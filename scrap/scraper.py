import asyncio
import json
import os
import sys
import requests

import boto3
from botocore.exceptions import ClientError
try:
    from .page import Page
except Exception:
    from page import Page

try:
    from .utils import AsyncCutBrowserSession
    from .utils import Dict2Obj
except Exception as e:
    from utils import AsyncCutBrowserSession
    from utils import Dict2Obj

OPERATOR = "OPERATOR"
RUNTIME_ENV = os.environ.get('AWS_EXECUTION_ENV')

SQS = os.environ.get('SQS', 'kendra-buttons-page-que-dev')
SQS_URL = None

CLIENT = boto3.client('sqs')
kendra = boto3.client('kendra')


import base64



def get_secret():

    secret_name = "devKendraQueryApiKey"
    region_name = "us-west-2"

    # Create a Secrets Manager client
    session = boto3.session.Session()
    client = session.client(
        service_name='secretsmanager',
        region_name=region_name
    )

    # In this sample we only handle the specific exceptions for the 'GetSecretValue' API.
    # See https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
    # We rethrow the exception by default.

    try:
        get_secret_value_response = client.get_secret_value(
            SecretId=secret_name
        )
    except ClientError as e:
        if e.response['Error']['Code'] == 'DecryptionFailureException':
            # Secrets Manager can't decrypt the protected secret text using the provided KMS key.
            # Deal with the exception here, and/or rethrow at your discretion.
            raise e
        elif e.response['Error']['Code'] == 'InternalServiceErrorException':
            # An error occurred on the server side.
            # Deal with the exception here, and/or rethrow at your discretion.
            raise e
        elif e.response['Error']['Code'] == 'InvalidParameterException':
            # You provided an invalid value for a parameter.
            # Deal with the exception here, and/or rethrow at your discretion.
            raise e
        elif e.response['Error']['Code'] == 'InvalidRequestException':
            # You provided a parameter value that is not valid for the current state of the resource.
            # Deal with the exception here, and/or rethrow at your discretion.
            raise e
        elif e.response['Error']['Code'] == 'ResourceNotFoundException':
            # We can't find the resource that you asked for.
            # Deal with the exception here, and/or rethrow at your discretion.
            raise e
    else:
        # Decrypts secret using the associated KMS CMK.
        # Depending on whether the secret is a string or binary, one of these fields will be populated.
        if 'SecretString' in get_secret_value_response:
            secret = get_secret_value_response['SecretString']
            return secret
        else:
            decoded_binary_secret = base64.b64decode(get_secret_value_response['SecretBinary'])
            return decoded_binary_secret


def is_local_env():
    return not RUNTIME_ENV


def get_queue_url(queue_name):
    if is_local_env():  # temporary
        return None

    response = CLIENT.get_queue_url(
        QueueName=queue_name
    )

    return response['QueueUrl']


if SQS_URL is None:
    SQS_URL = get_queue_url(SQS)


def send_to_sqs(page):
    if is_local_env():  # temporary
        print(page.to_json())
        return

    resp = CLIENT.send_message(QueueUrl=SQS_URL, MessageBody=page.to_json())
    print('Operator: sent a message to queue, {}. Return: {}.'.format(SQS_URL, str(resp)))


def operator(request, context):
    event_list = list()

    print('Operator started.')
    print(request)
    req = Dict2Obj(request)
    if hasattr(req, "Records"):
        # event data from DynamoDB Stream or SQS
        for item in req.Records:
            event_list.append(item)
    else:
        # todo: CloudWatch event, not yet implemented
        raise TypeError("Unsupported event type")

    for event in event_list:
        if hasattr(event, "eventSource"):
            # events from DynamoDB or SQS
            # Convert event to Page obj.
            if event.eventSource == "aws:dynamodb":
                page = Page()
                if event.eventName == "INSERT":
                    try:
                        page.scraped = event.dynamodb.NewImage.scraped.BOOL
                        page.site = event.dynamodb.NewImage.site.S
                        page._type = event.dynamodb.NewImage.type.S
                        page.url = event.dynamodb.NewImage.url.S
                    except AttributeError:
                        raise TypeError("Unsupported event scheme. event: {}".format(str(event)))
                elif event.eventName == "MODIFY":
                    try:
                        page.scraped = event.dynamodb.NewImage.scraped.BOOL
                        page.site = event.dynamodb.NewImage.site.S
                        page._type = event.dynamodb.NewImage.type.S
                        page.url = event.dynamodb.NewImage.url.S
                    except AttributeError:
                        raise TypeError("Unsupported event scheme. event: {}".format(str(event)))
                elif event.eventName == "DELETED":
                    # todo: page 삭제시, 삭제된 페이지의 인덱스ID를 이용해 켄드라 색인에서 해당 리소스 삭제 하기
                    raise NotImplementedError("Not implemented: DynamoDB DELETED event handler/Operator")

                # todo: site 정보 가져오기 정책 및 메타데이터 (???)
                send_to_sqs(page)

            elif event.eventSource == "aws:sqs":
                raise NotImplementedError("Not implemented: SQS event handler/Operator")
                # todo: SQS event handler
            else:
                raise TypeError("Unsupported event type. event type: {}".format(str(type(event))))
        elif hasattr(event, "source"):
            # events from CloudWatch
            # cloudwatch case
            # site 정보 가져오기 정책 및 메타데이터 및 entrypoint url
            # sqs에 작업 넣기
            raise NotImplementedError("Not implemented: CloudWatch event handler/Operator")
        else:
            raise TypeError("Unsupported event type. event type: {}/Operator".format(str(type(event))))


async def get_page(url: str):
    session = AsyncCutBrowserSession()
    print(f'start scrap {url}')
    req = await session.get(url)
    await req.html.arender()
    result = req.html
    print(req.html.absolute_links)
    print(result)
    return result


def verify(pettern, url) -> bool:
    return True


####
# message type
#   msg['site']
#   msg['url']
#   msg['host']   <--- ???

async def handler(messages: list):
    for msg in messages:
        site = msg['site']
        url = msg['url']
        host = msg.get('host')
        pattern = "*"
        html = await get_page(url)
        # save kendra
        # print(html.raw_html)

        # binary로 변환
        scrappedBinary = base64.b64encode(html.raw_html)

        secret = get_secret()
        print('secret.............', secret, type(secret))
        print('header??????????', requests.head(url))


        result = kendra.batch_put_document(
        IndexId="zCrSOcnD6A8zkXjy7ahn88EV00HGtq2r5lC0yT8E",
        RoleArn = "arn:aws:secretsmanager:us-west-2:213888382832:secret:devKendraQueryApiKey-bXjYFs",
        Documents=[
            {
                'Id': site + ':' + url,
                'Title': requests.head(url),
                'Blob': scrappedBinary,
                'Attributes': [
                    {
                        'Key': 'site',
                        'Value': {
                            'StringValue': site,  
                        },
                    }
                ],
                # 'AccessControlList': [
                #     {
                #         'Name': 'string',
                #         'Type': 'USER' | 'GROUP',
                #         'Access': 'ALLOW' | 'DENY'
                #     },
                # ],
                # 'ContentType': 'PDF' | 'HTML' | 'MS_WORD' | 'PLAIN_TEXT' | 'PPT'
            },
        ]
    )

        p = Page.get(site, url) # dynamodb table의 item return
        p.update([Page.scraped.set(True)])
        p.save()


        # get links
        links = [l for l in html.absolute_links if l != url]
        with Page.batch_write() as batch: #dynamodb table의 batch 작업
            items = [Page(site, link, _type='html') for link in links if verify(pattern, url)]
            for item in items:
                batch.save(item) # dynamodb에 넣기


def worker(request, context):
    """Worker lambda function implementation

    최대 10개의 url이 들어옴
    que에 담긴 수집 url을 이용하여 html일 가져오기
        - html을 que에 담긴 메타와 함께 kendra에 넣기
        - page index ddb에 해당 url 수집 완료 처리 및 인덱스ID도 같이 넣기
        - html에 있는 url을 추출후 수집 정책에 부합한 url만 page index ddb에 추가

    Parameters
    ----------
    request: dict, required
       SQS Message
       Event doc: https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html

    context: object, required
        Lambda Context runtime methods and attributes
        Context doc: https://docs.aws.amazon.com/lambda/latest/dg/python-context-object.html

    """
    print('run worker')
    print(request)
    # request에서 메세시 파싱
    messages = []

    try:
        for record in request['Records']:
            body = json.loads(record["body"])
            url = body["url"]
            message = { "body": body, "url": url}
            messages.append(message)

    except Exception as e:
        # Send some context about this error to Lambda Logs
        print(e)
        # throw exception, do not handle. Lambda will make message visible again.
        raise e

    asyncio.get_event_loop().run_until_complete(handler(messages))




if __name__ == '__main__':
    msg = {"url": "https://github.com/pricing", "site": "abcd", "host": "https://github.com/"}

    if (len(sys.argv) == 2) and (sys.argv[1].upper() == OPERATOR):
        # todo: for testing. it should be removed.
        with open("event_samples/dynamodb_insert.json", "r") as f:
            events_data = json.load(f)

        operator(request=events_data, context=None)
    else:
        # Worker
        asyncio.get_event_loop().run_until_complete(handler([msg]))

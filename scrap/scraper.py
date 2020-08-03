import asyncio
import base64
import json
import os
import sys
from io import BytesIO

import boto3
import shortuuid
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
#  kendra_role: kendra-buttons-put-doc-role-${self:custom.stage}
#     arn: arn:aws:iam::${self:custom.kendra.account}:role/${self:custom.role.kendra_role}
S3 = os.environ.get('S3', 'kendra-button')
BUCKET = boto3.resource('s3').Bucket(S3)
CLIENT = boto3.client('sqs')
KENDRA_ROLE_ARN = os.environ.get('KENDRA_ROLE', "arn:aws:iam::294038372338:role/kendra-buttons-put-doc-role-dev")
SECRET_ID = os.environ.get("SECRET_ID", "devKendraQueryApiKey")
SECRET_REGION = os.environ.get("SECRET_REGION", "us-west-2")

KENDRA_INDEX_ID = os.environ.get("KENDRA_INDEX_ID", "f3eca9c5-5307-4347-b573-9fbb20be6658")


def get_secret():
    # Create a Secrets Manager client
    session = boto3.session.Session()
    client = session.client(
        service_name='secretsmanager',
        region_name=SECRET_REGION
    )

    # In this sample we only handle the specific exceptions for the 'GetSecretValue' API.
    # See https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
    # We rethrow the exception by default.

    try:
        get_secret_value_response = client.get_secret_value(
            SecretId=SECRET_ID
        )
    except ClientError as e:
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
    return result


def verify(pettern, url) -> bool:
    return True


def convert_url_to_key(url):
    char_sets = [':', '/', '.', '?', '&']

    key = url
    for ch in char_sets:
        key = key.replace(ch, '_')

    return key


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
        key = shortuuid.uuid(name=url)
        meta_key = f"{key}.metadata.json"
        html = await get_page(url)
        f = BytesIO(html.raw_html)
        BUCKET.upload_fileobj(f, key)

        doc_title = html.find("title", first=True).text
        doc_id = f"{site}:{key}"

        metadata = {
            "DocumentId": doc_id,
            "Attributes": {
                "_source_uri": url,
                "site": site,
                "host": host,
            },
            "Title": doc_title,
            "ContentType": "HTML",
        }

        meta_obj = BytesIO(json.dumps(metadata, ensure_ascii=False).encode('utf-8'))
        BUCKET.upload_fileobj(meta_obj, meta_key)
        # base64 변환
        # base64_doc = base64.b64encode(html.raw_html).decode('UTF-8')

        # site title 가져오기 

        # doc_key = convert_url_to_key(url)

        # doc_dict = {
        #     "IndexId": KENDRA_INDEX_ID,
        #     "RoleArn": KENDRA_ROLE_ARN,
        #     "Documents": [
        #         {
        #             'Id': doc_id,
        #             'Title': doc_title,
        #             'S3Path': {
        #                 'Bucket': S3,
        #                 'Key': key,
        #             },
        #             "ContentType": "HTML",
        #             "Attributes": [
        #                 {
        #                     "Key": "_source_uri",
        #                     "Value": {
        #                         "StringValue": url
        #                     },
        #                 },
        #                 {
        #                     "Key": "site",
        #                     "Value": {
        #                         "StringValue": site
        #                     },
        #                 },
        #                 {
        #                     "Key": "host",
        #                     "Value": {
        #                         "StringValue": host
        #                     },
        #                 },
        #
        #             ],
        #
        #         }
        #     ]
        # }

        # Push to Kendra
        # secret = get_secret()
        # kendra_endpoint_info = json.loads(secret)
        #
        # req_url = "{}/{}/{}".format(kendra_endpoint_info['endpoint'], 'kendra', 'batch_put_document')
        # req_headers = {
        #     'Content-Type': 'application/json; charset=utf-8',
        #     'x-api-key': kendra_endpoint_info['apikey']
        # }

        # res = requests.post(url=req_url, json=doc_dict, headers=req_headers)
        # if res.status_code < 400:
        #     pass
        # else:
        #     print(
        #         "[ERROR]Unable to store the document into Kendra. Status code: {}, Document ID: '{}', Document Title: '{}'"
        #             .format(str(res.status_code), doc_id, doc_title))
        #     continue
        # print(res.status_code)
        # print(res.text)

        # Save to DynamoDB table
        p = Page.get(site, url)  # dynamodb table의 item return
        p.update([Page.scraped.set(True)])
        p._type = 'html'
        p.save()

        # get links
        links = [l for l in html.absolute_links if l != url]
        with Page.batch_write() as batch:  # dynamodb table의 batch 작업
            items = [Page(site, link, _type='html') for link in links if verify(pattern, url)]
            for item in items:
                batch.save(item)  # dynamodb에 넣기


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
            body_json = json.loads(record["body"])
            messages.append(body_json)

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

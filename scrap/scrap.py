import asyncio
import os
import sys
import boto3

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
SQS = os.environ.get('SQS', 'kendra-buttons-index-dev')

CLIENT = boto3.client('sqs')


def get_queue_url(queue_name):
    response = CLIENT.get_queue_url(
        QueueName=queue_name
    )
    
    return response['QueueUrl']


def send_to_sqs(queue_url, page):
    # CLIENT.send_message(QueueUrl=queue_url, MessageBody=page.to_json())
    print(page.to_json())


def operator(request, context):
    event_list = list()
    
    print('run operator')
    
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
                    page.scraped = event.dynamodb.NewImage.scraped.BOOL
                    page.site = event.dynamodb.NewImage.site.S
                    page._type = event.dynamodb.NewImage.type.S
                    page.url = event.dynamodb.NewImage.url.S
                elif event.eventName == "MODIFY":
                    page.scraped = event.dynamodb.NewImage.scraped.BOOL
                    page.site = event.dynamodb.NewImage.site.S
                    page._type = event.dynamodb.NewImage.type.S
                    page.url = event.dynamodb.NewImage.url.S
                elif event.eventName == "DELETED":
                    # todo: page 삭제시, 삭제된 페이지의 인덱스ID를 이용해 켄드라 색인에서 해당 리소스 삭제 하기
                    raise NotImplementedError("Not implemented: DynamoDB DELETED event handler/Operator")
                
                # todo: site 정보 가져오기 정책 및 메타데이터 (???)
                send_to_sqs(SQS, page)
                
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
        print(html.raw_html)
        p = Page.get(site, url)
        p.update([Page.scraped.set(True)])
        # get links
        links = [l for l in html.absolute_links if l != url]
        with Page.batch_write() as batch:
            items = [Page(site, link, _type='html') for link in links if verify(pattern, url)]
            for item in items:
                batch.save(item)


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
    asyncio.get_event_loop().run_until_complete(handler(messages))



    try:
        for record in request['Records']:
            body = json.loads(record["body"])
            url = body["url"]

    except Exception as e:
        # Send some context about this error to Lambda Logs
        print(e)
        # throw exception, do not handle. Lambda will make message visible again.
        raise e


if __name__ == '__main__':
    msg = {"url": "https://github.com/pricing", "site": "abcd", "host": "https://github.com/"}
    
    if (len(sys.argv) == 2) and (sys.argv[1].upper() == OPERATOR):
        # Operator
        import json
        with open("event_samples/dynamodb_insert.json", "r") as f:
            events_data = json.load(f)
            
        operator(request=events_data, context=None)
    else:
        # Worker
        asyncio.get_event_loop().run_until_complete(handler([msg]))

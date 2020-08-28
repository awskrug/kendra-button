import base64
import json
import os
from io import BytesIO
from typing import List, Optional, TypedDict

import arrow
import boto3
import shortuuid
from botocore.exceptions import ClientError

from chalicelib.page import Page
from chalicelib.utils import AsyncCutBrowserSession

OPERATOR = "OPERATOR"
RUNTIME_ENV = os.environ.get('AWS_EXECUTION_ENV')

PAGE_QUE_URL = os.environ.get('pageQueUrl')
#  kendra_role: kendra-buttons-put-doc-role-${self:custom.stage}
#     arn: arn:aws:iam::${self:custom.kendra.account}:role/${self:custom.role.kendra_role}
S3 = os.environ.get('S3', 'kendra-button')
BUCKET = boto3.resource('s3').Bucket(S3)
CLIENT = boto3.client('sqs')
KENDRA_ROLE_ARN = os.environ.get('KENDRA_ROLE', "arn:aws:iam::294038372338:role/kendra-buttons-put-doc-role-dev")
SECRET_ID = os.environ.get("SECRET_ID", "kendera-btn/dev/secretes")
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

class WorkerMsg(TypedDict):
    site: str
    url: str
    domain: str
    user: str
    _type: str
    doc_id: Optional[str]
    obj_key: Optional[str]
    meta_obj_key: Optional[str]



async def handler(messages: List[WorkerMsg]):
    for msg in messages:
        site = msg['site']
        url = msg['url']
        domain = msg.get('domain', '')
        pattern = "*"
        html = await get_page(url)
        new_page = True
        if msg.get('doc_id'):
            new_page = False
            key = msg['obj_key']
            meta_key = msg['meta_obj_key']
            doc_id = msg['doc_id']
        else:
            key = shortuuid.uuid(name=url)
            meta_key = f"{key}.metadata.json"
            doc_id = f"{site}:{key}"

        f = BytesIO(html.raw_html)
        BUCKET.upload_fileobj(f, key)

        doc_title = html.find("title", first=True).text

        metadata = {
            "DocumentId": doc_id,
            "Attributes": {
                "_source_uri": url,
                "site": site,
                "domain": domain,
            },
            "Title": doc_title,
            "ContentType": "HTML",
        }

        meta_obj = BytesIO(json.dumps(metadata, ensure_ascii=False).encode('utf-8'))
        BUCKET.upload_fileobj(meta_obj, meta_key)

        now = arrow.utcnow()
        updates: list = [
            Page.scraped.set(True),
            Page.doc_title.set(doc_title),
            Page.last_scraped_at.set(now.timestamp)
        ]
        if new_page:
            updates += [
                Page.doc_id.set(doc_id),
                Page.obj_key.set(key),
                Page.meta_obj_key.set(meta_key),
            ]
        try:
            Page(site, url).update(updates)
        except Page.DoesNotExist:
            print(f"Fail update scrap {url} result")
            continue

        # get links
        links = [l for l in html.absolute_links if l != url and (domain in l) and verify(pattern, url)]
        for link in links:
            try:
                page = Page.get(site, link)
                page.update(
                    [Page.scraped.set(False)],
                    # 한시간 이내 수집 했으면 수집 안함
                    condition=~Page.last_scraped_at.exists() | Page.last_scraped_at < now.shift(hours=-1).timestamp
                )
            except Page.DoesNotExist:
                page = Page(
                    site, link,
                    _type='html',
                    user=msg['user'],
                )
                page.save()
            except Exception:
                print(f'already scraped {site} : {url}')

# if __name__ == '__main__':
#     msg = {"url": "https://github.com/pricing", "site": "abcd", "host": "https://github.com/"}
#
#     if (len(sys.argv) == 2) and (sys.argv[1].upper() == OPERATOR):
#         # todo: for testing. it should be removed.
#         with open("event_samples/dynamodb_insert.json", "r") as f:
#             events_data = json.load(f)
#
#         operator(request=events_data, context=None)
#     else:
#         # Worker
#         asyncio.get_event_loop().run_until_complete(handler([msg]))

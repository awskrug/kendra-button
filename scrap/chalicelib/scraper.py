import base64
import json
import os
from io import BytesIO
from typing import List, Optional, TypedDict
from urllib.parse import urldefrag

import arrow
import boto3
import shortuuid
from botocore.exceptions import ClientError

from chalicelib.page import Page
from chalicelib.utils import AsyncCutBrowserSession

OPERATOR = "OPERATOR"
RUNTIME_ENV = os.environ.get('AWS_EXECUTION_ENV')

PAGE_QUE_URL = os.environ.get('pageQueUrl')
S3 = os.environ.get('S3', 'kendra-buttons-everypython-store-dev')
BUCKET = boto3.resource('s3').Bucket(S3)
CLIENT = boto3.client('sqs')





def is_local_env():
    return not RUNTIME_ENV


async def get_page(url: str):
    session = AsyncCutBrowserSession()
    print(f'start scrap {url}')
    req = await session.get(url)
    # await req.html.arender()
    result = req.html
    print(result)
    return result


def verify(pettern, url) -> bool:
    return True


def refine_url(url: str) -> str:
    link, _ = urldefrag(url)
    return link


def convert_url_to_key(url):
    char_sets = [':', '/', '.', '?', '&']

    key = url
    for ch in char_sets:
        key = key.replace(ch, '_')

    return key


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
        BUCKET.upload_fileobj(f, key, ExtraArgs={"ACL": "bucket-owner-full-control"})

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
        BUCKET.upload_fileobj(meta_obj, meta_key, ExtraArgs={"ACL": "bucket-owner-full-control"})

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
        links = {refine_url(l) for l in html.absolute_links if l != url and (domain in l) and verify(pattern, url)}
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

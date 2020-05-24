import asyncio
import io
import os

import boto3

try:
    from .utils import AsyncCutBrowserSession, make_obj_name
except Exception as e:
    from utils import AsyncCutBrowserSession

BUCKET = os.environ.get('BUCKET', 'kendra-button')

s3 = boto3.client('s3')


async def get_page(site: str, url: str, base_path='', recursive=False) -> set:
    session = AsyncCutBrowserSession()
    req = await session.get(url)
    await req.html.arender()
    obj_path = make_obj_name(site, url, 'html')
    with io.StringIO(req.html) as f:
        s3.upload_fileobj(f, BUCKET, obj_path)
    print(req.html)
    if recursive:
        child_links = list(filter(lambda x: base_path in x, req.html.absolute_links, ))
        print(child_links)


if __name__ == '__main__':
    asyncio.run(get_page('https://brownbears.tistory.com/140'))

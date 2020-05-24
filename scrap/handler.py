import asyncio
import io
import os
import tempfile

import boto3
import shortuuid
from scrapy.spiders import SitemapSpider

try:
    from scrap.parser.sitemap import get_sitemap_urls
except Exception as e:
    from parser.sitemap import get_sitemap_urls
td = tempfile.TemporaryDirectory()
BASE_DIR = td.name
DATA_DIR = os.path.join(BASE_DIR, 'data')
BUCKET = os.environ.get('BUCKET', 'kendra-button')

s3 = boto3.client('s3')





class AWSDoc(SitemapSpider):
    name = 'aws_doc'
    base_path = 'https://docs.aws.amazon.com/'
    sitemap_urls = ['https://docs.aws.amazon.com/kendra/latest/dg/sitemap.xml']

    async def parse(self, response):
        print(response.url)
        doc_path = response.url[len(self.base_path):].split('/')
        service = doc_path[0]
        path = '-'.join(doc_path[1:])

        file = os.path.join(DATA_DIR, 'aws_doc', service, path)
        os.makedirs(os.path.dirname(file), exist_ok=True)
        buff2 = io.BytesIO(response.body)
        obj_path = make_obj_name(self.name, response.url, 'html')
        s3.upload_fileobj(buff2, BUCKET, obj_path)
        #         metadata = {
        #             "DocumentId": "document ID",
        #             "Attributes": {
        #         "_category": "document category",
        #         "_created_at": "ISO 8601 encoded string",
        #         "_last_updated_at": "ISO 8601 encoded string",
        #         "_source_uri": "document URI,
        #         "_version": "file version",
        #         "_view_count": number of times document has been viewed,
        #         "custom attribute key": "custom attribute value",
        #         additional custom attributes
        #     },
        #     "AccessControlList": [
        #          {
        #              "Name": "user name",
        #              "Type": "GROUP | USER",
        #              "Access": "ALLOW | DENY"
        #          }
        #     ],
        #     "Title": "document title",
        #     "ContentType": "HTML | MS_WORD | PDF | PLAIN_TEXT | PPT"
        # }
        # s3.upload_fileobj(buff2, BUCKET, make_meta_name(obj_path))

        yield {
            "url": response.url,
            "service": service,
        }


class MIT_SITE(SitemapSpider):
    name = 'aws_doc'
    base_path = 'https://docs.aws.amazon.com/'
    sitemap_urls = ['https://docs.aws.amazon.com/kendra/latest/dg/sitemap.xml']

    async def parse(self, response):
        print(response.url)
        doc_path = response.url[len(self.base_path):].split('/')
        service = doc_path[0]
        path = '-'.join(doc_path[1:])

        buff2 = io.BytesIO(response.body)
        obj_path = make_obj_name(self.name, response.url, 'html')
        s3.upload_fileobj(buff2, BUCKET, obj_path)


async def get_urls(url):
    result = await get_sitemap_urls(url)
    print('total_page = ', len(result))
    # print(result)
    return result


def handler(event, context):
    url = 'https://docs.aws.amazon.com/kendra/latest/dg/sitemap.xml'
    # url = 'https://docs.aws.amazon.com/sitemap_index.xml'
    asyncio.run(get_urls(url))


if __name__ == '__main__':
    print(handler(None, None))

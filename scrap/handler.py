import io
import os
import tempfile

import boto3
import shortuuid
from scrapy.crawler import CrawlerProcess
from scrapy.spiders import SitemapSpider

td = tempfile.TemporaryDirectory()
BASE_DIR = td.name
DATA_DIR = os.path.join(BASE_DIR, 'data')
BUCKET = os.environ.get('BUCKET', 'awskrug.kendra.dev')

s3 = boto3.client('s3')


def make_hash(name: str):
    return shortuuid.uuid(name=name)


def make_obj_name(site: str, url: str):
    return f"{make_hash(site)}/{make_hash(url)}"


def make_meta_name(site: str, url: str):
    return f"{make_hash(site)}/meta/{make_hash(url)}.json"


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
        s3.upload_fileobj(buff2, BUCKET, make_obj_name(self.name, response.url))
        # s3.upload_fileobj(buff2, BUCKET, make_meta_name(self.name, response.url))

        yield {
            "url": response.url,
            "service": service,
        }


def handler(event, context):
    td = tempfile.TemporaryDirectory()
    result_file = os.path.join(td.name, 'result.json')
    process = CrawlerProcess({
        'USER_AGENT': 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1)',
        'FEEDS': {
            result_file: {
                'format': 'json',
                'encoding': 'utf8',
                'indent': 4,
            },
        }
    })

    process.crawl(AWSDoc)
    process.start(stop_after_crawl=True)  # the script will block here until the crawling is finished


if __name__ == '__main__':
    print(handler(None, None))

import os
import tempfile
import io
from scrapy.crawler import CrawlerProcess
from scrapy.spiders import SitemapSpider
from scrapy.utils.reactor import install_reactor
from twisted.internet import reactor, defer
import boto3
from hashids import Hashids
td # BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BASE_DIR = td.name
DATA_DIR = os.path.join(BASE_DIR, 'data')
BUCKET = os.environ.get('BUCKET')

def get_file_name(name, path):
    path = os.path.join(DATA_DIR, name, path.replace('/', '-'))
    return path

s3 = boto3.client('s3')
def site_hash(name:str):
    hashids = Hashids(salt=name)
    return hashids.encode(1)
    

def make_obj_name(site:str,url: str):
    hashids = Hashids(salt=)
    return f"{}/{hashids.encode(1)}" 

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
        s3.upload_fileobj(buff2,BUCKET, make_obj_name(self.name,response.url))

        yield {
            "url": response.url,
            "service": service,
        }


def get_all_files():
    file_list = []
    for (path, dir, files) in os.walk(BASE_DIR):
        for filename in files:
            ext = os.path.splitext(filename)[-1]
            if ext == '.html':
                file_list.append(os.path.join(path, filename))
    return file_list


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

    file_list =  get_all_files()
    response = {
        'message': 'finsh',
        'files': file_list,
        'total_count': len(file_list)
    }
    return response


if __name__ == '__main__':
    print(handler(None, None))

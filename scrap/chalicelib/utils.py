import os
import json
import boto3
import pyppeteer
import shortuuid
from botocore.exceptions import ClientError
from requests_html import AsyncHTMLSession

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CHROMIUM = os.path.join('/tmp', 'headless-chromium')


def download_chromium():
    if os.environ.get('AWS_LAMBDA_FUNCTION_NAME'):
        print('check chromium exists')
        if not os.path.isfile(CHROMIUM):
            s3 = boto3.client('s3')
            with open(CHROMIUM, 'wb') as f:
                s3.download_fileobj('kendra-btns-assets', 'headless-chromium', f)
            os.chmod(CHROMIUM, 755)
            print("download chromium")
        else:
            os.chmod(CHROMIUM, 755)
            print('already chromium exists')


class AsyncCutBrowserSession(AsyncHTMLSession):

    @property
    async def browser(self):
        if not hasattr(self, "_browser"):
            self.__browser_args = [
                '--no-sandbox',
            ]
            kwargs = {
                'ignoreHTTPSErrors': not (self.verify),
                'headless': True,
                'args': self.__browser_args
            }
            # if os.environ.get('AWS_LAMBDA_FUNCTION_NAME'):
            #     kwargs['executablePath'] = CHROMIUM

            self._browser = await pyppeteer.launch(**kwargs)
        return self._browser




def make_hash(name: str):
    return shortuuid.uuid(name=name)


def make_obj_name(site: str, url: str, ext: str):
    return f"{make_hash(site)}/{make_hash(url)}.{ext}"


def make_simple_obj_name(site: str, url: str):
    path = '/'.join(url.split('/')[3:])
    return f"{site}/{path}"


def make_meta_name(path: str):
    return f"{path}/metadata.json"


class Dict2Obj(object):
    def __init__(self, dic):
        for k, v in dic.items():
            if isinstance(v, (list, tuple)):
                setattr(self, k, [Dict2Obj(x) if isinstance(x, dict) else x for x in v])
            else:
                setattr(self, k, Dict2Obj(v) if isinstance(v, dict) else v)



secret_name = os.environ.get('secrets','kendera-btn/dev/query-api')
def get_secret():
    region_name = "us-west-2"

    # Create a Secrets Manager client
    session = boto3.session.Session()
    client = session.client(
        service_name='secretsmanager',
        region_name=region_name
    )

    try:
        get_secret_value_response = client.get_secret_value(
            SecretId=secret_name
        )
        return json.loads( get_secret_value_response['SecretString'])
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
            raise e


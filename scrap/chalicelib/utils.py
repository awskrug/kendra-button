import os

import pyppeteer
import shortuuid
from requests_html import AsyncHTMLSession

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CHROMIUM = os.path.join(BASE_DIR, 'bin', 'headless-chromium')


class AsyncCutBrowserSession(AsyncHTMLSession):
    @property
    async def browser(self):
        if not hasattr(self, "_browser"):
            self.__browser_args = ['--no-sandbox']
            kwargs = {
                'ignoreHTTPSErrors': not (self.verify),
                'headless': True,
                'args': self.__browser_args
            }
            if os.environ.get('AWS_LAMBDA_FUNCTION_NAME'):
                kwargs['executablePath'] = CHROMIUM

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

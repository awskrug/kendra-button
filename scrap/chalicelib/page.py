import json
import os

from pynamodb.attributes import BooleanAttribute, NumberAttribute, UnicodeAttribute
from pynamodb.models import Model

DB = os.environ.get('pageDB', 'kendra-btns-page-dbdev')

SAMPLE_USER = 'sample'


class Page(Model):
    class Meta:
        table_name = DB
        region = 'us-west-2'

    site = UnicodeAttribute(hash_key=True)
    url = UnicodeAttribute(range_key=True)
    user = UnicodeAttribute()
    _type = UnicodeAttribute(attr_name="type", default='html')
    scraped = BooleanAttribute(default=False)
    doc_id = UnicodeAttribute(null=True)
    doc_title = UnicodeAttribute(null=True)
    obj_key = UnicodeAttribute(null=True)
    meta_obj_key = UnicodeAttribute(null=True)
    last_scraped_at = NumberAttribute(null=True)  # time-stamp

    def to_dict(self):
        return dict(
            site=self.site,
            url=self.url,
            type=self._type,
            doc_id=self.doc_id,
            doc_title=self.doc_title,
            obj_key=self.obj_key,
            meta_obj_key=self.meta_obj_key,
            last_scraped_at=self.last_scraped_at

        )

    def to_json(self):
        return json.dumps(self.to_dict(), ensure_ascii=False)


if __name__ == '__main__':
    p = Page("asvvta", "https://www.yna.co.kr/index?site=header_loasdfasgo",)
    p.update(
        [
            Page.user|'avda',
            Page.scraped.set(False)
        ]
    )
    print(p)

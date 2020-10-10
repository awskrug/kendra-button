import json
import os

from pynamodb.attributes import BooleanAttribute, NumberAttribute, UnicodeAttribute
from pynamodb.indexes import AllProjection, GlobalSecondaryIndex
from pynamodb.models import Model

DB = os.environ.get('pageDB', 'kendra-btns-page-dbdev')

SAMPLE_USER = 'sample'


class UserSiteIndex(GlobalSecondaryIndex):
    """
    This class represents a global secondary index
    """

    class Meta:
        # index_name is optional, but can be provided to override the default name
        index_name = 'user_by_site'
        read_capacity_units = 2
        write_capacity_units = 1
        # All attributes are projected
        projection = AllProjection()

    user = UnicodeAttribute(hash_key=True)
    site_id = UnicodeAttribute(range_key=True)


class Page(Model):
    class Meta:
        table_name = DB
        region = 'us-west-2'

    site_id = UnicodeAttribute(hash_key=True)
    url = UnicodeAttribute(range_key=True)
    user = UnicodeAttribute()
    _type = UnicodeAttribute(attr_name="type", default='html')
    scraped = BooleanAttribute(default=False)
    doc_id = UnicodeAttribute(null=True)
    doc_title = UnicodeAttribute(null=True)
    obj_key = UnicodeAttribute(null=True)
    meta_obj_key = UnicodeAttribute(null=True)
    last_scraped_at = NumberAttribute(null=True)  # time-stamp
    user_site_index = UserSiteIndex()

    def to_dict(self):
        return dict(
            site_id=self.site_id,
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
    p = Page("asvvta", "https://www.yna.co.kr/index?site=header_loasdfasgo", )
    p.update(
        [
            Page.user | 'avda',
            Page.scraped.set(False)
        ]
    )
    print(p)

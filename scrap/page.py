import os
import random

import graphene
from graphene_pynamodb import PynamoObjectType
from pynamodb.attributes import UnicodeAttribute,BooleanAttribute
from pynamodb.models import Model

DB = os.environ.get('pageDB', 'kendra-buttons-page-dev')
SAMPLE_USER = 'sample'


class Page(Model):
    class Meta:
        table_name = DB
        region = 'us-west-2'

    site = UnicodeAttribute(hash_key=True)
    url = UnicodeAttribute(range_key=True)
    _type = UnicodeAttribute(attr_name="type")
    scraped = BooleanAttribute(default=False)
    

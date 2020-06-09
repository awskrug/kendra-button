import os
import random

import graphene
from graphene_pynamodb import PynamoObjectType
from pynamodb.attributes import UnicodeAttribute
from pynamodb.models import Model

DB = os.environ.get('indexDB', 'kendra-buttons-index-dev')
SAMPLE_USER = 'sample'


class Site(Model):
    class Meta:
        table_name = DB
        region = 'us-west-2'

    user = UnicodeAttribute(hash_key=True)
    site = UnicodeAttribute(range_key=True)
    title = UnicodeAttribute()
    url = UnicodeAttribute()


class CrawlerStatus(graphene.ObjectType):
    total = graphene.Int()
    done = graphene.Int()


class SiteNode(PynamoObjectType):
    class Meta:
        model = Site
        # interfaces = (graphene.Node,)

    crawler_status = graphene.Field(CrawlerStatus)

    def resolve_crawler_status(self, info, ):
        return CrawlerStatus(total=100, done=random.randrange(10, 100))
    # def get_node(cls, info, id):
    #     print(id)
    #     keys = id.split(':')
    #     return cls._meta.model.get(*keys)
    #
    # def resolve_id(self, info):
    #     graphene_type = info.parent_type.graphene_type
    #     if is_node(graphene_type):
    #         return f"{self.user}:{self.site}"
    #


class SiteList(graphene.ObjectType):
    items = graphene.List(SiteNode)
    last_key = graphene.String()


class Query:
    sites = graphene.List(SiteNode)
    sites_pagi_nation = graphene.Field(SiteList, page_size=graphene.Int(), last_key=graphene.String())

    site = graphene.Field(SiteNode, site=graphene.String())

    def resolve_site(self, info, site: str):
        return Site.get('sample', site)

    def resolve_sites(self, info):
        return list(Site.query('sample'))

    def resolve_sites_page_nation(self, info, page_size=5, last_key=None):
        args = {
            "page_size": page_size
        }
        if last_key:
            args['last_evaluated_key'] = last_key
        results = Site.query('sample', **args)
        return SiteList(
            items=list(results),
            last_key=results.last_evaluated_key
        )


class SiteCreate(graphene.Mutation):
    class Arguments:
        title = graphene.String(required=True)
        site = graphene.String(required=True)
        url = graphene.String(required=True)


    site = graphene.Field(SiteNode)

    def mutate(self, info, title, site, url):
        if Site.count(SAMPLE_USER, Site.site == site):
            raise Exception('duplicated site name')
        data = Site(SAMPLE_USER, site, title=title, url=url)
        data.save()
        return SiteCreate(site=data)


class Mutation:
    create_site = SiteCreate.Field()
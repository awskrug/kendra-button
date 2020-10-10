import os

import graphene
import jwt
import shortuuid
from graphene_pynamodb import PynamoObjectType
from pynamodb.attributes import UnicodeAttribute
from pynamodb.models import Model

from chalicelib.page import Page
from chalicelib.utils import get_secret

DB = os.environ.get('siteDB', 'kendra-btns-site-dbdev')


def _generate_token(site_id, user, domain, sub='search', **kwargs):
    jwt_secret_key = get_secret()['jwt_secret_key']
    payload = {
        'site_id': site_id,
        'sub': 'search',
        'user': user,
        'domain': domain,
        **kwargs,
    }
    return jwt.encode(payload, jwt_secret_key, algorithm='HS256')


class Site(Model):
    class Meta:
        table_name = DB
        region = 'us-west-2'

    user = UnicodeAttribute(hash_key=True)
    site_id = UnicodeAttribute(range_key=True)
    token = UnicodeAttribute()
    name = UnicodeAttribute()
    domain = UnicodeAttribute()
    scrap_endpoint = UnicodeAttribute()
    scrap_interval = UnicodeAttribute(default='daily')

    def update_token(self):
        self.token = _generate_token(self.site_id, self.user, self.domain)

    @classmethod
    def create_site(cls, user: str, name: str, domain: str, scrap_endpoint: str, scrap_interval: str = "daily"):
        site_id = shortuuid.uuid()
        site = cls(
            user, site_id,
            name=name,
            domain=domain,
            scrap_endpoint=scrap_endpoint,
            scrap_interval=scrap_interval,
        )
        site.update_token()
        site.save()
        return site


class CrawlerStatus(graphene.ObjectType):
    total = graphene.Int()
    done = graphene.Int()


class SiteNode(PynamoObjectType):
    class Meta:
        model = Site

    crawler_status = graphene.Field(CrawlerStatus)

    def resolve_crawler_status(self: Site, info, ):
        total_count = Page.user_site_index.count(self.user, range_key_condition=Page.site_id == self.site_id)
        done = Page.user_site_index.count(
            self.user,
            range_key_condition=Page.site_id == self.site_id,
            filter_condition=Page.scraped == True
        )

        return CrawlerStatus(total=total_count, done=done)


class SiteList(graphene.ObjectType):
    items = graphene.List(SiteNode)
    last_key = graphene.String()


class Query:
    sites = graphene.List(SiteNode)
    sites_page_nation = graphene.Field(SiteList, page_size=graphene.Int(), last_key=graphene.String())

    site = graphene.Field(SiteNode, site_id=graphene.String())

    def resolve_site(self, info, site_id: str):
        return Site.get(info.context.get('user'), site_id)

    def resolve_sites(self, info):
        results = []
        try:
            print('sites request user', info.context.get('user'))
            results = list(Site.query(info.context.get('user')))
            print('results', results)
        except Exception as e:
            print(e)
        return results

    def resolve_sites_page_nation(self, info, page_size=5, last_key=None):
        user = info.context.get('user')
        print(user)
        args = {
            "page_size": page_size
        }
        if last_key:
            args['last_evaluated_key'] = last_key
        try:
            sites = Site.query(user, **args)
        except Exception as e:
            print(e)
            return SiteList(
                items=[],
                last_key=None,
            )

        return SiteList(
            items=list(sites),
            last_key=sites.last_evaluated_key
        )


class SiteCreate(graphene.Mutation):
    class Arguments:
        name = graphene.String(required=True)
        domain = graphene.String(required=True)
        scrap_endpoint = graphene.String(required=True)

    site = graphene.Field(SiteNode)

    def mutate(self, info, name, domain, scrap_endpoint):
        user = info.context.get('user')
        if Site.count(user, Site.name == name):
            raise Exception('duplicated site name')
        site = Site.create_site(user, name, domain, scrap_endpoint)
        page = Page(name, site.site_id, user=user, _type='html')
        page.save()
        return SiteCreate(site=site)


class SiteUpdate(graphene.Mutation):
    class Arguments:
        site_id = graphene.String(required=True)
        name = graphene.String(required=False)
        domain = graphene.String(required=False)

    site = graphene.Field(SiteNode)

    def mutate(self, info, site_id, name=None, domain=None):
        user = info.context.get('user')
        try:
            item = Site.get(user, site_id)
        except Exception as e:
            raise Exception('there is no site')
        actions = []
        if domain:
            actions.append(Site.domain.set(domain))
            actions.append(Site.token.set(_generate_token(site_id, user, domain)))
        if name:
            actions.append(Site.name.set(name))
        if actions:
            item.update(actions=actions)
        return SiteUpdate(site=item)


class SiteDelete(graphene.Mutation):
    class Arguments:
        site_id = graphene.String(required=True)

    ok = graphene.Boolean()

    def mutate(self, info, site_id):
        user = info.context.get('user')
        try:
            Site(info.context.get('user'), site_id).delete()
        except Exception as e:
            print(e)
            return SiteDelete(ok=False)
        pages = Page.user_site_index.query(user, Page.site_id == site_id)
        with Page.batch_write() as batch:
            for page in pages:
                batch.delete(page)

        return SiteDelete(ok=True)


class Mutation:
    create_site = SiteCreate.Field()
    update_site = SiteUpdate.Field()
    delete_site = SiteDelete.Field()

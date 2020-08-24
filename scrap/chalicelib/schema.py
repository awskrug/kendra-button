import graphene

from chalicelib.kendra import Query as KendraQuery, types as KendraTypes
from chalicelib.kendra_site import Query as SiteQuery, Mutation as SiteMutaion, SiteNode


class Mutation(graphene.ObjectType, SiteMutaion):
    pass


class Query(graphene.ObjectType, SiteQuery, KendraQuery):
    pass


schema = graphene.Schema(query=Query, mutation=Mutation, types=[SiteNode] + KendraTypes)

if __name__ == '__main__':
    result = schema.execute(
        '{ sites { user site } }',
        context={
            'user':'test'
        }
    )
    print(result)
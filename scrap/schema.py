 
import graphene
try:
    from scrap.site import Query as SiteQuery, Mutation as SiteMutaion,SiteNode
    from scrap.kendra import Query as KendraQuery,types as KendraTypes
except Exception as e:
    from site import Query as SiteQuery, Mutation as SiteMutaion,SiteNode
    from kendra import Query as KendraQuery,types as KendraTypes

class Mutation(graphene.ObjectType,SiteMutaion):
    pass

class Query(graphene.ObjectType,SiteQuery,KendraQuery):
    pass

schema = graphene.Schema(query=Query, mutation=Mutation, types=[SiteNode]+KendraTypes)
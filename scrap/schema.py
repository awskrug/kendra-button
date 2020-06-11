 
import graphene


from kendra_site import Query as SiteQuery, Mutation as SiteMutaion,SiteNode
from kendra import Query as KendraQuery,types as KendraTypes

class Mutation(graphene.ObjectType,SiteMutaion):
    pass

class Query(graphene.ObjectType,SiteQuery,KendraQuery):
    pass

schema = graphene.Schema(query=Query, mutation=Mutation, types=[SiteNode]+KendraTypes)
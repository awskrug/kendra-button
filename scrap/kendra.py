import graphene

class Highlight(graphene.ObjectType):
    start = graphene.Int()
    end = graphene.Int()
    topAnswer = graphene.Boolean()

class HighlightText(graphene.ObjectType):
    text = graphene.String()
    highlights = graphene.List(Highlight)
    highlightText = graphene.String()



class SearchResult(graphene.ObjectType):
    items = graphene.List(HighlightText)
    pass

class Query:
    search = graphene.Field(SearchResult,text=graphene.String(required=True))
    highlights = graphene.Field(HighlightText,text=graphene.String())

    def resolve_highlights(self,info,text):
        print(text)
        c = 'asdf'
        return HighlightText(
            text=text,
            highlights=[Highlight(start=n,end=n,topAnswer=False) for n in range(9)],
            highlightText=f'text{c}'
        )
        
    

    def resolve_search(self,info,text,):

        return SearchResult()

# types = [Highlight]
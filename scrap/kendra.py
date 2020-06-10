import graphene
import requests
class Highlight(graphene.ObjectType):
    start = graphene.Int()
    end = graphene.Int()
    topAnswer = graphene.Boolean()

    @classmethod
    def make_from_dict(cls, data:dict):
        return cls(
            start=data.get('BeginOffset'),
            end = data.get('EndOffset'),
            topAnswer = data.get('topAnswer')
        )


class HighlightText(graphene.ObjectType):
    text = graphene.String()
    highlights = graphene.List(Highlight)
    highlightText = graphene.String()

    @classmethod
    def make_from_dict(cls, data:dict):
        if data:
            return cls(
            highlights=[Highlight.make_from_dict(x) for x in data.get('Highlights',[])],
            text=data.get('Text')
            )
        else:
            return

class BaseDocument(graphene.Interface):
    url = graphene.String(required=True)
    title = graphene.Field(HighlightText) 
    excerpt = graphene.Field(HighlightText)

class ANSWER(graphene.ObjectType):
    class Meta:
        interfaces = (BaseDocument,)
    answers = graphene.List(HighlightText)

class DOCUMENT(graphene.ObjectType):
    class Meta:
        interfaces = (BaseDocument,)

class DocumentType(graphene.Enum):
    DOCUMENT = 'DOCUMENT'
    QUESTION_ANSWER = 'QUESTION_ANSWER' 
    ANSWER = 'ANSWER'


class SearchResult(graphene.ObjectType):
    items = graphene.List(BaseDocument)
    total = graphene.Int()
    

class Query:
    search = graphene.Field(SearchResult,
        text=graphene.String(required=True),
        site=graphene.String(required=True),
        size=graphene.Int(),
        page=graphene.Int()
        )
    highlights = graphene.Field(HighlightText,text=graphene.String())

    def resolve_highlights(self,info,text):
        print(text)
        c = 'asdf'
        return HighlightText(
            text=text,
            highlights=[Highlight(start=n,end=n,topAnswer=False) for n in range(9)],
            highlightText=f'text{c}'
        )

    def resolve_search(self,info,text,site,size=100,page=1):
        if size > 100:
            raise Exception('Page size should be less than 100') 
            
        url = "https://f7ngbade0c.execute-api.us-west-2.amazonaws.com/dev/kendra/query"
        print(text)

        payload = {
            "IndexId": "65a73c7f-74df-43da-950b-70cbc46be778",
            "QueryText": text,
            "PageSize":size,
            "PageNumber":page,
        }

        response = requests.request("POST", url, json=payload).json()
        items = []
        for doc in response['ResultItems']:
            result = {}
            result['url']=doc['DocumentURI']
            result['title'] = HighlightText.make_from_dict(doc.get("DocumentTitle"))
            result['excerpt'] = HighlightText.make_from_dict(doc.get('DocumentExcerpt'))
    
            doc_type = doc['Type']
            item = BaseDocument
            if doc_type == 'DOCUMENT':
                item = DOCUMENT
            elif doc_type =='ANSWER':
                item = ANSWER
                result['answers'] = []
                
            
            items.append(item(**result))

        return SearchResult(
            items=items,
            total=response['TotalNumberOfResults']
            #DocumentType 기준으로 실행 예정
        )

# Object type & scarla type
# 어떤 type 쓰이는지 명세 해야함
types = [
    Highlight,
    HighlightText,
    DOCUMENT,
    ANSWER,
    BaseDocument,
    SearchResult,
    DocumentType,
    ]
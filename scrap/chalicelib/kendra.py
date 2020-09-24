import graphene
import requests

from chalicelib.utils import get_secret


class Highlight(graphene.ObjectType):
    start = graphene.Int()
    end = graphene.Int()
    topAnswer = graphene.Boolean()

    @classmethod
    def make_from_dict(cls, data: dict):
        return cls(
            start=data.get('BeginOffset'),
            end=data.get('EndOffset'),
            topAnswer=data.get('topAnswer')
        )


class HighlightText(graphene.ObjectType):
    text = graphene.String()
    highlights = graphene.List(Highlight)
    highlightText = graphene.String()

    @classmethod
    def make_from_dict(cls, data: dict):
        if data:
            return cls(
                highlights=[Highlight.make_from_dict(x) for x in data.get('Highlights', [])],
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
    highlights = graphene.Field(HighlightText, text=graphene.String())

    def resolve_highlights(self, info, text):
        print(text)
        c = 'asdf'
        return HighlightText(
            text=text,
            highlights=[Highlight(start=n, end=n, topAnswer=False) for n in range(9)],
            highlightText=f'text{c}'
        )

    def resolve_search(self, info, text, site, size=100, page=1):
        if size > 100:
            raise Exception('Page size should be less than 100')
        query_api_info = get_secret()
        QUERY_API_ENDPOINT = query_api_info['endpoint']
        KENDRA_INDEX_ID = query_api_info['indexid']

        payload = {
            "IndexId": KENDRA_INDEX_ID,
            "QueryText": text,
            "PageSize": size,
            "PageNumber": page,
            "AttributeFilter": {
                'EqualsTo': {
                    "Key": "site",
                    "Value": {
                        "StringValue": site,
                    }
                }
            }
        }
        raw_resp = requests.request("POST", f"{QUERY_API_ENDPOINT}/kendra/query", json=payload)
        print(raw_resp.text)
        response = raw_resp.json()
        print(response)
        items = []
        total = 0
        if response:
            for doc in response.get('ResultItems', []):
                result = {}
                result['url'] = doc['DocumentURI']
                result['title'] = HighlightText.make_from_dict(doc.get("DocumentTitle"))
                result['excerpt'] = HighlightText.make_from_dict(doc.get('DocumentExcerpt'))

                doc_type = doc['Type']
                item = BaseDocument
                # type (RequestedDocumentAttributes) 이 DOCUMENT, QUESTION_ANSWER, ANSWER 라고 나와있지만
                # QUESTION_ANSWER 는 테스트 시 출력되는 상황 확인 된 적 없음
                if doc_type == 'DOCUMENT':
                    item = DOCUMENT
                elif doc_type == 'ANSWER':
                    item = ANSWER
                    result['answers'] = []

                items.append(item(**result))
            total = response.get('TotalNumberOfResults', 0)
        return SearchResult(
            items=items,
            total=total
            # DocumentType 기준으로 실행 예정
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

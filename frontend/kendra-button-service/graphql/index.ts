export const getSearchQry = ({ text = '', site = '' }) => `query{
  search(
    text: "${text}"
    site: "${site}"
  ){
    items{
      url
      title{
        text
        highlights{
          start
          end
          topAnswer
        }
      }
      excerpt{
        text
        highlights{
          start
          end
          topAnswer
        }
        
      }
    }
    total
  }
}`;

export interface Highlight {
  start: number;
  end: number;
  topAnswer: boolean;
}
export interface HighlightText {
  text: string;
  highlights: Highlight[];
  highlightText: string;
}
export interface BaseDocument {
  url: string;
  title: HighlightText;
}
export interface GqlSearchResult {
  search: {
    items: BaseDocument[];
    total: number;
  };
}

export const validationQry = ({ site = '' }) => `query{
  site(site: "${site}") {
    site
    domain
    scrapEndpoint
  }
}`;

export interface GraphQLResult<T = object> {
  data?: T;
  errors?: [
    {
      locations: object;
      message: string;
      path: object;
    },
  ];
  extensions?: {
    [key: string]: any;
  };
}

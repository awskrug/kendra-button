export const getSearchQry = ({
  text = '',
  site = '',
  size = 0,
  page = 0,
}) => `query{
  search(
    text: "${text}"
    token: "${site}"
    ${size === 0 ? '' : `size: ${size}`}
    ${page === 0 ? '' : `page: ${page}`}
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
  excerpt: HighlightText;
}
export interface GqlSearchResult {
  search: {
    items: BaseDocument[];
    total: number;
  };
}

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

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

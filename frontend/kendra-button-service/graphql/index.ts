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
export const validationQry = ({ site = '' }) => `query{
  site(site: "${site}") {
    site
    domain
    scrapEndpoint
  }
}`;

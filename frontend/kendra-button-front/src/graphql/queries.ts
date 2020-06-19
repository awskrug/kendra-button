// export const createSite = `mutation Create(
//   $site: String!
//   $title: String!
//   $url: String!
// ) {
//   createSite(
//     site: $site
//     title: $title
//     url: $url
//   ) {
//     site {
//       site
//       title
//       url
//       user
//       crawlerStatus {
//         total
//         done
//       }
//     }
//   }
// }`;
export const createSite = `mutation Create(
  $site: String!
  $domain: String!
  $scrapEndpoint: String!
) {
  createSite(
    site: $site
    domain: $domain
    scrapEndpoint: $scrapEndpoint
  ) {
    site {
      user
      site
      domain
      scrapEndpoint
      crawlerStatus {
        total
        done
      }
    }
  }
}`;

export const siteList = `query SiteList{
	sites{
    user
    site
    domain
    scrapEndpoint
    crawlerStatus {
      total
      done
    }
  }
}`;

export const siteListPagination = `query SiteListPagination(
  $pageSize: Int!
  $IntlastKey: String!
){
  sitesPagiNation(
    pageSize: $pageSize
    IntlastKey: $IntlastKey
  ) {
    items {
      sites{
        user
        site
        domain
        scrapEndpoint
        crawlerStatus {
          total
          done
        }
      }
    }
    lastKey
  }
}`;

export const siteItem = `query SiteItem(
  $site: String!
){
	site(site: $site) {
    user
    site
    domain
    scrapEndpoint
    crawlerStatus {
      total
      done
    }
  }
}`;

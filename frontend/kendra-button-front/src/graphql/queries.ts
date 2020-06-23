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

export const updateSite = `mutation Update(
  $site: String!
  $domain: String!
) {
  updateSite(
    site: $site
    domain: $domain
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

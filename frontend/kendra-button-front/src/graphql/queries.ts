export interface CrawlerStatus {
  total: number;
  done: number;
}
export interface SiteNode {
  domain: string;
  name: string;
  scrapEndpoint: string;
  scrapInterval: string;
  siteId: string;
  token: string;
  user: string;
  crawlerStatus: CrawlerStatus;
}
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

export const createSite = `mutation Create(
  $domain: String!
  $name: String!
  $scrapEndpoint: String!
) {
  createSite(
    domain: $domain
    name: $name
    scrapEndpoint: $scrapEndpoint
  ) {
    site {
      user
      name
      token
      siteId
      domain
      scrapEndpoint
      crawlerStatus {
        total
        done
      }
    }
  }
}`;
export interface GqlCreateSiteRes {
  createSite: {
    site: SiteNode;
  };
}

export const updateSite = `mutation Update(
  $domain: String!
  $name: String!
  $siteId: String!
) {
  updateSite(
    domain: $domain
    name: $name
    siteId: $siteId
  ) {
    site {
      user
      name
      token
      siteId
      domain
      scrapEndpoint
      crawlerStatus {
        total
        done
      }
    }
  }
}`;
export interface GqlUpdateSiteRes {
  updateSite: {
    site: SiteNode;
  };
}

export const deleteSite = `mutation Delete(
  $siteId: String!
) {
  deleteSite(
    siteId: $siteId
  ) {
    ok
  }
}`;
export interface GqlDeleteSiteRes {
  ok: boolean;
}

export const siteList = `query SiteList{
	sites {
    domain
    name
    scrapEndpoint
    scrapInterval
    siteId
    token
    user
    crawlerStatus {
      total
      done
    }
  }
}`;

export interface GqlSiteListRes {
  sites: SiteNode[];
}

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
        name
        token
        siteId
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
export interface GqlSiteListPaginationRes {
  items: SiteNode[];
  lastKey: string;
}

export const siteItem = `query SiteItem(
  $siteId: String!
){
	site(siteId: $siteId) {
    user
    name
    token
    siteId
    domain
    scrapEndpoint
    crawlerStatus {
      total
      done
    }
  }
}`;
export interface GqlSiteItemRes {
  site: SiteNode;
}

export const search = `query($keyword:String!, $token: String!, $size: String!, $page: String!){
  search(text: $keyword token: $token size: $size page: $page){
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
export interface GqlSearchRes {
  search: {
    items: BaseDocument[];
    total: number;
  };
}

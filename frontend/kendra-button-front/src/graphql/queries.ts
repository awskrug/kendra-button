export const createSite = `mutation Create(
  $site: String!
  $title: String!
  $url: String!
) {
  createSite(
    site: $site
    title: $title
    url: $url
  ) {
    site {
      site
      title
      url
      user
      crawlerStatus {
        total
        done
      }
    }
  }
}`;

export const siteList = `query SiteList{
	sites{
    site
    user
    title
    url
    crawlerStatus {
      total
      done
    }
  }
}`;

export const siteItem = `query SiteItem(
  $site: String!
){
	site(site: $site) {
    site
    user
    title
    url
    crawlerStatus {
      total
      done
    }
  }
}`;

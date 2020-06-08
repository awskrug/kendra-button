export const createSite = `mutation CreateSite{
  createSite(site:"asdfasdfa",title:"vd",url:"https://avcd.com"){
    site{
      title
      url
      user
    }
  }
}`;

export const siteList = `query SiteList{
	sites{
      site
      user
      title
      url
  }  
}`;

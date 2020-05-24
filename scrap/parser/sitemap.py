from requests_html import AsyncHTMLSession


async def get_sitemap_urls(sitemap_url: str) -> set:
    print(f"{sitemap_url=}")
    session = AsyncHTMLSession()
    req = await session.get(sitemap_url)
    pages = set(req.html.xpath('//url/loc/text()'))
    print(f"find {len(pages)} pages")
    sitemaps = set(req.html.xpath('//sitemap/loc/text()'))
    print(f"find {len(sitemaps)} child sitemaps")
    # 추후 작업을 다시 sqs넣는 방식으로 변경 하기 하위 사이트맵이 900개 넘어가면 시간이 너무 오래 걸림
    for site in sitemaps:
        pages |= await get_sitemap_urls(site)
    print(f"finish {sitemap_url=}\n total pages is {len(pages)}")
    return pages

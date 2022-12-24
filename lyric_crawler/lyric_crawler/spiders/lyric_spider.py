import re
from scrapy.spiders import CrawlSpider

class LyricSpider(CrawlSpider):
    name = "lyric_crawler"
    allowed_domains = ["sinhalasongbook.com"]
    start_urls = ["https://sinhalasongbook.com/featured-artists-sinhala-song-book/"]

    def extract_lyrics(lyrics):
        updated_lyrics = re.sub(r'[a-zA-Z]|\d|#|—|\/|\'|\|', '', lyrics)
        updated_lyrics = re.sub(r'\s+', ' ', updated_lyrics).strip()

        return updated_lyrics

    def parse_song(self, response):
        title = "".join(response.css("div.entry-content > h2 *::text").getall())
        lyrics = "".join(response.css("div.entry-content > pre *::text").getall())
        
        yield {
            "title": title,
            "lyrics": self.extract_lyrics(lyrics)
        }

    def parse_artist(self, response):
        for song_href in response.css("a.entry-title-link::attr(href)").getall():
            yield response.follow(song_href, self.parse_song)

    def parse(self, response):
        # artist_hrefs = [
        #     "https://www.sinhalasongbook.com/category/amaradewa/",
        #     "https://www.sinhalasongbook.com/category/amarasiri-peiris/",
        #     "https://www.sinhalasongbook.com/category/edward-jayakody/",
        #     "https://www.sinhalasongbook.com/category/gunadasa-kapuge/",
        #     "https://www.sinhalasongbook.com/category/karunaratna-divulgane/",
        #     "https://www.sinhalasongbook.com/category/nanda-malani/",
        #     "https://www.sinhalasongbook.com/category/sanath-nandasiri/",
        #     "https://www.sinhalasongbook.com/category/sunil-edirisinghe/",
        #     "https://www.sinhalasongbook.com/category/t-m-jayarathna/",
        #     "https://www.sinhalasongbook.com/category/victor-rathnayaka/"
        # ]

        # for artist_href in artist_hrefs:
        #     yield response.follow(artist_href, self.parse_artist)
        for artist_href in response.css("div.one-half a::attr(href)").getall():
            yield response.follow(artist_href, self.parse_artist)
        
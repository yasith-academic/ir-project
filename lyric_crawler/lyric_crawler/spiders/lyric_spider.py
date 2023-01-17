import re
import json
import os
from scrapy.spiders import Spider

class LyricSpider(Spider):
    # configuration
    name = "lyric_crawler"
    allowed_domains = ["sinhalasongbook.com"]
    start_urls = ["https://sinhalasongbook.com/featured-artists-sinhala-song-book/"]
    
    # outputs
    OUTPUT_PATH = "../outputs/corpus"
    songs = []

    # for limiting the number of songs
    ARTIST_SONG_COUNT = 15

    # print songs after reaching limit
    SONG_COUNT = 0

    # save output of crawled files
    def save_output(self):
        with open(os.path.join(self.OUTPUT_PATH, "songs.json"), "w", encoding="utf8") as f:
            json.dump(self.songs, f, ensure_ascii=False)

    # remove unwanted charactes and extract lyrics
    def extract_data(self, data, extract_type):
        if extract_type == "lyrics":
            data = re.sub(r'[a-zA-Z]|\d|#|—|\/|\'|\+|-|&|\(|\)|∆|\[|\]|\$|\|', '', data)
            data = re.sub(r'[ \t\r\f\v]', ' ', data).strip()
            data = re.sub(r'\n\s*\n', '\n', data)
        elif extract_type == "key_beat":
            key = re.search(r'((?:[A-G][#b]?)(?:\s[a-z]+)?)', data)
            beat = re.search(r'(\d/\d)', data)
            if key != None:
                key = key.group(1)
            if beat != None:
                beat = beat.group(1)
            data = (key, beat)

        return data

    # parse a song
    def parse_song(self, response):
        try:
            title = "".join(response.css("div.entry-content > h2 *::text").getall())
            artist = response.css("div.su-row span.entry-categories a::text").get()
            genre = response.css("div.su-row span.entry-tags a::text").get()
            lyricist = response.css("div.su-row span.lyrics a::text").get()
            music = response.css("div.su-row span.music a::text").get()
            
            key_beat = response.css("div.entry-content h3::text").get()
            key_beat = self.extract_data(key_beat, "key_beat")
            key = key_beat[0]
            beat = key_beat[1]
            
            lyrics = "".join(response.css("div.entry-content pre *::text").getall())
            lyrics = self.extract_data(lyrics, "lyrics")
            
            self.songs.append({
                "title": title,
                "artist": artist,
                "genre": genre,
                "lyricist": lyricist,
                "music": music,
                "key": key,
                "beat": beat,
                "lyrics": lyrics
            })
        except:
            print("Error Occurred while parsing the Song")
        finally:
            self.SONG_COUNT -= 1
            print(self.SONG_COUNT)
            if self.SONG_COUNT == 2:
                print("Writing Songs")
                self.save_output()

    # parse an artist
    def parse_artist(self, response):
        songs = response.css("a.entry-title-link::attr(href)").getall()
        if len(songs) > self.ARTIST_SONG_COUNT:
            songs = songs[:self.ARTIST_SONG_COUNT]
        self.SONG_COUNT += len(songs)

        for song_href in songs:
            yield response.follow(song_href, self.parse_song)

    def parse(self, response):
        artist_hrefs = [
            "https://www.sinhalasongbook.com/category/amaradewa/",
            "https://www.sinhalasongbook.com/category/amarasiri-peiris/",
            "https://www.sinhalasongbook.com/category/edward-jayakody/",
            "https://www.sinhalasongbook.com/category/gunadasa-kapuge/",
            "https://www.sinhalasongbook.com/category/karunaratna-divulgane/",
            "https://www.sinhalasongbook.com/category/nanda-malani/",
            "https://www.sinhalasongbook.com/category/sanath-nandasiri/",
            "https://www.sinhalasongbook.com/category/sunil-edirisinghe/",
            "https://www.sinhalasongbook.com/category/t-m-jayarathna/",
            "https://www.sinhalasongbook.com/category/victor-rathnayaka/"
        ]

        for artist_href in artist_hrefs:
            yield response.follow(artist_href, self.parse_artist)
# Sinhala Song Search Application

This application is done as a project for the Semester 7, CS4642 - Data Mining & Information Retrieval module under the Department of Computer Science and Engineering, University of Moratuwa.

## Table of Content

1. Corpus Creation.
2. Information Retrieval System using `elasticsearch`.
3. Backend creation using `elasticsearch Nodejs client`.
4. Frontend.

### Corpus Creation

The corpus used for the application was created using python's web crawling framework [`Scrapy`](https://scrapy.org/). Following are some key points of the corpus creation.

1. Song information Collection.
   - [https://www.sinhalasongbook.com/](https://www.sinhalasongbook.com/) was used to crawl song data.
2. Song data were crawled using `Scrapy` as mentioned above.
   - Songs sung by `Amaradewa`, `Amarasiri Peiris`, `Edward Jayakody`, `Gunadasa Kapuge`, `Karunarathna Divulgane`, `Nanda Malani`, `Sanath Nandasiri`, `Sunil Edirisinghe`, `TM Jayarathna`, `Victor Rathnayaka` were selected to be crawled.
   - A maximum of 15 songs by each (a total of 150 songs were collected) artist were collected to create the initial corpus.
3. Adding metaphor data.
   - Using the 150 songs obtained, 100 songs were selected by adding metaphors data manually for each seleted song.
   - Metaphor related fields added: `metaphor`, `metaphor interpretation`, `metaphore source domain`, `metaphore target domain`.
4. Creating the corpus.
   - Using the formatted song details, a song corpus in `csv` format was created ([songs_formatted.csv](outputs/corpus/songs_formatted.csv)) and using it the indexable song data file ([song_data.json](elasticsearch/song_data.json)) was created.

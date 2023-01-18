# Sinhala Song Search Application

This application is done as a project for the Semester 7, CS4642 - Data Mining & Information Retrieval module under the Department of Computer Science and Engineering, University of Moratuwa.

## Table of Content

1. [Corpus Creation](#corpus-creation).
2. [Information Retrieval System using `elasticsearch`](#information-retieval-system).
3. Frontend and Backend of the system.

### Corpus Creation

The corpus used for the application was created using python's web crawling framework [`Scrapy`](https://scrapy.org/). Following are some key points of the corpus creation.

1. Song information Collection.
   - [https://www.sinhalasongbook.com/](https://www.sinhalasongbook.com/) was used to crawl song data.
2. Song data were crawled using `Scrapy` as mentioned above.
   - Songs sung by `Amaradewa`, `Amarasiri Peiris`, `Edward Jayakody`, `Gunadasa Kapuge`, `Karunarathna Divulgane`, `Nanda Malani`, `Sanath Nandasiri`, `Sunil Edirisinghe`, `TM Jayarathna`, `Victor Rathnayaka` were selected to be crawled.
   - A maximum of 15 songs by each (a total of 150 songs were collected) artist were collected to create the initial corpus.
   - Each crawled item contained information about the `title`, `artist`, `genre`, `lyricist`, `music`, `key`, `beat`, `lyrics` of the song.
3. Adding metaphor data.
   - Using the 150 songs obtained, 100 songs were selected by adding metaphors data manually for each seleted song.
   - Metaphor related fields added: `metaphor`, `metaphor interpretation`, `metaphore source domain`, `metaphore target domain`.
4. Creating the corpus.
   - Using the formatted song details, a song corpus in `csv` format was created ([songs_formatted.csv](outputs/corpus/songs_formatted.csv)) and using it the indexable song data file ([song_data.json](elasticsearch/song_data.json)) was created.

### Information Retieval System

After completing the song corpus, next the information retrieval system for sinhala songs were created using [`elasticsearch`](https://www.elastic.co/). [`Node.js elasticsearch client`](https://www.npmjs.com/package/@elastic/elasticsearch) was used for elasticsearch operations. Following are some important functionalities of the Information Retrieval System.

1. Analyzers:

   - `sinhala_language_analyzer`: A custom analyzer created for analyzing `sinhala` words. [`icu_tokenizer`](https://www.elastic.co/guide/en/elasticsearch/plugins/current/analysis-icu-tokenizer.html) plugin was seleted as the `tokenizer` which supports asian languages. Finally, a few custom filters related to `sinhala` language within the domain was created which will be explained in the `Filters` section.
   - `case_insensitive_analyzer`: A custom analyzer created for analyzing `english` words by filtering every character into `lowercase` characters.

2. Filters:

   - `stop word filters`: Custom stop word filters related to different sinhala searching fields (`song`, `artist`, `lyricist`, `other`) were created.
   - `sinhala n gram`: Edge N Gram filter was created with a `max_gram` of 10 and `min_gram` of 2.

3. Mappings:
   - After creating the custom analyzers and filters, mappings for each field were created.

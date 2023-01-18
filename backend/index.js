"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const { Client } = require("@elastic/elasticsearch");
const client = new Client({ node: "http://localhost:9200" });

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.post("/search", async (req, res) => {
  const { title, artist, genre, lyricist, music, key, beat, lyrics, metaphor } =
    req.body;

  let conditions = [];
  if (title) {
    conditions.push({ match: { "title.sinhala": title } });
    conditions.push({ match: { "title.case_insensitive": title } });
  } else if (artist) {
    conditions.push({ match: { "artist.case_insensitive": artist } });
  } else if (genre) {
    conditions.push({ match: { genre: genre } });
  } else if (lyricist) {
    conditions.push({ match: { "lyricist.case_insensitive": lyricist } });
  } else if (music) {
    conditions.push({ match: { "music.case_insensitive": music } });
  } else if (key) {
    conditions.push({ match: { "key.case_insensitive": key } });
  } else if (beat) {
    conditions.push({ match: { beat: beat } });
  } else if (lyrics) {
    conditions.push({ match: { "lyrics.sinhala": lyrics } });
  } else if (metaphor) {
    conditions.push({ match: { "metaphor.sinhala": metaphor } });
  }

  const result = await client.search({
    index: "songs",
    size: 100,
    query: {
      bool: {
        must: conditions,
      },
    },
  });

  const output = result.hits.hits.map((hit) => ({
    score: hit._score,
    title: hit._source.title,
    artist: hit._source.artist,
    genre: hit._source.genre,
    lyricist: hit._source.lyricist,
    music: hit._source.music,
    key: hit._source.key,
    beat: hit._source.beat,
    lyrics: hit._source.lyrics,
    metaphor: hit._source.metaphor,
    metaphor_interpretation: hit._source.metaphor_interpretation,
    metaphor_source_domain: hit._source.metaphor_source_domain,
    metaphor_target_domain: hit._source.metaphor_target_domain,
  }));

  console.log("POST /search");
  res.json(output);
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

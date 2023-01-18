"use strict";

require("array.prototype.flatmap").shim();
const { Client } = require("@elastic/elasticsearch");
const client = new Client({ node: "http://localhost:9200" });
const song_data = require("../elasticsearch/song_data.json");

async function run() {
  await client.indices.create(
    {
      index: "songs",
      body: {
        settings: {
          index: {
            analysis: {
              analyzer: {
                sinhala_language_analyzer: {
                  type: "custom",
                  filter: [
                    "song_stop_word_filter",
                    "artist_stop_word_filter",
                    "lyricist_stop_word_filter",
                    "other_stop_word_filter",
                    "sinhala_n_gram",
                  ],
                  tokenizer: "icu_tokenizer",
                },
                case_insensitive_analyzer: {
                  filter: ["lowercase"],
                  tokenizer: "standard",
                },
              },
              filter: {
                song_stop_word_filter: {
                  type: "stop",
                  stopwords: [
                    "ගීත",
                    "ගීතය",
                    "ගී",
                    "සිංදු",
                    "සිංදූ",
                    "සංගීතය",
                    "සංගීතවත්",
                  ],
                },
                artist_stop_word_filter: {
                  type: "stop",
                  stopwords: ["ගැයූ", "ගායනා", "ගීතවත්", "කිව්ව", "කීව"],
                },
                lyricist_stop_word_filter: {
                  type: "stop",
                  stopwords: ["රචනා", "රචිත", "ලියුව", "ලියූ"],
                },
                other_stop_word_filter: {
                  type: "stop",
                  stopwords: ["කල", "කරපු", "කෙරූ"],
                },
                sinhala_n_gram: {
                  type: "edge_ngram",
                  min_gram: 2,
                  max_gram: 10,
                },
              },
            },
          },
        },
        mappings: {
          properties: {
            title: {
              type: "text",
              analyzer: "sinhala_language_analyzer",
              fields: {
                sinhala: {
                  type: "text",
                  analyzer: "sinhala_language_analyzer",
                },
                case_insensitive: {
                  type: "text",
                  analyzer: "case_insensitive_analyzer",
                },
              },
            },
            artist: {
              type: "text",
              analyzer: "sinhala_language_analyzer",
              fields: {
                sinhala: {
                  type: "text",
                  analyzer: "sinhala_language_analyzer",
                },
                case_insensitive: {
                  type: "text",
                  analyzer: "case_insensitive_analyzer",
                },
              },
            },
            genre: {
              type: "keyword",
            },
            lyricist: {
              type: "text",
              analyzer: "sinhala_language_analyzer",
              fields: {
                sinhala: {
                  type: "text",
                  analyzer: "sinhala_language_analyzer",
                },
                case_insensitive: {
                  type: "text",
                  analyzer: "case_insensitive_analyzer",
                },
              },
            },
            music: {
              type: "text",
              analyzer: "case_insensitive_analyzer",
              fields: {
                case_insensitive: {
                  type: "text",
                  analyzer: "case_insensitive_analyzer",
                },
              },
            },
            key: {
              type: "text",
              analyzer: "case_insensitive_analyzer",
              fields: {
                case_insensitive: {
                  type: "text",
                  analyzer: "case_insensitive_analyzer",
                },
              },
            },
            beat: {
              type: "keyword",
            },
            lyrics: {
              type: "text",
              analyzer: "sinhala_language_analyzer",
              fields: {
                sinhala: {
                  type: "text",
                  analyzer: "sinhala_language_analyzer",
                },
              },
            },
            metaphor: {
              type: "text",
              analyzer: "sinhala_language_analyzer",
              fields: {
                sinhala: {
                  type: "text",
                  analyzer: "sinhala_language_analyzer",
                },
              },
            },
            metaphor_interpretation: {
              type: "text",
              analyzer: "sinhala_language_analyzer",
              fields: {
                sinhala: {
                  type: "text",
                  analyzer: "sinhala_language_analyzer",
                },
              },
            },
            metaphor_source_domain: {
              type: "text",
              analyzer: "sinhala_language_analyzer",
              fields: {
                sinhala: {
                  type: "text",
                  analyzer: "sinhala_language_analyzer",
                },
              },
            },
            metaphor_target_domain: {
              type: "text",
              analyzer: "sinhala_language_analyzer",
              fields: {
                sinhala: {
                  type: "text",
                  analyzer: "sinhala_language_analyzer",
                },
              },
            },
          },
        },
      },
    },
    { ignore: [400] }
  );

  const operations = song_data.flatMap((doc) => [
    { index: { _index: "songs" } },
    doc,
  ]);

  const bulkResponse = await client.bulk({ refresh: true, operations });

  if (bulkResponse.errors) {
    const erroredDocuments = [];
    // The items array has the same order of the dataset we just indexed.
    // The presence of the `error` key indicates that the operation
    // that we did for the document has failed.
    bulkResponse.items.forEach((action, i) => {
      const operation = Object.keys(action)[0];
      if (action[operation].error) {
        erroredDocuments.push({
          // If the status is 429 it means that you can retry the document,
          // otherwise it's very likely a mapping error, and you should
          // fix the document before to try it again.
          status: action[operation].status,
          error: action[operation].error,
          operation: operations[i * 2],
          document: operations[i * 2 + 1],
        });
      }
    });
    console.log(erroredDocuments);
  }

  const count = await client.count({ index: "songs" });
  console.log(count);
}

run().catch(console.log);

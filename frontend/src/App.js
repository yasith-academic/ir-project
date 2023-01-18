import { useState, useEffect } from "react";
import clsx from "clsx";
import {
  Grid,
  Container,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
} from "@mui/material";
import api from "./api";

import "./App.css";

function App() {
  const [searcher, setSearcher] = useState("title");
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [showingSong, setShowingSong] = useState(null);
  const [showingResults, setShowingResults] = useState(false);

  const searchSong = async (searcher, search) => {
    setShowingSong(null);
    setShowingResults(false);
    const request = {
      title: searcher === "title" ? search : "",
      artist: searcher === "artist" ? search : "",
      genre: searcher === "genre" ? search : "",
      lyricist: searcher === "lyricist" ? search : "",
      music: searcher === "music" ? search : "",
      key: searcher === "key" ? search : "",
      beat: searcher === "beat" ? search : "",
      lyrics: searcher === "lyrics" ? search : "",
      metaphor: searcher === "metaphor" ? search : "",
    };

    const response = await api.POST(request);
    setResults(response);
    setShowingResults(true);
    setShowingSong(null);
  };

  useEffect(() => {
    console.log(results);
  }, [results, setResults]);

  return (
    <div className="body">
      <Container>
        <Typography variant="h4" className={clsx("title", "text")}>
          Sinhala Song Searcher
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Search By</InputLabel>
              <Select
                label="Search By"
                value={searcher}
                defaultValue="Title"
                onChange={(e) => setSearcher(e.target.value)}
              >
                <MenuItem value="title">Title</MenuItem>
                <MenuItem value="artist">Artist</MenuItem>
                <MenuItem value="genre">Genre</MenuItem>
                <MenuItem value="lyricist">Lyricist</MenuItem>
                <MenuItem value="music">Music</MenuItem>
                <MenuItem value="key">Key</MenuItem>
                <MenuItem value="beat">Beat</MenuItem>
                <MenuItem value="lyrics">Lyrics</MenuItem>
                <MenuItem value="metaphor">Metaphor</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              value={search}
              placeholder="Search..."
              onChange={(e) => setSearch(e.target.value)}
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <Button
              variant="contained"
              className="button"
              onClick={() => searchSong(searcher, search)}
            >
              Search
            </Button>
          </Grid>
        </Grid>

        {showingSong === null && showingResults && (
          <Box className="search-container">
            {results.map((result, index) => (
              <Box key={index} className="search-result">
                <Typography
                  variant="h5"
                  className="search-result-title"
                  onClick={() => setShowingSong(index)}
                >
                  {result.title}
                </Typography>
                <Box className="search-result-additional-container">
                  <Typography variant="h6" className="search-result-additional">
                    Artist: {result.artist}
                  </Typography>
                  <Typography variant="h6" className="search-result-additional">
                    Beat: {result.beat}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        )}

        {showingSong !== null && (
          <Grid container className="song-container" spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" className="song-title">
                {results[showingSong].title}
              </Typography>
              <Typography variant="h6" className="song-lyrics">
                {results[showingSong].lyrics}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" className="song-fields">
                {`Artist: ${results[showingSong].artist}`}
              </Typography>
              <Typography variant="h6" className="song-fields">
                {`Genre: ${results[showingSong].genre}`}
              </Typography>
              <Typography variant="h6" className="song-fields">
                {`Lyricist: ${results[showingSong].lyricist}`}
              </Typography>
              <Typography variant="h6" className="song-fields">
                {`Music: ${results[showingSong].music}`}
              </Typography>
              <Typography variant="h6" className="song-fields">
                {`Key: ${results[showingSong].key}`}
              </Typography>
              <Typography variant="h6" className="song-fields">
                {`Beat: ${results[showingSong].beat}`}
              </Typography>
              <Typography variant="h6" className="song-fields">
                {`Metaphor: ${results[showingSong].metaphor}`}
              </Typography>
              <Typography variant="h6" className="song-fields">
                {`Metaphor Interpretation: ${results[showingSong].metaphor_interpretation}`}
              </Typography>
              <Typography variant="h6" className="song-fields">
                {`Metaphor Source Domain: ${results[showingSong].metaphor_source_domain}`}
              </Typography>
              <Typography variant="h6" className="song-fields">
                {`Metaphor Target Domain: ${results[showingSong].metaphor_target_domain}`}
              </Typography>
            </Grid>
          </Grid>
        )}
      </Container>
    </div>
  );
}

export default App;

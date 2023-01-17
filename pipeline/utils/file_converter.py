import json
import pandas as pd

class FileConverter:  
    def json_to_csv(JSON_FILE_PATH, CSV_FILE_PATH):
        # converts the song json file to csv
        with open(JSON_FILE_PATH, "r") as f:
            songs = json.load(f)
        
        # convert to dataframe
        df = pd.DataFrame({
            "title": [song["title"] for song in songs],
            "artist": [song["artist"] for song in songs],
            "genre": [song["genre"] for song in songs],
            "lyricist": [song["lyricist"] for song in songs],
            "music": [song["music"] for song in songs],
            "key": [song["key"] for song in songs],
            "beat": [song["beat"] for song in songs],
            "lyrics": [song["lyrics"] for song in songs]
        })

        # save to csv
        df.to_csv(CSV_FILE_PATH, index=False)

    def format_csv(CSV_INPUT_PATH, CSV_OUTPUT_PATH):
        # formats the csv file
        df = pd.read_csv(CSV_INPUT_PATH)
        df = df[df["selected"] == 1]
        df.drop(columns=["selected"], inplace=True)

        # save to csv
        df.to_csv(CSV_OUTPUT_PATH, index=False)
from utils.file_converter import FileConverter as fc

# generates the data file for the elastic search index
fc.csv_to_index("outputs/corpus/songs_formatted.csv", "elasticsearch/song_data.json")

from utils.file_converter import FileConverter as fc

fc.json_to_csv("outputs/corpus/songs.json", "outputs/corpus/songs.csv")
fc.format_csv("outputs/corpus/songs_unformatted.csv", "outputs/corpus/songs_formatted.csv")
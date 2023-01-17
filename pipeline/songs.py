from utils.file_converter import FileConverter as fc

# fc.json_to_csv("output/songs.json", "output/songs.csv")
fc.format_csv("outputs/corpus/songs_unformatted.csv", "outputs/corpus/songs_formatted.csv")
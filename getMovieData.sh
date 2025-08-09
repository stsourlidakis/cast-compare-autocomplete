#!/bin/bash
# https://developers.themoviedb.org/3/getting-started/daily-file-exports
MIN_POPULARITY=0.1
filename="movie_ids_$(date +%m_%d_%Y).json"
fileUrl="http://files.tmdb.org/p/exports/$filename.gz"
wget $fileUrl
gunzip -f "$filename.gz"

# Check if file exists after download and extraction
if [ ! -f "$filename" ]; then
    echo "Error: File $filename not found after download/extraction"
    exit 1
fi

echo "Starting data processing"

sed -r 's/^\{"adult":|\}$//g; s/,"id":|,"original_title":"|","popularity":|,"video":/\t/g' $filename |
awk -F"\t" -v min_pop="$MIN_POPULARITY" '$4 >= min_pop' |
sort -t$'\t' -rnk4 |
awk -F"\t" '$1 == "false" { print $3"\t"$2 }' > movie.tsv

echo "Movie file created"
rm $filename
echo "Downloaded file removed"

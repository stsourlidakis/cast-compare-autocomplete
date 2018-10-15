#!/bin/bash
# https://developers.themoviedb.org/3/getting-started/daily-file-exports
filename="movie_ids_$(date +%m_%d_%Y).json"
fileUrl="http://files.tmdb.org/p/exports/$filename.gz"
wget $fileUrl
gunzip -f "$filename.gz"

echo "Starting data processing"

sed -r 's/^\{"adult":|\}$//g; s/,"id":|,"original_title":"|","popularity":|,"video":/\t/g' $filename |
sort -t$'\t' -rnk4 |
awk -F"\t" '$1 == "false" { print $3"\t"$2 }' > movie.tsv

echo "Movie file created"

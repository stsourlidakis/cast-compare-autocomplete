#!/bin/bash
# https://developers.themoviedb.org/3/getting-started/daily-file-exports
MIN_POPULARITY=0.8
filename="person_ids_$(date +%m_%d_%Y).json"
fileUrl="http://files.tmdb.org/p/exports/$filename.gz"
wget $fileUrl
gunzip -f "$filename.gz"

echo "Starting data processing"

sed -r 's/^\{"adult":|\}$//g; s/,"id":|,"name":"|","popularity":/\t/g' $filename |
awk -F"\t" -v min_pop="$MIN_POPULARITY" '$4 >= min_pop' |
sort -t$'\t' -rnk4 |
awk -F"\t" '$1 == "false" { print $3"\t"$2 }' > person.tsv

echo "Person file created"
rm $filename
echo "Downloaded file removed"

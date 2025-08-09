#!/bin/bash
# https://developers.themoviedb.org/3/getting-started/daily-file-exports
filename="person_ids_$(date +%m_%d_%Y).json"
fileUrl="http://files.tmdb.org/p/exports/$filename.gz"
wget $fileUrl
gunzip -f "$filename.gz"

echo "Starting data processing"

sed -r 's/^\{"adult":|\}$//g; s/,"id":|,"name":"|","popularity":/\t/g' $filename |
sort -t$'\t' -rnk4 |
awk -F"\t" '$1 == "false" { print $3"\t"$2 }' > person.tsv

echo "Person file created"
rm $filename
echo "Downloaded file removed"

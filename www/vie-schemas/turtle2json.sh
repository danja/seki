#!/bin/bash
# Converts Turtle files to JSON (assuming common naming)

echo "NOT JSON-LD!!!"

for i in $( ls *.ttl )
do
    file=$( basename "$i" )
    name=${file%.*}
    echo .
    echo "$i -> $name.json"
    rapper -i rdfxml -o turtle $i > $name.json   
done
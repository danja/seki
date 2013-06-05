#!/bin/bash
# Converts RDF/XML files in this dir to Turtle format (assuming common naming)

for i in $( ls *.rdf; ls *.owl )
do
	file=$( basename "$i" )
	name=${file%.*}
	echo .
	echo "$i -> $name.ttl"
	rapper -i rdfxml -o turtle $i > $name.ttl   
done

for i in $( ls *.ttl )
do
	rapper -i turtle -c $i 
done

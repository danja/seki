curl https://danja:sashapooch@api.del.icio.us/v1/posts/all?red=api > delicious.xml
xsltproc -o ../../data/samples/delicious.rdf delicious2rdfxml-simple.xsl delicious.xml
rapper -i rdfxml -o turtle delicious.rdf > delicious.ttl


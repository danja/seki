java -Xms2048M -Xmx2048M -Xss4m -jar ../jena-fuseki-1.0.0/fuseki-server.jar --verbose --update --config ../src/config/seki-config.ttl --pages ~/fuwiki/pages

# -Xss4m is stack

# was ../jena-fuseki-1.0.0/pages

# was just -Xmx1200M

# java -Xmx1200M -jar fuseki-server.jar --update --desc tdb.ttl /seki
# --verbose

# /home/java/eclipse/eclipse -vmargs -Xms1024M -Xmx1536M

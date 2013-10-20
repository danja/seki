cd ..
docco-husky -name "Seki" *.js admin config handlers misc rules templates tests usermanager utils
yuidoc -c ./yuidoc.json ./

# see also : yuidoc --server -c ./yuidoc.json ./

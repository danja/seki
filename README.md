**Seki is a front-end to an independent SPARQL server using node.js**

It operates as a Web server, building queries from HTTP requests and passing them to the SPARQL server and formatting the results to HTML which is passed back to the client (typically a browser).

![Block Diagram](https://github.com/danja/seki/raw/master/docs/seki-full.png)

The current version has been written for an RDF tutorial and right now only features basic functionality. It has minimal dependency on other modules. Once this version is stable (very soon) it will be frozen as a branch, the main branch being used for development of a production version.

If (were it live) you pointed a browser at http://hyperdata.org/seki/Hello it would take "http://hyperdata.org/seki/Hello" to build a query to find out about that resource - in the data store it will have a title, content etc. - which then get turned into HTML to show in the browser.

There is a form to allow POSTing, inserting title, content etc. for a given resource into the RDF store. Files can also be served from the filesystem.

It has been built against a Fuseki server, which uses protocols/query syntax according to the latest SPARQL 1.1 drafts, and so it should be reusable with any SPARQL server.

At present it considers all resources to be information resources - the ones that get displated are instances of sioc:Post.

After the tutorial version is stable the plan is to use it as an experimental Read/Write Data Web testbed, e.g. adding support for the linked data API, RDF affordances play.

Proper installation notes will follow soon, but basically it's install node.js and Fuseki (using tdb.ttl as the config for Fuseki) and run seki.js.





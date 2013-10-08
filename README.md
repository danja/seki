**Seki is a front-end to an independent SPARQL server using node.js**

It operates as a Web server, building queries from HTTP requests and passing them to the SPARQL server and formatting the results to HTML which is passed back to the client (typically a browser).

![Block Diagram](https://github.com/danja/seki/raw/master/docs/seki-full.png)

For updates see [Seki on G+](https://plus.google.com/b/102910670341143019851/102910670341143019851/posts)

Also [TODO List](https://workflowy.com/shared/dd5976b2-b48f-9096-0357-105f34b4d6ed/)

Note 2013-08-27 : packaging etc. still in progress, but I have managed to get a live instance running on OpenShift (Red Hat's hosting service) at http://seki-hyperdata.rhcloud.com/welcome, backed by a Fuseki store hosted at http://fuseki-hyperdata.rhcloud.com/ (using https://github.com/semfact/openshift-fuseki ). The live Seki code is structured differently than that in git here, but as that version works (!) I'll merge it back in here asap.

Note 2013-08-15 : currently trying to package as npm and tidy up dependencies - may be a messfor a little while

If (were it live) you pointed a browser at http://hyperdata.org/seki/Hello it would take "http://hyperdata.org/seki/Hello" to build a query to find out about that resource - in the data store it will have a title, content etc. - which then get turned into HTML to show in the browser.

There is a form to allow POSTing, inserting title, content etc. for a given resource into the RDF store (there's no authentication as yet). Files can also be served from the filesystem.

It has been built against a Fuseki server, which uses protocols/query syntax according to the latest SPARQL 1.1 drafts, and so it should be reusable with any SPARQL server.

(Note that the current version includes a little SAX-based XML SPARQL results to JSON converter, this was for demo purposes (don't ask!) - future versions *may* use JSON SPARQL results directly).

At present it considers all resources to be information resources - the ones that get displayed are instances of sioc:Post. Descriptions of those resources are contained in little named graphs (named by the resources in question). The Fuseki config includes _#dataset tdb:unionDefaultGraph true_ so SPARQL queries can be applied over a (virtual) merge of all the named graphs.

After the tutorial version is stable the plan is to use it as an experimental Read/Write Data Web testbed, e.g. adding support for the linked data API, RDF affordances play.

See contents.txt in individual folders for description.

Installation/running is easy : 

* install node.js (or copy node.exe into the src dir)
* run Fuseki using bin/run-fuseki.bat (make executable first on *nix)
* in another terminal bin/run-seki.bat (or node Seki.js)
* point a browser at http://localhost:8888/seki/ 

post data should have URIs of the form http://hyperdata.org/seki/Hello
the Fuseki server (SPARQL endpoint) will be accessible at http://localhost:3030/

localhost:8888/store/ will proxy to the store

Exploring data from Fuseki, first select the /seki dataset through the Control Panel, then go to the query panel
with e.g. 
   SELECT * WHERE { GRAPH ?graph { ?s ?p ?o } }
   
----

2013-10-07

Added bits for [Grunt](http://gruntjs.com/), [Vows](http://vowsjs.org/) plus [grunt-vows](https://github.com/CMTegner/grunt-vows), also [APIeasy](https://github.com/flatiron/api-easy), though not yet runnable, related scripts will be in /bin (also will set up 'npm test').

[docco-husky]() used for source doc generation.

----


[Danny](http://dannyayers.com/) 2011-2013





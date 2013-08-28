
# Fuseki on OpenShift

This git repository sets up a
[Fuseki SPARQL server](https://jena.apache.org/documentation/serving_data/)
on OpenShift.

## Running on OpenShift

Create an account at
[http://openshift.redhat.com/](http://openshift.redhat.com/)

Create a `diy-0.1` application

    rhc app create -a fuseki -t diy-0.1

Add this repository

    cd fuseki
    git remote add fuseki -m master git://github.com/semfact/openshift-fuseki.git
    git pull -s recursive -X theirs fuseki master

Push the repository to your OpenShift instance

    git push

And you've got Fuseki running! Check it out at

    http://fuseki-$yournamespace.rhcloud.com



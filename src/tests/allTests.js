/*            Test Fixture
          run with:
          nodeunit allTests.js
          
          requires:
          npm install nodeunit
 */

exports.miscTests = {
		testTemplater: require("./testTemplater"),
    };

exports.httpTests = {
		testRdfHttp: require("./testRdfHttp")
    };

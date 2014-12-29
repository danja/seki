xhrFields: { responseType: "document" },

To retrieve the document object, your success call should look like this:

success: function(data, textStatus, request) {
  if (textStatus == "success") {
    myResponse = request.responseXML;
  }
  else
    // Not successful
  },
  
  https://github.com/glennjones/microformat-shiv
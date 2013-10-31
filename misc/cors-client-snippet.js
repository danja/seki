  var x = new XMLHttpRequest();
  if ("withCredentials" in x) {
      x.open("GET", o.url, true);
  } else if (typeof XDomainRequest != "undefined") {
      x = new XDomainRequest();
      x.open("GET", o.url);
  } else {
      // Otherwise, CORS is not supported by the browser.
      x = null;
  }

        function escapeRegExp(string) {
            return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
        }
        
        function replaceAll(string, find, replace) {
            return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
        }
        
        var queryString = (function(a) {
            if (a == "") return {};
                           var b = {};
                           for (var i = 0; i < a.length; ++i)  {
                               var p=a[i].split('=', 2);
                               if (p.length == 1)
                                   b[p[0]] = "";
                               else
                                   b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
                           }
                           return b;
        })(window.location.search.substr(1).split('&'));
        
        
        function translateLocalLinks() {
            $('div.content  a').each(
                function(){
                    if (this.href.indexOf(serverBaseURI) == 0) {
                    //    console.log("old href = "+this.href);
                        var localRef = this.href.substring(serverBaseURI.length);
                //        console.log("new = "+this.href.substring(serverBaseURI.length));
                 //       console.log("new href = "+this.href);
                        this.href = serverBaseURI + "page.html?uri="+pagesBaseURI+localRef;
                    }
                    
                });
       //     console.log("edit link = "+$('#editLink').href);
        }
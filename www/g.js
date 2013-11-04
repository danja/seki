javascript: (function() {
    var % 20a = window,
        b = document,
        c = encodeURIComponent,
        d = a.open("http://localhost:8888/miniform.html?op=edit&output=popup&bkmk=" + c(b.location) + "&title=" + c(b.title), "bkmk_popup", "left=" + ((a.screenX || a.screenLeft) + 10) + ",top=" + ((a.screenY || a.screenTop) + 10) + ",height=420px,width=550px,resizable=1,alwaysRaised=1");
    a.setTimeout(function() {
        d.focus()
    }, 300)
})();

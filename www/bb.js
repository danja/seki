javascript: (function() {
    f = 'http://localhost:8888/miniform.html?url=' + encodeURIComponent(window.location.href) + '&title=' + encodeURIComponent(document.title) + '&notes=' + encodeURIComponent('' + (window.getSelection ? window.getSelection() : document.getSelection ? document.getSelection() : document.selection.createRange().text)) + '&v=6&';
    a = function() {
        if (!window.open(f + 'noui=1&jump=doclose', 'deliciousuiv6', 'location=1,links=0,scrollbars=0,toolbar=0,width=710,height=660')) location.href = f + 'jump=yes'
    };
    if (/Firefox/.test(navigator.userAgent)) {
        setTimeout(a, 0)
    } else {
        a()
    }
})()

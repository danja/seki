 //init functions
$(function() {
    Trellis.init();
});

var Trellis = Trellis || {};

Trellis.init = function() {

    var keyCodes = {
        "tab": 9,
        "return": 13,
        "down": 40,
        "up": 38
    }
    /*
     altKey - alt/option key                                    *
     ctrlKey - control key
     shiftKey - shift key
     metaKey - control key on PCs, control and/or command key on Macs
     */



    $('.ts-expander').on('click', function() {
        $(".ts-title").removeClass('ts-selected');
        $(this).parent().parent().toggleClass('ts-open').toggleClass('ts-closed');
        // return false;
        event.preventDefault();
    });

    $('.ts-entry').keydown(function(e) {
        $(this).find(".ts-title").addClass('ts-selected');

        var li = $(this).parent("li");

        var keyCode = e.keyCode || e.which;
        console.log("Handler for .keydown() called = " + keyCode);
        if (keyCode == keyCodes["return"]) {
            ts_insert($(li));
        }
        if (keyCode == keyCodes["tab"]) {
            if (e.shiftKey) {
                ts_outdent($(li));
            } else {
                ts_indent($(li));
            }
            event.preventDefault();
        }
        if (keyCode == keyCodes["down"]) {
            ts_down($(li));
            event.preventDefault();
        }
        if (keyCode == keyCodes["up"]) {
            ts_up($(li));
            event.preventDefault();
        }
    });

    function ts_up($li) {

        var prevLI = $li.prev("li");
        console.log("prevLI.length " + prevLI.length);

        if (prevLI.length == 0) {
            prevLI = $li.parent().closest("li");
        }

        /*
        while(prevLI.children("ul").length) { // descend tree
            console.log("prevLI.childrenul).length "+prevLI.children("ul").length);
            var kids = $(prevLI.children("ul")[0]).children("li");
            prevLI = $(kids[kids.length-1]);
        }
        */

        $(".ts-title").removeClass('ts-selected');
        var title = $(prevLI).find(".ts-title");
        console.log("tl" + title.length);
        if (title.length > 1) {
            title = $($(prevLI).find(".ts-title")[0]);
        }
        title.focus();
        title.addClass('ts-selected');
    }

    function ts_down($li) {
        console.log("down");

        var nextLI = $li.next("li"); // easy one

        if (nextLI.length == 0) {
            nextLI = $li.parent("ul").parent("li").next("li");
        }

        if ($li.children("ul").length) {
            nextLI = $($li.children("ul").children("li")[0]);
        }

        $(".ts-title").removeClass('ts-selected');

        var title = $(nextLI).find(".ts-title");

        if (title.length > 1) {
            title = $($(nextLI).find(".ts-title")[0]);
        }
        title.focus();
        title.addClass('ts-selected');
    }

    function ts_indent($li) {
        console.log("TAB");

        var prev = $li.prev("li");
        console.log("prev = " + prev.length + "   " + prev.attr("class"));
        if (prev.length) {
            if (prev.hasClass("ts-open") || prev.hasClass("ts-closed")) {
                console.log("has ts-open/closed");

                var prevUL = prev.children("ul");
                console.log("prevUL = " + prevUL.length + "   " + prevUL.attr("class"));
                $li.remove();
                prevUL.append($li);
            } else {
                $li.remove();
                var ul = $('<ul/>').appendTo(prev);
                ul.append($li);
                prev.addClass("ts-open");
            }
        }
        event.preventDefault();
    }

    function ts_outdent($li) {
        console.log("UNTAB");
        var target = $li.parent().parent();
        console.log("target.html() = " + target.html());
        if (target.length) {
            $li.remove();
            target.append($li);
        }
        event.preventDefault();
    }

    function ts_insert($li) {
        console.log("INSERT");
        var template = $("#li-template").clone(true); // deepWithDataAndEvents
        template.removeClass("hidden"); 
        template.removeAttr("id");
       template.find("#nid-template").attr("id", generateID());
  
        
        $li.after(template);
     
        template.show();
        
        
        $li.find(".ts-title").removeClass('ts-selected');
        // .attr('contenteditable', 'false');
        $('.ts-title')
        template.find(".ts-title").addClass('ts-selected');
        // .attr('contenteditable', 'true');
        
        event.preventDefault();
    }

    $('.ts-entry').click(function() {
        $(".ts-title").removeClass('ts-selected');
        $(this).find(".ts-title").addClass('ts-selected');
        //    ts_highlight($(this));
        $(this).find(".ts-actions").show();
    });

    $(document).click(function(e) {
        if ($(e.target).closest('.ts-title').length === 0) {
            $(".ts-title").removeClass('ts-selected');
        };
    });

    $('.ts-title').attr('contenteditable', 'true');

    $('.ts-entry').mouseover(function() { // .ts-entry
        $(".ts-handle").hide();
        $(".ts-title").removeClass('ts-highlight'); //from previous
        $(this).find(".ts-title").addClass('ts-highlight');
        $(this).find(".ts-handle").css("display", "block");
        $(this).find(".ts-actions").show();
    });

    $('.ts-entry').mouseleave(function() { // .ts-entry
        $(this).find(".ts-actions").hide();
    });

    $('.ts-root').mouseleave(function() { // .ts-entry
        //     $(this).find(".ts-title").removeClass('ts-highlight');
        $(".ts-title").removeClass('ts-highlight');
        $(this).find(".ts-handle").hide();
    });



    $('#trellis li').prepend('<div class="dropzone"></div>');

    $('#trellis .ts-entry, #trellis .dropzone').droppable({
        accept: '#trellis li',
        tolerance: 'pointer',
        drop: function(e, ui) {
            var li = $(this).parent();
            var child = !$(this).hasClass('dropzone');
            if (child && li.children('ul').length == 0) {
                li.append('<ul/>');
            }
            if (child) {
                li.addClass('ts-open').removeClass('ts-closed').children('ul').append(ui.draggable);
            } else {
                li.before(ui.draggable);
            }
            $('#trellis li.ts-open').not(':has(li:not(.ui-draggable-dragging))').removeClass('ts-open');
            li.find('.ts-entry,.dropzone').css({
                backgroundColor: '',
                borderColor: ''
            });
            trellisHistory.commit();
        },
        over: function() {
            $(this).filter('ts-entry').css({
                backgroundColor: '#ccc'
            });
            $(this).filter('.dropzone').css({
                borderColor: '#aaa'
            });
        },
        out: function() {
            $(this).filter('.ts-entry').css({
                backgroundColor: ''
            });
            $(this).filter('.dropzone').css({
                borderColor: ''
            });
        }
    });
    $('#trellis li').draggable({
        handle: '.ts-handle', // ' > dl' // dd
        opacity: .8,
        addClasses: false,
        helper: 'clone',
        zIndex: 100,
        start: function(e, ui) {
            trellisHistory.saveState(this);
        }
    });
    $('.trellis-undo').click(trellisHistory.restoreState);
    $(document).bind('keypress', function(e) {
        if (e.ctrlKey && (e.which == 122 || e.which == 26))
            trellisHistory.restoreState();
    });
    
    
    $('#saveButton').button().click(function() {
        var turtle = '';
        
        ts_toTurtle("http://hyperdata.org/", function(turtle) {
            // targetURL, graphURI, turtle
            Trellis.save("http://localhost:8888/outlines/test1", "http://hyperdata.org/outlines/test1", turtle);
            console.log("TURTLE : " + turtle);
            ts_renderHTML(turtle, $("#output"));
            
        });
    });
    
    $("#shortcutsButton")
    .button()
    .click(function(event) {
        $("#shortcuts-text").toggle();
        event.preventDefault();
    });
}

/*
 * generate node id
 * uses date.format.js (to minimise browser support issues)
 * datetime+milliseconds+4-digit random
 *
 * e.g. nid-2013-11-06-17-46-54-269-7829
 *
 * differs from ISO date because jQuery can get confused by colons
 * see http://blog.stevenlevithan.com/archives/date-time-format
 */
var generateID = function() {
    // isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"

    var r = '' + Math.floor((Math.random() * 10000));
    var pad = "0000";
    var rnd = (pad + r).slice(-pad.length);
    var now = new Date();
    return "nid-" + dateFormat(now, "UTC:yyyy-mm-dd-HH-MM-ss-l") + "-" + rnd;
};

var generateDate = function() {
    // isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
    var now = new Date();
    return  now.format("isoUtcDateTime");
};

var trellisHistory = {
    stack: new Array(),
    temp: null,
    //takes an element and saves it's position in the trellis.
    //note: doesn't commit the save until commit() is called!
    //this is because we might decide to cancel the move
    saveState: function(item) {
        trellisHistory.temp = {
            item: $(item),
            itemParent: $(item).parent(),
            itemAfter: $(item).prev()
        };
    },
    commit: function() {
        if (trellisHistory.temp != null) trellisHistory.stack.push(trellisHistory.temp);
    },
    //restores the state of the last moved item.
    restoreState: function() {
        var h = trellisHistory.stack.pop();
        if (h == null) return;
        if (h.itemAfter.length > 0) {
            h.itemAfter.after(h.item);
        } else {
            h.itemParent.prepend(h.item);
        }
        //checks the classes on the lists
        $('#trellis li.ts-open').not(':has(li)').removeClass('ts-open');
        $('#trellis li:has(ul li):not(.ts-closed)').addClass('ts-open');
    }
}

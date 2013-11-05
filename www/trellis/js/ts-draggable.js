//init functions
$(function() {
    $('.ts-title').attr('contenteditable', 'true');
    
        $('.ts-entry').mouseover(function(){ // .ts-entry
         $(this).find(".ts-title").addClass('ts-highlight');
         $(this).find(".ts-card").show(); //////////////////////// better to add HTML element??
         $(this).find(".ts-addChild").show();
         $(this).find(".ts-workFlow").show();
         $(this).find(".ts-delete").show();
         });
      
        $('.ts-entry').mouseout(function(){
          $(this).find(".ts-title").removeClass('ts-highlight');
          $(this).find(".ts-card").hide();
          $(this).find(".ts-addChild").hide();
          $(this).find(".ts-workFlow").hide();
          $(this).find(".ts-delete").hide();
        });
    
    $('#trellis li').prepend('<div class="dropzone"></div>');

    $('#trellis dl, #trellis .dropzone').droppable({
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
            }
            else {
                li.before(ui.draggable);
            }
			$('#trellis li.ts-open').not(':has(li:not(.ui-draggable-dragging))').removeClass('ts-open');
            li.find('dl,.dropzone').css({ backgroundColor: '', borderColor: '' });
            trellisHistory.commit();
        },
        over: function() {
            $(this).filter('dl').css({ backgroundColor: '#ccc' });
            $(this).filter('.dropzone').css({ borderColor: '#aaa' });
        },
        out: function() {
            $(this).filter('dl').css({ backgroundColor: '' });
            $(this).filter('.dropzone').css({ borderColor: '' });
        }
    });
    $('#trellis li').draggable({
        handle: ' > dl',
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
	$('.ts-expander').on('click', function() {
		$(this).parent().parent().toggleClass('ts-open').toggleClass('ts-closed');
		return false;
	});
});

var trellisHistory = {
    stack: new Array(),
    temp: null,
    //takes an element and saves it's position in the trellis.
    //note: doesn't commit the save until commit() is called!
    //this is because we might decide to cancel the move
    saveState: function(item) {
        trellisHistory.temp = { item: $(item), itemParent: $(item).parent(), itemAfter: $(item).prev() };
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
        }
        else {
            h.itemParent.prepend(h.item);
        }
        //checks the classes on the lists
        $('#trellis li.ts-open').not(':has(li)').removeClass('ts-open');
        $('#trellis li:has(ul li):not(.ts-closed)').addClass('ts-open');
    }
}


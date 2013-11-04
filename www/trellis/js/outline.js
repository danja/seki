

$(document).ready(function(){
console.log("READY");
// MOVE THIS

$('.ts-entry').mouseover(function(){
          $(this).addClass('ts-highlight');
        });
        
        $('.ts-entry').mouseout(function(){
          $(this).removeClass('ts-highlight');
        });
        
$('.ts-card').click(function() {
console.log("ts-card clicked");
		$(function() {
    $( "#card" ).dialog({
      height: 140,
      modal: true
    });
  });
  /*
    $( "#card" ).dialog({
      height: 140,
      modal: true
    });
    */
  });
  
		// });
///////////////////////////////////////////
		$('ol.sortable').nestedSortable({
			forcePlaceholderSize: true,
			handle: 'div',
			helper:	'clone',
			items: 'li',
			opacity: 0, // .6
			placeholder: 'placeholder',
			revert: 250,
			tabSize: 25,
			tolerance: 'pointer',
			toleranceElement: '> div',
			maxLevels: 0,
			isTree: true,
			expandOnHover: 700,
			startCollapsed: true
		});

		$('.disclose').on('click', function() {
			$(this).closest('li').toggleClass('mjs-nestedSortable-collapsed').toggleClass('mjs-nestedSortable-expanded');
		})

		$('#serialize').click(function(){
			serialized = $('ol.sortable').nestedSortable('serialize');
			$('#serializeOutput').text(serialized+'\n\n');
		})

		$('#toHierarchy').click(function(e){
			hiered = $('ol.sortable').nestedSortable('toHierarchy', {startDepthCount: 0});
			hiered = dump(hiered);
			(typeof($('#toHierarchyOutput')[0].textContent) != 'undefined') ?
			$('#toHierarchyOutput')[0].textContent = hiered : $('#toHierarchyOutput')[0].innerText = hiered;
		})

		$('#toArray').click(function(e){
			arraied = $('ol.sortable').nestedSortable('toArray', {startDepthCount: 0});
			arraied = dump(arraied);
			(typeof($('#toArrayOutput')[0].textContent) != 'undefined') ?
			$('#toArrayOutput')[0].textContent = arraied : $('#toArrayOutput')[0].innerText = arraied;
		})

	});

	function dump(arr,level) {
		var dumped_text = "";
		if(!level) level = 0;

		//The padding given at the beginning of the line.
		var level_padding = "";
		for(var j=0;j<level+1;j++) level_padding += "    ";

		if(typeof(arr) == 'object') { //Array/Hashes/Objects
			for(var item in arr) {
				var value = arr[item];

				if(typeof(value) == 'object') { //If it is an array,
					dumped_text += level_padding + "'" + item + "' ...\n";
					dumped_text += dump(value,level+1);
				} else {
					dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
				}
			}
		} else { //Strings/Chars/Numbers etc.
			dumped_text = "===>"+arr+"<===("+typeof(arr)+")";
		}
		return dumped_text;
	}
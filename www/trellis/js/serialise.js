function toArray(options) {
    console.log("called toArray");
    var o = $.extend({}, this.options, options),
        sDepth = o.startDepthCount || 0,
        ret = [],
        left = 2;

    ret.push({
        "item_id": o.rootID,
        "parent_id": 'none',
        "depth": sDepth,
        "left": '1',
        "right": ($(o.items, this.element).length + 1) * 2
    });

// console.log("ret = "+JSON.stringify(ret));

    $(this.element).children(o.items).each(function() {
        left = _recursiveArray(this, sDepth + 1, left);
        console.log("left = "+JSON.stringify(left));
    });

    ret = ret.sort(function(a, b) {
        return (a.left - b.left);
    });

    return ret;

    function _recursiveArray(item, depth, left) {
console.log("called _recursiveArray");
        var right = left + 1,
            id,
            pid;

        if ($(item).children(o.listType).children(o.items).length > 0) {
            depth++;
            $(item).children(o.listType).children(o.items).each(function() {
                right = _recursiveArray($(this), depth, right);
            });
            depth--;
        }

        id = ($(item).attr(o.attribute || 'id')).match(o.expression || (/(.+)[-=_](.+)/));

        if (depth === sDepth + 1) {
            pid = o.rootID;
        } else {
            var parentItem = ($(item).parent(o.listType)
                .parent(o.items)
                .attr(o.attribute || 'id'))
                .match(o.expression || (/(.+)[-=_](.+)/));
            pid = parentItem[2];
        }

      //  if (id) {
            ret.push({
                "item_id": id[2],
                "parent_id": pid,
                "depth": depth,
                "left": left,
                "right": right
            });
     //   }

        left = right + 1;
        return left;
    }

};

function dump(arr, level) {
    console.log("called dump with"+arr);
    var dumped_text = "";
    if (!level) level = 0;

    //The padding given at the beginning of the line.
    var level_padding = "";
    for (var j = 0; j < level + 1; j++) level_padding += "    ";

    if (typeof(arr) == 'object') { //Array/Hashes/Objects
        for (var item in arr) {
            var value = arr[item];

            if (typeof(value) == 'object') { //If it is an array,
                dumped_text += level_padding + "'" + item + "' ...\n";
                dumped_text += dump(value, level + 1);
            } else {
                dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
            }
        }
    } else { //Strings/Chars/Numbers etc.
        dumped_text = "===>" + arr + "<===(" + typeof(arr) + ")";
    }
    return dumped_text;
};

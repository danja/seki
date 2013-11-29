(function() {
    var models = window.etch.models,
        views = window.etch.views,
        collections = window.etch.collections;

    // default search term for image search
    etch.defaultImageSearch = 'dogs';

    // boolean for enabling/disabling resizing the preview image
    etch.previewResizable = true;

    // aspect ratio preset button definitions
    etch.aspectPresets = {
        'landscape': {aspectRatio: 4/3, previewSize: {x: 176, y: 132}},
        'portrait': {aspectRatio: 3/4, previewSize: {x: 130, y: 174}},
        'square': {aspectRatio: 1, previewSize: {x: 132, y: 132}},
        'banner': {aspectRatio: 4/1, previewSize: {x: 559, y: 140}}
    };

    var imageUploaderTemplate = '\
        <a class="etch-section-delete" href="#"></a>\
        <div class="etch-head">\
            <ul class="etch-link-list etch-tabs">\
                <li class="etch-current"><a href="#" data-pane="etch-file-upload">Upload</a></li>\
                <li><a href="#" data-pane="etch-web-search-upload">Web Search</a></li>\
                <li><a href="#" data-pane="etch-url-upload">Url</a></li>\
            </ul>\
        </div>\
        <div class="etch-body">\
            <div class="etch-inner-pane etch-file-upload">\
                <form action="/api/image/upload/" method="POST" enctype="multipart/form-data">\
                    <input name="image-file" type="file" />\
                </form>\
            </div>\
            <div class="etch-inner-pane etch-web-search-upload">\
                <input type="text" class="etch-web-search-terms" placeholder="Search Terms" name="search_terms" value="{{ terms }}" />\
                <a href="#" class="etch-web-search-submit etch-button" value="Search">Search</a>\
                <div class="etch-arrows">\
                    <a class="etch-arrow etch-prev etch-left-arrow" href="#"></a>\
                    <a class="etch-arrow etch-next etch-right-arrow" href="#"></a>\
                </div>\
                <div class="etch-gallery">\
                </div>\
            </div>\
            <div class="etch-inner-pane etch-url-upload">\
                <input type="text" placeholder="Image Url" class="etch-image-url" name="image_url" />\
                <a href="#" class="etch-button etch-url-upload-submit">Submit</a>\
            </div>\
        </div>\
    ';
 
    var imageCropTemplate = '\
        <a class="etch-section-delete" href="#"></a>\
        <div class="etch-crop-section">\
            <div class="etch-natural-dimensions">Original Size: <span></span></div>\
            <div class="etch-raw-image-wrapper etch-inner-pane">\
                <img class="etch-raw-image" src="{{ url }}" />\
            </div>\
        </div>\
        <div class="etch-preview-section">\
            <ul class="etch-link-list etch-tabs etch-aspect-links">\
                {% _.each(etch.aspectPresets, function(value, key) { %}\
                    <li><a href="#" class="etch-aspect-preset" data-aspect="{{ key }}">{{ key }}</a></li>\
                {% }); %}\
                <!--\
                <li><a href="#" class="etch-aspect-square">Square</a></li>\
                <li><a href="#" class="etch-aspect-portrait">Portrait</a></li>\
                <li><a href="#" class="etch-aspect-landscape">Landscape</a></li>\
                -->\
                <li><a href="#" class="etch-button etch-apply-crop">Crop</a></li>\
            </ul>\
            <div class="etch-crop-preview-wrapper">\
                <div class="etch-crop-size-wrapper">\
                    <div class="etch-crop-dimensions"></div>\
                    <img class="etch-crop-preview" src="{{ url }}"/>\
                </div>\
                <p>\
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus. Sed sit amet ipsum mauris. \
                    Maecenas congue ligula ac quam viverra nec consectetur ante hendrerit. Donec et mollis dolor. \
                    Praesent et diam eget libero egestas mattis sit amet vitae augue. Nam tincidunt congue enim, ut porta lorem lacinia consectetur. \
                    Donec ut libero sed arcu vehicula ultricies a non tortor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. \
                    Aenean ut gravida lorem. Ut turpis felis, pulvinar a semper sed, adipiscing id dolor. Pellentesque auctor nisi id magna consequat\
                    sagittis. Curabitur dapibus enim sit amet elit pharetra tincidunt feugiat nisl imperdiet. Ut convallis libero in urna ultrices \
                    accumsan. Donec sed odio eros. Donec viverra mi quis quam pulvinar at malesuada arcu rhoncus. Cum sociis natoque penatibus et \
                    magnis dis parturient montes, nascetur ridiculus mus. In rutrum accumsan ultricies. Mauris vitae nisi at sem facilisis semper \
                    ac in est.\
                </p>\
                <p>\
                    Curabitur dapibus enim sit amet elit pharetra tincidunt feugiat nisl imperdiet. Ut convallis libero in urna ultrices \
                    accumsan. Donec sed odio eros. Donec viverra mi quis quam pulvinar at malesuada arcu rhoncus. Cum sociis natoque penatibus et \
                    magnis dis parturient montes, nascetur ridiculus mus. In rutrum accumsan ultricies. Mauris vitae nisi at sem facilisis semper \
                    ac in est.  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus. Sed sit amet ipsum mauris. \
                    Maecenas congue ligula ac quam viverra nec consectetur ante hendrerit. Donec et mollis dolor. \
                    Praesent et diam eget libero egestas mattis sit amet vitae augue. Nam tincidunt congue enim, ut porta lorem lacinia consectetur. \
                    Donec ut libero sed arcu vehicula ultricies a non tortor.\
                </p>\
            </div>\
        </div>\
    ';

    var imageToolsTemplate = '\
        <div class="etch-image-tools">\
            <div class="etch-buttons">\
                <a class="etch-editor-button etch-left" title="Left" href="#"><span></span></a>\
                <a class="etch-editor-button etch-center" title="Center" href="#"><span></span></a>\
                <a class="etch-editor-button etch-right" title="Right" href="#"><span></span></a>\
                <a class="etch-editor-button etch-delete" title="Delete" href="#"><span></span></a>\
            </div>\
        </div>\
    ';

    var imagePaneTemplate = '\
        <div class="etch-gallery-pane">\
            {% _.each(images, function(image) { %}\
                <div class="etch-media etch-selectable-element" {% if (image.id) { %}data-element-id="{{ image.id }}"{% } %} data-provider="{{ image.provider }}">\
                    <div class="etch-media-wrap">\
                        <a href="{{ image.direct_url }}" title="{{ image.alt_text }}">\
                            <div class="etch-image-wrap">\
                             <img src="{{ image.thumb_url }}" alt="{{ image.alt_text }}" />\
                            </div>\
                        </a>\
                    </div>\
                    <div class="media-content">\
                        <div class="etch-body">\
                            {{ image.title.slice(0,35) }}\
                        </div>\
                        <div class="etch-foot">\
                            {{ image.width }} x {{ image.height }}\
                        </div>\
                    </div>\
                </div>\
            {% }); %}\
        </div>\
    ';
        
    models.ImageUploader = Backbone.Model.extend({
        defaults: {
            index: 0,
            terms: etch.defaultImageSearch
        }
    });
    
    views.ImageUploader = Backbone.View.extend({
        initialize: function(options) {
            _.bindAll(this, 'startCropper', 'uploadCallback', 'imageSearch');
            this.model.bind('change:index', this.imageSearch);
            this.model.bind('change:terms', this.imageSearch);
        },
        
        className: 'etch-section etch-image-uploader',
        
        template: _.template(imageUploaderTemplate),
        
        events: {
            'click .etch-tabs a': 'switchTab',
            'click .etch-url-upload-submit': 'urlSubmit',
            'click .etch-section-delete': 'closeWindow',
            'click .etch-web-search-submit': 'webSearch',
            'click .etch-arrow': 'navigateImages',
            'click .etch-gallery img': 'gallerySubmit',
            'keypress .etch-web-search-terms': 'termsKeypress',
            'change .etch-file-upload [name="image-file"]': 'uploadSubmit'
        },

        closeWindow: function(e) {
            // close image uploader
            e.preventDefault();
            this.remove(); 
        },

        applyUploadForm: function() {
            // use jquery.form.ajaxForm to handle async file upload
            this.$('.etch-file-upload form').ajaxForm({
                iframe: true,
                success: this.uploadCallback
            });
        },
        
        uploadSubmit: function(e) {
            // submit file upload form
            e.preventDefault();
            this.$('.etch-file-upload form').submit();
        },
        
        imageSearch: function(options) {
            // search flickr for search terms
            var view = this;
            var template = _.template(imagePaneTemplate);
            var settings = {
                provider: 'flickr',
                search_terms: this.model.get('terms'),
                result_index: this.model.get('index'),
                layout_position: 'main_column',
                row_count: 2,
                cc_filter: 1,
                success: function(data) {
                    view.$('.etch-gallery').html(template(data));
                },
                error: function(data) {
                    $('body').etchNotify({type: 'error', message: data.responseText, timeOut: 5000});
                }
            }
            
            $.extend(settings, options);
            
            var data = [
                {name: 'provider', value: settings.provider},
                {name: 'search_terms', value: settings.search_terms},
                {name: 'result_index', value: settings.result_index},
                {name: 'layout_position', value: settings.layout_position},
                {name: 'row_count', value: settings.row_count},
                {name: 'cc_filter', value: settings.cc_filter},
                {name: 'format', value: 'json'}
            ];
            
            $.ajax({
                type: 'GET',
                url: '/api/mpages/elements/image/search/',
                data: data,
                success: settings.success,
                error: settings.error
            });            
        },
        
        navigateImages: function(e) {
            // switch image search panes
            e.preventDefault();
            var difference = $(e.target).hasClass('etch-prev') ? -1 : 1;
            this.model.set({'index': this.model.get('index') + difference});
        },
        
        termsKeypress: function(e) {
            // set search terms on model if ENTER is pressed on search term input
            if (e.keyCode == $.ui.keyCode.ENTER) {
                this.webSearch(e);
            }
        },
        
        webSearch: function(e) {
            // set search terms on model
            e.preventDefault();
            this.model.set({'terms': this.$('.etch-web-search-terms').val(), 'index': 0});
        },

        urlSubmit: function(e) {
            // submit url upload form
            e.preventDefault();
            var url = this.$('.etch-url-upload .etch-image-url').val()
            this.uploadImage(url);
        },
        
        gallerySubmit: function(e) {
            // submit choice from image gallery
            e.preventDefault();
            var url = $(e.target).closest('a').attr('href');
            this.uploadImage(url)
        },
                
        uploadImage: function(url, cb) {
            // upload image...  
            var callback = cb || this.uploadCallback;
            $.ajax({
                type: 'POST',
                url: '/api/image/upload/', 
                data: [{name: 'url', value: url}], 
                success: callback
            });            
        },
        
        uploadCallback: function(res) {
            // parse upload response and feed image to imageCallback
            var image = JSON.parse(res).images.image;
            this.model._imageCallback(image);
        },
        
        startCropper: function(image, cb) {
            // this is called as a success callback from the upload form

            var self = this;
            var image;
            
            // create attrs for new image cropper model
            var attrs = _.extend({}, image, {
                id: image.filename
            });

            // create and render ImageCropper 
            var model = new models.ImageCropper(attrs);
            var view = new views.ImageCropper({model: model});
            $(this.el).remove();
            $('body').append(view.render().el);
    

            // get aspects ratios
            var aspects = []
            _.each(etch.aspectPresets, function(value, key) {
               aspects.push(etch.aspectPresets[key]);
            });

            // set first aspect preset as default
            var defaultAspect = aspects[0]

            // wait for the image to load and then
            // initialize Jcrop.  otherwise the image will have size 0 0.
            view.$('.etch-raw-image').load(function() {
                var cropApi = $.Jcrop('.etch-image-cropper .etch-raw-image', {
                    boxHeight: 400,
                    boxWidth: 400,
                    onChange: view.updateCoords,
                    onSelect: view.updateCoords
                });

                // set initial selection
                cropApi.setSelect([0, 0, defaultAspect.previewSize.x, defaultAspect.previewSize.y]);

                // set initial aspect ratio
                cropApi.setOptions({aspectRatio: defaultAspect.aspectRatio});

                // set default preview size
                view.model.set({'previewSize': defaultAspect.previewSize});

                // stash reference to jcrop api for later use
                view.model.set({cropApi: cropApi});

                // TODO: hacky.  triggering a click to make the image preview reset itself to the first preset
                // fix this later when I have time to refactor this code
                $('.etch-aspect-links li a').first().click();

                view.model._imageCallback = cb;
            });
        },
        
        switchTab: function(e) {
            // navigate between image uploading options
            e.preventDefault();
            $anchor = $(e.target);
            $tab = $anchor.parent('li');
            $tabs = $tab.add($tab.siblings());
            $tabs.removeClass('etch-current');
            $tab.addClass('etch-current');
            var paneClass = $anchor.attr('data-pane');
            this.$('.etch-body .etch-inner-pane').hide();
            this.$('.'+ paneClass).show();
            if (paneClass === 'etch-web-search-upload' && !this.$('.etch-gallery').children().size()) {
                this.imageSearch();
            }
        },
        
        render: function() {
            // render uploader
            $(this.el).html(this.template(this.model.toJSON()));
            this.applyUploadForm();
            return this;
        }
        
    });

    models.ImageCropper = Backbone.Model.extend({
        url: function() {
            return '/api/image/'+ this.get('relative_path') +'/'+ this.get('filename') +'/';
        }
    });
    
    views.ImageCropper = Backbone.View.extend({
        initialize: function(options) {
            _.bindAll(this, 'showPreview', 'changePreviewSize', 'updateCoords');
            this.model.bind('change:previewSize', this.changePreviewSize);
        },
        
        className: 'etch-section etch-image-cropper',
        
        template: _.template(imageCropTemplate),

        events: {
            'click .etch-aspect-preset': 'setAspect',
            'click .etch-apply-crop': 'applyCrop',
            'click a.etch-section-delete': 'closeWindow'
        },

        closeWindow: function(e) {
            // close cropper
            e.preventDefault();
            this.remove();
        },

        setAspect: function(e) {
            // set new aspect ratio
            e && e.preventDefault();
            var preset = etch.aspectPresets[$(e.target).attr('data-aspect')];
            
            var cropApi = this.model.get('cropApi');
            cropApi.setOptions({
                aspectRatio: preset.aspectRatio
            });

            this.$('.etch-crop-size-wrapper').resizable('option', 'aspectRatio', preset.aspectRatio);
            
            this.model.set({'previewSize': preset.previewSize});
            this.showPreview(this.model.get('coords'));
        },

        previewResize: function(newSize) {
            // resize preview image
        	var $img = this.$('.etch-crop-preview');

            // establish ratios
            var previewSize = this.model.get('previewSize');
            var marginRatio = newSize.width / previewSize.x;
            var mLeft = parseInt($img.css('margin-left'));
            var mTop = parseInt($img.css('margin-top'));
            var ratio = this.model.get('cropSizeRatio');

            // change size on element
            $img.css({height: newSize.height * ratio.y, width: newSize.width * ratio.x, 'margin-left': mLeft * marginRatio, 'margin-top': mTop * marginRatio});

            // set size on model
            this.model.set({'previewSize': {x: newSize.width, y: newSize.height}});
        },
        
        applyCrop: function(e) {
            // send crop info to server and crop image
            e.preventDefault();
            var view = this;
            var coords = this.model.get('coords');
            var previewSize = this.model.get('previewSize');
            var size = [Math.floor(previewSize.x), Math.floor(previewSize.y)];

            var attrs = {
                image_requests: [{crop: [coords.x, coords.y, coords.x2, coords.y2], size: size}]
            };
            
            var options = {
                success: function(model, res) {
                    view.destroy();
                    var image = res.images.image
                    
                    // add timestamped querystrings to images to force out of browser cache
                    image.url = image.url +'?'+ new Date().valueOf();
                    image.url_local = image.url_local +'?'+ new Date().valueOf();

                    // call imageCallback
                    view.model._imageCallback(image);
                }
            };
            
            this.model.save(attrs, options);
        },
        
        updateCoords: function(coords) {
            var $cropPreviewImg = this.$('.etch-crop-preview[src]');
            var $cropSizeWrapper = this.$('.etch-crop-size-wrapper');

            // get ratio between crop preview bounding box and the crop preview image
            var yRatio = $cropPreviewImg.height() / $cropSizeWrapper.height();
            var xRatio = $cropPreviewImg.width() / $cropSizeWrapper.width();

            this.model.set({coords: coords});
            this.model.set({'cropSizeRatio': {x: xRatio, y: yRatio}});
            this.model.set({'previewSize': {x: $cropSizeWrapper.width(), y: $cropSizeWrapper.height()}});
            
            this.showPreview(coords);
        },
        
        showPreview: function(coords) {
            var previewSize = this.model.get('previewSize');
            var xRatio = previewSize.x / coords.w;
            var yRatio = previewSize.y / coords.h;
            var imgWidth = this.model.get('rawImgSize').x;
            var imgHeight = this.model.get('rawImgSize').y;
            
            this.$('.etch-crop-preview').css({
                width: Math.round(xRatio * imgWidth),
                height: Math.round(yRatio * imgHeight),
                marginLeft: '-' + Math.round(xRatio * coords.x)+ 'px',
                marginTop: '-' + Math.round(yRatio * coords.y)+ 'px'
            });
        },

        updateDimensions: function(size) {
            this.$('.etch-crop-dimensions').text(parseInt(size.width) +'x'+ parseInt(size.height));
        },
        
        changePreviewSize: function() {
            var previewSize = this.model.get('previewSize');
            this.$('.etch-crop-size-wrapper').css({height: previewSize.y, width: previewSize.x});
            this.updateDimensions({width: previewSize.x, height: previewSize.y});
        },
        
        render: function() {
            var view = this;
            $(this.el).html(this.template(this.model.toJSON()));
            var $rawImg = this.$('.etch-raw-image');
            $rawImg.load(function() {
                var $previewWrapper = view.$('.etch-crop-size-wrapper');

                // controls whether the preview image can be resized
                if (etch.previewResizable) {
                    $previewWrapper.resizable({
                        aspectRatio: 1,
                        maxWidth: 559,
                        stop: function(e, ui) {
                            view.previewResize(ui.size);
                        },
                        resize: function(e, ui) {
                            view.updateDimensions(ui.size)
                        }
                    });
                }
                
                view.model.set({
                    rawImgSize: {x:$rawImg.outerWidth(), y:$rawImg.outerHeight()},
                    previewSize: {y: $previewWrapper.height(), x: $previewWrapper.width()}
                });


                // display the images size
                var height = $rawImg[0].naturalHeight
                var width = $rawImg[0].naturalWidth
                view.$('.etch-natural-dimensions span').text(width +'x'+ height);
            });
            
            return this;
        },
        
        destroy: function() {
            $(this.el).remove();
        }
    });

    models.EditableImage = Backbone.Model;
        
    views.EditableImage = Backbone.View.extend({
        
        template: _.template('<img src="{{ url }}" />'),
        
        toolsTemplate: _.template(imageToolsTemplate),
        
        events: {
            'mouseenter': 'showTools'
        },
        
        //  I wasn't sure if I wanted to break these tools off into its own model
        //  if it gets any more complicated then it probably should be seperated
        showTools: function(e) {
            var view = this;
            $el = $(this.el);
            this.$tools = $(this.renderTools().tools);
            $('body').append(this.$tools);
            this.$tools.css({
                top: $el.offset().top,
                left: $el.offset().left,
                height: $el.outerHeight() + 3,
                width: $el.outerWidth() + 3
            });
            
            this.$tools.bind('mouseleave', function() {
                view.removeTools();
            });
            
            this.$tools.find('.etch-right').click(function(e) {
                e.preventDefault();
                var $el = $(view.el);
                $el.removeClass();
                $el.addClass('etch-float-right');
                var editableModel = view.model.get('editableModel');
                view.removeTools();
            });
            
            this.$tools.find('.etch-center').click(function(e) {
                e.preventDefault();
                var $el = $(view.el);
                $el.removeClass();
                $el.addClass('etch-centered');
                view.removeTools();
            });
            
            this.$tools.find('.etch-left').click(function(e) {
                e.preventDefault();
                var $el = $(view.el);
                $el.removeClass();
                $el.addClass('etch-float-left');
                view.removeTools();
            });
            
            this.$tools.find('.etch-delete').click(function(e) {
                e.preventDefault();
                $(view.el).remove();
                view.removeTools();
            });
            
            this.$tools.show('fade', 'fast')
        },
        
        removeTools: function(duration) {
            var view = this;
            $('.etch-image-tools').hide('fade', 'fast', function() {
                $(this).remove();
            });
        },
        
        render: function() {
            this.el = $(this.template(this.model.toJSON()))[0];
            return this;
        },
        
        renderTools: function() {
            this.tools = this.toolsTemplate();
            return this
        }
    });

    $.fn.etchNotify = function(options){
        var settings = {
            type: 'alert',   // type should equal 'error', 'alert', 'loading', or 'success'
            message: '',
            timeOut: null,   // time to display, in ms
            effect: 'blind' // effect for jQuery show() method
        }

        $.extend(settings, options);

        return this.each(function(){
            var $notify = $(this).find('.etch-notify').first();

            clearTimeout($notify.data('notifyTimeoutId'));
            $notify.stop(true, true);
            $notify.removeClass('error loading alert success');
            $notify.html(settings.message).addClass(settings.type);

            //for some reason, using :hidden or :visible doesn't work here.
            //we have to directly look at the css display property
            if ($notify.is(':hidden')) {
                $notify.show(settings.effect);
            }

            if (settings.timeOut) {
                $notify.data('notifyTimeoutId', setTimeout(function() { $notify.hide(settings.effect); }, settings.timeOut));
            }
        });
    }


})();

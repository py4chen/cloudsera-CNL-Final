// $(function(){
//    
//
// });


// Sketch


var __slice = Array.prototype.slice;
(function($) {

    // Compatibility shim
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    // PeerJS object
    var peer = new Peer({ key: 'lwjd5qra8257b9', debug: 3});

    peer.on('open', function(){
        $('#my-id').text(peer.id);
    });

    // Receiving a call
    peer.on('call', function(call){
        // Answer the call automatically (instead of prompting user) for demo purposes
        call.answer(window.localStream);
        step3(call);
    });
    peer.on('error', function(err){
        alert(err.message);
        // Return to step 2 if error occurs
        step2();
    });

    // peer.on('connection',function(dataConnection){
    //
    //     console.log("a connection canvas data come in from "+dataConnection.peer);
    //     dataConnection.on('data', function (image){
    //         console.log("sb call me");
    //         // console.log("Receive data:"+data_str);
    //         // var data = JSON.parse(data_str);
    //         // $('#whiteboard').sketch('action', []);
    //         // var ctx = $("#whiteboard").get(0).getContext('2d');
    //         // ctx.fillStyle="#FFFFFF";
    //         // ctx.fillRect(0, 0, 800, 500);
    //         // $('#whiteboard').clear();.get(0).loadFromJSON(data);
    //         // ctx.putImageData(data, 0, 0);
    //         var myimage = new Image();
    //         myimage.src = image;
    //         var ctx = $('#whiteboard').get(0).getContext("2d");
    //         ctx.drawImage(myimage, 0, 0);
    //         ctx.stroke();
    //         ctx.redraw();
    //         // $('#whiteboard').get(0).lock()
    //     });
    // });

    // Click handlers setup
    $(function(){
        $('#make-call').click(function(){
            // Initiate a call!
            var call = peer.call($('#callto-id').val(), window.localStream);

            step3(call);
        });

        $('#end-call').click(function(){
            window.existingCall.close();
            step2();
        });

        // Retry if getUserMedia fails
        $('#step1-retry').click(function(){
            $('#step1-error').hide();
            step1();
        });

        // Get things started
        step1();
    });

    function step1 () {
        // Get audio/video stream
        navigator.getUserMedia({audio: true, video: true}, function(stream){
            // Set your video displays
            $('#my-video').prop('src', URL.createObjectURL(stream));

            window.localStream = stream;
            step2();
        }, function(){ $('#step1-error').show(); });
    }

    function step2 () {
        $('#step1, #step3').hide();
        $('#step2').show();
    }

    function step3 (call) {
        // Hang up on an existing call if present
        if (window.existingCall) {
            window.existingCall.close();
        }

        // Wait for stream on the call, then set peer video display
        call.on('stream', function(stream){
            $('#their-video').prop('src', URL.createObjectURL(stream));



        });

        // UI stuff
        window.existingCall = call;
        $('#their-id').text(call.peer);
        call.on('close', step2);
        $('#step1, #step2').hide();
        $('#step3').show();
    }


    $('#send_button').click(function send(){
            // Send messages
            var dest_id = $('#callto-id').val();
            // console.log("dest_id is:", dest_id, dest_id.type);

            var conn = peer.connect(dest_id);

            conn.on("open", function () {
                // send canvas data
                // var c = $('#whiteboard');
                // c_data = JSON.stringify(c);
                // var ctx = $('#whiteboard').get(0).getContext("2d");
                // var data = ctx.getImageData(0, 0, $('#whiteboard').get(0).width, $('#whiteboard').get(0).height);
                // console.log("convas data:"+ JSON.stringify(data));

                var image = $('#whiteboard').get(0).toDataURL("image/png");

                conn.send(image);
                console.log("call sb");
                // console.log(data);

                // console.log(JSON.parse(JSON.stringify(data)));
                // ctx.putImageData(JSON.parse(JSON.stringify([data]))[0], 0, 0);
                // conn.send("hello world");
            })
        }
    )
    

    
    


    var Sketch;
    $.fn.sketch = function() {
        var args, key, sketch;
        key = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        if (this.length > 1) {
            $.error('Sketch.js can only be called on one element at a time.');
        }
        sketch = this.data('sketch');
        if (typeof key === 'string' && sketch) {
            if (sketch[key]) {
                if (typeof sketch[key] === 'function') {
                    return sketch[key].apply(sketch, args);
                } else if (args.length === 0) {
                    return sketch[key];
                } else if (args.length === 1) {
                    return sketch[key] = args[0];
                }
            } else {
                return $.error('Sketch.js did not recognize the given command.');
            }
        } else if (sketch) {
            return sketch;
        } else {
            this.data('sketch', new Sketch(this.get(0), key));
            return this;
        }
    };
    Sketch = (function() {
        function Sketch(el, opts) {
            this.el = el;
            this.canvas = $(el);
            this.context = el.getContext('2d');
            this.options = $.extend({
                toolLinks: true,
                defaultTool: 'marker',
                defaultColor: '#000000',
                defaultSize: 5
            }, opts);
            this.painting = false;
            this.color = this.options.defaultColor;
            this.size = this.options.defaultSize;
            this.tool = this.options.defaultTool;
            this.actions = [];
            this.action = [];
            this.canvas.bind('click mousedown mouseup mousemove mouseleave mouseout touchstart touchmove touchend touchcancel', this.onEvent);
            if (this.options.toolLinks) {
                $('body').delegate("a[href=\"#" + (this.canvas.attr('id')) + "\"]", 'click', function(e) {
                    var $canvas, $this, key, sketch, _i, _len, _ref;
                    $this = $(this);
                    $canvas = $($this.attr('href'));
                    sketch = $canvas.data('sketch');
                    _ref = ['color', 'size', 'tool'];
                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                        key = _ref[_i];
                        if ($this.attr("data-" + key)) {
                            sketch.set(key, $(this).attr("data-" + key));
                        }
                    }
                    if ($(this).attr('data-download')) {
                        sketch.download($(this).attr('data-download'));
                    }
                    return false;
                });
            }
        }
        Sketch.prototype.download = function(format) {
            var mime;
            format || (format = "png");
            if (format === "jpg") {
                format = "jpeg";
            }
            mime = "image/" + format;
            return window.open(this.el.toDataURL(mime));
        };
        Sketch.prototype.set = function(key, value) {
            this[key] = value;
            return this.canvas.trigger("sketch.change" + key, value);
        };
        Sketch.prototype.startPainting = function() {
            this.painting = true;
            return this.action = {
                tool: this.tool,
                color: this.color,
                size: parseFloat(this.size),
                events: []
            };
        };
        Sketch.prototype.stopPainting = function() {
            if (this.action) {
                this.actions.push(this.action);
            }
            this.painting = false;
            this.action = null;
            return this.redraw('myupdate');
        };
        Sketch.prototype.onEvent = function(e) {
            if (e.originalEvent && e.originalEvent.targetTouches) {
                e.pageX = e.originalEvent.targetTouches[0].pageX;
                e.pageY = e.originalEvent.targetTouches[0].pageY;
            }
            $.sketch.tools[$(this).data('sketch').tool].onEvent.call($(this).data('sketch'), e);
            e.preventDefault();
            return false;
        };
        Sketch.prototype.redraw = function(update) {
            var sketch;
            this.el.width = this.canvas.width();
            this.context = this.el.getContext('2d');
            sketch = this;
            $.each(this.actions, function() {
                if (this.tool) {
                    return $.sketch.tools[this.tool].draw.call(sketch, this, update);
                }
            });
            if (this.painting && this.action) {
                return $.sketch.tools[this.action.tool].draw.call(sketch, this.action, update);
            }
        };
        return Sketch;
    })();
    $.sketch = {
        tools: {}
    };
    $.sketch.tools.marker = {
        onEvent: function(e) {
            switch (e.type) {
                case 'mousedown':
                case 'touchstart':
                    this.startPainting();
                    break;
                case 'mouseup':
                case 'mouseout':
                case 'mouseleave':
                case 'touchend':
                case 'touchcancel':
                    this.stopPainting();
            }
            if (this.painting) {
                this.action.events.push({
                    x: e.pageX - this.canvas.offset().left,
                    y: e.pageY - this.canvas.offset().top,
                    event: e.type
                });
                return this.redraw('myupdate');
            }
        },
        draw: function(action, update) {
            var event, previous, _i, _len, _ref;
            this.context.lineJoin = "round";
            this.context.lineCap = "round";
            this.context.beginPath();
            this.context.moveTo(action.events[0].x, action.events[0].y);
            _ref = action.events;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                event = _ref[_i];
                this.context.lineTo(event.x, event.y);
                previous = event;
            }
            this.context.strokeStyle = action.color;
            this.context.lineWidth = action.size;
            // console.log("Action:"+);
            if( update === 'myupdate'){
                // Send messages
                var dest_id = $('#callto-id').val();

                var conn = peer.connect(dest_id);

                conn.on("open", function () {
                    conn.send(JSON.stringify(action));
                    console.log("call sb");
                });
            }
            return this.context.stroke();
        }

    };


    peer.on('connection',function(dataConnection){
        console.log("a connection canvas data come in from "+dataConnection.peer);
        dataConnection.on('data', function (action_string){
            var action = JSON.parse(action_string);
            console.log("sb call me");

            // sketch same as in draw:
            var event, previous, _i, _len, _ref;
            $.sketch.tools.marker.context.lineJoin = "round";
            $.sketch.tools.marker.context.lineCap = "round";
            $.sketch.tools.marker.context.beginPath();
            $.sketch.tools.marker.context.moveTo(action.events[0].x, action.events[0].y);
            _ref = action.events;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                event = _ref[_i];
                $.sketch.tools.marker.context.lineTo(event.x, event.y);
                previous = event;
            }
            $.sketch.tools.marker.context.strokeStyle = action.color;
            $.sketch.tools.marker.context.lineWidth = action.size;
            // $('#whiteboard').get(0).lock()
        });
    });


    return $.sketch.tools.eraser = {
        onEvent: function(e) {
            return $.sketch.tools.marker.onEvent.call(this, e);
        },
        draw: function(action) {
            var oldcomposite;
            oldcomposite = this.context.globalCompositeOperation;
            this.context.globalCompositeOperation = "copy";
            action.color = "rgba(0,0,0,0)";
            $.sketch.tools.marker.draw.call(this, action);
            return this.context.globalCompositeOperation = oldcomposite;
        }
    };


})(jQuery);
$(function(){
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

	peer.on('connection',function(dataConnection){

		console.log("a connection canvas data come in from "+dataConnection.peer);
		dataConnection.on('data', function (image){
			console.log("sb call me");
			// console.log("Receive data:"+data_str);
			// var data = JSON.parse(data_str);
			// $('#whiteboard').sketch('action', []);
			// var ctx = $("#whiteboard").get(0).getContext('2d');
			// ctx.fillStyle="#FFFFFF";
			// ctx.fillRect(0, 0, 800, 500);
			// $('#whiteboard').clear();.get(0).loadFromJSON(data);
			// ctx.putImageData(data, 0, 0);
			var myimage = new Image();
			myimage.src = image
			$('#whiteboard').get(0).getContext("2d").drawImage(myimage, 0, 0);
			$('#whiteboard').sketch('actions', []);
			// $('#whiteboard').get(0).lock()
		});
	});

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

});



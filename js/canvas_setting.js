$(function() {
	$.each(['rgb(244, 42, 53)', 'rgb(255, 162, 0)', 'rgb(255, 213, 0)', 'rgb(168, 191, 18)', 'rgb(46, 181, 47)', 'rgb(0, 170, 181)', 'rgb(50, 91, 197)'], function() {
		$('.brushes').append("<a class='brush' href='#whiteboard' data-color='" + this + "' style='width: 50px; height: 50px; background: " + this + "; display: inline-block;'></a> ");
	});
	$('.brushes').append("<br>");
	$('.brushes').append("<span style='width: 50px; height: 50px; display: inline-block;'></span> ");
	$.each(['rgb(250, 208, 222)', 'rgb(148, 109, 155)', 'rgb(135, 94, 55)', 'rgb(142, 150, 155)', 'rgb(0, 0, 0)'], function() {
		$('.brushes').append("<a class='brush' href='#whiteboard' data-color='" + this + "' style='width: 50px; height: 50px; background: " + this + "; display: inline-block;'></a> ");
	});


	$('#whiteboard').sketch();

	$('.brushes>a.brush').click(function(e){
		$('.brushes>a.brush').css('box-shadow', '0px 5px 5px #888888');
		$('.special-tools>.eraser').css('box-shadow', '5px 5px 5px #888888');
		$(this).css('box-shadow', 'none');
	});

	$('.special-tools>.eraser').click(function(e){
		$('.brushes>a.brush').css('box-shadow', '0px 5px 5px #888888');
		$(this).css('box-shadow', 'none');
	});

	/*$('.special-tools>.clear').click(function(e){
		var c=document.getElementById("whiteboard");
		var ctx=c.getContext("2d");
		ctx.fillStyle="#FFFFFF";
		ctx.fillRect(0,0,800,500);
		$('#whiteboard').sketch('actions',[]);
	});*/
	$('.size').change(function(){
		$(this).attr('data-size', $(this).val());
		$('#whiteboard').sketch('size', $(this).val());
	});
});
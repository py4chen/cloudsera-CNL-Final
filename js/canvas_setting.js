$(function() {
	$.each(['#f00', '#ff0', '#0f0', '#0ff', '#00f', '#f0f', '#000', '#fff'], function() {
		$('.tools').append("<a href='#whiteboard' data-color='" + this + "' style='width: 15px; height: 15px; background: " + this + "; display: inline-block;'></a> ");
	});
	$.each([3, 5, 10, 15], function() {
		$('.tools').append("<a href='#whiteboard' data-size='" + this + "' style='background: #ccc'>" + this + "</a> ");
	});
	$('#whiteboard').sketch();
});
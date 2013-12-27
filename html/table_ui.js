define(["jquery", "table"], function($, table) {	
	$(function() {			
		var t = new table();
		console.info('table:' + t);
		for (x = 1; x <= t.seats.length; x++) {
			$("#table > .seats").append("<div id=\"seat" + x + "\">seat" + x + "<div>action</div></div>");
		}
		$("#commandbutton").click( function(event) { console.info('CMD:' + $("#command").val() ); t.command( $("#command").val() ) } );
	});	
});



 
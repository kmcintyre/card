define(["jquery", "table_blackjack_ui", "table_client"], function($, table_blackjack_ui, table_client) {
	$(function() {										
		
		function tablecast(json) {
			var ui = new table_blackjack_ui(json, "#tables", "tablecanvas");
			ui.paint(); 
			ui.re();
			ui.bgtable();
			$(window).resize( function() { ui.paint(); ui.re(); ui.bgtable(); } );
		}
		
		new table_client().set(tablecast);
		
	});	
});
define(["jquery", "table_blackjack_ui", "table_client"], function($, table_blackjack_ui, table_client) {
	$(function() {								
		
		function tablecast(json) {
			var ui = new table_blackjack_ui(json, "#tables");
			ui.paint();	
			ui.re();
		}				
		new table_client().set(tablecast);	
	});	
});
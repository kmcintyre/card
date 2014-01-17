define(["jquery", "table_ui", "table_client"], function($, table_ui, table_client) {
	$(function() {								
		
		var ui = new table_ui();
		
		function tablecast(json) {
			ui.table = json;
			ui.paint("#tables");	
			ui.re();
		}				
		new table_client().set(tablecast);
		$(window).resize( function() { ui.re(); });		
	});	
});
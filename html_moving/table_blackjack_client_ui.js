define(["jquery", "table_blackjack_ui", "table_client"], function($, table_blackjack_ui, table_client) {
	$(function() {														 		
		var ui = null;
		function tablecast(json) {
			console.log(json);
			if ( !ui ) {
				ui = new table_blackjack_ui(json, "#tables", "#tablecanvas");
				ui.measure(); 
				ui.paint();
				$("#" + json.id).data('table', 
					{ 
					"act" : function(step) { new table_client().send(step); }
					}
				);
				$(window).resize( function() {ui.measure(); ui.paint();});
			} else {				
				ui.table = json;
				ui.paint();
			}
		}
		new table_client().set(tablecast);
	});	
});
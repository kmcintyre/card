define(["jquery", "table_ui", "table_client"], function($, table_ui, table_client) {
		
	
	$(function() {								
		function tablecast(evt) {			
			console.log('tablecast:' + evt.data );			
			var json = JSON.parse(evt.data);
			new table_ui(json).paint("#tables");
		}				
		
		console.log('disconnect:' + evt);
		
		new table_client().set(tablecast);		
	});
	
});
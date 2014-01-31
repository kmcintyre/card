define(["jquery", "table", "table_ui", "table_client"], function($, table, table_ui, table_client) {
	
	console.log('table test ui');
	
	var blank = new table();
	blank.id = 'blank';
		
	$(function() {
		
		$("#localtables").append("<h2>local tests</h2>");
		
		try {
			$("#localtables").append( $('<div><span class="expo">blank table to json:</span></div>').append( JSON.stringify(blank.simple()) ) );
		} catch (err) {
			$("#localtables").append( $('<div><span class="error">null table error:</span></div>').append(err) );			
		}
		
		try {
			new table_ui(blank).paint("#localtables");			
		} catch (err) {
			$("#localtables").append( $('<div><span class="error">null table paint error:</span></div>').append(err) );			
		}		
		
		try {
			blank.act({});	
		} catch (err) {
			$("#localtables").append( $('<div><span class="error">blank act error:</span></div>').append(err) );			
		}		

		var json = blank.simple()
		console.info('blank json:' + JSON.stringify(json));
		var clone = JSON.parse(json);
		
		$("#localtables").append( $('<div><span class="expo">ids  same:</span></div>').append(clone.id == blank.id) );
		
		console.info('force change id to clone to get 2nd table');
		clone.id = 'clone';		
		try {			
			new table_ui(clone).paint("#localtables");
		} catch (err) {
			$("#localtables").append( $('<div><span class="error">clone paint error:</span></div>').append(err) );			
		}
		
		try {
			$("#localtables").append( $('<div><span class="expo">clone addseat exists:</span></div>').append( (clone.addseat ? "true" : "false") ) );
		} catch (err) {
			console.info('hmmm:' + err);
		}

		console.log('seat0 table');
				
		try {
			blank.id = 'seat0';	
			blank.addseat();						
			new table_ui(blank).paint("#localtables");
		} catch (err) {
			$("#localtables").append( $('<div><span class="error">seat0 failure:</span></div>').append(err) );
		}		
		
		try {
			var seat0kevin = new table();
			seat0kevin.id = 'seat0kevin';
			seat0kevin.addseat();					
			var s = { seat : 0, action: 'sit', table: blank.id, name: 'kevin'}			
			seat0kevin.act(s);
			new table_ui(seat0kevin).paint("#localtables");
		} catch (err) {
			$("#localtables").append( $('<div><span class="error">seat for 1 failure:</span></div>').append(err) );
		}		

	});
	
	$(function() {
		
		$("#remotetables").append("<h2>remote tests</h2>");
		
		function tablecast(json) {			
			new table_ui(json).paint("#remotetables");
		}
		
		new table_client().set(tablecast);		
	});
	
});

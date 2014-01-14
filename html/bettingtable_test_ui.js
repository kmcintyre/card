define(["jquery", "table", "player"], function($, table, player) {
	$(function() {
		console.log('table test ui');
		$("#table1").html( new table().toString() );
		$("#table2").html( new table(5).toString() );
		
		var t = new table(8);
		t.sit(0, new player('Bob'));		
		$("#table3").html( t.toString() );
		
		try {
			t.sit(0, new player('Bob2'));
		} catch (err) {
			$("#table4").html( err.toString() );
		}
		
		try {
			t.sit(-1, new player('Bob2'));
		} catch (err) {
			$("#table5").html( err.toString() );
		}
		
		try {
			t.seats[0].player.chips = 50;
			$("#table6").append( t.toString() + "<br>" );
			t.bet(0, 50);
			t.seats[0].player.chips = 30;
			$("#table6").append( t.toString() + "<br>" );
			t.bet(0, 30);
			$("#table6").append( t.toString() );
			
		} catch (err) {
			$("#table6").html( err.toString() );
		}
		
	});
});

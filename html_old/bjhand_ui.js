define(["jquery", "card", "bjhand"], function($, card, bjhand) {
	
	$(function() {		
		console.info("ready");
		try {
			
			var nullbj = new bjhand();
			$("#bjhand").append("<div>" + nullbj.toString() + "</div>");
			$("#bjhand").append("<br/>");
			var bj = new bjhand(10);
			$("#bjhand").append("<div>" + bj.toString() + "</div>");
			bj.cards[0] = new card(0);
			bj.cards[1] = new card(0);
			$("#bjhand").append("<div>" + bj.toString() + "</div>");					
			bj.cards[1] = new card(12);
			$("#bjhand").append("<div>" + bj.toString() + "</div>");
			
			bj.cards[0] = new card(5);
			bj.cards[1] = new card(0);
			bj.cards[2] = new card(8);
			$("#bjhand").append("<div>" + bj.toString() + "</div>");

			bj.cards[0] = new card(0);
			bj.cards[1] = new card(0);
			bj.cards[2] = new card(0);
			bj.cards[3] = new card(0);
			$("#bjhand").append("<div>" + bj.toString() + "</div>");			
			$("#bjhand").append("<br/>");
			
			console.info('split test');			
			var spbj = new bjhand(10);
			spbj.cards[0] = new card(0);
			spbj.cards[1] = new card(0);				
			$("#bjhand").append("<div>" + spbj.toString() + "</div>");			
			var o = spbj.split(9);			
			$("#bjhand").append("<div>" + o.toString() + "</div>");
			
			console.info('double test');
			$("#bjhand").append("<br/>");
			var dbj = new bjhand(10);
			dbj.cards[0] = new card(4);
			dbj.cards[1] = new card(5);			
			$("#bjhand").append("<div>" + dbj.toString() + "</div>");
			dbj.double(9);
			$("#bjhand").append("<div>" + dbj.toString() + "</div>");			
			dbj.hit(new card(9));
			$("#bjhand").append("<div>" + dbj.toString() + "</div>");
			

		} catch (err) {
			console.info('bjhand_ui error:' + err);
		}
		
	});
	
});

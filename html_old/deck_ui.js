define(["jquery", "deck"], function($, deck) {
	$(function() {
		
		try {
			
			$("#newdeck").html( new deck().toString() );
			
			$("#shuffleddeck").html( new deck(true).toString() );
			
		} catch (err) {
			console.info('Deck_ui error:' + err);
		}
		
	});
});

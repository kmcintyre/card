define(["jquery", "deck", "card"], function($, deck, card) {
	$(function() {
		
		try {			
			$("#newdeck").html( new deck().toString() );
			
			var c = new deck();
			c.cut(5);			
			$("#cutdeck").html( c.toString() );
			
			var sd = new deck();
			for (var x = 0; x < 10; x++) {
				sd.shuffle();
				$("#shuffleddeck").append( sd.toString() + "<br>" );
			}
			
			$("#facedown").html( c.facedown().toImg() );
			
			deck.prototype.facedown = function() {
				var fd = new card();
				fd.card = 'Red_';
				fd.suite = 'Back';
				return fd; 
			}
			
			$("#red").html( new deck().facedown().toImg() );
						
		} catch (err) {
			console.log('Deck_ui error:' + err);
		}
		
	});
});

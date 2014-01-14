define(["jquery", "card"], function($, card) {
	$(function() {
		
		try {
		
			for ( x = 0; x < 52; x++) {
				var c = new card(x);
				$("#all").append( ( x > 0 ? ", " : "" ) +  c.toString());
			}
			
			$("#card").bind({
				
				click: function() {
					console.log('click');
					$("#card").html( new card(Math.floor(Math.random()*52 )).toImg() );
					
				},
				
				mouseenter: function() {
					console.log('mousenter');
					$("#card").html( new card(Math.floor(Math.random()*52 )).toImg() );
				}
			});
			
			try {
				var c = new card(NaN).toString();
			} catch (err) {
				$("#nullcard").html( err );
			}
			
			try {
				var c = new card('a').toString();
			} catch (err) {
				$("#testcard1").html( err );
			}
			
		} catch (err) {
			console.log('card_test_ui error:' + err);
		}
		
	});
});

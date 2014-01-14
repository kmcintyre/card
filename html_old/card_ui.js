define(["jquery", "card"], function($, card) {
	$(function() {
		
		try {
		
			for ( x = 0; x < 52; x++) {
				var c = new card(x);
				$("#all").append( ( x > 0 ? ", " : "" ) +  c.toString());
			}
			
			$("#card").bind({
				
				click: function() {
					console.info('click');
					$("#card").html( new card(Math.floor(Math.random()*52 )).toImg() );
					
				},
				
				mouseenter: function() {
					console.info('mousenter');
					$("#card").html( new card(Math.floor(Math.random()*52 )).toImg() );
				}
			});
			
			$("#nullcard").html( new card(NaN).toString() );
			
			$("#testcard1").html( new card('a').toString() );
				
		} catch (err) {
			console.info('card_ui error:' + err);
		}
		
	});
});

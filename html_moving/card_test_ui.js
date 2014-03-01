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
				$("#cardtests").append($("<div>").append(new card(NaN).toImg()) );
			} catch (err) {
				$("#cardtests").append($("<div>").append("err:" + err) );
			}
			
			
			
			try {
				$("#cardtests").append($("<div>").append( $(new card(1).toImg()).css('position', 'absolute')) );
				
				$("#cardtests").append($("<div>").append(new card(0).toImg()) );
				$("#cardtests").append($("<div>").append($(new card(0).toImg()).css(
						{ 
							'-webkit-transform': 'rotate(-90deg)', 
							'-moz-transform': 'rotate(-90deg)', 
							'-o-transform': 
								'rotate(-90deg)', '-ms-transform': 'rotate(-90deg)', 'transform': 'rotate(-90deg)' 
							})));
			} catch (err) {
				$("#cardtests").append($("<div>").append("err:" + err) );
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

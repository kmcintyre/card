define(["jquery", "card", "player", "hand_blackjack"], function($, card, player, hand_blackjack) {
	
	$(function() {		
		console.log("ready");
		try {
			
			$(document.body).append( $("<div>").append("<h3>null hand</h3>").append( new hand_blackjack().toString()));
			
			var  bj = new hand_blackjack();
			bj.card(new card(1));
			$(document.body).append( $("<div>").append("<h3>1 card</h3>").append( bj.toString() ) );
			
			bj = new hand_blackjack();
			bj.card(new card(0));
			bj.card(new card(0));			
			$(document.body).append( $("<div>").append("<h3>2 aces</h3>").append( bj.toString() ) );

			bj = new hand_blackjack();
			bj.card(new card(5));
			bj.card(new card(0));
			bj.card(new card(8));
			$(document.body).append( $("<div>").append("<h3>3 card 16</h3>").append( bj.toString() ) );

			bj = new hand_blackjack();
			bj.card(new card(0));
			bj.card(new card(0));
			bj.card(new card(0));
			bj.card(new card(0));
			$(document.body).append( $("<div>").append("<h3>4 aces</h3>").append( bj.toString() ) );

			bj = new hand_blackjack();
			bj.card(new card(0));
			bj.card(new card(0));
			$(document.body).append( $("<div>").append("<h3>aces</h3>").append( bj.toString() ).append("<h3>split</h3>").append( (bj.split()).toString() ) );
						
			bj = new hand_blackjack();
			bj.card(new card(0));
			bj.card(new card(9));			
			
			$(document.body).append( $("<div>").append("<h3>blackjack</h3>").append( bj.bj() ) );

			var bj3 = new hand_blackjack();
			bj3.card(new card(0));
			bj3.card(new card(1));
			bj3.card(new card(7));
			
			$(document.body).append( $("<div>").append("<h3>blackjack vs: 21</h3>").append( 'winner? ' + bj.winner(bj3) ).append( ' push? ' + bj.push(bj3) ) );
						
			bj = new hand_blackjack();
			bj.card(new card(0));
			bj.card(new card(9));			
			$(document.body).append( $("<div>").append("<h3>bj vs: bj</h3>").append( 'winner? ' + bj.winner(bj) ).append( ' push? ' + bj.push(bj) ) );
			
			bj = new hand_blackjack();
			bj.card(new card(8));
			bj.card(new card(8));			
			$(document.body).append( $("<div>").append("<h3>18 vs: 18</h3>").append( 'push? ' + bj.push(bj) ) );
			
			var bj2 = new hand_blackjack();
			bj2.card(new card(9));
			bj2.card(new card(8));
			$(document.body).append( $("<div>").append("<h3>18 vs: 19</h3>").append( 'winner? ' + bj.winner(bj2) ) );
			
			$(document.body).append( $("<div>").append("<h3>19 vs: 18</h3>").append( 'winner? ' + bj2.winner(bj) ) );
			
			bj = new hand_blackjack();
			bj.card(new card(8));
			bj.card(new card(8));
			bj.card(new card(8));
			
			bj2 = new hand_blackjack();
			bj2.card(new card(8));
			bj2.card(new card(8));
			bj2.card(new card(8));
			
			$(document.body).append( $("<div>").append("<h3>bust vs: bust</h3>").append( 'winner? ' + bj.winner(bj2) ).append( ' push? ' + bj.push(bj2) ) );

			bj = new hand_blackjack();
			bj.card(new card(4));
			bj.card(new card(4));
			bj.card(new card(4));			
			bj.card(new card(4));
			
			bj2 = new hand_blackjack();
			bj2.card(new card(7));
			bj2.card(new card(7));
			bj2.card(new card(7));
			
			$(document.body).append( $("<div>").append("<h3>20 vs: bust</h3>").append( 'winner? ' + bj.winner(bj2) ).append( ' push? ' + bj.push(bj2) ) );
			
			
		} catch (err) {
			console.log('hand_blackjack_test_ui error:' + err);
		}
		
	});
	
});

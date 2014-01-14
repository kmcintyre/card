//define(["jquery", "table_blackjack", "hand_blackjack", "player"], function($, table_blackjack, hand_blackjack, player) {

define(["jquery", "table_blackjack", "table_ui"], function($, table_blackjack, table_ui) {

	//table_blackjack.prototype. = table_ui.prototype.paint;
		
	var promptclient = function() {		
		this.send = function(sm) {
			console.log('send to client:' + sm);
		};   			
		this.received = function(sm) {
			console.log('received from client:' + sm);
		}
	};	

	/*
	table_blackjack.prototype.paint = function(s) {
		console.log('paint seat:' + s );
		try {
			$('#seat' + s).empty();			
			try {
				
				$('#seat' + s).html( $(".player").first().clone(true) );
				
				$('#seat' + s + ' > .player > .name').html( this.seats[s].player.name );
				try {
					$('#seat' + s + ' > .player > .chips').html('chips:' + this.seats[s].player.chips.toString() );
				} catch (err) {
					//console.log('no chips');
				}
				
				if ( this.seats[s].hand instanceof Array  ) {
					
					$(".hand").first().clone(true).appendTo( $("#seat" + s) );
					$("#seat" + s).append('splitter');
					
				} else if ( this.seats[s].hand  ) {
					console.log('seat: ' + s + ' hand:' + this.seats[s].hand.constructor.name);
					
					$(".hand").first().clone(true).appendTo( $("#seat" + s) );
					
					$('#seat' + s + ' > .hand')
					
					$('#seat' + s + ' > .hand > .value').html('value:' + this.seats[s].hand.value());						
					if ( this.seats[s].hand.sum() > 0 ) { 
						$('#seat' + s + ' > .hand > .bet').html('bet:' + this.seats[s].hand.bet);
					}						
					$('#seat' + s + ' > .hand > input[type="button"]').each(function() {
						if ( !thisoption(s, $( this ).val()) ) {
							//console.log("button hidden:" + $( this ).val());										
							$(this).addClass("zerovis");
						} 											
					});
					for (var y = 0; y < this.seats[s].hand.cards.length; y++) {
						//console.log('img:' + this.seats[s].hand.cards[y].toImg());
						$('#seat' + s + ' > .hand > .cards').append(this.seats[s].hand.cards[y].toImg());								
					}
					//if ( this.seats[s].hand.options().length == 0 ) {
					if ( this.active() != null && s != this.active() ) {
						console.log('future active:' + this.active());							
						this.paint( this.active()  );															
					} 													
					//}						
				} else if ( this.seats[s].bet ) {
					console.log('has bet:' + this.seats[s].bet);						
					$("#seat" + s).append('bet:' + this.seats[s].bet);
											
				} else if ( s < this.seats.length -1 ) {						
					console.log('no hand');
					$(".bet").first().clone(true).appendTo($("#seat" + s));						
				} 
				
				if ( s == this.seats.length - 1 && !this.hands() && this.bets() ) {						
					console.log('no hand');
					$(".deal").first().clone(true).appendTo($("#seat" + s));						
				}
				
			} catch (err) {
				console.log('empty player ?:' + err);
				$(".empty").first().clone(true).appendTo($("#seat" + s));
			}					
		} catch (err) {
			$("#seat" + s).append( "error:" + err );
		}
		
		if ( s < this.seats.length - 1 ) {
			$("<div> Seat " + (s+1) + "</div>").prependTo($("#seat" + s));
		}
	}
	*/
	
	$(function() {	
		
		$(window).resize(function() {
			//cardsize = parseInt(document.body.clientWidth * document.body.clientHeight) / 8;
		});
		
		var t = new table_blackjack();
		t.addseats(7);
		
		t.deal = function() {
			console.log('intercept deal to show card distributed');
			var updateseat = table_blackjack.prototype.deal.call(this);
			if ( updateseat != null ) {
				//t.paint("#table_blackjack");					
				this.deal();
			}
		}

		t.payout = function() {
			console.log('intercept payout');
			var updateseat = table_blackjack.prototype.payout.call(this);
			if ( updateseat != null ) {
				//t.paint(updateseat);
				//t.payout();
				//var self = t;
				//setTimeout(function() { t.payout() }, 1000);
			}
		}		
				
		$("#table_blackjack").data('table', t);
		
		//for (var x = 0; x < t.seats.length; x++) {
		//	console.log('create seat:' + x);
		//	$("#table_blackjack > .seats").append("<div class=\"seat\" id=\"seat" + x + "\"></div>");
		//	t.paint(x);
		//}
		
		console.log('table with seats:' + t);
		
		//$("#table_blackjack > .seats > .seat:last").insertBefore('#table_blackjack > .seats > .seat:first');
		
		//  change to dealer				
		
		if (false) {		
			t.sit(0, new player('1st Base', 5000));
			t.bet(0, 1000);
			
			t.sit(1, new player('2nd Base', 5000));
			t.bet(1, 2000);
	
			t.sit(2, new player('3nd Base', 5000));
			t.bet(2, 3000);

			t.sit(3, new player('Center Stage', 5000));
			t.bet(3, 3000);

			t.sit(4, new player('5th Street', 5000));
			t.bet(4, 3000);

			t.sit(5, new player('Right of Anchor', 5000));
			t.bet(5, 3000);	
		}

		t.sit(7, { name: '%Anchor%', chips: 5000 }  );
		t.bet(7, 100 );
		t.deal();
		console.log('new table:' + t);
		//t.paint("#table_blackjack");
		//t.deal();		
		
		//
	});	
});
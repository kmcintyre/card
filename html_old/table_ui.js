define(["jquery", "table", "player", "bjhand"], function($, table, player, bjhand) {
	
	$(function() {		
		var t = new table();		

		table.prototype.paint = function(seat) {
			console.debug('paint:' + seat);
			try {
				$('#seat' + seat).empty();				
				try {
					var p = t.player(seat);
					$('#seat' + seat).html( $(".player").first().clone(true) );							
					$('#seat' + seat + ' > .player > .name').html(p.name );
					$('#seat' + seat + ' > .player > .chips').html(p.chips );
					try {
						var h = t.hand(seat);
						console.info('hand-' + h);
						$(".hand").first().clone(true).appendTo( $("#seat" + seat) );
						
						if ( h.bet instanceof Array ) {
							$('#seat' + seat + ' > .hand > .bet').html('Double:' + h.bet);
						} else {
							$('#seat' + seat + ' > .hand > .bet').html(h.bet);
						}
						$('#seat' + seat + ' > .hand > input[type="button"]').each(function() {
							if ( h.option($( this ).val()) ) {
								console.info("button is an option:" + $( this ).val());										
							} else {
								$( this ).addClass("zerovis");
							}
						});
						for ( var y = 0; y < h.cards.length; y++) {								
							$('#seat' + seat + ' > .hand > .cards').append(h.cards[y].toImg());								
						}
						
					} catch (err) {
						console.info('no hand');
						$(".bet").first().clone(true).appendTo($("#seat" + seat));
						try {							
							var b = t.bet(seat);
							console.info('bet:' + b);
							$('#seat' + seat + ' > .bet > input[type="button"][value="bet"]').val('unbet');
							$('#seat' + seat + ' > .bet > input[type="button"][value="unbet"]').parent().append( "<div>bet: " + b + "</div>" );
						} catch (err) {
							console.info('no bet:' + err);
						}
					}
				} catch (err) {
					//console.info('empty:' + seat);
					$(".empty").first().clone(true).appendTo($("#seat" + seat));
				}					
			} catch (err) {
				$("#seat" + x).append( "error:" + err );
			}

			$("<div>Seat " + (x+1) + "</div>").prependTo($("#seat" + x));

		}		
		
		t.deal = function() {
			var updateseat = table.prototype.deal.call(this);
			if ( updateseat ) {
				console.info('update seat!' + updateseat);
				t.paint(updateseat);
			}			
		}
		
		console.info('table:' + t);
		var promptclient = function() {
			
			this.send = function(sm) {
				console.info('send to client:' + sm);
			};   			
			this.received = function(sm) {
				console.info('received from client:' + sm);
			}
		};		
		
		for (var x = 0; x < t.seats.length - 1; x++) {
			$("#table > .seats").append("<div class=\"seat\" id=\"seat" + x + "\"></div>");
			t.paint(x);			
		}
		
		var dealer_id = "seat" + (t.seats.length - 1);
		
		$("#table > #dealer").attr('id', dealer_id);
		
		$('input[type="button"]').click( function(event) {			
			try {
				var seat = parseInt($(event.target).parent().parent().attr('id').substring(4));
				console.log('seat:' + seat + ' action:' + $(event.target).val() );
				if ( $(event.target).val() == 'sit' ) {
					t.sit(seat, new player(prompt(" Seat " + (seat+1) + " Player", "Anonymous"), new promptclient(), 5000));
					t.paint(seat);
				}				
				if ( $(event.target).val() == 'bet' ) {
					t.bet(seat, prompt(" Seat " + (seat+1) + " Bet Amount", t.minimum) );
					t.paint(seat);
				}
				if ( $(event.target).val() == 'hit' && t.hand(seat).option('hit') ) {
					t.hand(seat).cards[t.hand(seat).cards.length] = t.shoe.next();					
					t.paint(seat);
				}
				if ( $(event.target).val() == 'stay' && t.hand(seat).option('stay') ) {
					t.hand(seat).stay();					
					t.paint(seat);
				}				
				if ( $(event.target).val() == 'double' && t.hand(seat).option('double') ) {
					t.hand(seat).double(prompt(" Seat " + (seat+1) + " Double Amount", t.hand(seat).bet));					
					t.paint(seat);
				}				
				if ( $(event.target).val() == 'split' && t.hand(seat).option('split') ) {
					t.hand(seat).split(prompt(" Seat " + (seat+1) + " Split Amount", t.hand(seat).bet));					
					t.paint(seat);
				}				
			} catch (err) {
				console.info("error:" + err.toString());
			}
		});
		
		t.sit(t.seats.length - 2, new player("%Anchor%", new promptclient(), 5000));
		t.bet(t.seats.length - 2, 100);
		t.paint(t.seats.length - 2);
		
		t.sit(0, new player("1st Base", new promptclient(), 5000));
		t.paint(0);
		
	});	
});



 ;
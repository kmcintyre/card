define(["jquery", "table_client"], function($, table_client) {
	
	/*
	 * can be either table rep or actual table
	 */
	function table_ui(table) {
		console.info('new table ui');
		this.table = table;
	}
	
	table_ui.prototype.paint = function(append_to) {
		console.info('paint ui:' + this.table.id);		
		try {
			if ( $("#" + this.table.id).length > 0 ) {
				console.info('empty div');
				$("#" + this.table.id).empty();
			} else {
				console.info('create div');
				$('<div class="table" id="' + this.table.id + '"></div>').appendTo(append_to);
			}
			
			if ( this.table.act ) {
				console.info('append table');
				$("#" + this.table.id).data("table", this.table);
			}
			
			
			console.info('seats length:' + this.table.seats.length);
			for (var x = 0; x < this.table.seats.length; x++) {				
				console.info('paint seat:' + x);
				var seatjq = $('<div class="seat" id="seat' + x + '"></div>');
				if ( this.table.seats[x].label ) {
					seatjq.append('<span class="label">' + this.table.seats[x].label + '</span>')
				}				
				if ( this.table.seats[x].player ) {
					var playerjq = $('<div class="player"></div>');
					if ( this.table.seats[x].player.name ) {
						console.info('name:' + this.table.seats[x].player.name);
						playerjq.append('<span class="name">' + this.table.seats[x].player.name + '</span>');
					}
					if ( this.table.seats[x].player.chips ) {
						playerjq.append('<span class="chips">' + this.table.seats[x].player.chips + '</span>');
					}				
					seatjq.append(playerjq);
				}
				
				if ( this.table.seats[x].options && this.table.seats[x].options.length > 0 ) {
					for ( var y = 0; y < this.table.seats[x].options.length; y++ ) {
						seatjq.append( $('<button>' + this.table.seats[x].options[y] + '</button>') );
					}
				}

				if ( this.table.seats[x].hand ) {
					seatjq.append('<div class="hand">hand</div>');
				}
				
				if ( this.table.seats[x].payout ) {
					seatjq.append('<div class="payout">payout</div>');
				}					
				
				$("#" + this.table.id).append(seatjq);
			}			
			
			$("#" + this.table.id).find('button').click(
				/*
				 *  remember it's a dom event to trigger an act via dom interpretation
				 */
				function(event) {
					var table = $(event.target).parent().parent().attr('id');
					var seat = parseInt($(event.target).parent().attr('id').substring(4));
					var action = $(event.target).text();
					console.info('table:' + table + ' seat:' + seat + 'action:' + action);
					var act = { 
							table: table, 
							seat: seat, 
							action: action,							 
						};					
					if ( action == 'sit' ) { 
						act.name = prompt($(event.target).find('.label').html() +  " Player", "Anonymous"); 
					}
					
					if ( $("#" + table).data('table') ) {
						$("#" + table).data('table').act(act);						
						//$("#" + table).data('table').paint(append_to);
						new table_ui( $("#" + table).data('table') ).paint(append_to);
					} else {
						new table_client().send(act);
					}
				}
			);				
			$('<span class="nick">' + this.table.nick + '</span>').appendTo("#" + this.table.id);
			$('<span class="_id">' + this.table.id + '</span>').appendTo("#" + this.table.id);
			
		} catch (err) {
			console.info('cannot paint:' + err);			
		}
	}
	return table_ui;
});



/*

if ( this.seats[x].player ) {
	console.info('paint player:' + this.seats[x].player.name);				
	
	var playerjq = $('<div class="player"><div class="name">' + this.seats[x].player.name + '</div></div>'); 				
	playerjq.find('.name').html( this.seats[x].player.name );
	
	if ( this.seats[x].player.chips ) {
		<div class="chips"><span class="value"></span></div>
	}
	
	
	
	playerjq.find('.chips').html( this.seats[x].player.chips );								
	playerjq.appendTo(seatjq);
} else {
	//console.info('empty seat');
	seatjq.append('Seat ' + x);
}

if ( this.options(x).length ) {
	for (var y = 0; y < this.options(x).length; y++) {
		console.info( 'option:' + this.options(x)[y] );
		$('<button value="' + this.options(x)[y] + '">' + this.options(x)[y] + '</button>').appendTo(seatjq);
	}				
}

//$('<button value="sit">Sit</button>').appendTo( $('<div class="player"></div>') ).appendTo(seatjq);
//} 

if ( this.seats[x].bet ) {
	console.info('bet:' + this.seats[x].bet);
	$('<button value="bet">Minimum Bet:' + this.minimum + '</button>').appendTo(seatjq);
	if ( parseInt(this.seats[x].bet) ) {
		seatjq.children().last().text('Current Bet:' + this.seats[x].bet);
	}
}

if ( this.seats[x].hand ) {
	console.info('have a hand');
	hand = $('<div class="hand">').appendTo(seatjq);
	for ( var y = 0; y < this.seats[x].hand.cards.length; y++) {
		hand.append(this.seats[x].hand.cards[y].toImg());
	}
	//$('<button value="bet">Minimum Bet:' + this.minimum + '</button>').appendTo(seatjq);
	//if ( parseInt(this.seats[x].bet) ) {
	//	seatjq.children().last().text('Current Bet:' + this.seats[x].bet);
	//}	
	seatjq.append(hand);
}

if ( this.seats[x].collect ) {
	$('(someting to collect)').appendTo(seatjq);
}

$.find(id).append(seatjq);
*/
//$("#" + this.id).append(seatjq);
//}
//$('<div class="chips"></div>').appendTo($.find(id));		

/*
<div class="hand">
<input type="button" value="backdoor">
<input type="button" value="expose">
<input type="button" value="payout">

<input type="button" value="insurance">
<input type="button" value="hit">

<input type="button" value="double">
<input type="button" value="even">
<input type="button" value="split">
<input type="button" value="stay">
<input type="button" value="surrender">		
<div class="value"></div>
<div class="cards"></div>
<div class="bet"></div>		
</div>
*/

//return table_ui;

/*
table_ui.prototype.button = function() {
	console.info('button up:');
	$.find('button').click( function(event) {
		try {
			var seat = parseInt($(event.target).parent().attr('id').substring(4));
			console.info('seat:' + seat + ' action:' + $(event.target).val() );
			var t = $(event.target).parent().parent().data('table');
			console.info('table:' + t);
			if ( $(event.target).val() == 'sit' ) {
				t.sit(seat, { name: prompt(" Seat " + (seat+1) + " Player", "Anonymous"), chips: 5000 } );					
			} else if ( $(event.target).val() == 'stand' ) {
				t.stand(seat);										
			} else if ( $(event.target).val() == 'bet' ) {
				console.info('bet:' + $(event.target).parent().val());
				t.bet( seat, parseInt( prompt(" Seat " + (seat+1) + " Bet Amount", t.minimum) ) );
			}
			
			var t = $(event.target).parent().parent().parent().data('table');
					//.attr('id').substring(4));
			console.info('seat:' + seat + ' action:' + $(event.target).val() );
			console.info('table:' + t );
			if ( $(event.target).val() == 'sit' ) {
				t.sit(seat, new player(prompt(" Seat " + (seat+1) + " Player", "Anonymous"), 5000 ));					
			} else if ( $(event.target).val() == 'insurance' ) {
				t.insurance(seat);
			} else if ( $(event.target).val() == 'backdoor' ) {
				t.backdoor(seat);
			} else if ( $(event.target).val() == 'bet' ) {
				t.bet( seat, prompt(" Seat " + (seat+1) + " Bet Amount", t.minimum) );
			} else if ( $(event.target).val() == 'deal') {
				t.deal();					
			} else if ( $(event.target).val() == 'hit' ) {
				t.hit(seat);					
			} else if ( $(event.target).val() == 'payout' ) {
				t.payout();
			} else if ( $(event.target).val() == 'stay' ) {
				t.stay(seat);
			} else if ( $(event.target).val() == 'double' ) {
				t.double(seat);
			} else if ( $(event.target).val() == 'expose' ) {
				t.expose(seat);										
			} else if ( $(event.target).val() == 'even' ) {
				t.even(seat);										
			} else if ( $(event.target).val() == 'split' ) {
				t.split(seat);										
			}			
		} catch (err) {
			console.info("error:" + err.toString());
		}			
	});		
}
*/

//var tc = new table_client();


/*
.click(function(event) {
	var msg = JSON.stringify({
		stand : $(event.target).parent().attr('id').substring(4)
	});
	console.info('send msg:' + msg);
	tc.send(msg);
})

.click(function(event) {
				var msg = JSON.stringify({
					bet : $(event.target).parent().attr('id').substring(4),
					amount : parseInt(prompt("Bet Amount:", $(event.target).val() ))
				});
				console.info('send msg:' + msg);
				tc.send(msg);

.click(function(event) {
				var n = prompt("Player Name:", "Anonymous");
				var msg = JSON.stringify({
					name : n,
					sit : $(event.target).parent().attr('id').substring(4)
				});
				console.info('send msg:' + msg);
				tc.send(msg);
			})

*/	
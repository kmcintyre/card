define(["jquery", "table_client", "card"], function($, table_client, card) {

	function handy(h) {
		var handjq = $('<div class="hand"></div>');
		if ( h.cards ) {			
			for (var y = 0; y < h.cards.length; y++) {
				console.info('append card');
				var c = new card();
				c.card = h.cards[y].card;
				c.suite = h.cards[y].suite;
				handjq.append(c.toImg());
			}
		}	
		
		return handjq;
	}
	
	/*
	 * can be either table rep or actual table
	 */
	function table_ui(table) {
		console.info('new table ui');
		this.table = table;
	}
	
	table_ui.prototype.re = function() {		
		
		//console.log('re: ' + document.documentElement.clientWidth + ' x ' + document.documentElement.clientHeight + ' seats:' + this.table.seats.length);
		$("#" + this.table.id).parent().width( document.documentElement.clientWidth );
		$("#" + this.table.id).parent().height( document.documentElement.clientHeight );
		
		var dealer = { left:0, top:0, 
				'margin-left':'auto',
				'margin-right':'auto',
				'-webkit-transform': 'rotate(180deg)',
				'-moz-transform': 'rotate(180deg)',
				'-o-transform': 'rotate(180deg)',
				'-ms-transform': 'rotate(180deg)',
				'transform': 'rotate(180deg)'					
				};
		
		
		// center dealer remove player
		$("#" + this.table.id + " > .seat:first").css(dealer);
		//$("#" + this.table.id + " > .seat:first > .player").empty();
		
		var seats = $("#" + this.table.id + " > .seat").not(":first").length;

		/* don't erase */
		//$(this).after($(this).prev());
		
		$("#" + this.table.id + " > .seat").not(":first").each(function (i) {
			console.info('check:' + i)
			$(this).css('position', 'absolute' );

			$(this).css('bottom', 50 * Math.abs((seats-1)/2-i)  );

			console.log('i:' + i + ' half:' + 50 * Math.abs((seats-1)/2-i) );
			
			if ( i < (seats - 1) / 2) {				
				$(this).css('right',  i *  document.documentElement.clientWidth / seats );
			} else if ( i > (seats - 1) / 2) {				
				$(this).css('left',  (seats - i - 1) * document.documentElement.clientWidth / seats );				
			} else {
				$(this).css({ 'left': 0 , 'right':0, 'bottom': 0, 'margin-left':'auto', 'margin-right':'auto'  });
			}
			$(this).find(".hand > img").each(function (j) {
				//$(this).css('position',  'absolute' );
				//$(this).css('bottom', '150px' );
				//$(this).css('left',   15 * j + 'px' );
				
				 
				//if ( j == 1 ) {
				//	$(this).after($(this).prev());
				//}
				
				//if ( j > 1 ) {
				//	$(this).prev().height();
				//	console.log('card:' + j + ' ' + $(this).prev().height() );
				//	$(this).css('position', 'absolute' );
				//	$(this).css('right', $(this).prev().width() / 2 );
				//	$(this).css('bottom', $(this).prev().height() );
				//	$(this).css('z-index', -1);
					//$(this).css('bottom', $(this).prev().height() );
				//} else {
				//	$(this).css('z-index', -2);
				//}
				//$(this).css('width', '4em');
				//
				//
				//$(this).css('right', spacing /  );
			});
		});		
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
			if ( this.table['act'] ) {
				console.info('data to "table"');
				$("#" + this.table.id).data("table", this.table);
			} 
			
			$('<div class="nick">' + this.table.nick + '</div>').appendTo("#" + this.table.id);
			$('<div class="_id">' + this.table.id + '</div>').appendTo("#" + this.table.id);			
			
			console.info('seats length:' + this.table.seats.length);
			for (var x = 0; x < this.table.seats.length; x++) {				
				console.info('paint seat:' + x);
				var seatjq = $('<div class="seat"></div>').attr('seat',x);				
				if ( typeof this.table.seats[x].bet === 'number' ) {
					seatjq.append('<div class="bet">' + this.table.seats[x].bet + '</div>');
				}
				var splits = 0;
				while ( this.table.seats[x]['hand' + splits] ) {
					seatjq.append(handy(this.table.seats[x]['hand' + splits]));
					if ( parseInt(this.table.seats[x]['hand' + splits].insurance) > 0 ) {
						seatjq.prepend('<div class="insurance">' + 	this.table.seats[x]['hand' + splits].insurance + '</div>');
					}
					if ( typeof this.table.seats[x]['hand' + splits].bet === 'number' ) {
						seatjq.prepend('<div class="bet">' + this.table.seats[x]['hand' + splits].bet + '</div>');
					}					
					splits++;
				}
				if ( this.table.seats[x].options && this.table.seats[x].options.length > 0 ) {
					var optionsjq = $('<div class="options"></div>');
					for ( var y = 0; y < this.table.seats[x].options.length; y++ ) {
						optionsjq.append( $('<button value="'+ this.table.seats[x].options[y] + '">' + this.table.seats[x].options[y] + '</button>') );
					}
					seatjq.append(optionsjq);
				}								
				if ( this.table.seats[x].player ) {
					var playerjq = $('<div class="player"></div>');
					if ( typeof this.table.seats[x].player.chips === 'number' ) {
						playerjq.append('<div class="chips">' + this.table.seats[x].player.chips + '</div>');
					}					
					if ( this.table.seats[x].player.name ) {
						console.info('name:' + this.table.seats[x].player.name);
						playerjq.append('<div class="name">' + this.table.seats[x].player.name + '</div>');
					}
					seatjq.append(playerjq);
				}												
				if ( this.table.seats[x].label ) {
					seatjq.append('<span class="label">' + this.table.seats[x].label + '</span>')
				}				
				$("#" + this.table.id).append(seatjq);
			}
			
			$("#" + this.table.id).find('button').click(
				/*
				 *  remember it's a dom event to trigger an act via dom interpretation
				 */
				function(event) {
					try {
						var table = $(event.target).parent().parent().parent().attr('id');
						var seat = parseInt($(event.target).parent().parent().attr('seat'));
						var action = $(event.target).val();
						console.info('table:' + table + ' seat:' + seat + 'action:' + action);
						var act = { 
							table: table, 
							seat: seat, 
							action: action,							 
						};
						if ( action == 'stand' ) {
							console.info('need to check for active hand');
							//act.name = prompt($(event.target).find('.label').html() +  " Player", "Anonymous"); 
						} else if ( action == 'sit' ) { 
							act.name = prompt($(event.target).find('.label').html() +  " Player", "Anonymous"); 
						} else if ( action == 'bet' ) { 
							var cb = parseInt( $(event.target).parent().find('.bet').html() );
							act.amount = prompt("Bet Amount", cb ? cb : 100 ); 
						}
						
						$("#" + table).data('table')
						
						if ( $("#" + table).data('table') ) {
							console.log('local act');
							$("#" + table).data('table').act(act);
						} else {
							console.log('remote act');
							new table_client().send(act);
						}
					} catch (err) {
						console.info('err:' + err);
					}
				}
			);			
		} catch (err) {
			console.info('cannot paint:' + err);			
		}
	}
	return table_ui;
});	
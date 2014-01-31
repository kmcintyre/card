define(["jquery", "hand", "card", "table_client"], function($, _hand, _card, table_client) {

	/*
	 * can be either table rep or actual table
	 */
	function table_ui(table, container) {
		console.info('new table ui');
		this.table = table;
		this.container = container;
	}
	
	table_ui.prototype.re = function() {
		var seats = $("#" + this.table.id + " > .seat").length;
		var players = $("#" + this.table.id).find(" > .player").length;
		var bets = $("#" + this.table.id).find("> .bet").length;
		
		$("#" + this.table.id).parent().width( document.documentElement.clientWidth );
		$("#" + this.table.id).parent().height( document.documentElement.clientHeight );
		
		if ( document.documentElement.clientWidth < 800 ) {
			$("#burner").width("100px");
			$(".card").width("100px");
		} else if ( document.documentElement.clientWidth < 1200 ) {
			$("#burner").width("150px");
			$(".card").width("150px");
		} else {
			$("#burner").width("200px");
			$(".card").width("200px");
		}
		
		//var hmmm = 're: ' + document.documentElement.clientWidth + ' x ' + document.documentElement.clientHeight + ' seats:' + this.table.seats.length + ' card width:' + $("#burner").width()
		//console.log( hmmm );
		
		//$("#" + this.table.id).find(".seat > .bet").each(function(i) {
		//	if ( parseInt($(this).html()) > 0 ) {
		//		$(this).parent().find('.options > button[value="bet"]').html("bet:" + parseInt($(this).html()));
		//	}
		//});
	}
	
	table_ui.prototype.hands = function(obj, append_to) {
		for (var x = 0;; x++) {			
			if ( obj['hand' + x] ) {
				if ( append_to.children(".hand[hand=" + x + "]").length == 0 ) {
					$('<div class="hand" hand="' + x + '"></div>').appendTo(append_to);
				} 
				var handjq = $("#" + this.table.id).children(".hand[hand=" + x + "]");
				handjq.children(".card").each(function(i) {
					if ( i > obj['hand' + x].cards.length ) {
						$(this).remove();
					} else {
						var c = new card();
						c.fromSrc($(this).attr('src'));												
						if ( c.card != obj['hand' + x].cards[i].card || c.suite != obj['hand' + x].cards[i].suite ) {
							var c2 = new _card();
							c2.card = obj['hand' + x].cards[y].card;
							c2.suite = obj['hand' + x].cards[y].suite;
							$(this).replaceWith(c2.toImg());
						}
					}
				});
				
				for (var y = 0; y < obj['hand' + x].cards.length; y++) {
					//var c = new _card();
					//c.card = obj['hand' + x].cards[y].card;
					//c.suite = obj['hand' + x].cards[y].suite;
					//handjq.append(c.toImg());
				}
				this.options(obj['hand' + x], handjq);
				if ( obj['hand' + x].bet ) {
					handjq.append('<div class="bet">' +  obj['hand' + x].bet + '</div>');
				} 								
				append_to.append(handjq);
			} else {
				break;
			}
		}
	}
	
	table_ui.prototype.options = function(obj, append_to) {
		if ( obj['options'] ) {
			var opts = (obj['options'] instanceof Array ? obj['options'] : obj.options() );
			console.log('opts:' + opts);
			if ( append_to.children(".options").length == 0 ) {
				$('<div class="options"/>').appendTo(append_to);
			} else {
				append_to.children(".options").children().each(function() {
					if ( opts.indexOf($(this).val()) > -1 ) {
						opts.splice(opts.indexOf($(this).val()), 1);
					} else {
						$(this).remove();
					}
				});
			}
			for ( var x = 0; x < opts.length; x++ ) {
				append_to.children(".options").append( $('<button value="'+ opts[x] + '">' + opts[x] + '</button>') );
			}
		} else {
			append_to.children(".options").remove();
		}
	}	
	
	table_ui.prototype.paint = function() {
		console.info('paint ui:' + this.table.id);		
		try {
			if ( $("#" + this.table.id).length == 0 ) {
				console.info('create div');
				var tablejq = $('<div class="table" id="' + this.table.id + '"><div class="minimum"/><div class="title"/><div class="_id"/></div>');
				tablejq.appendTo(this.container);
				if ( this.table['act'] ) {
					console.info('data to "table"');
					$("#" + this.table.id).data("table", this.table);
				}
				$("#" + this.table.id).children(".title").html( this.table.title );
				$("#" + this.table.id).children("._id").html( this.table.id );
				$("#" + this.table.id).children(".minimum").html( this.table.minimum );				
			}

			for (var x = 0; x < this.table.seats.length; x++) {
				if ( $("#" + this.table.id).children(".seat[seat=" + x + "]").length == 0 ) {
					$('<div class="seat" seat="' + x + '"><div class="chair"/></div>').appendTo("#" + this.table.id);
				}				
				var seatjq = $("#" + this.table.id).children(".seat[seat=" + x + "]");
				
				this.hands(this.table.seats[x], seatjq );
				
				if ( typeof this.table.seats[x].bet === 'number' && seatjq.children(".bet").length ) {
					seatjq.children(".bet").html( this.table.seats[x].bet );					
				} else if ( typeof this.table.seats[x].bet === 'number' ) {
					seatjq.append('<div class="bet">' + this.table.seats[x].bet + '</div>');
				} else {
					seatjq.children(".bet").remove();
				}				
								
				if ( this.table.seats[x].player ) {
					if ( seatjq.children(".player").length == 0 ) {
						seatjq.append('<div class="player"><div class="name"/></div>');
					}
					if ( x == 0 ) {
						seatjq.children(".player").children(".name").html( document.documentElement.clientHeight + ' ' + $("#burner").height());
					} else {
						seatjq.children(".player").children(".name").html(this.table.seats[x].player.name);
					}					
					
					if ( typeof this.table.seats[x].player.chips === 'number' &&  seatjq.children(".player").children(".chips").length == 0 ) {
						seatjq.children(".player").append('<div class="chips"/>').html(this.table.seats[x].player.chips);
					} else if ( typeof this.table.seats[x].player.chips === 'number' ) {
						seatjq.children(".player").children(".chips").html( this.table.seats[x].player.chips );
					} else {
						seatjq.children(".player").children(".chips").remove();
					}					
				} else {
					seatjq.children(".player").remove();					
				}

				this.options(this.table.seats[x], seatjq);
				seatjq.children(".chair").html(this.table.seats[x].chair);
				seatjq.appendTo("#" + this.table.id);
			}			
			
			this.options(this.table, $("#" + this.table.id));
			
			$("#" + this.table.id).find('button2').unbind('click').click(
					
					function(event) {
						if ( $(event.target).val() == 'bet' && !$(event.target).attr('amount')) {
							console.log('clicked bet:' + $(event.target).closest(".table").attr('minimum'));
							$(event.target).attr('amount', $(event.target).closest(".table").attr('minimum') );
							$(event.target).html('bet:' + $(event.target).attr('amount'));
						} 						
						var act = { 
							table: $(event.target).closest(".table").find("._id").html(),  
							action: $(event.target).val(),							 
						};
						if ( $(event.target).val() == 'bet' ) {
							act['amount'] = $(event.target).attr('amount');
						}
						act['seat'] = $(event.target).closest(".seat").attr('seat');
						console.log(act);						
						if ( $(event.target).closest(".table").data('table') ) {
							console.log('local act');
							$(event.target).closest(".table").data('table').act(act);
						} else {
							console.log('remote act');
							new table_client().send(act);
						}
					}					
			);			
		} catch (err) {
			console.info('cannot paint:' + err);			
		}
	}
	
	return table_ui;
				
});	
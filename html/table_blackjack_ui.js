define(["jquery", "table_ui", "card"], function($, table_ui, card) {

	var styleobject = { offset:11, spinset:22};
	
	function rotatecss(rot) {
		ang = 'rotate(' + rot + 'deg)';
		return { '-webkit-transform': ang, '-moz-transform': ang, '-o-transform': ang, '-ms-transform': ang, 'transform': ang };
	}	
		
	function getimgstyle(cs) {
		if ( !styleobject['style' + cs] ) {
			styleobject['style' + cs] = [Math.floor((Math.random()*styleobject.spinset)) - 10, Math.floor((Math.random()*styleobject.offset)), Math.floor((Math.random()*styleobject.offset))];
		}
		var ang = 'rotate(' + styleobject['style' + cs][0] + 'deg) translate(' + styleobject['style' + cs][1] + 'px,' + styleobject['style' + cs][2] + 'px)';
		return { '-webkit-transform': ang, '-moz-transform': ang, '-o-transform': ang, '-ms-transform': ang, 'transform': ang };
	}
	
	function table_blackjack_ui(table, container) {
		console.log('new blackjack ui');
		table_ui.call(this, table, container);
	}
	
	table_blackjack_ui.prototype = new table_ui();
	table_blackjack_ui.prototype.constructor=table_blackjack_ui;	
	

	table_blackjack_ui.prototype.rules = function() {
		if ( $(this.container + ' > #' + this.table.id + ' > .seat:first > .hand > .options > button').val() == 'insurance' ) {
			$(this.container + ' > #' + this.table.id + ' > .seat:not(:first) > .hand > .bet').siblings('.options').empty().append(
					$(this.container + ' > #' + this.table.id + ' > .seat:first > .hand > .options > button').clone(true)
			);
			$(this.container + ' > #' + this.table.id + ' > .seat:not(:first) > .hand > .bj').parent().find(".options > button").html('Even').val('even');			
		} else if ( $(this.container + ' > #' + this.table.id + ' > .seat:first > .hand > .options > button').val() == 'backdoor' ) {
			$(this.container + ' > #' + this.table.id + ' > .seat:not(:first)').find('> .hand > .options').empty();
		} else if ( $(this.container + ' > #' + this.table.id + ' > .seat:first > .hand > .options > button').val() == 'expose' && $('#' + this.table.id + ' .seat:not(:first) .hand .options').length > 0 ) {
			$('#' + this.table.id + ' .seat .hand .options').each(function(i) {
				console.log( $(this).closest(".seat").attr('seat') + ' ' + i );
				if ( i != 1) {					
					$(this).remove();
				} 
			});
			//console.log( $('#' + this.table.id + ' .seat .hand .options').length );
			//$('#' + this.table.id + ' .seat:first .hand .options').remove();
			//console.log( $('#' + this.table.id + ' .seat .hand .options').length );
			//$('#' + this.table.id + ' .seat .hand .options')
			//if ( $('#' + this.table.id + ' .seat .hand .options').length > 1 ) {
//				$('#' + this.table.id + ' .seat .hand .options:not(:first)').remove();
	//		}
		} 
		$(this.container + ' > #' + this.table.id + ' > .seat:not(:first) > .hand:eq(' + this.table.splitlimit + ')').parent().find("button[value='split']").remove();
		
	}
	
	table_blackjack_ui.prototype.re = function() {
		table_ui.prototype.re.call(this);
		this.rules();
		var seats = $("#" + this.table.id + " > .seat").not(":first").length;
		var players = $("#" + this.table.id + " > .seat").not(":first").find(".player").length;
		
		//console.log('non dealear seats:' + seats + ' non dealer players:' + players);		
		
		$("#" + this.table.id).css({"overflow":"hidden", "height": "100%", "width": "100%"});
		var chairwidth = document.documentElement.clientWidth / seats;
				
		$("#" + this.table.id).find(".seat").each(function(s) {
			
			if ( s == 0 ) {
				$(this).css('left', 0 );
				$(this).width('100%');
			} else {
				$(this).width(chairwidth);
				$(this).css('bottom', $("#chip").height() );
				if ( (s - 1) / (seats - 1) > .5 ) {					
					$(this).css('left',  (seats - s) *  chairwidth);
				} else if ( (s- 1) / (seats - 1) < .5 ) {
					$(this).css('right',  (s - 1) *  chairwidth);
				} else {
					$(this).css('left',  document.documentElement.clientWidth / 2 - $(this).width() / 2);
				}				
			}			
			
			$(this).children('.options').each(function() {
				$(this).css({"left" : $(this).parent().outerWidth() / 2 - $(this).outerWidth() / 2 });
				if ( s == 0 ) {
					$(this).css({"margin-top" : $(this).parent().outerHeight() });
				} else {
					$(this).css({"margin-top" : -$(this).outerHeight() });
				}
			});
			
			$(this).find(".hand").each( function(h) {

				if ( s != 0) {			
					//$(this).css({"bottom": 0 });
				} else {
					//$(this).offset({"top": $(this).parent().height() + $("#burner").height() / 8 });
				}								
				
				var splits = $(this).siblings(".hand").length;
				if ( splits == 0 ) {
					$(this).css("left", $(this).parent().width() / 2);
				} else {
					console.log('splits:' + splits);					
					var handwidth = $(this).closest('.seat').width() / (splits + 1);
					$(this).css("left", Math.max( $(this).parent().width() - handwidth * (h + 1), 0 ) + $("#burner").width() / 2);					
				}				
				
				//$(this).children('.options').css({'margin-left': $("#burner").width() / 1.5});
				//if ( s == 0 ) {
				//	$(this).children('.options').css({'top': $("#burner").height() / 2});	
				//} else {
				//	$(this).children('.options').css({'top': -$("#burner").height() / 2});
				//}
								
				$(this).find(".card").each( function(c) {
					if ( s == 0 ) {
						if ( c == 0 && $(this).siblings(".card").length == 0 ) {
							$(this).css("left", -$("#burner").width() / 2);
							$(this).css(getimgstyle($(this).attr('src')));
						} else if ( c == 1 ) {
							$(this).css("left", -$("#burner").width() * 3 / 4 );
							if ( $(this).siblings(".card").length == 1 ) {
								var _c = new card();
								_c.fromSrc( $(this).siblings(".card").attr('src') );
								var _b = new card();
								_b.fromSrc( $(this).attr('src') );																				
								if ( _b.bjValue() ) {								
									$(this).css("z-index", 2 );
								} else {
									$(this).css("z-index", 0 );									
								}								
							}							
						}  else if ( c == 0 ) {
							$(this).css("left", -$("#burner").width() / 2 );
							$(this).css(getimgstyle($(this).attr('src')));
							if ( $(this).siblings(".card").length == 1 ) {
								$(this).css("z-index", 1);
							}							
						} else if ( c > 1) {
							$(this).css("left", -$("#burner").width() * 3 / 4 - $("#burner").width() / 4 * (c-1) );
							$(this).css(getimgstyle($(this).attr('src')));
						}
					} else if ( s > 0 ) {
						if ( $(this).siblings(".double").length > 0 && c == 2 )  {
							$(this).css(rotatecss(90));					
						} else {
							$(this).css(getimgstyle($(this).attr('src')));
						}
						if ( c > 1 ) {
							$(this).css("bottom", c * $("#burner").height() / 5);
							$(this).css("left", -$("#burner").width() / 2 );
						} else if ( c == 1 ) {
							$(this).css("left", -$("#burner").width() * 3 / 4 );
							$(this).css("bottom", styleobject.offset);
						} else {
							$(this).css("left", -$("#burner").width() / 4 );
							$(this).css("bottom", styleobject.offset);
						} 
					}
				});
			});
		});
		
		$("#" + this.table.id).find('.bet,.insurance,.double,.payout').css({ "width" : $("#chip").width(), "height" : $("#chip").height()});		
		$("#" + this.table.id + " > .seat > .chair").each( function() { $(this).css({"left": $(this).parent().width() / 2 - $(this).outerWidth() / 2}) });
		$("#" + this.table.id + " > .seat > .bet,.payout").each( function() { $(this).css({"left": $(this).parent().width() / 2 - $("#chip").width() / 2 }) });		
		$("#" + this.table.id + " > .seat > .hand > .bet").each( function() { $(this).css({"left": -$("#chip").width() / 2, "bottom": -$("#chip").height() })});
		$("#" + this.table.id + " > .seat:not(:first) > .hand > .options").each( function() { $(this).css({"left": -$("#burner").width(), "bottom": $("#burner").height() })});		
		//$("#" + this.table.id + " > .seat > .hand > .double,.payout").each( function() { $(this).css({"left": -$("#chip").width(), "bottom": $("#chip").height()})});
		$("#" + this.table.id + " > .seat > .hand > .insurance").each( function() { $(this).css({"left": -$("#chip").width() / 2, "bottom": $("#burner").height() })});
		$("#" + this.table.id + " > .seat > .hand > .double").each( function() { $(this).css({"left": -$("#chip").width() / 2, "bottom": $("#burner").height() / 4, "z-index": 50 })});		
		$("#" + this.table.id + " > .seat > .player").each( function() { $(this).css({"left": $(this).parent().width() / 2 + $("#chip").width() / 2 })});
		//$(this).find('.name').css({"margin-left":"100px"});
	}
	
	/*
	 * tweak hand on incoming 
	 */
	table_blackjack_ui.prototype.hands = function(obj, append_to) {
		table_ui.prototype.hands.call(this, obj, append_to);
		var splits = 0;
		while ( obj['hand' + splits] && this.table.splitlimit >= splits ) {			
			if ( obj['hand' + splits] ) {
				if ( obj['hand' + splits].doubled ) {
					console.log('doubled');
					append_to.find(' > .hand:eq(' + splits + ')').prepend('<div class="double">' + obj['hand' + splits].doubled + '</div>');
				}
				if ( obj['hand' + splits].isBj) {
					console.log('bj');
					append_to.find(' > .hand:eq(' + splits + ')').prepend('<div class="bj">BJ!</div>');
				}
				
				splits++;
			} else {
				break;
			}
		}
	}
	
	/*
	 * tweak incoming 
	 */
	table_blackjack_ui.prototype.paint = function() {
		table_ui.prototype.paint.call(this);
		console.log('seats:' + this.table.seats.length);
		for (var x = 1; x < this.table.seats.length; x++) {
			if ( this.table.seats[x].hand0 && this.table.seats[x].hand0.insurance && !this.table.seats[x].hand0.isBj ) {
				$(this.container + ' > #' + this.table.id + ' > .seat:eq(' + x + ') > .hand:first').prepend( $('<div class="insurance"/>').append(this.table.seats[x].hand0.insurance) );
			} 
		}
		$(this.container + ' > #' + this.table.id + ' .seat:not(:first) .hand .options button[value="deal"]').remove();
		//$(this.container + ' > #' + this.table.id).find('.bet,.insurance,.double').css({"margin-left": -$("#burner").width()});
	}
	
	return table_blackjack_ui;
});	
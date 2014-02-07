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
		table_ui.call(this, table, container);
	}
	
	table_blackjack_ui.prototype = new table_ui();
	table_blackjack_ui.prototype.constructor=table_blackjack_ui;	

	table_blackjack_ui.prototype.rules = function() {
		if ( $('#' + this.table.id + ' > .seat:first > .hand > .options > button').val() == 'insurance' ) {
			$('#' + this.table.id + ' > .seat:not(:first) > .hand > .options').remove();
			$('#' + this.table.id + ' > .seat:not(:first) > .hand > .bet:parent').append(
					$('#' + this.table.id + ' > .seat:first > .hand > .options').clone(true).css({"left": -$("#burner").width(), "bottom": $("#burner").height() + $(this).siblings(".bet").length * $("#chip").height() })
			);
			$('#' + this.table.id + ' > .seat:first > .hand > .options > button[value="insurance"]').html('insurance close');
		} else if ( $('#' + this.table.id + ' > .seat:first > .hand > .options > button').val() == 'backdoor' ) {
			$('#' + this.table.id + ' > .seat:not(:first)').find('> .hand > .options').empty();
		} else if ( $('#' + this.table.id + ' > .seat:first > .hand > .options > button').val() == 'expose' && $('#' + this.table.id + ' .seat:not(:first) .hand .options').length > 0 ) {
			$('#' + this.table.id + ' .seat .hand .options').each(function(i) {
				console.log( $(this).closest(".seat").attr('seat') + ' ' + i );
				if ( i != 1) {					
					$(this).remove();
				} 
			});
		} 
		$('#' + this.table.id + ' .seat').find('.hand:gt('+ (this.table.splitlimit - 1) + ')').each(function() { $(this).parent().find('button[value="split"]').remove(); });
		$('#' + this.table.id + ' > .seat:not(:first) > .hand > .bj').parent().find(".options > button[value='insurance']").html('Even').val('even');
		//$('#' + this.table.id + ' > .seat:not(:first) > .hand > .options > button[value='insurance']")
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
				$(this).css({'left':0, "width": "100%"});
			} else {
				var bot = $(this).find(".player .name").outerHeight() + $(this).find(".player .chips").outerHeight();
				if ( bot == 0 ) {
					bot = $(this).find("button").outerHeight() + 10;
				}
				$(this).css({"width": chairwidth, "bottom": bot});				
				if ( (s - 1) / (seats - 1) > .5 ) {					
					$(this).css('left',  (seats - s) *  chairwidth);
				} else if ( (s- 1) / (seats - 1) < .5 ) {
					$(this).css('right',  (s - 1) *  chairwidth);
				} else {
					$(this).css('left',  document.documentElement.clientWidth / 2 - $(this).width() / 2);
				}				
			}			
			
			$(this).children('.player').each(function() {
				$(this).css({"left": $(this).parent().width() / 2 - $(this).children(".name").outerWidth() / 2});
			});
			
			$(this).children('.options').each(function() {
				$(this).css({"left": $(this).parent().width() / 2 - $(this).outerWidth() / 2});
				if ( s == 0 ) {
					$(this).css({"margin-top" : $(this).parent().outerHeight() });
				}
			});
			
			$(this).find(".hand").each( function(h) {

				var splits = $(this).siblings(".hand").length;
				if ( splits == 0 ) {
					$(this).css("left", $(this).parent().width() / 2);
				} else {
					console.log('splits:' + splits);					
					var handwidth = $(this).closest('.seat').width() / (splits + 1);
					$(this).css({"left" : $(this).parent().width() - handwidth * (h + 1) +  handwidth / 2, "z-index": $(this).find('.options button').length});					
				}				

				if ( s == 0 ) {
					$(this).css({"top": $(this).children(".player").outerHeight()});
					$(this).children(".options").css({"left":$("#burner").width()/2,"top":$("#chip").height()/2});
				} else {
					$(this).children(".options").each( function() {
						$(this).css({"left": -$("#burner").width(), "bottom": $("#burner").height() + $(this).siblings(".bet").length * $("#chip").height() })
					});					
				}
				
				$(this).children(".bet").each(function() {
					$(this).css({"left":-$(this).width()/2, "bottom":$("#chip").height()/2-$(this).height()/2});
					$(this).append( $('#chip').clone().css({"z-index": "-1", "position": "absolute", "left": -$("#chip").width()/2+$(this).width()/2, "bottom" : -$("#chip").height()/2+$(this).height()/2}).show() );
				});
				
				$(this).children(".double").each(function() {
					$(this).css({"left":-$(this).width()/2, "bottom":$('#burner').height()});
					$(this).append( $('#chip').clone().css({"z-index": "-1", "position": "absolute", "left": -$("#chip").width()/2+$(this).width()/2, "bottom" : -$('#chip').height()/2 + $(this).height()/2}).show() );
				});

				$(this).children(".insurance").each(function() {
					$(this).css({"left":-$(this).width()/2, "bottom":$('#burner').height() + 2 * $('#chip').height()});
					$(this).append( $('#chip').clone().css({"z-index": "-1", "position": "absolute", "left": -$("#chip").width()/2+$(this).width()/2, "bottom" : -$('#chip').height()/2 + $(this).height()/2}).show() );
				});
				
				$(this).children(".bj").each(function() {
					// clear player - bet - cards - style
					$(this).css(( s == 0 ? "top" : "bottom" ), 
							$(this).siblings(".bet,.payout").length * $("#chip").height() + $("#burner").height() + $(this).closest(".seat").find(".player").outerHeight() + styleobject.offset 
					);				
				});
				
				$(this).find(".card").each( function(c) {
					if ( s == 0 ) {
						$(this).css("top", $(this).parent().siblings(".player").outerHeight());
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
									$(this).css("zIndex", 2 );
								} else {
									$(this).css("zIndex", 0 );									
								}								
							}							
						}  else if ( c == 0 ) {
							$(this).css("left", -$("#burner").width() / 2 );
							$(this).css(getimgstyle($(this).attr('src')));
							if ( $(this).siblings(".card").length == 1 ) {
								$(this).css("zIndex", 1);
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
						var uc = styleobject.offset;
						if ( $(this).siblings(".bet").length + $(this).parent().siblings(".payout").length > 0 ) {
							uc = $("#chip").height() + styleobject.offset;
						}  
						
						if ( c > 1 ) {
							$(this).css("bottom", c * $("#burner").height() / 5 + uc );
							$(this).css("left", -$("#burner").width() / 2 );
						} else if ( c == 1 ) {
							$(this).css("left", -$("#burner").width() * 3 / 4 );
							$(this).css("bottom",uc);
						} else {
							$(this).css("left", -$("#burner").width() / 4 );
							$(this).css("bottom", uc);
						}
					}
				});
			});
		});
		$(document).unbind('keydown');
		$(window).unbind('mousewheel DOMMouseScroll');
		this.bets();		
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
				$('#' + this.table.id + ' > .seat:eq(' + x + ') > .hand:first').prepend( $('<div class="insurance"/>').append(this.table.seats[x].hand0.insurance) );
			} 
		}
		$('#' + this.table.id + ' .seat:not(:first) .hand .options button[value="deal"]').remove();		
		//$('#' + this.table.id + ' .seat:first .chair').html( $('#' + this.table.id + ' .seat:first .chair').attr('title') );
		//$('#' + this.table.id + ' .seat:first .chair').each( function () { $(this).css("top", -$(this).outerHeight() ); });
	}
	
	return table_blackjack_ui;
});	
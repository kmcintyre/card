define(["jquery", "table_ui", "card"], function($, table_ui, card) {

	var styleobject = { offset:11, spinset:22};
	function rotatecss(rot, scaleY) {
		ang = 'rotate(' + rot + 'deg)';
		if ( scaleY ) {
			ang = ang + ' scaleY(' + scaleY + ')';
		}
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
		$('#' + this.table.id + ' > .seat > .hand > .options > button[value="insurance"],button[value="backdoor"]').each(function() {
			$(this).closest('.seat').siblings('.seat').find('.hand .options').remove();			
			$(this).closest('.options button[value="insurance"]').parent().clone(true).appendTo(
				$(this).closest('.seat').siblings('.seat').find('.hand .bet').parent()
			);	
			$(this).val() == "insurance" ? $(this).html('close') : console.log('backdoor');			
		});
		$('#' + this.table.id + ' .seat').find('.hand:gt('+ (this.table.splitlimit - 1) + ')').each(function() { $(this).parent().find('button[value="split"]').remove(); });
		if (  $('#' + this.table.id).attr('blackjackpays') == '3-2' ) {
			$('#' + this.table.id + ' > .seat:not(:first) > .hand > .bj').parent().find(".options > button[value='insurance']").html('even').val('even');
		}		 
		$('#' + this.table.id + ' > .seat:first > .hand > .options > button[value="expose"]').each(function() {
			if ( $(this).closest('.hand').children('.bj').each(function() {
					$(this).html('Oh no!');
				}).length == 0 && $(this).closest('.seat').siblings('.seat').find('.hand .options button').length > 0 
			) { 
				$(this).closest('.seat').siblings('.seat').find('.hand .options').not(':first').remove();
				$(this).remove();
			};
		});
				
		/*
		$('#' + this.table.id + ' .seat:gt(0)').find('.hand .options button[value="double"],button[value="split"],button[value="insurance"]').each(function() {
			console.log('check ' + $(this).val() + ':' + ' ' + $(this).closest(".table").attr('forless').indexOf($(this).val()) + ' ' + $(this).closest(".hand").children(".bet").text() + ' ' + $(this).closest('.seat').find('.player .chips').html() );
			if ( (
					(parseFloat( $(this).closest(".hand").children(".bet").html()) > parseFloat($(this).closest('.seat').find('.player .chips').html()) && $(this).val() != 'insurance') 
					||
					(parseFloat( $(this).closest(".hand").children(".bet").html()) / 2 > parseFloat($(this).closest('.seat').find('.player .chips').html()) && $(this).val() == 'insurance')
					) 
				&& 
					$(this).closest(".table").attr('forless').indexOf($(this).val()) < 0 					 
				) {
				console.log('lacks ' + $(this).val() + ' chips');
				$(this).attr('disabled', true);				
			} else if ($(this).closest(".table").attr('forless').indexOf($(this).val()) >= 0) {
				$(this).attr('forless', true);
				if ( $(this).closest(".table").attr('fornothing').indexOf($(this).val()) >= 0 ) {
					$(this).attr('fornothing', true);
				}
			}
			if ( $(this).val() == 'double' && $(this).closest(".table").attr('doubleon').length > 0 ) {
				var v = 0;				
				$(this).closest(".hand").children(".card").each(function() {
					var _c = new card();
					_c.fromSrc( $(this).attr('src') );
					v += _c.bjValue();
				}); 
				if ( $(this).closest(".table").attr('doubleon').indexOf(v) < 0 ) {
					console.log('non qualifying double');
					$(this).attr('disabled', true);
				}
			}
		});
		*/
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
				$(this).css({"width": chairwidth, "bottom": $(this).find(".player .chips").outerHeight()});				
				if ( (s - 1) / (seats - 1) > .5 ) {					
					$(this).css('left',  (seats - s) *  chairwidth);
				} else if ( (s- 1) / (seats - 1) < .5 ) {
					$(this).css('right',  (s - 1) *  chairwidth);
				} else {
					$(this).css('left',  document.documentElement.clientWidth / 2 - $(this).width() / 2);
				}				
			}			
			
			$(this).children('.player').children('.name').hide();			

			$(this).children('.payout').each(function () {
				$(this).css({"left": $(this).closest(".seat").outerWidth()/2-$(this).width()/2, "bottom" : $("#whitechip").height()/2-$(this).height()/2});				
				$('#whitechip').clone().css({"z-index":-1, "position": "absolute", "left": -$("#whitechip").width()/2+$(this).width()/2, "bottom": -$("#whitechip").height()/2+$(this).height()/2 }).
					show().prependTo($(this));											
			});
			$(this).children('.bet').each(function () {
				$(this).css({"left": $(this).closest(".seat").outerWidth()/2-$(this).width()/2, "bottom" : $("#bluechip").height()/2-$(this).height()/2});				
				$('#bluechip').clone().css({"z-index":-1, "position": "absolute", "left": -$("#bluechip").width()/2+$(this).width()/2, "bottom": -$("#bluechip").height()/2+$(this).height()/2 }).
					show().prependTo($(this));											
			});			
			
			$(this).children(".hand").each( function(h) {

				var splits = $(this).siblings(".hand").length;
				if ( splits == 0 ) {
					$(this).css("left", $(this).parent().width() / 2);
				} else {
					console.log('splits:' + splits);					
					var handwidth = $(this).closest('.seat').width() / (splits + 1);
					$(this).css({"left" : $(this).parent().width() - handwidth * (h + 1) +  handwidth / 2, "z-index": $(this).find('.options button').length});					
				}				
				
				$(this).children(".options").each( function() {
					var maxbuttonwidth = 0;
					$(this).children('button').each(function(){if ( $(this).outerWidth() > maxbuttonwidth ) { maxbuttonwidth = $(this).outerWidth(); }});
					$(this).css({"left": -maxbuttonwidth/2});
					if ( s == 0 ) {
						$(this).css({"top": styleobject.offset + $("#burner").height() + $(this).closest(".seat").children('.player').height()});
					} else {
						$(this).css({"bottom": 
							styleobject.offset +
							$("#burner").height() + 							
							$(this).siblings(".bet").length * $("#bluechip").height() + 
							$(this).siblings(".card:gt(1)").length * $("#burner").height() / 5 
						});
					}
				})
					
				$(this).children(".bet").each(function() {
					$(this).css({"left":-$(this).width()/2, "bottom":$("#bluechip").height()/2-$(this).height()/2});
					$(this).append( $('#bluechip').clone().css({"z-index": "-1", "position": "absolute", "left": -$("#bluechip").width()/2+$(this).width()/2, "bottom" : -$("#bluechip").height()/2+$(this).height()/2}).show() );
				});
				
				$(this).children(".double").each(function() {
					$(this).css({"left":-$(this).width()/2, "bottom":$('#burner').height()});
					$(this).append( $('#bluechip').clone().css({"z-index": "-1", "position": "absolute", "left": -$("#bluechip").width()/2+$(this).width()/2, "bottom" : -$('#bluechip').height()/2 + $(this).height()/2}).show() );
				});

				$(this).children(".insurance").each(function() {
					$(this).css({"left":-$(this).width()/2, "bottom":$('#burner').height() + $('#greenchip').height() + styleobject.offset});
					var ic = '#bluechip';
					if ( $(this).parent().find('.options button[value="insurance"]').parent().hide().parent().children('.insurance').on('click', function(e) {						
						$(e.target).closest(".hand").find(".options button[value='insurance']").trigger('click');
					}).length == 1) { ic = '#greenchip'; };
					$(this).append($(ic).clone().css({"z-index": "-1", 
						"position": "absolute", 
						"left": -$("#bluechip").width()/2+$(this).width()/2, 
						"bottom" : -$('#bluechip').height()/2 + $(this).height()/2 
					}).show());
				});
				
				$(this).children(".bj").each(function() {
					// clear player - bet - cards - style
					$(this).css(( s == 0 ? "top" : "bottom" ), 
							$(this).siblings(".bet,.payout").length * $("#bluechip").height() / 2 + styleobject.offset 
					);
					$(this).css("left",$("#bluechip").width()/2);
				});
				
				$(this).find(".card").each( function(c) {
					$(this).css("z-index", c );					
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
									$(this).css("zIndex", 3 );
								} else {
									$(this).css("zIndex", 1 );									
								}								
							}							
						}  else if ( c == 0 ) {
							$(this).css("left", -$("#burner").width() / 4 );
							$(this).css(getimgstyle($(this).attr('src')));
							if ( $(this).siblings(".card").length == 1 ) {
								$(this).css("zIndex", 2);
							}							
						} else if ( c > 1) {
							$(this).css("left", -$("#burner").width() / 2 - $("#burner").width() / 4 * c );
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
							uc = $("#bluechip").height() + styleobject.offset;
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

			$(this).children('.options').each(function() {
				$(this).css({"left": $(this).parent().width() / 2 - $(this).outerWidth() / 2});
				if ( s == 0 ) {									
					$(this).css({"top" : $(this).siblings('.player').outerHeight() });
				} else {
					
					$(this).find('button[value="stand"]').each(function() {
						if ( $(this).parent().siblings('.hand,.bet,.payout').length > 0 ) {
							$(this).remove();
						} else {
							$(this).css({'bottom':0, 'left': -$(this).width()-$(this).closest('.seat').find('.player .chips').outerWidth()/2 });
						}
												
					}); 
					$(this).find('button[value="collect"]').css({'bottom':0,"left":$('#bluechip').width()/2});
					$(this).find('button[value="rebuy"]').hide();
					
					$(document).unbind('keydown dragover');		
					$(window).unbind('mousewheel DOMMouseScroll');
					
					switch( 
						$(this).children('button[value="bet"]').on('amount', function() {
						var min = parseInt($(this).closest('.table').attr('minimum'));
						var sliderjq = $('<input type="range" value="' + min + '">');
						sliderjq.attr({
							'min': min,				 
							'step': parseInt($(this).closest('.table').attr('denomination'))
						});
						sliderjq.attr('max', parseInt($(this).closest('.seat').find('.player .chips').html()) );
						if ( $(this).closest('.table').attr('ante') ) {
							sliderjq.attr('max', parseInt(sliderjq.attr('max')) - $(this).closest('.table').attr('ante'));
							$(this).closest('.seat').children('.ante').each(function(){
								sliderjq.attr('max', parseInt(sliderjq.attr('max')) + parseInt($(this).html()));
							});
						}
						$(this).css({"left": $("#bluechip").width() / 2 + styleobject.offset / 2,"bottom" : $(this).closest('.seat').find('.player .chips').outerHeight() });
						
						function sliderheight() {
							return parseInt(sliderjq.val()-sliderjq.attr('min'))/parseInt(sliderjq.attr('max')-sliderjq.attr('min')) * $('#burner').height();
						}
						
						function sliderchipbet() {
							var diff = parseInt(sliderjq.val());
							if ( diff >= sliderjq.attr('min') && diff <= sliderjq.attr('max') ) {								
								sliderjq.siblings('button[value="bet"]').css("bottom", sliderheight());
								sliderjq.closest(".seat").children(".bet").each(function () {
									$(this).css("bottom", sliderheight() + $("#bluechip").height()/2-$(this).height()/2);
									if ( diff < min ) {
										diff = 0;
									}
									this.firstChild.data = '' + diff;
								});								
								if ( diff < min ) {
									sliderjq.siblings('button[value="bet"]').text('cancel');
								} else if ( diff == sliderjq.attr('min') ) {
									sliderjq.siblings('button[value="bet"]').text('min');
								} else if ( diff == sliderjq.attr('max') ) {
									sliderjq.siblings('button[value="bet"]').text('max');
								} else {
									sliderjq.siblings('button[value="bet"]').text('bet');
								}	
								console.log('new slider value:' + diff);									
							}
						}
						sliderjq.on('input', function(e) {
							if ( (sliderjq.val() - sliderjq.attr('min')) > 25 && (sliderjq.attr('max') - sliderjq.val()) > 25 ) {
								sliderjq.attr('step', 25);
							} else if ( (sliderjq.val() - sliderjq.attr('min')) > 10 && (sliderjq.attr('max') - sliderjq.val()) > 10 ) {
								sliderjq.attr('step', 10);
							} else if ( (sliderjq.val() - sliderjq.attr('min')) > 5 && (sliderjq.attr('max') - sliderjq.val()) > 5 ) {
								sliderjq.attr('step', 5);
							} else {
								sliderjq.attr('step', 1);
							}
							sliderchipbet();
						});
						if ( $(this).closest(".seat").children(".bet").length == 0 ) {
							$(this).closest(".seat").append('<div class="bet emptybet">' + $(this).closest(".table").attr('minimum') + '</div>');
						}
						$(this).closest(".seat").children(".bet").each(function () {
							if ( !$(this).hasClass('emptybet') ) {
								sliderjq.attr({'min': Math.max(0, parseInt(sliderjq.attr('min')) - 1), 'max' : parseInt(sliderjq.attr('max')) + parseInt($(this).html()) });								
							}
							var dragy = 0;
							var dragval = 0;
							$(document).bind('dragover' ,function(e) {								
								var up_or_down = dragy - e.originalEvent.screenY;
								console.log('up or d:' + up_or_down + ' ' + dragval);
								var nv = (sliderjq.attr('max') - sliderjq.attr('min')) * up_or_down/sliderjq.width()+Math.max(dragval,sliderjq.attr('min'));
								console.log('going to:' + nv);
								sliderjq.val(nv);
								sliderchipbet();								
							});
							$(this).bind({				
								dragend : function(e) { console.log('dragend:' + e.originalEvent.screenY + ' ' + sliderjq.val()); dragval = sliderjq.val();},
								dragstart : function(e) { dragy = e.originalEvent.screenY; dragval = sliderjq.val();console.log('dragstart:' + e.originalEvent.screenY + ' ' + dragval);},
							});
							$(this).css({"left": $(this).closest(".seat").outerWidth()/2-$(this).width()/2, "bottom" : $("#bluechip").height()/2-$(this).height()/2});							
							if ( $(this).hasClass('emptybet') ) {
								$('#greenchip').clone().css({"z-index":-1, "position": "absolute", 
									"left": -$("#bluechip").width()/2+$(this).width()/2, 
									"bottom": sliderheight()-$("#bluechip").height()/2+$(this).height()/2 }).
									show().appendTo($(this).attr('dragable',true));
							} else {
								//$(this).css({"bottom": sliderheight()-$("#bluechip").height()/2+$(this).height()/2 });
								console.log('MOVE THIS SHIT');
							}				
														
						});			
						$(window).bind('mousewheel DOMMouseScroll', function(e) {
							sliderjq.val( parseInt(sliderjq.val()) + Math.max(-1 * sliderjq.attr('step'), Math.min(1 * sliderjq.attr('step'), (e.originalEvent.wheelDelta || -e.originalEvent.detail)))); 
							sliderjq.triggerHandler('input'); 
			            });
						$(document).bind('keydown' ,function(e) {
			                switch (e.keyCode) {
			                	case 38: sliderjq.val( Math.max(min, parseInt(sliderjq.val()) + 1)); sliderjq.triggerHandler('input'); break;
			                	case 40: sliderjq.val( parseInt(sliderjq.val()) - 1); sliderjq.triggerHandler('input'); break;
			                	default: {
			                		console.log('which key:' + e.keyCode);
			                		e.preventDefault();
			                	}
			                }
						});			
						var slide = rotatecss("-90", "1.5");
						slide['width'] = $('#burner').height();
						slide['bottom'] = $('#bluechip').height();
						slide['left'] = -$('#bluechip').width() * 3 / 2 - sliderjq.height() - styleobject.offset;
						sliderjq.css(slide);
						$(this).parent().append(sliderjq);
						console.log( $(this).closest('.seat').children('.bet').text() );
						sliderjq.val(parseFloat($(this).closest('.seat').children('.bet').text()));
						sliderjq.triggerHandler('input');
					}).length
					
					) {
					case 0:
					  console.log('no bets can be made');
					  break;
					case 1:
						$(this).children('button[value="bet"]').triggerHandler('amount');
					  break;
					default:
					   console.log('default number of bets to make');
					}
				}
			});			
			
		});		
	}
	
	/*
	 * tweak hand on incoming 
	 */
	table_blackjack_ui.prototype.hands = function(obj, append_to) {
		table_ui.prototype.hands.call(this, obj, append_to);
		var splits = 0;
		while ( obj['hand' + splits] && this.table.splitlimit >= splits ) {			
			if ( obj['hand' + splits] ) {
				if ( obj['hand' + splits].insured ) {
					console.log('insured');
					append_to.find(' > .hand:eq(' + splits + ')').prepend('<div class="insurance">' + obj['hand' + splits].insured + '</div>');
				}				
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
		if ( this.table.maximum ) {
			$("#" + this.table.id).attr("maximum" , this.table.maximum );
		} else {
			$("#" + this.table.id).removeAttr("maximum");
		}		
		$("#" + this.table.id).attr("forless" , this.table.forless );
		$("#" + this.table.id).attr("fornothing" , this.table.fornothing );
		$("#" + this.table.id).attr("doubleon", this.table.doubleon);
		$("#" + this.table.id).attr("blackjackpays", this.table.blackjackpays);
		$("#" + this.table.id).attr("insurancepays", this.table.insurancepays);
		$("#" + this.table.id).attr("holecards", this.table.holecards);
		$("#" + this.table.id).attr("downdirty", this.table.downdirty);
		$("#" + this.table.id).attr("surrender", this.table.surrender);
		$("#" + this.table.id).attr("soft17", this.table.soft17);
		
		$("#" + this.table.id).find('.seat:first .player').hide();
		
		console.log('seats:' + this.table.seats.length);
		//$('#' + this.table.id + ' .seat:not(:first) .hand .options button[value="deal"]').remove();		
		//$('#' + this.table.id + ' .seat:first .chair').html( $('#' + this.table.id + ' .seat:first .chair').attr('title') );
		//$('#' + this.table.id + ' .seat:first .chair').each( function () { $(this).css("top", -$(this).outerHeight() ); });
	}
	
	return table_blackjack_ui;
});	
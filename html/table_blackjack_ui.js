define(["jquery", "table_ui", "card"], function($, table_ui, card) {

	function css3transform(transform) {
		return { '-webkit-transform': transform, '-moz-transform': transform, '-o-transform': transform, '-ms-transform': transform, 'transform': transform };
	}	
	function getimgstyle(card_suite) {
		if ( !styler['card_suite_' + card_suite] ) {
			styler['card_suite_' + card_suite] = [Math.floor((Math.random()*styler.spinset)) - styler.spinset/2, Math.floor((Math.random()*styler.offset)), Math.floor((Math.random()*styler.offset))];
		}
		return css3transform('rotate(' + styler['card_suite_' + card_suite][0] + 'deg) translate(' + styler['card_suite_' + card_suite][1] + 'px,' + styler['card_suite_' + card_suite][2] + 'px)'); 
	}
	
	function table_blackjack_ui(table, container_id, canvas_id) {
		table_ui.call(this, table, container_id, canvas_id);
	}
	
	table_blackjack_ui.prototype = new table_ui();
	table_blackjack_ui.prototype.constructor=table_blackjack_ui;	

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
		$("#" + this.table.id).attr("splitlimit", this.table.splitlimit );
		$("#" + this.table.id).attr("forless" , this.table.forless );
		$("#" + this.table.id).attr("fornothing" , this.table.fornothing );
		$("#" + this.table.id).attr("doubleon", this.table.doubleon);
		$("#" + this.table.id).attr("blackjackpays", this.table.blackjackpays);
		$("#" + this.table.id).attr("insurancepays", this.table.insurancepays);
		$("#" + this.table.id).attr("holecards", this.table.holecards);
		$("#" + this.table.id).attr("downdirty", this.table.downdirty);
		$("#" + this.table.id).attr("surrender", this.table.surrender);
		$("#" + this.table.id).attr("soft17", this.table.soft17);		
		$("#" + this.table.id).attr("decks", this.table.decks);
		
		for (var s = 1; s < this.table.seats.length; s++) {
			for (var h=0;;h++) {
				if ( !this.table.seats[s]['hand' + h] ) {
					break;;
				}
				if ( this.table.seats[s]['hand' + h].insured ) {
					var handjq = $("#" + this.table.id).children('.seat:eq(' + s + ')').children('.hand:eq(' + h + ')');					
					if ( handjq.children('.insurance').length == 0 ) {
						handjq.append('<div class="insurance">' + this.table.seats[s]['hand' + h].insured + '</div>');
					}
					if ( this.table.seats[s]['hand' + h].doubled ) {
						if ( handjq.children('.doubled').length == 0 ) {
							handjq.append('<div class="doubled">' + this.table.seats[s]['hand' + h].doubled + '</div>');
						}
					}
					if ( this.table.seats[s]['hand' + h].bj ) {
						if ( handjq.children('.bj').length == 0 ) {
							handjq.append('<div class="bj">' + this.table.seats[s]['hand' + h].bj + '</div>');
						}
					}					
					if ( this.table.seats[s]['hand' + h].payout ) {
						if ( handjq.children('.payout').length == 0 ) {
							handjq.append('<div class="payout">' + this.table.seats[s]['hand' + h].payout + '</div>');
						}
					}					
				}				
			}			
		}
		this.rules();
		
		this.canvas();
		
		this.wire();
		
		this.arm();
		
		this.cards_and_chips();
	}
	
	table_blackjack_ui.prototype.rules = function() {		
		table_ui.prototype.rules.call(this);
		$('#' + this.table.id).children('.seat:first').find('.hand .options button[value="insurance"],button[value="backdoor"]').each(function() {
			$(this).closest('.seat').siblings('.seat').find('.hand .options button').remove();			
			$(this).closest('.options button[value="insurance"]').clone().appendTo(
				$(this).closest('.seat').siblings('.seat').find('.hand .bet').siblings('.options')
			).each(function () { console.log('need to offer different options to single players');});						
		});
		$('#' + this.table.id).children('.seat').children('.hand:gt('+ (this.table.splitlimit - 1) + ')').each(function() { $(this).parent().find('button[value="split"]').remove(); });		
		if (  $('#' + this.table.id).attr('blackjackpays') == '3 to 2' ) {
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
	}
		
	table_blackjack_ui.prototype.wire = function() {
		table_ui.prototype.wire.call(this);		
		$("#" + this.table.id).css({"overflow":"hidden", "height": "100%", "width": "100%"});
		var chairwidth = document.documentElement.clientWidth / ($("#" + this.table.id + ' .seat').length - 1);
				
		$("#" + this.table.id).find(".seat").each(function(s) {			
			if ( s == 0 ) {
				$(this).css({"width": "100%", "top": styler.topset});
			} else {
				$(this).css({"left": document.documentElement.clientWidth - chairwidth * s + chairwidth / 2});
				$(this).css({"bottom": styler.bottomset});  
			}									
						
			$(this).children(".hand").each( function(h) {
				var splits = $(this).siblings(".hand").length;				
				if ( splits > 0 ) {					
					var hw = $(this).siblings('.hand').length * $("#burner").width()  * 5 / 4;
					$(this).siblings('.hand').each(function () {
						$(this).css({"right" : "-=" + $("#burner").width()  * 5 / 4} + this.canvas_id);
					})					
					$(this).css({"right" : hw/2});														
				} else {
					$(this).css("left", "50%");
				} 
				
				$(this).children(".options").each(function() {
					if ( s == 0 ) { $(this).css({"top": $("#burner").height()}); } else { $(this).css({"bottom": $("#burner").height()});}
					$(this).children('button').each(function(b){
						$(this).css({"left": -$(this).width()/2});
						$(this).not( s != 0 ).css({"bottom": ($(this).height() + styler.buttonset) * b});
					});					
				});
					
				$(this).find(".double").each(function() {
					$(this).css({"left":-$(this).width()/2, "bottom":$('#burner').height()});
					$(this).append( $('.bluechip').clone().css({"z-index": "-1", "position": "absolute", "left": -$(".bluechip").width()/2+$(this).width()/2, "bottom" : -$('.bluechip').height()/2 + $(this).height()/2}).show() );
				});

				$(this).children(".insurance").each(function() {
					$(this).css({"left":-$(this).width()/2, "bottom":$('#burner').height() + $('.greenchip').height() + styler.offset});
					var ic = '.bluechip';
					if ( $(this).parent().find('.options button[value="insurance"]').parent().hide().parent().children('.insurance').on('click', function(e) {						
						$(e.target).closest(".hand").find(".options button[value='insurance']").trigger('click');
					}).length == 1) { ic = '.greenchip'; };
					$(this).append($(ic).clone().css({"z-index": "-1", 
						"position": "absolute", 
						"left": -$(".bluechip").width()/2+$(this).width()/2, 
						"bottom" : -$('.bluechip').height()/2 + $(this).height()/2 
					}).show());
				});
				
				$(this).children(".bj").each(function() {
					$(this).css(( s == 0 ? "top" : "bottom" ), 
							$(this).siblings(".bet,.payout").length * $(".bluechip").height() / 2 + styler.offset 
					);
					$(this).css("left",$(".bluechip").width()/2);
				});
				
				$(this).find(".card").each( function(c) {
					$(this).css("z-index", c );					
					if ( s == 0 ) {
						$(this).css("top", styler.topset );
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
							$(this).css(css3transform('rotate(90deg)'));					
						} else {
							$(this).css(getimgstyle($(this).attr('src')));
						}						
						if ( c > 1 ) {
							$(this).css("bottom", c * $("#burner").height() / 5 + styler.offset );
							$(this).css("left", -$("#burner").width() / 2 );
						} else if ( c == 1 ) {
							$(this).css("left", -$("#burner").width() * 3 / 4 );
							$(this).css("bottom",styler.offset);
						} else {
							$(this).css("left", -$("#burner").width() / 4 );
							$(this).css("bottom",styler.offset);
						}
					}
				});
			});

			$(this).children('.options').each(function() {
				if ( s == 0 ) {
					$(this).css({"left" : "50%", "margin-left" : -$(this).children('button:first').outerWidth()/2 });
				} else {
					$(this).css({"margin-left" : -$(this).children('button:first').outerWidth()/2 });
					
					$(this)
					
					
					$(this).find('button[value="stand"]').each(function() {
						if ( $(this).parent().siblings('.hand,.bet,.payout').length > 0 ) {
							$(this).hide();
						} else {
							$(this).css({'bottom':0, 'left': -$(this).width()-$(this).closest('.seat').find('.player .chips').outerWidth()/2 });
						}
												
					}); 					
					$(this).find('button[value="collect"]').css({'bottom':0,"left":$('.bluechip').width()/2});
					
					$(document).unbind('keydown dragover');		
					$(window).unbind('mousewheel DOMMouseScroll');
					
					switch(														
						$(this).children('button[value="bet"]').not( $(this).bind('amount') ).unbind('amount').on('amount', function() {
							var ctx = $(this).closest('.table').siblings('canvas')[0].getContext('2d');
							var id = ctx.getImageData(0,0,document.documentElement.clientWidth,document.documentElement.clientHeight);
							for (var i=0; i<id.data.length; i+=4) {
								var r = id.data[i];
								var g = id.data[i+1];
								var b = id.data[i+2];
								var v = 0.2126*r + 0.7152*g + 0.0722*b;
								id.data[i] = id.data[i+1] = id.data[i+2] = v;
							}
							ctx.putImageData(id,0,0);
							
							var min = parseInt($(this).closest('.table').attr('minimum'));
							var denom = parseInt($(this).closest('.table').attr('denomination'));
							
							if ( $(this).siblings('input[type="range"]').length == 0 ) {
								$(this).parent().append('<input type="range"/>');
							}
							var sliderjq = $(this).siblings('input[type="range"]');							
							sliderjq.attr({
								'min': min,				 
								'step': denom 
							});							
							sliderjq.attr('max', parseInt(
								$(this).closest('.table').attr('maximum').length ? $(this).closest('.table').attr('maximum') : $(this).closest('.seat').find('.player .chips').html()									
							));						
							
							function sliderheight() {
								return parseInt(sliderjq.val()-sliderjq.attr('min'))/parseInt(sliderjq.attr('max')-sliderjq.attr('min')) * $('#burner').height();
							}
							
							sliderjq['previousValueAsNumber'] = null;							
							sliderjq.unbind('change').on('change', function(e) {
								//console.log(e);								
								var chips = $(e.target).closest('.seat').find('.player').children('.chips')[0].firstChild.data;
								
								if ( e.target.valueAsNumber > $(e.target).closest('.seat').find('.player').children('.chips')[0].firstChild.data) {
									console.log('TO BIG A BET:' + $(e.target).closest('.seat').find('.player').children('.chips')[0].firstChild.data);
									e.target.value = $(e.target).closest('.seat').find('.player').children('.chips')[0].firstChild.data;
								} 								
								
								if ( e.target.valueAsNumber >= $(e.target).attr('min') && e.target.valueAsNumber <= $(e.target).attr('max') ) {								
									$(e.target).siblings('button[value="bet"]').css("bottom", sliderheight());
									$(e.target).closest(".seat").children(".bet").each(function () {
										$(e.target).css("bottom", sliderheight() + $(".bluechip").height()/2-$(e.target).height()/2);
										if ( e.target.valueAsNumber < min ) {
														diff = 0;
										}
									});								
									if ( e.target.valueAsNumber < min ) {
										$(e.target).siblings('button[value="bet"]').text('cancel');
									} else if ( e.target.valueAsNumber == sliderjq.attr('min') ) {
										$(e.target).siblings('button[value="bet"]').text('min');
									} else if ( e.target.valueAsNumber == sliderjq.attr('max') ) {
										$(e.target).siblings('button[value="bet"]').text('max');
									} else {
										$(e.target).siblings('button[value="bet"]').text(e.target.value);
									}																			
								}
								e.target.previousValueAsNumber = e.target.valueAsNumber;
							});
							
							if ( $(this).closest(".seat").children(".bet").length == 0 ) {
								$(this).closest(".seat").append('<div class="bet">' + min + '</div>');
								$(this).closest(".seat").find(".bet").each(function(){
									$(this).css({"left":-$(this).width()/2, "bottom": document.documentElement.clientHeight/2-$(this).height()/2});
									$(this).append(
										$('.greenchip').clone().css({"z-index" : -1, "position": "absolute", "left": -$(".greenchip").width()/2+$(this).width()/2, "bottom": -$(".greenchip").height()/2+$(this).height()/2 })
											.show()
									);
								});										
							} else {
								$(this).closest(".seat").children(".bet").children('.bluechip').removeClass('bluechip').add('yellowchip').attr('src', $('.yellowchip:first').attr('src') );
							}
							
							$(this).closest(".seat").children(".bet").each(function () {																							
								var dragy = 0;
								var dragval = 0;
								
								//$(document).bind('dragover' ,function(e) {								
								//	var up_or_down = dragy - e.originalEvent.screenY;
								//	console.log('up or d:' + up_or_down + ' ' + dragval);
								//	var nv = (sliderjq.attr('max') - sliderjq.attr('min')) * up_or_down/sliderjq.width()+Math.max(dragval,sliderjq.attr('min'));
								//	console.log('going to:' + nv);
								//	sliderjq.val(nv);
								//	sliderchipbet();								
								//});i.prototype.canvas
								//$(this).bind({				
								//	dragend : function(e) { console.log('dragend:' + e.originalEvent.screenY + ' ' + sliderjq.val()); dragval = sliderjq.val();},
								//	dragstart : function(e) { dragy = e.originalEvent.screenY; dragval = sliderjq.val();console.log('dragstart:' + e.originalEvent.screenY + ' ' + dragval);},
								//});
								
								
								//if ( $(this).hasClass('emptybet') ) {
								//	$('.greenchip').clone().css({"z-index":-1, "position": "absolute", 
								//		"left": -$(".greenchip").width()/2+$(this).width()/2, 
								//		"bottom":-$(".greenchip").height()/2+$(this).height()/2}).
										//show().appendTo($(this).attr('dragable',true));
								//		show().appendTo($(this));
								//} else {
								//$(this).css({"bottom": sliderheight()-$(".bluechip").height()/2+$(this).height()/2 });
								//	console.log('MOVE THIS SHIT');
								//}				
															
							});
							
							$(window).unbind('mousewheel DOMMouseScroll').bind('mousewheel DOMMouseScroll', function(e) {
								var adjacent_value = parseInt(sliderjq.val()) + Math.max(-1 * sliderjq.attr('step'), Math.min(1 * sliderjq.attr('step'), (e.originalEvent.wheelDelta || -e.originalEvent.detail)));
								console.log('adjacent value:' + adjacent_value);								
								sliderjq.val(adjacent_value);								
								sliderjq.trigger('change');
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
							var slide = css3transform('translateY(-200px)');
							slide['width'] = document.documentElement.clientHeight / 3;
							slide['bottom'] = 0;
							slide['left'] = 0;
							sliderjq.css(slide);
							sliderjq.val(parseFloat($(this).closest('.seat').children('.bet').text()));
							sliderjq.triggerHandler('change');
						}).length					
					) {
					case 0:
					  //console.log('either wired or not an option');
					  break;
					case 1:
					  console.log('trigger amount seat:' + s);
					  $(this).children('button[value="bet"]').triggerHandler('amount');
					  break;
					default:
					console.log('default number of bets to make');
					}
				}
			});			
			
		});		
	}
	
	
	table_blackjack_ui.prototype.canvas = function() {
		console.info('blackjack canvas');
		table_ui.prototype.canvas.call(this);
		var offscreen = -styler.tableradius*4/5;
		function textCircle(ctx,text,x,y,radius,ang,pos,clockwise){
			ctx.save();
			ctx.translate(x,y);						
			if ( !text ) text = 'undef';
			ctx.textAlign = (pos.textAlign?pos.textAlign:"left");
			ctx.textBaseline = (pos.textBaseline?pos.textBaseline:'middle');
			ctx.font = (pos.font?pos.font:styler.base_font); 
			ctx.fillStyle = (pos.color?pos.color:'white');		
			if ( pos.align == "center" && clockwise ) {				  
				ctx.rotate(ang+Math.PI/2-ctx.measureText(text).width/radius/2);
			} else if ( pos.align == "center" ) {				  
				ctx.rotate(ang-Math.PI/2+ctx.measureText(text).width/radius/2);
			} else if ( pos.align == "right" && clockwise ) {
				  ctx.rotate(ang+Math.PI/2-ctx.measureText(text).width/radius);
			} else if ( pos.align == "right") {
				  ctx.rotate(ang-Math.PI/2+ctx.measureText(text).width/radius);
			} else if ( clockwise ) {
				ctx.rotate(ang+Math.PI/2);
			} else {
				ctx.rotate(ang-Math.PI/2);
			}
			for ( var c = 0; c < text.length; c++) {
				if ( clockwise ) {
					ctx.fillText(text[c], 0, -radius);
				} else {
					ctx.fillText(text[c], 0, radius);
				}
				var rot = ctx.measureText(text[c]).width/radius;
				if ( clockwise ) {
					ctx.rotate(+rot);
				} else {
					ctx.rotate(-rot);
				}				
			}
			ctx.restore();
		}
		
		var ctx = document.getElementById(this.canvas_id.substring(1)).getContext('2d');

		ctx.font = styler.base_font;
		ctx.beginPath();
		ctx.arc(document.documentElement.clientWidth/2,offscreen,styler.tableradius,Math.PI/3,Math.PI*2/3);
		ctx.arc(document.documentElement.clientWidth/2,offscreen,styler.tableradius+25,Math.PI*2/3,Math.PI/3,true);
		ctx.closePath();
		ctx.lineWidth = 3;	
		ctx.strokeStyle = 'gold';
		ctx.stroke();
		ctx.fillStyle = '#57854e';
		ctx.fill();
		
		textCircle(ctx, "Insurance Pays",document.documentElement.clientWidth/2,offscreen,styler.tableradius,Math.PI/2,
				{font:styler.insurance_font, align:'center',textBaseline:'top', color:'black'}
		);
		textCircle(ctx, $("#" + this.table.id).attr('insurancepays'),document.documentElement.clientWidth/2,offscreen,styler.tableradius+4,Math.PI*2/3,
				{font: styler.odds_font, align:'left',textBaseline:'top'} 
		);
		textCircle(ctx, $("#" + this.table.id).attr('insurancepays'),document.documentElement.clientWidth/2,offscreen,styler.tableradius+4,Math.PI/3,
				{ font: styler.odds_font, align:'right',textBaseline:'top'} 
		);				
		
		var soft17 = $("#" + this.table.id).attr('soft17') + "s soft 17";		
		var dealername = $("#" + this.table.id).find(".seat:first").find('.player .name').html();
		
		ctx.font = styler.soft17_font;
		var sr = ctx.measureText(soft17+'-').width/styler.tableradius;
		
		textCircle(ctx,dealername,document.documentElement.clientWidth/2,offscreen,styler.tableradius,Math.PI/3+sr,
				{font:styler.soft17_font, align:'right',textBaseline:'bottom', color:'white'}
		);		
		textCircle(ctx,soft17,document.documentElement.clientWidth/2,offscreen,styler.tableradius,Math.PI/3,
				{font:styler.soft17_font, align:'right',textBaseline:'bottom', color:'white'}
		);		
		
		textCircle(ctx, "BJ Pays " + $("#" + this.table.id).attr('blackjackpays'),
				document.documentElement.clientWidth/2 + (styler.tableradius+styler.flowerarc-50) * Math.cos(Math.PI*.583),
				offscreen + (styler.tableradius+styler.flowerarc-50) * Math.sin(Math.PI*.583),
				80,Math.PI*.583,
				{font: styler.odds_font, align:'center', color:'gold'},false
		);		
		textCircle(ctx, $("#" + this.table.id).attr('splitlimit') + " Splits",
				document.documentElement.clientWidth/2 + (styler.tableradius+styler.flowerarc-20) * Math.cos(Math.PI*.583),
				offscreen + (styler.tableradius+styler.flowerarc-20) * Math.sin(Math.PI*.583),			
				30,Math.PI*.583+Math.PI,
				{font: styler.odds_font, align:'center', color:'gold'},true
		);		
		textCircle(ctx, $("#" + this.table.id).attr('decks') + " decks",
				document.documentElement.clientWidth/2 + (styler.tableradius+styler.flowerarc) * Math.cos(Math.PI/2),
				offscreen + (styler.tableradius+styler.flowerarc) * Math.sin(Math.PI/2),				
				45, -Math.PI/2,
				{font: styler.odds_font, align:'center', color:'gold'},true
		);
		var doubleon = $("#" + this.table.id).attr('doubleon') ? $("#" + this.table.id).attr('doubleon') : 'Any 2';
		textCircle(ctx, "Double " + doubleon,
				document.documentElement.clientWidth/2 + (styler.tableradius+styler.flowerarc-60) * Math.cos(Math.PI*.416),
				offscreen + (styler.tableradius+styler.flowerarc-60) * Math.sin(Math.PI*.416),
				90,Math.PI*.416,{font: styler.odds_font, align:'center', color:'gold'},false);
				
		
	  	ctx.save();
	  	ctx.translate(document.documentElement.clientWidth,0);	  	
	  	ctx.rotate(Math.PI/4);
	  	ctx.drawImage( $('#burner')[0], -styler.cardwidth/2, -styler.cardwidth*1.4/2, styler.cardwidth, styler.cardwidth * 1.4);
	  	ctx.restore();
	  	
	  	
	  	ctx.beginPath();
	  	ctx.moveTo(document.documentElement.clientWidth-styler.cardwidth*2/3,0);	  	
	  	ctx.lineTo(document.documentElement.clientWidth,styler.cardwidth*2/3);
	  	ctx.lineTo(document.documentElement.clientWidth,0);
	  	ctx.closePath();
	  	ctx.strokeStyle = 'black';
	  	ctx.stroke();
	  	ctx.fillStyle = 'rgba(190,0,0,.75)';
	  	ctx.fill();	  	
	}	
	return table_blackjack_ui;
});	


//ctx.save();
//ctx.beginPath();
//ctx.translate(document.documentElement.clientWidth/2,offscreen);
//console.log(ctx);
//ctx.rotate(Math.PI/2);




//ctx.font = styler.dealer_font;
//ctx.textBaseline = 'hanging';
//ctx.align = 'right';
//ctx.fillStyle = 'gold';
//ctx.font = styler.dealer_font;
//ctx.fillText(dealername,document.documentElement.clientWidth/2 + Math.cos(Math.PI/3) * styler.tableradius - ctx.measureText(dealername).width,styler.offset);

//ctx.closePath();
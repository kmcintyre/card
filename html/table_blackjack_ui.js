define(["jquery", "table_ui", "card"], function($, table_ui, card) {

	function css3transform(transform) {
		return { '-webkit-transform': transform, '-moz-transform': transform, '-o-transform': transform, '-ms-transform': transform, 'transform': transform };
	}	
	function getimgstyle(cs) {
		if ( !styleobject['style' + cs] ) {
			styleobject['style' + cs] = [Math.floor((Math.random()*styleobject.spinset)) - 10, Math.floor((Math.random()*styleobject.offset)), Math.floor((Math.random()*styleobject.offset))];
		}
		return css3transform('rotate(' + styleobject['style' + cs][0] + 'deg) translate(' + styleobject['style' + cs][1] + 'px,' + styleobject['style' + cs][2] + 'px)'); 
	}
	
	function table_blackjack_ui(table, container_id, canvas_id) {
		table_ui.call(this, table, container_id, canvas_id);
	}
	
	table_blackjack_ui.prototype = new table_ui();
	table_blackjack_ui.prototype.constructor=table_blackjack_ui;	

	table_blackjack_ui.prototype.ruler = function(resize) {
		table_ui.prototype.ruler.call(this,resize);
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
		
	table_blackjack_ui.prototype.re = function() {
		table_ui.prototype.re.call(this);
		this.rules();
		
		var seats = $("#" + this.table.id + " > .seat").not(":first").length;
		var players = $("#" + this.table.id + " > .seat").not(":first").find(".player").length;
		
		//console.log('non dealear seats:' + seats + ' non dealer players:' + players);		
		
		$("#" + this.table.id).css({"overflow":"hidden", "height": "100%", "width": "100%"});
		var chairwidth = document.documentElement.clientWidth / seats - 1;
				
		$("#" + this.table.id).find(".seat").each(function(s) {			
			if ( s == 0 ) {
				$(this).css({"width": "100%", "top": styleobject.topset});
			} else {
				$(this).css({"left": document.documentElement.clientWidth - chairwidth * s + chairwidth / 2});
				$(this).css({"bottom": styleobject.bottomset});  
			}			
			
			$(this).children('.payout').each(function () {
				$(this).css({"left":-$(this).width()/2, "bottom": document.documentElement.clientHeight/2-$(this).height()/2}).not( $(this).children('.chip') ).append(
					$('.yellowchip:first').clone().css(
							{"z-index":-1, "position": "absolute", "left": -$(".yellowchip:first").width()/2+$(this).width()/2, "bottom": -$(".yellowchip:first").height()/2+$(this).height()/2 }
						).show()
				);
			});
			$(this).children('.bet').each(function () {
				$(this).css({"left":-$(this).width()/2, "bottom": document.documentElement.clientHeight/2-$(this).height()/2}).not( $(this).children('.chip') ).append(				
					$('.bluechip:first').clone().css(
							{"z-index":-1, "position": "absolute", "left": -$(".bluechip:first").width()/2+$(this).width()/2, "bottom": -$(".bluechip:first").height()/2+$(this).height()/2 }
					).show()											
				);
			});			
			$(this).children('.ante').each(function () {
				$(this).css({"left":-$(this).width()/2, "bottom": document.documentElement.clientHeight/2-$(this).height()/2}).not( $(this).children('.chip') ).append(				
					$('.whitechip:first').clone().css(
							{"z-index":-1, "position": "absolute", "left": +$(".whitechip:first").width()/2+$(this).width()/2, "bottom": -$(".whitechip:first").height()/2+$(this).height()/2 }
					).show()											
				);
			});			
						
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
						$(this).not( s != 0 ).css({"bottom": ($(this).height() + styleobject.buttonset) * b});
						//if ( s == 0 ) {
						//$(this).css(
						//		function() {
						//			var t_or_b = "bottom";
						//			
						//				return { "top": ($(this).height() + syleobject.buttonset) * b}
						//				 
						//			} else { 
						//				return {"bottom": ($(this).height() + syleobject.buttonset) * b}
						//			}
						//		}
						//);
						//if ( s == 0 ) { $(this).css({
						//	"top":  ($(this).height() + syleobject.buttonset) * b}); } else { $(this).css({"bottom": $("#burner").height()});}
					});					
				});
					//var maxbuttonwidth = 0;
					//var	buttonheight = 0
					//
					
						
					//} else {
					//	$(this).css({"bottom": 
					//		2 * styleobject.offset +
					//		$("#burner").height() + 							
					//		buttonheight +
					//		$(this).siblings(".card:gt(1)").length * $("#burner").height() / 5 
					//	});
					//}
				//})
					
				$(this).children(".bet").each(function() {
					$(this).css({"left":-$(this).width()/2, "bottom": document.documentElement.clientHeight/2-$(this).height()/2});
					$(this).append( $('.bluechip').clone().css({"z-index" : -1, "position": "absolute", "left": -$(".bluechip").width()/2+$(this).width()/2, "bottom": -$(".bluechip").height()/2+$(this).height()/2 }).show());
				});
				
				$(this).children(".double").each(function() {
					$(this).css({"left":-$(this).width()/2, "bottom":$('#burner').height()});
					$(this).append( $('.bluechip').clone().css({"z-index": "-1", "position": "absolute", "left": -$(".bluechip").width()/2+$(this).width()/2, "bottom" : -$('.bluechip').height()/2 + $(this).height()/2}).show() );
				});

				$(this).children(".insurance").each(function() {
					$(this).css({"left":-$(this).width()/2, "bottom":$('#burner').height() + $('.greenchip').height() + styleobject.offset});
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
							$(this).siblings(".bet,.payout").length * $(".bluechip").height() / 2 + styleobject.offset 
					);
					$(this).css("left",$(".bluechip").width()/2);
				});
				
				$(this).find(".card").each( function(c) {
					$(this).css("z-index", c );					
					if ( s == 0 ) {
						$(this).css("top", styleobject.topset );
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
							$(this).css("bottom", c * $("#burner").height() / 5 + styleobject.offset );
							$(this).css("left", -$("#burner").width() / 2 );
						} else if ( c == 1 ) {
							$(this).css("left", -$("#burner").width() * 3 / 4 );
							$(this).css("bottom",styleobject.offset);
						} else {
							$(this).css("left", -$("#burner").width() / 4 );
							$(this).css("bottom",styleobject.offset);
						}
					}
				});
			});

			$(this).children('.options').each(function() {
				if ( s == 0 ) {
					$(this).css({"left" : "50%", "margin-left" : -$(this).children('button:first').outerWidth()/2 });
				} else {
					$(this).css({"margin-left" : -$(this).children('button:first').outerWidth()/2 });
					
					$(this).find('button[value="stand"]').each(function() {
						if ( $(this).parent().siblings('.hand,.bet,.payout').length > 0 ) {
							$(this).hide();
						} else {
							$(this).css({'bottom':0, 'left': -$(this).width()-$(this).closest('.seat').find('.player .chips').outerWidth()/2 });
						}
												
					}); 					
					$(this).find('button[value="collect"]').css({'bottom':0,"left":$('.bluechip').width()/2});
					
					$(this).find('button[value="rebuy"]').hide();
					
					$(document).unbind('keydown dragover');		
					$(window).unbind('mousewheel DOMMouseScroll');
					
					switch(														
						$(this).children('button[value="bet"]').not( $(this).bind('amount') ).unbind('amount').on('amount', function() {
							
							/*
							var ctx = $(this).closest('.table').parent().siblings('canvas')[0].getContext('2d');
							var id = ctx.getImageData(0,0,document.documentElement.clientWidth,document.documentElement.clientHeight);
							for (var i=0; i<id.data.length; i+=4) {
								var r = id.data[i];
								var g = id.data[i+1];
								var b = id.data[i+2];
								var v = 0.2126*r + 0.7152*g + 0.0722*b;
								id.data[i] = id.data[i+1] = id.data[i+2] = v;
							}
							ctx.putImageData(id,0,0);
							*/
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
							
							//css3transform('translate(-50%,50%) rotate(-90deg) translateX(100%) scale(1.5)');//rotate(-90deg)							
							
							slide['width'] = document.documentElement.clientHeight / 3;
							slide['bottom'] = 0;
							slide['left'] = 0;
							sliderjq.css(slide);
							//$(this).parent().prepend(sliderjq);
							console.log( $(this).closest('.seat').children('.bet').text() );
							sliderjq.val(parseFloat($(this).closest('.seat').children('.bet').text()));
							sliderjq.triggerHandler('change');
						}).length					
					) {
					case 0:
					  console.log('no bets can be made');
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
		//$("#" + this.table.id).find('.seat:first .player').hide();
		
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
				}				
			}			
		}		
		this.ruler();
		this.canvas();
	}
	
	table_blackjack_ui.prototype.canvas = function() {
		table_ui.prototype.canvas.call(this);
	 	console.log(styler);
	}
	
	return table_blackjack_ui;
});	


/*
 							var image_data = ctx.getImageData(0,0,document.documentElement.clientWidth,document.documentElement.clientHeight);
							var matrix = [1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9];							
							var side = Math.round(Math.sqrt(matrix.length));						    
							var output = ctx.createImageData(image_data.width, image_data.height);
							var halfSide = Math.floor(side/2);							
							var alphaFac = 0;//opaque ? 1 : 0;


for (var y=0; y<image_data.height; y++) {
for (var x=0; x<image_data.width; x++) {
  var dstOff = (y*image_data.width+x)*4;
  var r=0, g=0, b=0, a=0;
  for (var cy=0; cy<side; cy++) {
    for (var cx=0; cx<side; cx++) {
      var scy = y + cy - halfSide;
      var scx = x + cx - halfSide;
      if (scy >= 0 && scy < image_data.height && scx >= 0 && scx < image_data.width) {
        var srcOff = (scy*image_data.width+scx)*4;
        var wt = matrix[cy*side+cx];
        r += image_data.data[srcOff] * wt;
        g += image_data.data[srcOff+1] * wt;
        b += image_data.data[srcOff+2] * wt;
        a += image_data.data[srcOff+3] * wt;
      }
    }
  }
  output.data[dstOff] = r;
  output.data[dstOff+1] = g;
  output.data[dstOff+2] = b;
  output.data[dstOff+3] = a + alphaFac*(255-a);
}
}
ctx.putImageData(output,0,0);
*/



/*
table_ui.prototype.bgtable = function() {
	
  	var felt_radius = Math.max(document.documentElement.clientWidth, document.documentElement.clientHeight)/2;
	var offscreen = -felt_radius*4/5;
	document.getElementById(this.canvas_id).width  = document.documentElement.clientWidth;
	document.getElementById(this.canvas_id).height = document.documentElement.clientHeight + 1;
	var ctx = document.getElementById(this.canvas_id).getContext('2d');
	ctx.clearRect(0,0,document.documentElement.clientWidth,document.documentElement.clientHeight+1);
			
		var grd = ctx.createRadialGradient(
  			document.documentElement.clientWidth/2, 
  			felt_radius/5, 
  			Math.max(document.documentElement.clientHeight,document.documentElement.clientWidth)/2,
  			
  			document.documentElement.clientWidth/2, 
  			-document.documentElement.clientHeight/3, 
  			Math.min(document.documentElement.clientHeight,document.documentElement.clientWidth)
  			); 
  	grd.addColorStop(1, '#005700');
  	grd.addColorStop(0, '#002400');

  	ctx.fillStyle = grd;
  	ctx.fillRect(-50,-50,document.documentElement.clientWidth+100,document.documentElement.clientHeight+100);
  			
	ctx.lineWidth = 3;
	
	ctx.beginPath();
	ctx.arc(ctx.canvas.width/2,offscreen,felt_radius,Math.PI/3,Math.PI*2/3);
	ctx.arc(ctx.canvas.width/2,offscreen,felt_radius+25,Math.PI*2/3,Math.PI/3,true);
	ctx.closePath();
	
	ctx.strokeStyle = 'gold';
	ctx.stroke();
	ctx.fillStyle = '#57854e';
	ctx.fill();
	
	function textCircle(text,x,y,radius,ang,pos,clockwise){
		   if ( !text ) text = 'undef';
		   ctx.save();
		   ctx.textAlign = (pos.textAlign?pos.textAlign:"left");
		   ctx.textBaseline = (pos.textBaseline?pos.textBaseline:'middle');
		   ctx.font = ( pos.font ? pos.font : base_font ); 
		   ctx.fillStyle = (pos.color?pos.color:'white');			   			   			   
		   ctx.translate(x,y);
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
		   ctx.save();
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
		   ctx.restore();
	}
	
	textCircle("Insurance Pays",ctx.canvas.width/2,offscreen,felt_radius,Math.PI/2,
			{font:insurance_font, align:'center',textBaseline:'top', color:'black'}
	);
	
	textCircle($("#" + this.table.id).attr('insurancepays'),ctx.canvas.width/2,offscreen,felt_radius+4,Math.PI*2/3,
			{font: odds_font, align:'left',textBaseline:'hanging'} 
	);
	textCircle($("#" + this.table.id).attr('insurancepays'),ctx.canvas.width/2,offscreen,felt_radius+4,Math.PI/3,
			{ font: odds_font, align:'right',textBaseline:'hanging'} 
	);
	
	
	var soft17 = $("#" + this.table.id).find(".seat:first").find('.player .name').html() + ' ' + $("#" + this.table.id).attr('soft17') + "s soft 17";
	
	textCircle(soft17,ctx.canvas.width/2,offscreen,felt_radius,Math.PI/3,
			{font: dealer_font, align:'right',textBaseline:'bottom', color:'white'}
	);
	
	console.log(ctx.canvas.width/2 + felt_radius * Math.cos(Math.PI*2/3));
	textCircle("BJ Pays " + $("#" + this.table.id).attr('blackjackpays'),
			ctx.canvas.width/2 + (felt_radius+arc_width-50) * Math.cos(Math.PI*.583),
			offscreen + (felt_radius+arc_width-50) * Math.sin(Math.PI*.583),90,
			Math.PI*.583,
			{font: odds_font, align:'center', color:'gold'},false
	);
	
	textCircle($("#" + this.table.id).attr('splitlimit') + " Splits",
			ctx.canvas.width/2 + (felt_radius+arc_width) * Math.cos(Math.PI*.583),
			offscreen + (felt_radius+arc_width) * Math.sin(Math.PI*.583),50,
			Math.PI*.583+Math.PI,
			{font: odds_font, align:'center', color:'gold'},true
	);
	
	textCircle($("#" + this.table.id).attr('decks') + " decks",
			ctx.canvas.width/2 + (felt_radius+arc_width) * Math.cos(Math.PI/2),
			offscreen + (felt_radius+arc_width) * Math.sin(Math.PI/2),50,
			-Math.PI/2,
			{font: odds_font, align:'center', color:'gold'},true
	);		
}
*/


//rgba(212,175,55,.66)
/*
$("#" + this.table.id).attr('blackjackpays');
var meme = Math.PI/3/7;		
ctx.beginPath();
for (var rays = 1; rays < 8; rays++) {
	ctx.strokeStyle = 'rgba(0,36,0,.66)';
	ctx.save();
	var ray_angle = Math.PI/3 + meme * rays - meme / 2;
	ctx.translate(ctx.canvas.widtbaseh/2+(felt_radius+$('.bluechip').width())*Math.cos(ray_angle),offscreen+(felt_radius+$('.bluechip').width())*Math.sin(ray_angle));
	ctx.beginPath();
	ctx.arc(0,0,10,0,Math.PI*2);
	ctx.closePath();
	ctx.stroke();			
	var bet_grd=ctx.createRadialGradient(
			-$('.bluechip').width()/4 * Math.cos(ray_angle), 
			-$('.bluechip').width()/4 * Math.sin(ray_angle),
			$('.bluechip').width()/8,
			$('.bluechip').width()/2 * Math.cos(ray_angle), 
			$('.bluechip').width()/2 * Math.sin(ray_angle),
			$('.bluechip').width()/4
			);			
	bet_grd.addColorStop(0, 'gold');   
	bet_grd.addColorStop(.75, 'silver');			
	
    ctx.fillStyle = bet_grd;
	ctx.fill();
	ctx.restore();
}
*/


/*
$("#" + this.table.id).find('button').unbind('click').click(function(event) 
});
*/

//if ( $('#' + this.table.id).attr('forless').length == 0 ) {
//	console.log('need to remove options to broke players:' + i);
//};

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

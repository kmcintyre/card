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
			$("#burner").width("75px");
			$(".card").width("75px");
		} else if ( document.documentElement.clientWidth < 1200 ) {
			$("#burner").width("125px");
			$(".card").width("125px");
		} else {			
			$("#burner").width("175px");			
			$(".card").width("175px");
		}
		
		$("#chip").width( $("#burner").width() * 3 / 4 );
		//$("#" + this.table.id).find('.seat .options button[value="stand"],button[value="buy-in"]').each(function() { $(this).css({"left": $(this).parent().siblings(".player").children(".name").outerWidth() / 2});});//.hide();
		//$("#" + this.table.id).find('.seat .options button[value="bet"],button[value="collect"]').each(function (){ $(this).css({"left": -$(this).outerWidth() / 2, "bottom": 0} ); });
		$("#" + this.table.id).find('.seat .options button[value="stand"],button[value="buy-in"]').hide();
	}
	
	table_ui.prototype.hands = function(obj, append_to) {
		for (var x = 0;; x++) {			
			if ( obj['hand' + x] ) {
				var handjq = $('<div class="hand"></div>');
				for (var y = 0; y < obj['hand' + x].cards.length; y++) {
					var c = new _card();
					c.card = obj['hand' + x].cards[y].card;
					c.suite = obj['hand' + x].cards[y].suite;
					handjq.append(c.toImg());
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
			if ( append_to.children(".options").children('button').length == 0 ) {
				append_to.children(".options").remove();
			}
		} else {
			append_to.children(".options").remove();
		}
	}	
	
	function rotatecss(rot, trans) {
		ang = 'rotate(' + rot + 'deg) scale(1.75)';
		return { '-webkit-transform-origin':trans, '-webkit-transform': ang, '-moz-transform-origin':trans, '-moz-transform': ang, '-o-transform-origin':trans, '-o-transform': ang, '-ms-transform-origin':trans, '-ms-transform': ang, 'transform-origin':trans, 'transform': ang };
	}
	
	table_ui.prototype.bets = function() {

		$("#" + this.table.id + ' .seat .options button[value="collect"]').each( function() { $(this).css({"bottom":$("#chip").height(),"left":-$("#chip").width()/2 }) }).remove('~ button[value="bet"]').closest(".seat").children(".payout").each(function() {
			//$(this).css({"left": $(this).closest(".seat").outerWidth() / 2 - $("#chip").width()/2, "bottom": 0});
			//$('#chip').clone().css({"cursor": "move", "position": "absolute", "left": 0, "bottom":$(this).height()}).bind({
			//	dragend : function(e) { console.log('dragend');},
			//	dragstart : function(e) { console.log('dragstart');},
			//	drag : function(e) {console.log('drag');},
			//	touchstart : function(e) {$(document).find(".seat:first .player .name").html('touchstart');},
			//	touchend : function(e) {$(document).find(".seat:first .player .name").html('touchend');},
			//	touchmove : function(e) {$(document).find(".seat:first .player .name").html('touchmove');},
			//	
			//}).attr('dragable', true).show().prependTo($(this));
			//$(this).find("~ .player .chips").css("top" , $("#burner").height() * 2 );
		});
		
		$("#" + this.table.id + ' .seat .options button[value="bet"]').each(function() {			
			
			//$(this).css({ "bottom": $("#burner").height() * 2, "right":-$(this).width()/2+10});					
			
			var denom = parseInt($(this).closest('.table').attr('denomination'));
			var min = parseInt($(this).closest('.table').attr('minimum'));
			var sliderjq = $('<input type="range">');
			sliderjq.attr({
				'min': min,				 
				'value': min,
				'step': denom
			});
			
			
			
			sliderjq.attr('max', parseInt($(this).closest('.seat').find('.player .chips').html()) );
			$(this).closest(".seat").children(".bet").each(function () {
				//$(this).css({"left": $(this).closest(".seat").width() / 2 - $("#chip").width() / 2, "bottom" : 0});
				sliderjq.attr({'value': parseInt($(this).html()), 'min': 0, 'max' : parseInt(sliderjq.attr('max')) + parseInt($(this).html()) });				
				//$('#chip').clone().css({"position": "absolute", "left": 0, "bottom": $(this).height() }).show().prependTo($(this));				
			});
			
			sliderjq.val(sliderjq.attr('value'));
			
			$(this).css({"left": sliderjq.height() * 2 + $(this).width(), "bottom" : sliderjq.attr('value')/sliderjq.attr('max') * 1.75 * $('#burner').height() + $("#chip").width()/2});
			
			function sliderchipbet(delta) {
				var diff = parseInt(sliderjq.attr('value')) + delta;
				if ( diff >= sliderjq.attr('min') && diff <= sliderjq.attr('max') ) {
					console.log('slider value2:' + diff);
					sliderjq.attr('value', diff);
					sliderjq.val(diff);
					sliderjq.siblings('button[value="bet"]').css("bottom", sliderjq.attr('value')/sliderjq.attr('max') * 1.75 * $('#burner').height() + $("#chip").width()/2);
					if ( diff < min ) {
						sliderjq.siblings('button[value="bet"]').text('cancel');
					} else if ( diff == sliderjq.attr('min') ) {
						sliderjq.siblings('button[value="bet"]').text('min ' + diff);
					} else if ( diff == sliderjq.attr('max') ) {
						sliderjq.siblings('button[value="bet"]').text('max ' + diff);
					} else {
						sliderjq.siblings('button[value="bet"]').text('bet ' + diff);
					}
					//chipbetjq.css({"bottom": diff/sliderjq.attr('max') * $('#burner').height() + buttonheight+10 });
				}
			}
			sliderjq.on('input', function(){sliderjq.attr('value', sliderjq.val()); sliderchipbet(0);});
			$(window).bind('mousewheel DOMMouseScroll', function(e) {
				sliderchipbet(Math.max(-1, Math.min(1, (e.originalEvent.wheelDelta || -e.originalEvent.detail))));
            });
			$(document).bind('keydown' ,function(e) {
				console.log(e.keyCode)
                switch (e.keyCode) {
                	case 38: sliderchipbet(1); break;
                	case 40: sliderchipbet(-1); break;
                }
			});			
			
			var slide = rotatecss("-90", "left center");
			slide['width'] = $('#burner').height();
			slide['bottom'] = $('#chip').height() / 2;
			slide['left'] = $('#chip').height() / 2;
			sliderjq.css(slide);
			$(this).parent().append(sliderjq);
			sliderchipbet(0);
		});		

		$("#" + this.table.id + ' .seat').children('.bet,.payout').each(function () {
			$(this).css({"left": $(this).closest(".seat").outerWidth()/2-$(this).width()/2, "bottom" : $("#chip").height()/2-$(this).height()/2});				
			$('#chip').clone().css({"z-index":-1, "position": "absolute", "left": -$("#chip").width()/2+$(this).width()/2, "bottom": -$("#chip").height()/2+$(this).height()/2 }).show().prependTo($(this));				
		});
		
		$("#" + this.table.id + ' .seat .options button[value="bet3"]').each(function (i) {
			console.log("bet or collect button:" + i + ' ' + $(this).val());
						
			var slide = rotatecss("90", "0% 0%"); 
			slide['width'] = $('#burner').height();
			slide['left'] = 0;				
			slide['bottom'] = $(this).outerHeight();
			
			var denom = parseInt($(this).closest('.table').attr('denomination'));
			var v = ($(this).closest('.seat').children('.bet,.payout').html() ? parseInt($(this).closest('.seat').children('.bet,.payout').html()) : $(this).closest('.table').attr('minimum'));
			var sliderjq = $('<input type="range">');
			sliderjq.attr({
				'min': $(this).closest('.seat').children('.bet,.payout').html() ? 0 : $(this).closest('.table').attr('minimum'),				 
				'step': denom
			});	
			sliderjq.attr('value', v);
			if ( $(this).val() == 'bet' ) {
				
				if ( $(this).closest('.table').attr('maximum') && $(this).closest('.table').attr('maximum') < sliderjq.attr('max') ) {
					sliderjq.attr('max', $(this).closest('.table').attr('maximum') );
				}				
			} else if ( $(this).val() == 'collect' ) {
				sliderjq.attr('max', sliderjq.attr('value') ) ;				
			}
			
			sliderjq.val( sliderjq.attr('value') );
			
			//need to adjust for table max
			sliderjq.css(slide);
			var buttonheight = $(this).height();			
			var clipslide = {};			
			clipslide['cursor'] = 'move';
			clipslide['position'] = 'absolute';
			clipslide['left'] = ($(this).val() == 'bet'?-$('#chip').width()-10:10);
			clipslide['bottom'] = sliderjq.attr('value')/sliderjq.attr('max') * $('#burner').height() + buttonheight+10;		
			var chipbetjq = $('#chip').clone().css(clipslide).attr('draggable', true);
			
			//chipbetjq.bind('mousedown', function(e) {
			//	console.log(e);
			//	
				
			//});
			//chipbetjq.bind('mouseup', function(e2) {console.log(e2); chipbetjq.unbind('mousemove');});
			
			//chipbetjq.bind('touchstart', function(e) { 
			//	alert('yo1:' + e.changedTouches[0].clientY);
			//	chipbetjq.attr('clientY', parseInt(e.changedTouches[0].clientY));
			//	e.preventDefault();
			//});			
			
			chipbetjq.bind('touchmove', function(e) {
				alert(e);
				//chipbetjq.attr('clientY', parseInt(e.changedTouches[0].clientY));
				e.preventDefault();
			});			
			
			//chipbetjq.bind('drag', function(e) { console.log(e.originalEvent)});
			//chipbetjq.bind('touchend', function(e) { 
			//	chipbetjq.removeAttr('clientY');
			//	e.preventDefault()
			//});						
			
			var min = parseInt($(this).closest('.table').attr('minimum'));
				
			function sliderchipbet(delta) {
				var diff = parseInt(sliderjq.val()) + (delta * min);				
				if ( diff >= sliderjq.attr('min') && diff <= sliderjq.attr('max') ) {
					console.log('slider value:' + diff);
					sliderjq.attr('value', diff);
					sliderjq.val(diff); 					
					chipbetjq.css({"bottom": diff/sliderjq.attr('max') * $('#burner').height() + buttonheight+10 });
				}
				sliderjq.siblings('button[value="bet"],button[value="collect"]').text( sliderjq.siblings('button[value="bet"],button[value="collect"]').val() + ":" + sliderjq.attr('value') );
			}			
			sliderjq.on('input', function(){console.log('input!'); sliderchipbet(0);});			
			$(window).bind('mousewheel DOMMouseScroll', function(e) {
				console.log('scroll');
				sliderchipbet(Math.max(-1, Math.min(1, (e.originalEvent.wheelDelta || -e.originalEvent.detail))));
            });
			$(document).bind('keydown' ,function(e) {
                switch (e.keyCode) {
                	case 38: sliderchipbet(1); break;
                	case 40: sliderchipbet(-1); break;
                }
			});			
			//$(this).parent().prepend( chipbet.show() ).prepend(slider);
			
			$(this).parent().append(sliderjq);		
			$(this).parent().append(chipbetjq.show());
		});
	}
	
	table_ui.prototype.paint = function() {
		console.info('paint ui:' + this.table.id);
		
		try {
			
			if ( $("#" + this.table.id).length == 0 ) {
				console.info('create div');
				var tablejq = $('<div class="table" id="' + this.table.id + '"><div class="title"/><div class="_id"/></div>');
				tablejq.appendTo(this.container);
				if ( this.table['act'] ) {
					console.info('data to "table"');
					$("#" + this.table.id).data("table", this.table);
				}
			} else {
				console.info('clear seats');
				$("#" + this.table.id).find(".seat").remove();
			}
			
			$("#" + this.table.id).children(".title").attr("title",this.table.title);
			$("#" + this.table.id).children("._id").html( this.table.id );
			$("#" + this.table.id).attr("minimum" , this.table.minimum );				
			$("#" + this.table.id).attr("denomination" , this.table.denomination );
			if ( this.table.maximum ) {
				$("#" + this.table.id).attr("maximum" , this.table.maximum );
			} else {
				$("#" + this.table.id).removeAttr("maximum");
			}
						
			for (var x = 0; x < this.table.seats.length; x++) {
				//console.log(this.table.seats[x]);
				var seatjq = $('<div class="seat"></div>').attr('seat',x);
				this.hands(this.table.seats[x], seatjq);
				
				if ( typeof this.table.seats[x].bet === 'number' ) {
					seatjq.append('<div class="bet">' + this.table.seats[x].bet + '</div>');
				}
				
				if ( typeof this.table.seats[x].payout === 'number' ) {
					seatjq.append('<div class="payout">' + this.table.seats[x].payout + '</div>');
				}
								
				if ( this.table.seats[x].player ) {
					var playerjq = $('<div class="player"></div>');					
					this.options(this.table.seats[x].player, playerjq);
					if ( this.table.seats[x].player.name ) {
						playerjq.append('<div class="name">' + this.table.seats[x].player.name + '</div>');
					}
					if ( typeof this.table.seats[x].player.chips === 'number' ) {
						playerjq.append('<div class="chips">' + this.table.seats[x].player.chips + '</div>');
					}										
					seatjq.append(playerjq);
				}
				this.options(this.table.seats[x], seatjq);
				seatjq.append('<div class="chair" title="' + this.table.seats[x].chair + '"/>');
				seatjq.appendTo("#" + this.table.id);
			}			
			
			this.options(this.table, $("#" + this.table.id));
									
			$("#" + this.table.id).find('button').unbind('click').click(
					
					function(event) {
						var act = { 
							table: $(event.target).closest(".table").find("._id").html(),  
							action: $(event.target).val().replace(/ /g, ''),							 
						};
						if ( $(event.target).val() == 'bet' ) {
							act['amount'] = $(event.target).siblings('input[type="range"]').attr('value');
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
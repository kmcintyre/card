define(["jquery", "card", "deck"], function($, card, deck) {	

	/* either table or rep */
	function table_ui(table, container_id, canvas_id) {
		console.info('new table ui');
		this.table = table;
		this.container_id =  container_id;
		this.canvas_id =  canvas_id;
	}

	window.requestAnimFrame = (function(callback) {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function(callback) {
          window.setTimeout(callback, 1000 / 60);
        };
    })();	
	
	styler = {
		seating: [[0,0]],
		betregions:[['bet','south'],['ante','north'],['lock','center'],['payout','north']],
		seatregions:[['bet','south'],['ante','north'],['lock','center'],['payout','north']],
		lightgreen:'rgba(0,87,0,1)',
		darkgreen:'rgba(0,36,0,1)',
				
		tableradius: Math.max(document.documentElement.clientWidth, document.documentElement.clientHeight)/2,
		offscreen: function () {
			return -styler.tableradius*4/5;
		},
		cardwidth: 100,
		chipradius: 50,
		offset : [0,0,0,0],
		font : function(name) {
			console.log('style font:' + name);
			return "normal normal 18pt Courgette";
		}, 		
		insurancewidth: 25,
		flowerarc: 25, 
		helpradius: 15,
		betradius: 25,
		scale: 1,
	};
	
	table_ui.prototype.context = function() {
		if ( this.container_id && this.canvas_id ) {
			if ( $(this.canvas_id).length == 0 ) { 
				console.info('create canvas:' + this.canvas_id.substring(1) + ' ' + document.documentElement.clientWidth + ' x ' + (document.documentElement.clientHeight + 1) );
				$('<canvas width="' + document.documentElement.clientWidth + '" height="' + (document.documentElement.clientHeight + 1) + '" id="' + this.canvas_id.substring(1) + '"></canvas>').appendTo($(this.container_id));								
			}
			return document.getElementById(this.canvas_id.substring(1)).getContext('2d');
		} else {
			throw 'Bad Container or Canvas';
		}
	}
	
	table_ui.prototype.measure = function() {		
		console.info('measure seats:' + this.table.seats.length);
		//console.log('seats:' + $("#" + this.table.id).children('.seat').length + ' players:' + $("#" + this.table.id).children('.seat').children('.player').length +' bets:' + $("#" + this.table.id).find(".seat .bet").length );
		styler.tableradius = Math.max(document.documentElement.clientWidth, document.documentElement.clientHeight)/2;
		styler.cardwidth = Math.min(160,Math.max(60,parseInt(document.documentElement.clientWidth * document.documentElement.clientHeight / 52 / 52 / 2.4 )));
		styler.chipradius = styler.cardwidth * .44;
		console.log(styler.tableradius + ' radius card width:' + styler.cardwidth + ' chip radius:' + styler.chipradius);
		if ( styler.cardwidth > 100 ) {
			$(document.body).css('overflow','scroll');
		} else {
			$(document.body).css('overflow',null);
		}		
		if ( this.context().canvas.width != document.documentElement.clientWidth || this.context().canvas.height != document.documentElement.clientHeight + 1 ) {
			console.log('resize: ' + document.documentElement.clientWidth + ' x ' + (document.documentElement.clientHeight + 1));
			this.context().canvas.width = document.documentElement.clientWidth;
			this.context().canvas.height = document.documentElement.clientHeight + 1;
		}		
		console.log($('head link[href*="fonts"]'));
		if ( $('head').children('link[href*="fonts"]').length == 0 ) {
			this.felt();
			this.context().save();
			this.context().translate(document.documentElement.clientWidth/2, document.documentElement.clientHeight/2);
			this.context().textAlign='center';
			this.context().font=styler.font('base');
			this.context().fillStyle='white';			
			this.context().fillText('Start', 0,0);
			this.context().restore();
			$('head link[rel="stylesheet"]').last().after('<link rel="stylesheet" href="http://fonts.googleapis.com/css?family=Courgette" type="text/css">');
			throw "No Font";
		}		
		if ( $(this.container_id).children(".card").length == 0 ) {						
			this.context().save();
			var loaded = 0;
			var self = this;
			function completed() {
				console.log('called complete');
				for (var c2 = 0; c2 < 52; c2++) {
					var loadedcard = new card(c2);					
					self.context().rotate(Math.PI/52);										
					var raw = $('#' + loadedcard.underscore());
					self.context().drawImage(
							raw[0],
							-styler.cardwidth/2,
							Math.min(document.documentElement.clientWidth,document.documentElement.clientHeight)/2-styler.cardwidth*1.4,styler.cardwidth,styler.cardwidth*1.4);
				}
				setTimeout(function () {
						if ( $(self.container_id).children(".chips").length == 0 ) {
							console.log('load chips');
						} else {
							console.log('got chips');
						}
					}, 
					250
				);
				throw "No Cards";
			}
			for (var c = 0; c < 52; c++) {				 				 
				$('<img class="card" id="' + new card(c).underscore() + '" src="'+ new card(c).toSrc() +'">').css('display','none').load(function() {
					loaded++;
					self.context().save();
					self.felt();
					self.context().translate(document.documentElement.clientWidth/2, document.documentElement.clientHeight/2);
					self.context().textAlign='center';
					self.context().font=styler.font('base');
					self.context().fillStyle='white';
					var per = 'Loading Deck ' + parseInt(loaded/52*100) + "%";
					self.context().fillText(per,0,0);					
					if ( loaded == 52 ) {
						self.context().rotate(-Math.PI*3/2);
						completed();
					} else {
						self.context().restore();
					}										
				}).appendTo(this.container_id);
			}
		}		
		$(this.container_id).children(".card").css({width:styler.cardwidth * styler.scale}); 
		$(this.container_id).children(".chip").css({width:styler.cardwidth * styler.scale * .54});		
	}
	
	table_ui.prototype.felt = function() {
		var grd = this.context().createRadialGradient(
	  			document.documentElement.clientWidth/2, 
	  			styler.tableradius,	  		
	  			Math.max(document.documentElement.clientHeight,document.documentElement.clientWidth)/2,	  			
	  			document.documentElement.clientWidth/2,	  			
	  			-document.documentElement.clientHeight/2, 
	  			Math.max(document.documentElement.clientHeight,document.documentElement.clientWidth)/2
	  			);
		grd.addColorStop(0, styler.darkgreen);
	  	grd.addColorStop(1, styler.lightgreen);		  	
	  	this.context().fillStyle = grd;
	  	this.context().fillRect(0,0,this.context().canvas.width,this.context().canvas.height);
	  	this.context().fill();		
	}

	table_ui.prototype.canvas = function() { 
	  	if ( $("#" + this.table.id + ' .options button').each(function(i) {
	  		$(this).hide();
	  	}).length > 0 ) {
	  		this.context().save();
	  		this.context().translate(styler.sideset+styler.helpradius/2+1,styler.helpradius/2+styler.topset+1);	  		
	  		this.context().beginPath();
	  		this.context().arc(0,0,styler.helpradius,0,2*Math.PI);
	  		this.context().strokeStyle = 'black';
	  		this.context().stroke();
	  		this.context().fillStyle = 'white';
	  		this.context().fill();
	  		this.context().closePath();
	  		this.context().beginPath();
	  		this.context().strokeStyle = 'black';
	  		this.context().font = styler.font('base');
	  		this.context().textAlign = "center";
	  		this.context().strokeText('?',0,this.context().measureText('?').width/2);
	  		this.context().fillStyle = 'red';
	  		this.context().fillText('?',0,this.context().measureText('?').width/2);	  			  		
	  		this.context().closePath();
	  		this.context().restore();
	  	};	  	
	} 
	
	table_ui.prototype.cards_and_chips = function() {
		$("#" + this.table.id).find(".card").css({width:styler.cardwidth * styler.scale}); 
		$("#" + this.table.id).find(".chip").css({width:styler.cardwidth * styler.scale/2});
	}

	//button pull-up
	table_ui.prototype.rules = function() {
		$('#' + this.table.id).find('.seat:not(:has(.player)) .options button').each(function () {			
			$(this).closest('.table').children('.options:not(:has(button[value="' + $(this).val() + '"]))').append($(this).remove());			
		});
	}	

	table_ui.prototype.wire = function() {
		console.log('table ui wire - need to turn on or off configuration hotspots');
		$("#" + this.table.id).children('.options').css('bottom',0);
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
		return append_to.children('button');
	}
	
	table_ui.prototype.paint = function() {
			console.info('paint ui:' + this.table.id);
			if ( $("#" + this.table.id).length == 0 ) {
				console.info('create table');
				var tablejq = $('<div class="table" id="' + this.table.id + '"><div class="title"/><div class="_id"/></div>');
				tablejq.appendTo($(this.container_id));				
				if ( this.table['act'] ) {
					console.info('data to "table"');
					$("#" + this.table.id).data("table", this.table);					
				}
			} 			
			$("#" + this.table.id).children(".title").attr("title",this.table.title);
			$("#" + this.table.id).children("._id").html( this.table.id );
			$("#" + this.table.id).attr("minimum" , this.table.minimum );				
			$("#" + this.table.id).attr("ante" , this.table.ante );
			$("#" + this.table.id).attr("denomination" , this.table.denomination );
			
			this.options(this.table, $("#" + this.table.id));
			
			for (var seat = 0; seat < this.table.seats.length; seat++) {
				if ( $("#" + this.table.id).find('.seat[seat="' + seat + '"]').length == 0 ) {		
					styler.seating[styler.seating.length] = [0,0];
					$('<div class="seat"><div class="chair" title="' + this.table.seats[seat].chair + '"/></div>').attr('seat',seat).appendTo("#" + this.table.id);
				}					
				var seatjq = $("#" + this.table.id).find('.seat[seat="' + seat + '"]');
				
				this.options(this.table.seats[seat], seatjq);
				
				for (var spot = 0; spot < styler.betregions.length;spot++) {
					if ( typeof this.table.seats[seat][styler.betregions[spot][0]] !== 'number' ) {
						seatjq.children('.'  + styler.betregions[spot][0]).remove();
					} else if ( seatjq.children('.' + [styler.betregions[spot][0]]).html(this.table.seats[seat][styler.betregions[spot][0]]).length == 0 ) {
						console.log('add:' + [styler.betregions[spot][0]] + ' ' + this.table.seats[seat][styler.betregions[spot][0]]);
						seatjq.append('<div class="'+[styler.betregions[spot][0]]+'">' + this.table.seats[seat][styler.betregions[spot][0]] + '</div>');
					}
				}

				if ( !this.table.seats[seat].player ) { seatjq.children('.player').remove(); } else {
					seatjq.not(':has(.player)').append('<div class="player"><div class="name"/><div class="chips"/></div>');
					seatjq.find('.player .name').html(this.table.seats[seat].player.name);
					seatjq.find('.player .chips').html(this.table.seats[seat].player.chips);
				}			
				
				for (var h = 0;; h++) {			
					if ( this.table.seats[seat]['hand' + h] ) {
						console.log('seat ' + seat + ' has hand:' + h);
						if ( seatjq.children('.hand:eq("' + h + '")').length == 0 ) {
							seatjq.append('<div class="hand"><div class="bet"/><div class="ant"/></div>');
						}							
						var handjq = seatjq.children('.hand:eq("' + h + '")');
						if ( this.table.seats[seat]['hand' + h].bet ) {
							handjq.children('.bet').html(this.table.seats[seat]['hand' + h].bet);	
						} else {
							handjq.children('.bet').remove();
						}						
						if ( this.table.seats[seat]['hand' + h].ante) {
							handjq.children('.ante').html(this.table.seats[seat]['hand' + h].ante);															
						} else {
							handjq.children('.ante').remove();
						}
						this.options(this.table.seats[seat]['hand' + h], handjq);
						for (var c = 0;; c++) {
							if ( this.table.seats[seat]['hand' + h].cards[c] ) {								
								var ci = new card();
								ci.card = this.table.seats[seat]['hand' + h].cards[c].card;
								ci.suite = this.table.seats[seat]['hand' + h].cards[c].suite;								
								if ( handjq.children('.card:eq("' + c + '")').length == 0 && this.table.seats[seat]['hand' + h].cards[c] ) {
									console.log('deal card');
									handjq.append(ci.toImg());
									this.dealcard(ci.toImg(),seat)
									
								} else if ( handjq.children('.card:eq("' + c + '")').attr('src') != ci.toSrc() ) {
									console.log('flip card');
									console.log('change card:' + handjq.children('.card:eq("' + c + '")').attr('src') + ' to ' + ci.toSrc() );
									handjq.children('.card:eq("' + c + '")').attr('src', ci.toSrc());
								}																						
							} else {
								break;
							}													
						}						
					} else {
						if ( seatjq.children('.hand:eq("' + h + '")').length > 0 ) {
							seatjq.children('.hand:eq("' + h + '")').remove();
						}
						break;
					}
				}
			}
			
	}
	
	table_ui.prototype.arm = function() {
		var ba = $("#" + this.table.id).find('button').not( $(this).bind('click') ).unbind('click').bind('click', function(event) {
			var act = { 
				table: $(event.target).closest(".table").find("._id").html(),  
				action: $(event.target).val().replace(/ /g, ''),							 
			};
			if ( $(event.target).val() == 'bet' ) {
				act['amount'] = parseInt( $(event.target).siblings('input[type="range"]').val() );
				if ( !act['amount'] ) {
					$(event.target).triggerHandler('amount');
					console.log('need to get amout');
					return;
				}
			}			
			if ( $(event.target).closest(".seat").attr('seat') ) {
				act['seat'] = $(event.target).closest(".seat").attr('seat');
			} else if ( $(event.target).attr('seat') ) {				
				if ( $(event.target).attr('seat').split(',').length == 1 ) {
					act['seat'] = $(event.target).attr('seat');
				} else {
					console.log('Need to choose seat');
				}
			}
			$(event.target).closest(".table").data('table').act(act);
		}).length;
		console.log('buttons armed:' + ba);		
	}	

	return table_ui;
				
});	


/*
function fakeit(step, animate) {
if ( step.action == 'insurance' && step.seat == 0 && !step['animate'] ) {			
	$("#" + bj.id + " .seat .hand .options button[value='insurance']").parent().remove();
	$("#" + bj.id + " > .seat:first .hand:first .card:eq(1)").css(rotatecss(90)).
	animate({marginTop: $("#burner").width() - $("#burner").height() }, 500).
	animate({marginTop: 0 }, 500, function() { step.animate = true; bj.act(step);});
	return;			
} else if ( step.action == 'backdoor' && step.seat == 0 && !step['animate'] ) {
	$("#" + bj.id + " .seat .hand .options button[value='backdoor']").parent().remove();
	$("#" + bj.id + " > .seat:first .hand:first .card:eq(1)").
		animate({marginTop: $("#burner").width() - $("#burner").height() }, 500).
		animate({marginTop: 0 }, 500, function() { step.animate = true; bj.act(step);});
	return;			
} else if ( step.action == 'expose' && step.seat == 0 && !step['animate'] ) {
	$("#" + bj.id + " .seat .hand .options button[value='expose']").parent().remove();
	console.log($("#" + bj.id + " > .seat:first .hand:first .card:first"));
	$("#" + bj.id + " > .seat:first .hand:first .card:first").
		animate({marginLeft: "+=" + $("#burner").width() / 2 }, 500, function () { $(this).css({'z-index': 0});} ).
		animate({marginLeft: "-=" + $("#burner").width() / 2 }, 500, function() { step.animate = true; bj.act(step);});			
	return;
}
}
*/
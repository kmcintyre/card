define(["jquery", "card"], function($, card) {
	
	styler = { 
		tableradius: Math.max(document.documentElement.clientWidth, document.documentElement.clientHeight)/2,
		cardwidth: 100,
		base_font: "normal 16px san-serif", 
		insurance_font: "normal 26px san-serif",
		odds_font: "normal 14px monospace", 
		player_font: "normal 18px monospace",
		dealer_font: "small-caps 18px monospace",		
		offset:5, spinset:20, bottomset:10, topset: 10, buttonset: 10, sideset: 10,
		arcwidth: 25,
		scale: 1
	};

	/* either table or rep */
	function table_ui(table, container_id, canvas_id) {
		console.info('new table ui');
		this.table = table;
		this.container_id =  container_id;
		this.canvas_id =  canvas_id;
	}

	table_ui.prototype.canvas = function() {		
		if ( $(this.canvas_id).length == 0 ) {
			console.info('create canvas:' + this.canvas_id.substring(1));
			var canvasjq = $('<canvas id="' + this.canvas_id.substring(1) + '"></canvas>');
			canvasjq.appendTo($(this.container_id));
		}
		var ctx = document.getElementById(this.canvas_id.substring(1)).getContext('2d');		
		ctx.canvas.width = document.documentElement.clientWidth;
		ctx.canvas.height = document.documentElement.clientHeight + 1;
		
		var ctx = document.getElementById(this.canvas_id.substring(1)).getContext('2d');
		ctx.clearRect(0,-1,document.documentElement.clientWidth,document.documentElement.clientHeight+1);
		$("#" + this.table.id + ' .options button[value="configure"]').each(function() {
			console.log('YO MONEY CREATE A GEAR');
		});	
		var grd = ctx.createRadialGradient(
	  			document.documentElement.clientWidth/2, 
	  			styler.tableradius*3/2,	  		
	  			Math.max(document.documentElement.clientHeight,document.documentElement.clientWidth)/2,	  			
	  			document.documentElement.clientWidth/2,	  			
	  			-document.documentElement.clientHeight/3, 
	  			Math.max(document.documentElement.clientHeight,document.documentElement.clientWidth)/2
	  			); 
	  	grd.addColorStop(1, 'rgba(0,87,0,1)');
	  	grd.addColorStop(0, 'rgba(0,36,0,1)');
	  	ctx.fillStyle = grd;
	  	ctx.fillRect(0,0,document.documentElement.clientWidth,document.documentElement.clientHeight+1);		
	}	
	
	table_ui.prototype.measure = function() {
		console.log(
			' seats:' + $("#" + this.table.id).children('.seat').length +
			' players:' + $("#" + this.table.id).children('.seat').children('.player').length +
			' bets:' + $("#" + this.table.id).find(".seat .bet").length			
		);
		styler.tableradius = Math.max(document.documentElement.clientWidth, document.documentElement.clientHeight)/2;
		styler.cardwidth = Math.min(150,Math.max(75,parseInt(document.documentElement.clientWidth * document.documentElement.clientHeight / 52 / 52 / 2.4 )));			
		console.log(styler.tableradius + ' radius card width:' + styler.cardwidth);
		$(this.container_id).find(".card").css({width:styler.cardwidth * styler.scale}); 
		$(this.container_id).find(".chip").css({width:styler.cardwidth * styler.scale * .54});
	}
	
	table_ui.prototype.rules = function() {
		$('#' + this.table.id).find('.seat:not(:has(.player)) > .options button').each(function () {
			$(this).clone().appendTo($(this).closest('.table').children(
				'.options:not(:has(button[value="'+$(this).val()+'"]))'
			));
		}).remove();
		$("#" + this.table.id + ' ._id').hide();
	}
	
	table_ui.prototype.wire = function() {
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
					this.options(this.table, tablejq);
				}
			} 			
			$("#" + this.table.id).children(".title").attr("title",this.table.title);
			$("#" + this.table.id).children("._id").html( this.table.id );
			$("#" + this.table.id).attr("minimum" , this.table.minimum );				
			$("#" + this.table.id).attr("ante" , this.table.ante );
			$("#" + this.table.id).attr("denomination" , this.table.denomination );
						
			for (var x = 0; x < this.table.seats.length; x++) {
				if ( $("#" + this.table.id).find('.seat[seat="' + x + '"]').length == 0 ) {					
					$('<div class="seat"><div class="chair" title="' + this.table.seats[x].chair + '"/></div>').attr('seat',x).appendTo("#" + this.table.id);
				}					
				var seatjq = $("#" + this.table.id).find('.seat[seat="' + x + '"]');
				this.options(this.table.seats[x], seatjq);
				if ( typeof this.table.seats[x].bet === 'number' ) {
					if (seatjq.children('.bet').length == 0) {
						seatjq.append('<div class="bet"/>');
					}
					seatjq.children('.bet').html(this.table.seats[x].bet);					
				} else if ( typeof this.table.seats[x].bet !== 'number' ) {
					seatjq.children('.bet').remove();
				} 
				if ( typeof this.table.seats[x].ante === 'number' ) {
					if (seatjq.children('.ante').length == 0) {
						seatjq.append('<div class="ante"/>');
					}
					seatjq.children('.ante').html(typeof this.table.seats[x].ante);					
				} else if ( typeof this.table.seats[x].bet !== 'number' ) {
					seatjq.children('.ante').remove();
				}				
				
				if ( seatjq.children('.payout').length == 0 && typeof this.table.seats[x].payout === 'number' ) {
					seatjq.append('<div class="payout">' + this.table.seats[x].payout + '</div>');
				} else if ( seatjq.children('.payout').length == 1 && typeof this.table.seats[x].payout !== 'number' ) {
					seatjq.children('.payout').remove();
				}
				
				if ( seatjq.children('.player').length == 0 && this.table.seats[x].player != null ) {
					seatjq.append('<div class="player"><div class="name">' + this.table.seats[x].player.name + '</div><div class="chips"/></div>');
					this.options(this.table.seats[x].player, seatjq.children('.player'));
				} else if ( seatjq.children('.player').length == 1 && typeof this.table.seats[x].player == null  ) {
					seatjq.children('.player').remove();
				}

				if ( this.table.seats[x].player && typeof this.table.seats[x].player.chips === 'number' ) {
					seatjq.children('.player').children('.chips').html(this.table.seats[x].player.chips);
				}
				
				for (var h = 0;; h++) {			
					if ( this.table.seats[x]['hand' + h] ) {
						console.log('seat ' + x + ' has hand:' + h);
						if ( seatjq.children('.hand:eq("' + h + '")').length == 0 ) {
							seatjq.append('<div class="hand"><div class="bet"/><div class="ant"/></div>');
						}							
						var handjq = seatjq.children('.hand:eq("' + h + '")');
						if ( this.table.seats[x]['hand' + h].bet ) {
							handjq.children('.bet').html(this.table.seats[x]['hand' + h].bet);	
						} else {
							handjq.children('.bet').remove();
						}						
						if ( this.table.seats[x]['hand' + h].ante) {
							handjq.children('.ante').html(this.table.seats[x]['hand' + h].ante);															
						} else {
							handjq.children('.ante').remove();
						}
						this.options(this.table.seats[x]['hand' + h], handjq);
						for (var c = 0;; c++) {
							if ( this.table.seats[x]['hand' + h].cards[c] ) {								
								var ci = new card();
								ci.card = this.table.seats[x]['hand' + h].cards[c].card;
								ci.suite = this.table.seats[x]['hand' + h].cards[c].suite;								
								if ( handjq.children('.card:eq("' + c + '")').length == 0 && this.table.seats[x]['hand' + h].cards[c] ) {
									handjq.append(ci.toImg());									
								} else if ( handjq.children('.card:eq("' + c + '")').attr('src') != ci.toSrc() ) {
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
			console.log('acting');
			var act = { 
				table: $(event.target).closest(".table").find("._id").html(),  
				action: $(event.target).val().replace(/ /g, ''),							 
			};
			if ( new Array('insurance', 'double','split').indexOf( $(event.target).val() ) >= 0 ) {
				console.log('FUCK YEAH');				
			} else if ( $(event.target).val() == 'bet' ) {
				act['amount'] = parseInt( $(event.target).siblings('input[type="range"]').val() );
				if ( !act['amount'] ) {
					$(event.target).triggerHandler('amount');
					console.log('need to get amout');
					return;
				}
			} 
			if ( $(event.target).closest(".seat").attr('seat') ) {
				act['seat'] = $(event.target).closest(".seat").attr('seat');
			}
			console.log(act);
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
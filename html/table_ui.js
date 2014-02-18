define(["jquery", "card"], function($, card) {
	
	styler = { 
		tableradius: Math.max(document.documentElement.clientWidth, document.documentElement.clientHeight)/2,
		cardwidth: 100,
		base_font: "normal 14pt 'Courier'", 
		insurance_font: "italic small-caps 20pt 'Arial Narrow'",
		odds_font: "normal normal 10pt monospace", 
		player_font: "normal normal 120pt 'Arial'",
		soft17_font: "normal normal 15pt 'Arial'",
		dealer_font: "normal italic 120pt 'Arial'",
		offset:5, spinset:20, bottomset:10, topset: 10, buttonset: 10, sideset: 10,
		flowerarc: 25, 
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
	  	ctx.fill();
	  	
	  	
		$("#" + this.table.id + ' .options button[value="configure2"]').each(function() {			
			ctx.save();
			ctx.translate(500,500);
			ctx.move(50,0);
			
			ctx.beginPath();
			var teeth = 30;
			var around = 0;			
			while ( around < Math.PI * 4) {
				ctx.arc(0,0,150,around,2*Math.PI/teeth);
				console.log(ctx.strokeStyle);
				ctx.strokeStyle = 'black';
								
				around += 2*Math.PI/teeth;
				ctx.rotate(around);
			}
			ctx.stroke();
			ctx.restore();
		});	  	
		$("#" + this.table.id + ' .options button[value="about"]').first(function() {			
			console.log('YO MONEY CREATE ABOUT');
		});			
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
		$(this.container_id).children(".card").css({width:styler.cardwidth * styler.scale}); 
		$(this.container_id).children(".chip").css({width:styler.cardwidth * styler.scale * .54});		
	}
	
	table_ui.prototype.cards_and_chips = function() {
		$("#" + this.table.id).find(".card").css({width:styler.cardwidth * styler.scale}); 
		$("#" + this.table.id).find(".chip").css({width:styler.cardwidth * styler.scale * .54});
	}
	
	table_ui.prototype.rules = function() {
		$('#' + this.table.id).find('.seat:not(:has(.player)) > .options button').each(function () {
			$(this).clone().appendTo($(this).closest('.table').children(
				'.options:not(:has(button[value="'+$(this).val()+'"]))'
			));
		}).remove();
	}
	
	table_ui.prototype.wire = function() {
		console.log('')
		$("#" + this.table.id).find('.payout').each(function () {
			$(this).css({"left":-$(this).width()/2, "bottom": document.documentElement.clientHeight/2-$(this).height()/2}).not( $(this).children('.chip') ).append(
				$('.yellowchip:first').clone().css(
						{"z-index":-1, "position": "absolute", "left": -$(".yellowchip:first").width()/2+$(this).width()/2, "bottom": -$(".yellowchip:first").height()/2+$(this).height()/2 }
					).show()
			);
		});
		$("#" + this.table.id).find('.bet').each(function () {
			$(this).css({"left":-$(this).width()/2, "bottom": document.documentElement.clientHeight/2-$(this).height()/2}).not( $(this).children('.chip') ).append(				
				$('.bluechip:first').clone().css(
						{"z-index":-1, "position": "absolute", "left": -$(".bluechip:first").width()/2+$(this).width()/2, "bottom": -$(".bluechip:first").height()/2+$(this).height()/2 }
				).show()											
			);
		});			
		$("#" + this.table.id).find('.ante').each(function () {
			$(this).css({"left":-$(this).width()/2, "bottom": document.documentElement.clientHeight/2-$(this).height()/2}).not( $(this).children('.chip') ).append(				
				$('.whitechip:first').clone().css(
						{"z-index":-1, "position": "absolute", "left": +$(".whitechip:first").width()/2+$(this).width()/2, "bottom": -$(".whitechip:first").height()/2+$(this).height()/2 }
				).show()											
			);
		});
		
		$("#" + this.table.id).children('.options button[value="sit"]').show();
		
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

				var regions = ['bet','ante','lock','payout'];
				for (var spot = 0; spot < regions.length;spot++) {
					if ( typeof this.table.seats[x][regions[spot]] === 'number' ) {
						console.log(seatjq.children().hasClass(regions[spot]).length);
					} else {
						console.log('clean up:' + seatjq.children('.'  + regions[spot]).remove().length );
					}
				}

				//if ( .length == 0 && this.table.seats[x].player != null ) {
				//	seatjq.append('<div class="player"><div class="name">' + this.table.seats[x].player.name + '</div><div class="chips"/></div>');
				//	this.options(this.table.seats[x].player, seatjq.children('.player'));
				//}  
				if ( !this.table.seats[x].player ) { seatjq.children('.player').remove(); } else {
					seatjq.not(':has(.player)').append('<div class="player"><div class="name"/><div class="chips"/></div>');
					seatjq.find('.player .name').html(this.table.seats[x].player.name);
					seatjq.find('.player .chips').html(this.table.seats[x].player.chips);
				}			
				
				/*
				if ( typeof this.table.seats[x].ante === 'number' && seatjq.children('.ante').length == 0) {
					seatjq.append('<div class="ante"/>');
				} else if ( typeof this.table.seats[x].bet !== 'number' ) {
					seatjq.children('.ante').remove();
				}
				seatjq.children('.ante').html(typeof this.table.seats[x].ante);
				
				if ( typeof this.table.seats[x].lock === 'number' && seatjq.children('.lock').length == 0) {
					seatjq.append('<div class="lock"/>');														
				} else if ( typeof this.table.seats[x].bet !== 'number' ) {
					
				}				
				seatjq.children('.lock').html(typeof this.table.seats[x].ante);
				
				if ( typeof this.table.seats[x].payout === 'number' && seatjq.children('.lock').length == 0 ) {
					seatjq.append('<div class="payout"/>');
				} else if ( seatjq.children('.payout').length == 1 && typeof this.table.seats[x].payout !== 'number' ) {
					seatjq.children('.payout').remove();
				}
				


				if ( this.table.seats[x].player && typeof this.table.seats[x].player.chips === 'number' ) {
					seatjq.children('.player').children('.chips').html(this.table.seats[x].player.chips);
				}
				*/
				
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
		$("#" + this.table.id).siblings(this.canvas_id).bind('click', function(e) {
			console.log(e);
		});
		
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
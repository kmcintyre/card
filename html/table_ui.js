define(["jquery", "hand", "card", "table_client"], function($, _hand, _card, table_client) {

	var offset = 11;

	var base_font = "normal normal normal 20px Arial";
	var felt_font = "normal normal bold 20px Monospace";
	var odds_font = "italic small-caps bold 14px Arial";
	var dealer_font = "italic normal normal 16px Monospace";
	
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
		
		if ( document.documentElement.clientWidth < 800 || 600 > document.documentElement.clientHeight ) {
			$("#burner").css({"width":75});
			$(".card").css({"width":75});
		} else if ( document.documentElement.clientWidth < 1200 || 1000 > document.documentElement.clientHeight  ) {
			$("#burner").css({"width":125});
			$(".card").css({"width":125});
		} else {			
			$("#burner").css({"width":175});			
			$(".card").css({"width":175});
		}
		
		$(".chip").width( $("#burner").width() * 3 / 4 );
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
				if ( obj['hand' + x].ante && obj['hand' + x].ante > 0 ) {
					handjq.append('<div class="ante">' +  obj['hand' + x].ante + '</div>');
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
		//ang = 'rotate(' + rot + 'deg) scale(1.75)';
		ang = 'rotate(' + rot + 'deg) scaleY(1.75)';
		return { '-webkit-transform-origin':trans, '-webkit-transform': ang, '-moz-transform-origin':trans, '-moz-transform': ang, '-o-transform-origin':trans, '-o-transform': ang, '-ms-transform-origin':trans, '-ms-transform': ang, 'transform-origin':trans, 'transform': ang };
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
			} 
			
			$("#" + this.table.id).children(".title").attr("title",this.table.title);
			$("#" + this.table.id).children("._id").html( this.table.id );
			$("#" + this.table.id).attr("minimum" , this.table.minimum );				
			$("#" + this.table.id).attr("ante" , this.table.ante );
			$("#" + this.table.id).attr("denomination" , this.table.denomination );
						
			for (var x = 0; x < this.table.seats.length; x++) {
				var seatjq = $('<div class="seat"></div>').attr('seat',x);
				this.hands(this.table.seats[x], seatjq);
				if ( typeof this.table.seats[x].bet === 'number' ) {
					seatjq.append('<div class="bet">' + this.table.seats[x].bet + '</div>');
				}
				if ( this.table.seats[x].ante && this.table.seats[x].ante > 0 ) {
					seatjq.append('<div class="ante">' + this.table.seats[x].ante + '</div>');
				}
				if ( typeof this.table.seats[x].payout === 'number' ) {
					seatjq.append('<div class="payout">' + this.table.seats[x].payout + '</div>');
				}
				if ( this.table.seats[x].player ) {
					var playerjq = $('<div class="player"></div>');					
					this.options(this.table.seats[x].player, playerjq);
					if ( typeof this.table.seats[x].player.chips === 'number' ) {
						playerjq.append('<div class="chips">' + this.table.seats[x].player.chips + '</div>');
					}															
					if ( this.table.seats[x].player.name ) {
						playerjq.append('<div class="name">' + this.table.seats[x].player.name + '</div>');
					}
					seatjq.append(playerjq);
				}
				this.options(this.table.seats[x], seatjq);
				seatjq.append('<div class="chair" title="' + this.table.seats[x].chair + '"/>');
				if ( $("#" + this.table.id).find('.seat[seat="' + x + '"]').length == 0 ) {
					console.log('thanks!!!!!!!!!!!!!!!!');
					seatjq.appendTo("#" + this.table.id);
				} else {
					if ( seatjq.html() != $("#" + this.table.id).find('.seat[seat="' + x + '"]').html() ) {
						$("#" + this.table.id).find('.seat[seat="' + x + '"]').replaceWith(seatjq);
					}
					//$("#" + this.table.id).find('.seat[seat="' + x + '"]').replaceWith(seatjq);
					console.log('no thanks');
				}
			}			
			
			this.options(this.table, $("#" + this.table.id));
									
			$("#" + this.table.id).find('button').unbind('click').click(					
					function(event) {
						var act = { 
							table: $(event.target).closest(".table").find("._id").html(),  
							action: $(event.target).val().replace(/ /g, ''),							 
						};
						if ( $(event.target).val() == 'bet' ) {
							act['amount'] = parseInt( $(event.target).siblings('input[type="range"]').val() );
							if ( !act['amount'] ) {
								console.log('get amount!!');
								$(event.target).triggerHandler('amount');
								return;
							}
						} else if ( new Array('insurance', 'double','split').indexOf( $(event.target).val() ) >= 0 ) {
							if ( $(event.target).attr('forless') ) {
								console.log('FUCK YEAH');
							}
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
	
	table_ui.prototype.bgcanvas = function(canvasid) {		
		document.getElementById(canvasid).width  = document.documentElement.clientWidth;
		document.getElementById(canvasid).height = document.documentElement.clientHeight + 1;			
		var ctx = document.getElementById(canvasid).getContext('2d');
		ctx.clearRect(0,0,document.documentElement.clientWidth,document.documentElement.clientHeight+1);
		
  		var grd = ctx.createRadialGradient(
      			document.documentElement.clientWidth/2, 
      			document.documentElement.clientHeight/4, 
      			Math.max(document.documentElement.clientHeight,document.documentElement.clientWidth), 
      			document.documentElement.clientWidth/2, 
      			-document.documentElement.clientHeight/3, 
      			Math.min(document.documentElement.clientHeight,document.documentElement.clientWidth)
      			); 
      	grd.addColorStop(1, '#005700');
      	grd.addColorStop(0, '#002400');

      	ctx.fillStyle = grd;
      	ctx.fillRect(0,0,document.documentElement.clientWidth,document.documentElement.clientHeight+1);
      	
		var felt_radius = Math.max(document.documentElement.clientWidth, document.documentElement.clientHeight)/2;
		var offscreen = -felt_radius*3/4;
								
		function jquerywidth(s,f) {
			if ( !s ) s = '';			
			return parseFloat($("#tape").html("'" + s + "'").css("font", (f?f:(ctx.font?ctx.font:base_font)) ).width());			
		}				
		function jqueryradian(s,f) {
			return jquerywidth(s,f) / felt_radius; 				   
		}
		
		ctx.strokeStyle = 'gold';
		ctx.lineWidth = 3;									
		ctx.arc(ctx.canvas.width/2,offscreen,felt_radius,Math.PI/3,Math.PI*2/3);
		ctx.arc(ctx.canvas.width/2,offscreen,felt_radius+jquerywidth("WC"),Math.PI*2/3,Math.PI/3,true);
		ctx.closePath();
		ctx.stroke();		
		ctx.fillStyle = '#57854e';
		ctx.fill();
		
		function textCircle(text,x,y,radius,ang,pos){
			   ctx.textAlign = (pos.textAlign?pos.textAlign:"left");
			   ctx.textBaseline = (pos.textBaseline?pos.textBaseline:'middle');
			   ctx.lineWidth = 1;
			   ctx.font = ( pos.font ? pos.font : base_font );
			   for ( var c = 0; c < text.length; c++) {
				   ctx.save();
				   var diff = jqueryradian(text.substring(0,c),ctx.font);
				   //console.log('jqueryradian:' + diff + ' ' + ang + ' ' + (x+r*Math.cos(ang - diff)) + ' ' + (y+r*Math.sin(ang - diff)) + ' ' + (ang-diff-Math.PI/2));
				   if ( !pos.textAlign || pos.textAlign == "left" ) {
					   ctx.translate(x+felt_radius*Math.cos(ang - diff),y+felt_radius*Math.sin(ang - diff));
					   ctx.rotate(ang-diff-Math.PI/2);
				   } else if ( pos.textAlign == "center" ) {
					   ctx.translate(x+felt_radius*Math.cos( (ang+jqueryradian(text)/2) - diff),y+felt_radius*Math.sin(ang+jqueryradian(text)/2 - diff));
					   ctx.rotate((ang+jqueryradian(text)/2)-diff-Math.PI/2);
				   } else if ( pos.textAlign == "right" ) {					   
					   ctx.translate(x+felt_radius*Math.cos(ang+jqueryradian(text)-diff),y+felt_radius*Math.sin(ang+jqueryradian(text)-diff));
					   ctx.rotate((ang+jqueryradian(text)/2)-diff-Math.PI/2);
				   }				   
				   ctx.fillStyle = (pos.color?pos.color:'white');
				   ctx.fillText(text[c], 0, 0);
				   ctx.restore();
			   }
		}
		textCircle($("#" + this.table.id).attr('insurancepays'),ctx.canvas.width/2,offscreen+5,felt_radius/2,Math.PI*2/3,{textAlign:'left',textBaseline:'top'} );
		textCircle($("#" + this.table.id).attr('insurancepays'),ctx.canvas.width/2,offscreen+5,felt_radius/2,Math.PI/3,{textAlign:'right',textBaseline:'top'} );
		textCircle("6 decks",ctx.canvas.width/2,offscreen,felt_radius/2,Math.PI*8/12,{textAlign:'left',textBaseline:'bottom', color:'gold'} );		
		
		textCircle( $("#" + this.table.id).attr('soft17') + "s soft 17",ctx.canvas.width/2,offscreen-2,felt_radius/2,Math.PI*2/3-jqueryradian("6 decks"),{textAlign:'left',textBaseline:'bottom', color:'white'} );
				
		$("#" + this.table.id).find(".seat:first").each(function() {
			textCircle($(this).find('.player .name').html(),ctx.canvas.width/2,offscreen,felt_radius/2,Math.PI/3,{textAlign:'right',textBaseline:'bottom', color:'gold'} );			
		});
				
		var meme = Math.PI/3/7;		
		for (var rays = 1; rays < 8; rays++) {
		    ctx.beginPath();
		    ctx.strokeStyle = 'rgba(0,36,0,.66)';
			ctx.lineWidth = 1;		    
			ctx.moveTo(
					ctx.canvas.width/2+(felt_radius+$('#burner').width()/2)*Math.cos(Math.PI/3 + meme * rays - meme / 2),
					offscreen+(felt_radius+$('#burner').width()/2)*Math.sin(Math.PI/3 + meme * rays - meme / 2)
					);			
			ctx.lineTo(
					ctx.canvas.width/2+(felt_radius+$('#burner').width()*3/2)*Math.cos(Math.PI/3 + meme * rays - meme / 2),
					offscreen+(felt_radius+$('#burner').width()*3/2)*Math.sin(Math.PI/3 + meme * rays - meme / 2)
					);
			ctx.stroke();
			var name = '(empty)';
			if ( !this.table.seats[rays] || !this.table.seats[rays].player ) {
				ctx.fillStyle = 'rgba(192,192,192,.33)';
			} else {
				name = this.table.seats[rays].player.name;
				ctx.fillStyle = 'rgba(212,175,55,.66)';	
			}			
			ctx.save();
			ctx.textAlign = 'left';
			ctx.translate(
				ctx.canvas.width/2+(felt_radius+$('#burner').width()*2)*Math.cos(Math.PI/3 + meme * rays - meme / 2),
				offscreen+(felt_radius+$('#burner').width()*2)*Math.sin(Math.PI/3 + meme * rays - meme / 2)
				);
			ctx.rotate(Math.PI/3 + meme * rays - meme / 2);
			ctx.fillText(name, 0, 0);
			ctx.restore();
			
		}
		
		textCircle("Insurance Pays",ctx.canvas.width/2,offscreen+1,felt_radius/2,Math.PI/2,{textAlign:'center',textBaseline:'top', color:'black'}, "bold normal normal 22px monospace");		
	}

	return table_ui;
				
});	
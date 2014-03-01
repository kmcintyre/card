define(["jquery", "card", "deck"], function($, card, deck) {		

	window.requestAnimFrame = (function(callback) {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function(callback) {
          window.setTimeout(callback, 1000 / 60);
        };
    })();
	
	styler = {
		orientation : function() {			
			var foci = function() {
				return Math.sqrt(
					Math.pow(Math.max(document.documentElement.clientWidth,document.documentElement.clientHeight)/2,2)
					-
					Math.pow(Math.min(document.documentElement.clientWidth,document.documentElement.clientHeight)/2,2)
				)
			};			
			return { 
				"landscape" : document.documentElement.clientWidth > document.documentElement.clientHeight,
				"foci" : (document.documentElement.clientWidth > document.documentElement.clientHeight ? 
						[[document.documentElement.clientWidth/2-foci(),document.documentElement.clientHeight/2],[document.documentElement.clientWidth/2+foci(),document.documentElement.clientHeight/2]]
					:
						[[document.documentElement.clientWidth/2,document.documentElement.clientHeight/2-foci()],[document.documentElement.clientWidth/2,document.documentElement.clientHeight/2+foci()]]
				), 
			}
		},
		tableradius: function() {
			return parseInt((document.documentElement.clientWidth + document.documentElement.clientHeight)/4);
		},
		seating: function () { return [[0,0]]; },		
		betregions:[['bet','south'],['ante','north'],['lock','center'],['payout','north']],
		seatregions:[['bet','south'],['ante','north'],['lock','center'],['payout','north']],
		lightgreen:'rgba(0,87,0,1)',
		darkgreen:'rgba(0,36,0,1)',							
		offscreen: function () {
			return -styler.tableradius()*4/5;
		},
		cardwidth: function() {
			return Math.max(Math.min( parseInt(Math.PI * document.documentElement.clientWidth * document.documentElement.clientHeight / 52 / 52 / 8) , 150 ),75);
		},
		chipradius: function() {
			return parseInt(this.cardwidth()*.33);
		},
		offset : [0,0,0,0],
		chips : [[1,'#137feb','white'],[5,'red','yellow'],[25,'green','white'],[100,'silver','black'],[500,'pink','gray'],[1000,'gold','black']],
		font : function(name) {
			if ( name == 'chip') return "normal normal 18pt Courgette";
			if ( name == 'stack') return "normal normal 14pt Monospace";
			if ( name == 'welcome') return "small-caps normal 30pt Courgette";
			return "normal normal 18pt Courgette"
		}, 		
		insurancewidth: 25,
		flowerarc: 25, 
		helpradius: 15,
		betradius: 25,
		
	};
	
	visible_table = function() {
		console.log('this active:' + $('.table:visible[id="' + $(document.body).attr('active') + '"]').length);
		return $('.table:visible[id="' + $(document.body).attr('active') + '"]');
	}
	
	/* either table or rep */
	function table_ui() {
		console.log('new table ui');
		console.log(styler.orientation());
		$(document.body).data('tables', { "home": { id:"home", seats:[]} });
		$(document.body).data('ui', this);
		$(document.body).attr('active', 'home');					
		$(document.body).append( $('<canvas id="blackjack4all"/>').attr({width:document.documentElement.clientWidth,height:document.documentElement.clientHeight+1}) );
		var ctx = $(document.body).children('canvas')[0].getContext('2d');		
		ctx['felt'] = function() {
			var grd = ctx.createRadialGradient(
		  			document.documentElement.clientWidth/2, 
		  			styler.tableradius()*4/5,	  		
		  			Math.max(document.documentElement.clientHeight,document.documentElement.clientWidth)/2,	  			
		  			document.documentElement.clientWidth/2,	  			
		  			-document.documentElement.clientHeight/3, 
		  			Math.max(document.documentElement.clientHeight,document.documentElement.clientWidth)/2
		  			);
			grd.addColorStop(0, styler.darkgreen);
		  	grd.addColorStop(1, styler.lightgreen);		  	
		  	ctx.fillStyle = grd;
		  	ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);
		  	ctx.fill();		
		};
		ctx['txtCircle'] = function(txt,x,y,radius,ang,pos,clockwise) {
			console.log(txt);
			ctx.save();
			ctx.translate(x,y);						
			if ( !txt ) txt = 'undef';
			ctx.textAlign = (pos.textAlign?pos.textAlign:"left");
			ctx.textBaseline = (pos.textBaseline?pos.textBaseline:'middle');
			ctx.font = (pos.font?pos.font:styler.font('base')); 
			ctx.fillStyle = (pos.color?pos.color:'white');
			
			if ( pos.align == "center" && clockwise ) {				  
				ctx.rotate(ang+Math.PI/2-ctx.measureText(txt).width/radius/2);
			} else if ( pos.align == "center" ) {				  
				ctx.rotate(ang-Math.PI/2+ctx.measureText(txt).width/radius/2);
			} else if ( pos.align == "right" && clockwise ) {
				ctx.rotate(ang+Math.PI/2-ctx.measureText(txt).width/radius);
			} else if ( pos.align == "right") {
				ctx.rotate(ang-Math.PI/2+ctx.measureText(txt).width/radius);
			} else if ( clockwise ) {
				ctx.rotate(ang+Math.PI/2);
			} else {
				ctx.rotate(ang-Math.PI/2);
			}
			for ( var c = 0; c < txt.length; c++) {
				if ( clockwise ) {
					ctx.fillText(txt[c], 0, -radius);
				} else {
					ctx.fillText(txt[c], 0, radius);
				}
				var rot = ctx.measureText(txt[c]).width/radius;
				if ( clockwise ) {
					ctx.rotate(+rot);
				} else {
					ctx.rotate(-rot);
				}				
			}
			ctx.restore();
	  	};					
		ctx['insurancearc'] = function() {
			console.log('insurance arc');
			ctx.save();
			ctx.beginPath();
			ctx.arc(document.documentElement.clientWidth/2,styler.offscreen(),styler.tableradius(),Math.PI/3,Math.PI*2/3);
			ctx.arc(document.documentElement.clientWidth/2,styler.offscreen(),styler.tableradius()+styler.insurancewidth,Math.PI*2/3,Math.PI/3,true);
			ctx.closePath();			
			ctx.lineWidth = 3;	
			ctx.strokeStyle = 'gold';
			ctx.stroke();
			var grd = ctx.createRadialGradient(
					document.documentElement.clientWidth/2, 
					0,	  		
					styler.tableradius()/2,	  			
					document.documentElement.clientWidth/2,	  			
					document.documentElement.clientHeight/2, 
					styler.tableradius()
		  			);			
			grd.addColorStop(0, 'white');		  				
		  	grd.addColorStop(1, '#57854e');			
		  	ctx.fillStyle=grd;			
			ctx.fill();
			if ( visible_table().length > 0 ) {
				
				var ip = visible_table().attr('insurancepays');
				var soft17 = visible_table().attr('soft17') + "s soft 17";
				var doubleon = "Double " + (visible_table().attr('doubleon') ? visible_table().attr('doubleon') : 'Any 2');
				var bjpays = "BJ Pays " + visible_table().attr('blackjackpays');
				var splits = visible_table().attr('splitlimit') + " Splits"
				
				ctx.txtCircle("Insurance Pays",document.documentElement.clientWidth/2,styler.offscreen(),styler.tableradius(),Math.PI/2,
			  		{font:styler.font('insurance'), align:'center',textBaseline:'top', color:'black'}
			  	);
				ctx.txtCircle(ip,document.documentElement.clientWidth/2,styler.offscreen(),styler.tableradius()+4,Math.PI*2/3,
	  					{font:styler.font('odds'), align:'left',textBaseline:'top'} 
	  			);
				ctx.txtCircle(ip,document.documentElement.clientWidth/2,styler.offscreen(),styler.tableradius()+4,Math.PI/3,
	  					{font:styler.font('odds'), align:'right',textBaseline:'top'} 
	  			);
						  			
				ctx.txtCircle(soft17,document.documentElement.clientWidth/2,styler.offscreen(),styler.tableradius(),Math.PI/3,
					{font: styler.font('soft17'), align:'right',textBaseline:'bottom', color:'white'}
				);	
				ctx.txtCircle(bjpays,
					document.documentElement.clientWidth/2, styler.offscreen(), styler.tableradius()+styler.insurancewidth + 5, Math.PI*.583,
					{font: styler.font('odds'), align:'center', textBaseline:'top', color:'gold'},false
				);		
				ctx.txtCircle( splits,
					document.documentElement.clientWidth/2 + (styler.tableradius()+styler.flowerarc-20) * Math.cos(Math.PI*.583),
					styler.offscreen() + (styler.tableradius+styler.flowerarc-20) * Math.sin(Math.PI*.583),			
					30,Math.PI*.583+Math.PI,
					{font: styler.font('odds'), align:'center', color:'gold'},true
				);
				
				ctx.txtCircle( doubleon,
					document.documentElement.clientWidth/2 + (styler.tableradius()+styler.flowerarc-60) * Math.cos(Math.PI*.416),
					styler.offscreen() + (styler.tableradius()+styler.flowerarc-60) * Math.sin(Math.PI*.416),
					90,Math.PI*.416,{font: styler.font('odds'), align:'center', color:'gold'},false);
			} else {
				console.log('no visible table');
			}			
			ctx.restore();
	  	}		
		ctx['animateText'] = function(txt, x, y, f, c) {
			function cb(index) {
				index++;
				ctx.save();
				ctx.font = f;
				ctx.fillStyle = c;
				ctx.textAlign="left";
				ctx.textBaseline="middle";
				ctx.fillText(txt.substring(index-1,index), x+(index==1?0:ctx.measureText(txt.substring(0,index-1)).width),y);
				ctx.restore();
				if ( index < txt.length ) {
					window.requestAnimFrame(function() {
						cb(index);
				    });									
				} 
			}
			cb(0);						
		}		
		ctx['shoe'] = function() {
			ctx.save();
			ctx.translate(document.documentElement.clientWidth-styler.cardwidth(),0);
			ctx.rotate(-Math.PI/4);
			ctx.drawImage( $('#facedown')[0], 0, 0, styler.cardwidth(), styler.cardwidth() * 1.4);
			ctx.restore();
			ctx.save();
			ctx.beginPath();
			ctx.moveTo(document.documentElement.clientWidth-styler.cardwidth()*2/3,0);	  	
			ctx.lineTo(document.documentElement.clientWidth,styler.cardwidth()*2/3);		
			ctx.lineTo(document.documentElement.clientWidth,0);
			ctx.closePath();
			ctx.strokeStyle = 'black';
			ctx.stroke();
			ctx.fillStyle = 'rgba(255,255,255,.75)';
			ctx.fill();
			ctx.translate(document.documentElement.clientWidth-styler.cardwidth()*2/3,0);
			ctx.rotate(Math.PI/4);
			ctx.fillStyle = 'gold';  		
			ctx.font = styler.font('odds');
			ctx.textAlign = "center";
			ctx.restore();
	  	};	  		  	
	  	
		ctx['forge'] = function(chip) {
			console.log("forge:" + chip);
			$('.chip' + chip[0]).remove().each(function() { console.log('removed')});
			$(document.body).append(														
				$('<canvas class="chip' + chip[0] + '"/>').attr({width:styler.chipradius()*2,height:styler.chipradius()*2})								
			);
			var chip_ctx = $(".chip" + chip[0])[0].getContext("2d");
			chip_ctx.arc(
				styler.chipradius(),
				styler.chipradius(),
				styler.chipradius()-1,0,2*Math.PI
			)
			var grd = chip_ctx.createRadialGradient(
					styler.chipradius()/2, 
					styler.chipradius()/2,	  		
					styler.chipradius()*7/5,	  			
					styler.chipradius()/2,	  			
					styler.chipradius()/2, 
					styler.chipradius()/2
		  			);
			grd.addColorStop(0, chip[2]);
			grd.addColorStop(1, chip[1]);											  			
		  				
			chip_ctx.translate(styler.chipradius()/2,styler.chipradius()/2);
			chip_ctx.strokeStyle='black';-styler.chipradius()
			chip_ctx.lineWidth = 1;
			chip_ctx.stroke();
			chip_ctx.fillStyle=grd;
			chip_ctx.fill();
									
			chip_ctx.font = styler.font('chip');
			chip_ctx.textAlign="center";
			chip_ctx.textBaseline="middle";			
			chip_ctx.shadowColor     = 'black';
			chip_ctx.shadowOffsetX   = 2;
			chip_ctx.shadowOffsetY   = 2;
			chip_ctx.shadowBlur      = 4;			
			chip_ctx.strokeText(chip[0],styler.chipradius()/2,styler.chipradius()/2);

			var chip_image = new Image();
			chip_image.src = chip_ctx.canvas.toDataURL();
			$('.chip' + chip[0]).remove();
			console.log('forged:' + 'chip' + chip[0]);
			$(document.body).append(
				$(chip_image).attr({'class':'chip' + chip[0]}).addClass('chip').css({'display':'none'})
			);		  		
		}

		for (var x = 0; x < styler.chips.length; x++) {
			if ( $('.chip' + styler.chips[x][0]).length == 0 ) {
				console.log($('.chip' + styler.chips[x][0]).length);
				ctx.forge(styler.chips[x]);
			}
		}
		
	  	ctx['fan'] = function(d) {
	  		for (var c = 0; c < d.cards.length; c++) {	  			
				ctx.save();				
				var ang = Math.PI*8/7+Math.PI*2/3/52*(d.cards[c].fromBox()+1);
				var tempx = document.documentElement.clientWidth/2*Math.cos(ang);
				var tempy = document.documentElement.clientHeight/2*Math.sin(ang);
				var ra = Math.sqrt(tempx*tempx+tempy*tempy);
				
				//console.log('ellipse: ang' + ang + ' ' + tempx + ' x ' + tempy + ' r:' + ra + ' :' + document.documentElement.clientWidth + ' x ' + document.documentElement.clientHeight);
				ctx.translate(document.documentElement.clientWidth/2+tempx,document.documentElement.clientHeight/2+tempy);
				ctx.rotate(ang+Math.PI/2);				
				ctx.drawImage(
						$('#' + new card(d.cards[c].fromBox()).underscore())[0],
						-styler.cardwidth(),
						0,
						styler.cardwidth(),
						styler.cardwidth()*1.4 
				)
				ctx.restore();	  			
	  		}
	  	}

		ctx['home'] = function() {
			ctx.felt();
			ctx.insurancearc();
			var welcome_msg = "blackjack4all";
			function welcome() {
				ctx.save();
				ctx.font = styler.font('welcome');
				ctx.animateText(welcome_msg, 
					document.documentElement.clientWidth/2-ctx.measureText(welcome_msg).width/2, 
					styler.cardwidth()*1.4+65,
					styler.font('welcome'),
					'gold'
				);
				ctx.restore();
			}
			if ( $('head').children('link[href*="fonts"]').length == 0 ) {				
				ctx.save();
				ctx.font = styler.font('welcome');
				var welcome_width = ctx.measureText(welcome_msg).width;
				ctx.restore();
				$('head link[rel="stylesheet"]').last().after(
					$('<link rel="stylesheet" href="http://fonts.googleapis.com/css?family=Courgette" type="text/css">').load(function() {
						function checkfontload() {
							ctx.save();
							ctx.font = styler.font('welcome');
							var check_width = ctx.measureText(welcome_msg).width;
							console.log('check_width:' + check_width);
							ctx.restore();							
							if ( check_width != welcome_width ) {
								welcome();							
							} else {
								setTimeout(function() { checkfontload(); }, 100);									
							}
						}
						checkfontload();
					})
				);
			} else if( $(document.body).attr('active') == 'home' ) {
				welcome();
			}
			var deckcomplete = "100%";
			if ( $('#facedown').length == 0 ) {
				ctx.save();
				ctx.font = styler.font('base');
				var deckcomplete_width = ctx.measureText(deckcomplete).width;
				ctx.restore();
				$('<img class="card" id="facedown" src="'+ new deck().facedown().toSrc() +'">').on('load', function() {
					ctx.shoe();
					var loaded = 0;
					for (var c = 0; c < 52; c++) {				
						$('<img class="card" id="' + new card(c).underscore() + '" src="'+ new card(c).toSrc() +'">').on('load', function() {
							loaded++;
							var loadedcard = new card();
							loadedcard.fromSrc(this.src);							
							if ( loaded < 52 ) {
								ctx.fan({ "cards" : [loadedcard]});								
							} else {
								welcome();
								ctx.fan(new deck());
							}																												
							var deckper = parseInt(loaded/52*100) + "%";
							ctx.save();
							ctx.beginPath();
							ctx.rect(
									document.documentElement.clientWidth/2-deckcomplete_width/2,
									styler.cardwidth()*1.4+20,
									deckcomplete_width,
									25
									)
							ctx.clip();
							ctx.felt();							
							ctx.textAlign="left";
							ctx.textBaseline="top";
							ctx.font = styler.font('base');
							ctx.fillStyle = 'white';							
							ctx.fillText(deckper,
								document.documentElement.clientWidth/2-deckcomplete_width/2, 
								styler.cardwidth()*1.4+20
							);							
							ctx.restore();
						}).appendTo(document.body).css('display','none');					
					}
				}).appendTo(document.body).css('display','none');
			} else if( $(document.body).attr('active') == 'home' ) {
				
				ctx.fan(new deck());
			}
			
			if( $(document.body).attr('active') == 'home') {
				$(document.body).children('.stack').remove();
				var oneofeach = 0;
				for (var x = 0; x < styler.chips.length;x++) {		
					oneofeach += styler.chips[x][0];
				}						
				
				$(document.body).data('ui').stack(
						oneofeach,
						document.documentElement.clientWidth/2-styler.chipradius(),
						styler.cardwidth()*1.4+65+styler.chipradius()*2
						);
				
				$(".stack").click(function (e) {
					$(e.target).remove();
					if ( $(e.target).siblings().length == 0 ) {
						console.log('do something else');
					}					
				})							
				//$(document.body).bind('click dblclick mouseover mouseout mouseup mousemove onkeydown onkeypress onkeyup mousewheel DOMMouseScroll touchstart touchmove touchend touchenter touchleave touchcancel' /* etc.*/,function(e){
				 //   console.log(e.type);
				  //  if ( e.type == 'click' ) {
				   // 	console.log($(document.body).data('tables'));
				   // 	$(document.body).data('ui').paint('home');
				    	//this.paint();
				    //}
				//});
			}					
		}
	}
	
	table_ui.prototype.add_table = function(table) {
		$(document.body).data('tables')[table.id] = table;
	}
	
	table_ui.prototype.context = function() {
		return document.getElementById("blackjack4all").getContext('2d');
	}
	
	table_ui.prototype.measure = function() {				
		//console.log('seats:' + $("#" + table.id).children('.seat').length + ' players:' + $("#" + table.id).children('.seat').children('.player').length +' bets:' + $("#" + table.id).find(".seat .bet").length );
		if ( this.context().canvas.width != document.documentElement.clientWidth || this.context().canvas.height != document.documentElement.clientHeight + 1 ) {
			console.info('resize: ' + document.documentElement.clientWidth + ' x ' + (document.documentElement.clientHeight + 1 + ' card:' + styler.cardwidth() + ' chip:' + styler.chipradius()*2));
			this.context().canvas.width = document.documentElement.clientWidth;
			this.context().canvas.height = document.documentElement.clientHeight + 1;
			this.context().felt();
		}		
		$(document.body).children(".card").css({width:styler.cardwidth()});		
		$(document.body).children(".chip").css({width:styler.chipradius()*2});
	}
	
	table_ui.prototype.stack = function (total,posX,posY) {
		console.log('stack:' + total + ' ' + posX + ' x ' + posY);	  		
		var chips = new Array();
		var countdown = total;
		var stackcount = 0;			
		for (var x = styler.chips.length-1; x >= 0; x--) {
			chips.unshift(
				Math.floor(countdown/styler.chips[x][0])
			);
			countdown -= chips[0] * styler.chips[x][0];
			stackcount += chips[0];
		}
		var chipstack = $('<div class="stack" title="' + total + '"/>').css(
			{
				"top":posY,
				"left":posX,
			}
		);						
		for (var x = chips.length-1; x >= 0; x--) {					
			while ( chips[x] > 0 ) {
				chipstack.append( 
					$('.chip' + styler.chips[x][0]).clone().css({
						'position': 'absolute',
						'top': x*2,
						'left': x*2,
						'transform':'rotateZ(-15deg)',
						'box-shadow': '0 2px 2px 2px rgba(0,0,0,.3)',
						'border-radius' : styler.chipradius()						
					}).show()
				)
				stackcount--;
				chips[x]--;
			}
		}
		console.log(chipstack);
		$(document.body).append(chipstack);
	};	
	
	/*
	 * 
	 * 
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
	*/
	
	table_ui.prototype.rules = function() {
		visible_table().find('.seat:not(:has(.player)) .options button').each(function () {			
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

	
	table_ui.prototype.paint = function(id) {
			console.info('paint ui:' + id);			
			$(document.body).attr('active', id);
			$('.table:not([id="' + id + '"])').hide();
			
			//$('#blackjack4all')[0].getContext('2d').home();			
			var table = $(document.body).data('tables')[id];
			
			if ( $("#" + table.id).length == 0 ) {
				console.info('create table');
				$(document.body).prepend($('<div class="table" id="' + table.id + '"><div class="title"/><div class="_id"/></div>'));				
				if ( table['act'] ) {
					console.info('data to "table"');
					$("#" + table.id).data("table", table);					
				}
			} 			
			$("#" + table.id).children(".title").attr("title",table.title);
			$("#" + table.id).children("._id").html( table.id );
			$("#" + table.id).attr("minimum" , table.minimum );				
			$("#" + table.id).attr("ante" , table.ante );
			$("#" + table.id).attr("denomination" , table.denomination );
			
			this.options(table, $("#" + table.id));
			
			for (var seat = 0; seat < table.seats.length; seat++) {
				if ( $("#" + table.id).find('.seat[seat="' + seat + '"]').length == 0 ) {		
					styler.seating[styler.seating.length] = [0,0];
					$('<div class="seat"><div class="chair" title="' + table.seats[seat].chair + '"/></div>').attr('seat',seat).appendTo("#" + table.id);
				}					
				var seatjq = $("#" + table.id).find('.seat[seat="' + seat + '"]');
				
				this.options(table.seats[seat], seatjq);
				
				for (var spot = 0; spot < styler.betregions.length;spot++) {
					if ( typeof table.seats[seat][styler.betregions[spot][0]] !== 'number' ) {
						seatjq.children('.'  + styler.betregions[spot][0]).remove();
					} else if ( seatjq.children('.' + [styler.betregions[spot][0]]).html(table.seats[seat][styler.betregions[spot][0]]).length == 0 ) {
						console.log('add:' + [styler.betregions[spot][0]] + ' ' + table.seats[seat][styler.betregions[spot][0]]);
						seatjq.append('<div class="'+[styler.betregions[spot][0]]+'">' + table.seats[seat][styler.betregions[spot][0]] + '</div>');
					}
				}

				if ( !table.seats[seat].player ) { seatjq.children('.player').remove(); } else {
					seatjq.not(':has(.player)').append('<div class="player"><div class="name"/><div class="chips"/></div>');
					seatjq.find('.player .name').html(table.seats[seat].player.name);
					seatjq.find('.player .chips').html(table.seats[seat].player.chips);
				}			
				
				for (var h = 0;; h++) {			
					if ( table.seats[seat]['hand' + h] ) {
						console.log('seat ' + seat + ' has hand:' + h);
						if ( seatjq.children('.hand:eq("' + h + '")').length == 0 ) {
							seatjq.append('<div class="hand"><div class="bet"/><div class="ant"/></div>');
						}							
						var handjq = seatjq.children('.hand:eq("' + h + '")');
						if ( table.seats[seat]['hand' + h].bet ) {
							handjq.children('.bet').html(table.seats[seat]['hand' + h].bet);	
						} else {
							handjq.children('.bet').remove();
						}						
						if ( table.seats[seat]['hand' + h].ante) {
							handjq.children('.ante').html(table.seats[seat]['hand' + h].ante);															
						} else {
							handjq.children('.ante').remove();
						}
						this.options(table.seats[seat]['hand' + h], handjq);
						for (var c = 0;; c++) {
							if ( table.seats[seat]['hand' + h].cards[c] ) {								
								var ci = new card();
								ci.card = table.seats[seat]['hand' + h].cards[c].card;
								ci.suite = table.seats[seat]['hand' + h].cards[c].suite;								
								if ( handjq.children('.card:eq("' + c + '")').length == 0 && table.seats[seat]['hand' + h].cards[c] ) {
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
		var ba = $("#" + table.id).find('button').not( $(this).bind('click') ).unbind('click').bind('click', function(event) {
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
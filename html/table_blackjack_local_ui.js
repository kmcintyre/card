define(["jquery", "table_blackjack_ui", "table_blackjack", "table_client", "card", "shoe"], function($, table_blackjack_ui, table_blackjack, table_client, card, shoe) {
	
	function tablecast(json) {
		console.log('ignore:' + json);
	}				
	
	new table_client().set(tablecast);	

	var bj = new table_blackjack();
	//bj.locked = true;
	bj.id = 'local';
	bj.title = '6 deck shoe';
		
	function rotatecss(rot) {
		ang = 'rotate(' + rot + 'deg)';
		return { '-webkit-transform': ang, '-moz-transform': ang, '-o-transform': ang, '-ms-transform': ang, 'transform': ang };
	}		
	    
	var quicktimer = null;
	dealer = function(delay) { 
		if ( quicktimer == null ) {
			try {
				if ( bj.seats[0].activeseat() == null && bj.seats[0].options().length > 0 && bj.seats[0].options()[0] == 'deal' && !quicktimer ) {
					quicktimer = setTimeout( function() { quicktimer = null; if ( bj.seats[0].activeseat() > 0 ) { return; } bj.act({ action: bj.seats[0].options()[0], seat: 0 }); }, 1000 * bj.seats.length);
				} else if ( bj.seats[0].activeseat() == 0 && !quicktimer ) {
					if ( bj.seats[0].hand0.options()[0] == 'insurance' ) {
						quicktimer = setTimeout( function() { quicktimer = null; if ( bj.seats[0].activeseat() > 0 ) { return; } bj.act({ action: bj.seats[0].hand0.options()[0], seat: 0 }); quicktimer = null; }, 4 * delay);
					} else {
						quicktimer = setTimeout( function() { quicktimer = null; if ( bj.seats[0].activeseat() > 0 ) { return; } bj.act({ action: bj.seats[0].hand0.options()[0], seat: 0 }); }, delay);
					}
				} else {
					console.log(bj.seats[0].options().length + ' options as:' + bj.seats[0].activeseat());
				}
			} catch (err) {
				console.log(err);
			}
			
		}
		if ( bj.automate ) {
			setTimeout( function() { dealer(delay); }, delay );
		}
	}
		
	var ui = new table_blackjack_ui(bj, "#tables");
	
	bj.act = function(step) {
		console.log(step);
		if ( step.action == '?'  ) {
			if ( $("#" + bj.id + " > .options").css("overflow") == 'visible' ) {
				$("#" + bj.id + " > .options").css({"overflow": "hidden", "height" : $("#" + bj.id + " > .options > button:first").outerHeight()});								
			} else {
				$("#" + bj.id + " > .options").css({"overflow": "visible", "height" : ""});
			}			
		} else if ( step.action == 'splits'  ) {
			var nl = prompt("split limit",bj.splitlimit);
			if ( !parseInt(nm) > 0 ) {
				nl = 3;
			} 			
			bj.splitlimit = nl;
		} else if ( step.action == 'minimum'  ) {
			var nm = prompt("table min",bj.minimum);
			if ( !parseInt(nm) ) {
				nm = 0;
			} 			
			bj.minimum = nm;
		} else if ( step.action == 'maximum'  ) {
			var nm = prompt("table max",(bj.maximum ? bj.maximum : ''));
			if ( !parseInt(nm) ) {
				delete bj.maximum;
			} else if ( parseInt(nm) >= bj.minimum ) {
				bj.maximum = parseInt(nm);
			}
		} else if ( step.action == 'rebuy'  ) {			
			bj.seats[step.seat].player.chips += 10 * bj.minimum;
		} else if ( step.action == 'automate'  ) {			
			bj.automate = true;
			bj.seats[0].player.name = 'auto';
			if ( !step.amount ) {
				step.amount = prompt("dealer delay millis:",1000);
			}
			dealer(step.amount);
		} else if ( step.action == 'manual' ) {
			if ( quicktimer ) { clearTimeout(quicktimer); }
			bj.seats[0].player.name = 'manual';
			delete bj.automate;
		} else if ( step.action == 'faceup' ) {
			bj.downdirty = false;					
		} else if ( step.action == 'ante' ) {
			if ( !step.ante ) {
				step.ante = parseInt(prompt("Ante (pos. integer)",bj.ante));
			}
			bj.ante = 0;
			if ( step.ante > 0 ) {
				console.log('set ante:' + step.ante);
				bj.ante = step.ante;
			}			
		} else if ( step.action == 'downdirty' ) {
			bj.downdirty = true;
		} else if ( step.action == 'blackjackpays' ) {			
			var blackjackpays = prompt("3-2, 6-5 or 1-1",bj.blackjackpays);
			if ( blackjackpays == '3-2' || blackjackpays == '6-5' || blackjackpays == '1-1') {
				bj.blackjackpays = blackjackpays;
			} else {
				bj.blackjackpays = '3-2';
			}
		} else if ( step.action == 'holecards' ) {			
			var holecards = prompt("2 or 1",bj.holecards);
			if ( holecards != 2 || holecards != 1 ) {
				bj.holecards = 2;
			} else {
				bj.holecards = holecards;
			}
		} else if ( step.action == 'soft17' ) {			
			var soft17 = prompt("hit or stay",bj.soft17);
			if ( soft17 == 'hit' || soft17 == 'stay' ) {
				bj.soft17 = soft17;
			} else {
				bj.soft17 = 'hit';
			}
			if ( bj.seats[0].hand0 ) {
				bj.seats[0].hand0.soft17 = bj.soft17;
			}
		} else if ( step.action == 'insurancepays' ) {			
			var insurancepays = prompt("2-1",bj.insurancepays);
			if ( insurancepays != '2-1' ) {
				bj.insurancepays = '2-1';
			} else {
				bj.insurancepays = insurancepays;
			}
		} else if ( step.action == 'surrender' ) {			
			var surrender = parseInt( prompt("true or false",bj.surrender) );
			if ( surrender ) {
				bj.surrender = true;
			} else {
				bj.surrender = false;
			}					
		} else if ( step.action == 'doubleon' ) {
			var doubleon = prompt("double on (blank any 2 cards)",bj.doubleon);
			bj.doubleon = new Array();
			$.each(doubleon.split(','), function() {bj.doubleon[bj.doubleon.length]=this;});
		} else if ( step.action == 'fornothing' ) {
			var fornothing = prompt("for nothing (split,double)",bj.fornothing);
			bj.fornothing = new Array();
			if ( fornothing ) {
				$.each(fornothing.split(','), function() {
					if (this.length > 0 && bj.fornothing.indexOf(this) < 0 ) {
						bj.fornothing.push(this);
						if ( bj.forless.toString().indexOf(this) < 0 ) { 
							bj.forless.push(this);
						}
					}
				});	
			}			
		} else if ( step.action == 'forless' ) {
			var forless = prompt("for less (split,double,insurance)",bj.forless);
			bj.forless = new Array();
			if ( forless ) {
				$.each(forless.split(','), function() {
					if ( bj.forless.indexOf(this) < 0 ) {
						console.log('add forless:' + this);
						bj.forless.push(this);
					}
				});	
				$.each(bj.fornothing, function(i) {
					console.log('wtf?' + i + ' ' + this);
					if ( bj.forless.toString().indexOf(this) < 0 ) {
						console.log('slice' + i);
						bj.fornothing.slice(i,1);
					}
				});				
			} else {
				bj.fornothin = new Array();
			}					
		} else if ( step.action == 'insurance' && step.seat == 0 && !step['animate'] ) {			
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
		} else {
			table_blackjack.prototype.act.call(this, step);
		}	
		ui.paint();
		ui.re();
		if ( step.action == 'addseat' || step.action == 'sit'  || step.action == 'stand' || step.action == 'manual'  || step.action == 'automate' || step.action == 'soft17'  ) {
			ui.bgcanvas("tablecanvas");
		}
		if ( bj.automate ) {			
			$("#" + bj.id + " > .seat:eq(0)").find(".options").empty();
		} 		
	} 	
	
	bj.options = function() {
		var opts = table_blackjack.prototype.options.call(bj);
		opts.pop();
		if ( !this.locked ) {
			opts.unshift('?');
			opts[opts.length] = 'add player';
			if ( bj.automate ) {
				opts[opts.length] = 'manual';
			} else {
				opts[opts.length] = 'automate';
			}			
			if ( bj.downdirty ) {
				opts[opts.length] = 'face up';				
			} else {
				opts[opts.length] = 'down dirty';
			}			
			opts[opts.length] = 'splits';
			opts[opts.length] = 'for less';			
			opts[opts.length] = 'for nothing';
			opts[opts.length] = 'double on';
			opts[opts.length] = 'ante';
			opts[opts.length] = 'soft 17';
			opts[opts.length] = 'blackjack pays';
			opts[opts.length] = 'insurance pays';
			opts[opts.length] = 'hole cards';
			opts[opts.length] = 'minimum';			
			opts[opts.length] = 'maximum';
		}
		return opts;
	}	
	
	$(function() {
		$(window).resize( function() {
			ui.bgcanvas("tablecanvas");
			ui.paint();
			ui.re();			
		});		
		bj.act({action: 'sit', seat: 4});
		bj.act({action: '?'});
		bj.act({action: 'manual', seat: 0, table: bj.id});
		
		bj.act({action: 'bet', seat: 4, amount: 25});
		
		bj.shoe.cards[1].card = 'A';
		bj.shoe.cards[2].card = 'A';
		bj.shoe.cards[3].card = 'K';
		bj.shoe.cards[4].card = '6';		
		bj.act({action: 'deal', seat: 0, table: bj.id});
		/*
		bj.shoe.cards[1].card = 'A';
		bj.shoe.cards[4].card = 'K';
		
		bj.shoe.cards[2].card = 'A';
		bj.shoe.cards[5].card = 'K';
		
		bj.shoe.cards[3].card = 'K';
		bj.shoe.cards[6].card = 'K';
		*/
		
		/*
		bj.shoe.cards[1].card = '8';
		bj.shoe.cards[2].card = 'A';
		bj.shoe.cards[3].card = '8';
		bj.shoe.cards[4].card = 'A';
		bj.shoe.cards[5].card = '3';
		bj.shoe.cards[6].card = 'Q';
		bj.shoe.cards[7].card = '8';
		bj.shoe.cards[8].card = '3';
		bj.shoe.cards[10].card = '8';
		bj.act({action: 'sit', seat: 2, name: "5 x Min" });
		bj.seats[2].player.chips = bj.minimum * 5;			
		bj.act({action: 'bet', seat: 2, amount: bj.minimum * 2.5});
		bj.act({action: 'manual', seat: 0, table: bj.id});
		*/

		
		
	});	
	console.log('started');					
});

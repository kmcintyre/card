define(["jquery", "table_blackjack_ui", "table_blackjack", "table_client", "card"], function($, table_blackjack_ui, table_blackjack, table_client, card) {
	
	function tablecast(json) {
		console.log('ignore:' + json);
	}				
	
	new table_client().set(tablecast);	

	var bj = new table_blackjack();
	//bj.locked = true;
	bj.id = 'local';
	//bj.downdirty = false;
	//bj.forless = false;
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
						quicktimer = setTimeout( function() { quicktimer = null; if ( bj.seats[0].activeseat() > 0 ) { return; } bj.act({ action: bj.seats[0].hand0.options()[0], seat: 0 }); quicktimer = null; }, 5000);
					} else {
						quicktimer = setTimeout( function() { quicktimer = null; if ( bj.seats[0].activeseat() > 0 ) { return; } bj.act({ action: bj.seats[0].hand0.options()[0], seat: 0 }); }, 1000);
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
		} else if ( step.action == 'buy-in'  ) {			
			bj.seats[step.seat].player.chips += 10 * bj.minimum;
		} else if ( step.action == 'automate'  ) {			
			bj.automate = true;
			dealer(1500);
		} else if ( step.action == 'manual' ) {
			if ( quicktimer ) { clearTimeout(quicktimer); }
			delete bj.automate;
		} else if ( step.action == 'faceup' ) {
			bj.downdirty = false;					
		} else if ( step.action == 'downdirty' ) {
			bj.downdirty = true;					
		} else if ( step.action == 'forless' ) {
			bj.forless = !bj.forless;										
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
		if ( bj.automate ) {			
			$("#" + bj.id + " > .seat:eq(0)").find(".options").empty();
		} 		
	} 	
	
	bj.options = function() {
		var opts = table_blackjack.prototype.options.call(bj);
		if ( !this.locked ) {
			
			opts.unshift('?');			
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
			opts[opts.length] = 'split for less';			
			opts[opts.length] = 'double for less';
			opts[opts.length] = 'ante';
			opts[opts.length] = 'minimum';			
			opts[opts.length] = 'maximum';
		}
		return opts;
	}
	
	$(function() {		
		$(window).resize( function() {
			ui.paint();
			ui.re();			
		});
		bj.addseat();
		
		bj.act({action: 'sit', seat: 1});
		//bj.seats[1].payout = 200;
		//bj.minimum = 0;
		//bj.act({action: 'buy-in', seat: 1});
		//bj.act({action: 'bet', seat: 1, amount: 5});
		
		//bj.shoe.cards[1].card = 'A';
		//bj.shoe.cards[2].card = 'A';
		//bj.shoe.cards[3].card = 'K';
		//bj.shoe.cards[4].card = 'K';
		
		/*
		bj.shoe.cards[1].card = '8';
		bj.shoe.cards[2].card = '4';
		bj.shoe.cards[3].card = '8';
		bj.shoe.cards[4].card = '8';
		bj.shoe.cards[5].card = '8';
		bj.shoe.cards[6].card = '8';
		bj.shoe.cards[7].card = '8';
		bj.shoe.cards[8].card = '8';
		*/
		//bj.shoe.cards[8].card = '8';
		//bj.shoe.cards[9].card = '8';
		//bj.shoe.cards[10].card = '8';
		//bj.shoe.cards[11].card = 'A';
		//bj.shoe.cards[12].card = 'A';
		//bj.shoe.cards[13].card = 'A';

		//bj.addseat();
		//bj.act({action: 'sit', seat: 2, name: "5 x Min" });
		//bj.seats[2].player.chips = bj.minimum * 5;			
		//bj.act({action: 'bet', seat: 2, amount: bj.minimum});
		
		//bj.shoe.cards[3].card = 'A';
		
		bj.act({action: '?', table: bj.id});
		//bj.act({action: 'deal', seat: 0, table: bj.id});
		bj.act({action: 'automate', table: bj.id});		

		//ui.paint();
		//ui.re();
		
		
		//$("#" + bj.id + " > .options").hide();		
		//$("#" + bj.id + " > .title").click(function (e) {
		//	$("#" + bj.id + " > .options").toggle(); 
		//});
		
		
		//bj.shoe.cards[1].card = '2';
		
		//bj.shoe.cards[3].card = '2';
		//bj.shoe.cards[3].card = 'A';
		//bj.shoe.cards[5].card = '4';
		//bj.shoe.cards[6].card = '5';
		//bj.shoe.cards[7].card = 'A';
		//bj.shoe.cards[8].card = 'A';
		
		//bj.act({action: 'deal', seat: 0 });
		//bj.shoe.cards[4].card = 'K';		
		//$(window).resize();
	});	
	console.log('started');					
});
/*	 
blackjack split	- there's a ton of variations...secondary splits etc
bj.shoe.cards[1].card = 'A';
bj.shoe.cards[2].card = 'A';
bj.shoe.cards[3].card = 'A';
bj.shoe.cards[5].card = 'K';
bj.shoe.cards[6].card = 'K';

// two blackjacks but shouldn't normally pay 3/2
bj.shoe.cards[1].card = 'A';
bj.shoe.cards[2].card = '4';
bj.shoe.cards[3].card = 'A';
bj.shoe.cards[5].card = 'K';
bj.shoe.cards[6].card = 'K';


*/	

/*	 
split tests...ton of variations	 
bj.shoe.cards[1].card = '8';
bj.shoe.cards[2].card = 'A';
bj.shoe.cards[3].card = '8';
bj.shoe.cards[5].card = '8';
bj.shoe.cards[6].card = '8';
bj.shoe.cards[7].card = '8';
*/


//bj.addseat();	

//bj.addseat();
//bj.act({action: 'sit', seat: 2, name: null});
//bj.act({action: 'bet', seat: 2, amount: 50});	

//
//bj.addseat();
//bj.addseat();

//bj.act({action: 'sit', seat: 0, name: 'Tester0'});
//bj.act({action: 'sit', seat: 1, name: 'Tester1'});

//
//bj.addseat();
//bj.addseat();
//bj.addseat();
//bj.addseat();
//bj.addseat();
//bj.addseat();


//bj.shoe.cards[2].card = 'A';
//bj.shoe.cards[4].card = '4';
/*
bj.shoe.cards[3].card = '5';
bj.shoe.cards[4].card = '5';	
bj.shoe.cards[5].card = '5';
bj.shoe.cards[6].card = '5';
bj.shoe.cards[7].card = '5';
*/
//bj.act({action: 'sit', seat: 4, name: 'Tester'});
//bj.act({action: 'bet', seat: 4, amount: 99.5 });

//bj.addseat();
//bj.act({action: 'sit', seat: 2, name: 'Tester 2'});
//bj.act({action: 'bet', seat: 2, amount: 106.7 });

//bj.act({action: 'deal', seat: 0 });
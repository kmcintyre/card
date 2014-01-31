define(["jquery", "table_blackjack_ui", "table_blackjack", "table_client", "card"], function($, table_blackjack_ui, table_blackjack, table_client, card) {

	var bj = new table_blackjack();
	//bj.locked = true;
	bj.id = 'local';
	//bj.dd = false;
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
	
	function tablecast(json) {
		console.log('ignore:' + json);
	}				
	new table_client().set(tablecast);
	
	var ui = new table_blackjack_ui(bj, "#tables");

	bj.act = function(step) {
		console.log(step);
		if ( step.action == 'automate'  ) {			
			bj.automate = true;
			dealer(1500);			
		} else if ( step.action == 'manual' ) {
			if ( quicktimer ) { clearTimeout(quicktimer); }
			delete bj.automate;
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
			if ( bj.automate ) {
				opts[opts.length] = 'manual';
			} else {
				opts[opts.length] = 'automate';
			}
		}
		return opts;
	}
	
	$(function() {		
		$(window).resize( function() {
			ui.paint();
			ui.re();			
		});
		bj.addseat();		
		bj.act({action: 'sit', seat: 1, name: "10 x Min" });
		bj.seats[1].player.chips = bj.minimum * 10;
		bj.act({action: 'bet', seat: 1, amount: bj.minimum});
		
		//bj.shoe.cards[1].card = '8';
		//bj.shoe.cards[2].card = 'A';
		//bj.shoe.cards[3].card = '8';
		//bj.shoe.cards[4].card = '9';

		bj.addseat();
		bj.act({action: 'sit', seat: 2, name: "2 x Min" });
		bj.seats[2].player.chips = bj.minimum * 2;			
		bj.act({action: 'bet', seat: 2, amount: bj.minimum});
		
		//bj.shoe.cards[3].card = 'A';
		
		bj.act({action: 'automate', table: bj.id});
		//bj.act({action: 'deal', seat: 0, table: bj.id});
		
		$("#" + bj.id + " > .options").hide();
		$("#" + bj.id + " > .title").click(function (e) {
			$("#" + bj.id + " > .options").toggle(); 
		});
		
		
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
define(["jquery", "table_blackjack_ui", "table_blackjack", "table_blackjack_conf","card", "shoe"], function($, table_blackjack_ui, table_blackjack, table_blackjack_conf, card, shoe) {

	if(typeof(Storage)!=="undefined") {
		//no storage
	} else {
		//need to check cookies.
	}
	
	var bj = new table_blackjack(8);
	//bj.locked = true;
	bj.id = 'local';
	bj.title = '6 deck shoe';
	bj.shoe.shuffle();
	bj.shoe.burn();
	
	var table_conf = new table_blackjack_conf(bj);			
	var ui = new table_blackjack_ui(bj, "#tables", "#tablecanvas");	
	
	bj.act = function(step) {
		if ( step.conf ) {
			console.log('configure');
			table_conf.act(step);
		} else if ( step.action == 'paint' ) {
			ui.paint();
		} else {
			table_blackjack.prototype.act.call(this, step);
			if ( step.action == 'addseat' ) {
				ui.measure();
			}
		}
		ui.paint();
	}	
	
	bj.options = function() {
		var opts = table_blackjack.prototype.options.call(bj);
		if ( !this.locked ) {			
			//opts = opts.concat(table_conf.options());
		}		
		return opts;
	}	
	
	$(function() {
		//$(window).resize( function(e) {
		//	ui.measure();
		//	ui.act({action:"paint"});
		//});	
		ui.measure();		
		//bj.seats[1].bet = 100;
		//bj.seats[1].ante = 100;
		//bj.seats[1].payout = 100;
		//bj.seats[1].lock = 100;		
		//bj.act({action: 'addseat'});
		//bj.seats[2].bet = 100;
		//bj.seats[2].ante = 100;
		//bj.seats[2].payout = 100;
		//bj.seats[2].lock = 100;	
		//bj.act({action: 'paint'});
		//
		//
		//bj.act({action: 'dispense', amount: 100, seat: 1});
		/*bj.shoe.cards[1].card = 'A';
		bj.shoe.cards[2].card = 'A';
		bj.shoe.cards[3].card = 'A';
		bj.shoe.cards[4].card = '6';
		bj.shoe.cards[5].card = 'A';
		bj.shoe.cards[6].card = 'A';-		
		 * 
		 */
		//bj.act({action: 'sit', seat: 4});
		//bj.act({action: 'dispense', seat: 4, amount: bj.minimum});
		//
		//bj.act({action: 'bet', seat: 4, amount: 150});
		//bj.act({action: 'deal', seat: 0, table: bj.id});		
		//setTimeout( function() { 
		//	bj.act({action: 'deal', seat: 0, table: bj.id}); }, 
		//	1000
		//);
		//bj.act({action: 'deal', seat: 0, table: bj.id});
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
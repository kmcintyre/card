define(["jquery", "table_blackjack_ui", "table_blackjack", "table_blackjack_conf","card", "shoe"], function($, table_blackjack_ui, table_blackjack, table_blackjack_conf, card, shoe) {
	
	var bj = new table_blackjack();
	//bj.locked = true;
	bj.id = 'local';
	bj.title = '6 deck shoe';
		
	var ui = new table_blackjack_ui(bj, "#tables", "#tablecanvas");	
	var table_conf = new table_blackjack_conf(bj);
	
	bj.act = function(step) {
		if ( isNaN(parseInt(step.seat)) ) {
			if ( step.action == 'paint'  ) {
				ui.paint();
			} else { 
				console.log('configure');
				table_conf.act(step);
			}
		} else {
			table_blackjack.prototype.act.call(this, step);
		}
		ui.paint();
	}	
	
	bj.options = function() {
		var opts = table_blackjack.prototype.options.call(bj);
		if ( !this.locked ) {			
			opts[opts.length] = 'add seat';
			opts[opts.length] = 'dealer';		
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
			opts[opts.length] = 'denom';
		}
		return opts;
	}	
	
	$(function() {
		ui.measure();
		$(window).resize( function() {
			ui.measure();
			bj.act({action: 'paint'});
		});
		/*bj.shoe.cards[1].card = 'A';
		bj.shoe.cards[2].card = 'A';
		bj.shoe.cards[3].card = 'A';
		bj.shoe.cards[4].card = '6';
		bj.shoe.cards[5].card = 'A';
		bj.shoe.cards[6].card = 'A';-		
		 * 
		 */
		bj.act({action: 'sit', seat: 4});
		//bj.act({action: 'paint'});
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
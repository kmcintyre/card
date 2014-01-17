define(["jquery", "table_ui", "table_blackjack"], function($, table_ui, table_blackjack) {
	
	var fixed = false;

	var bj = new table_blackjack();
	
	bj.addseat();

	bj.shoe.cards[1].card = '5';
	bj.shoe.cards[2].card = '5';
	bj.shoe.cards[3].card = '5';
	bj.shoe.cards[4].card = '5';	
	bj.shoe.cards[5].card = '5';
	bj.shoe.cards[6].card = '5';
	bj.shoe.cards[7].card = '5';
	
	bj.act({action: 'sit', seat: 1, name: 'Tester'});
	bj.act({action: 'bet', seat: 1, amount: 99.5 });

	//bj.addseat();
	//bj.act({action: 'sit', seat: 2, name: 'Tester 2'});
	//bj.act({action: 'bet', seat: 2, amount: 106.7 });
	
	bj.act({action: 'deal', seat: 0 });	
	bj.options();
	
	var ui = new table_ui(bj);
	
	bj.act = function(step) {
		console.log('intercept act');
		table_blackjack.prototype.act.call(this, step);		
		bj.options();
		ui.paint();
		ui.re();
	} 
	
	$(function() {						
		new table_ui(bj).paint("#tables");		
		$("body").css("overflow", "hidden");		
		$(window).resize( function() { ui.re(); });
		ui.re();
	});	
	
});
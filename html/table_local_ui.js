define(["jquery", "table_ui", "table"], function($, table_ui, table) {

	var bj = new table();
	
	bj.options();	
	
	var ui = new table_ui(bj, "#tables");	
	
	bj.act = function(step) {
		console.log('intercept act');
		table.prototype.act.call(this, step);		
		bj.options();
		ui.paint();
		ui.re();
	} 	
	
	$(function() {
		ui.paint();		
		//$("body").css("overflow", "hidden");				
		ui.re();
		$(window).resize( function() { ui.re(); });
	});	
	
	
	bj.addseat();
	bj.addseat();
	bj.addseat();
	
	bj.act({action: 'sit', seat: 0, name: 'Tester0'});
	bj.act({action: 'sit', seat: 1, name: 'Tester1'});
	
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
	
});
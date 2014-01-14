define(["jquery", "cardutil", "war", "deck"], function($, cardutil, war, deck) {

	var d = new deck();
	var cardcounter = 0;
	var offset = 15;
	var card_width = 223;
	var card_height = 312;

	$(function() {

	  d.cards = cardutil.shuffle(d.cards);
	
	  $(window).resize(function() {
		$("#cardlink").css("width", card_width );
		$("#cardlink").css("height", card_height );
		
		$("#cardtable").css("width", document.body.clientWidth - $("#welcome").width() - 20 * 2 );
		$("#cardtable").css("height", document.body.clientHeight - 20 * 2 );
		
		$('#bottom_card').css( { left: $("#cardtable").width() / 2 - card_width - offset, top: card_height / 2} );		
		$("#middle_card").css( { left: $("#cardtable").width() / 2 - card_width / 2, top: -offset} );
		$("#top_card").css( { left: $("#cardtable").width() / 2 + offset, top: card_height / 2 } );
		$("#extra_card").css( { left: $("#cardtable").width() / 2 - card_width / 2, top: card_height + offset } );		
						
		$("#feelings").css( { right: $("#cardtable").width() / 2 + card_width / 2, top: card_height / 2 - $('#feelings').height() } );
		$("#mutual").css( { left: $("#cardtable").width() / 2 + card_width / 2, top: card_height / 2 - $('#mutual').height() } );
				
	  });
	  
	  $(window).resize();
	  
	  function changeCards() {
	  	if ( cardcounter > 51 ) {
	  		d.cards = cardutil.shuffle(d.cards);
	  		cardcounter = 0;  		
	  	}
	  	
	  	$('#bottom_card').attr('src', '/deck/' + d.cards[cardcounter++] + '.svg' );
	  	$('#middle_card').attr('src', '/deck/' + d.cards[cardcounter++] + '.svg' );
	  	$('#top_card').attr('src', '/deck/' + d.cards[cardcounter++] + '.svg' );
	  	$('#extra_card').attr('src', '/deck/' + d.cards[cardcounter++] + '.svg' );
	  	if ( !$("#cards").children().is(":visible") ) {
	  		$("#cards").children().show("slow");
	  	}	  	
	  }
	  
	  changeCards();
	  
	  $("#welcome").click(function () {
		if (  !$("#feelings").is(":visible") ) {
			$("#feelings").show("slow");
			$("#mutual").show("slow");
		}
		changeCards();
	  });
	
	  $(".card").click(function () {
		if (  !$("#feelings").is(":visible") ) {
			$("#feelings").show("slow");
			$("#mutual").show("slow");
		}
		changeCards();
	  });  
	  
	  
	  $("#feelings").click(function () {
	  	changeCards();	
		window.open('https://play.google.com/store/apps/details?id=com.nwice.card');
	  });
	  $("#mutual").click(function () {
	  	changeCards();	
		window.open('https://play.google.com/store/apps/details?id=com.nwice.card');
	  });  
	});
});
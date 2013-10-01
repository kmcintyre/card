define(["jquery", "war", "deck"], function($, war, deck) {	
	var war = new war();
	var continuoustimer = null;
	console.log('war:' + war);
	
	$(function() {
			function load_deck() { 
				if ( !$("#deck").attr('loaded') ) {
					var d = new deck();			
					for (var i = 0; i < d.cards.length; i++ ) {			
						var $elem = "<img id=\"" + d.cards[i] + "\" class=\"card\" src=\"/deck/" + d.cards[i] + ".svg\">";			
						$("#deck").append($elem);
					}			
					$("#deck").attr('loaded', true);			
				}
				}
				
				function player_display(p) {
					$("#" + p + " > .warpile").empty();		
					for (var i = 0; i < war.players[p].warpile.length; i++ ) {
						if ( i % (war.props["warbury"] + 1) == 0 || ( i + 1 == war.players[p].warpile.length && war.players[p].cardCount() == 0 ) ) {
							var $elem = $("#" + war.players[p].warpile[i]).clone();
							$elem.click(function () { $("#gather").click() });
							$("#" + p + " > .warpile").append( $elem );
						} else {				
							var $elem = $("#" + $("#cardback:checked").val() + "_Back").clone();
							//$elem.click(function () { alert("yo"); });
							$("#" + p + " > .warpile").append( $elem );
						}				
					} 
					$("#" + p + " > .playpile").empty();
					if ( war.players[p].playpile.length > 0 ) {
						var $elem = $("#" + $("#cardback:checked").val() + "_Back").clone();
						$elem.click(function () { $("#war").click() });
						$("#" + p + " > .playpile").append( $elem ); 			
						$("#" + p + " > .playpile").append( "<br>" + war.players[p].playpile.length  );
					} else {
						$("#" + p + " > .playpile").append( $("#Blank_Card").clone() );
					}
					
					$("#" + p + " > .winpile").empty();		
					if ( war.players[p].winpile.length > 0 ) {
						var $elem = $("#" + $("#cardback:checked").val() + "_Back").clone()
						$("#" + p + " > .winpile").append( $elem ); 			
						$("#" + p + " > .winpile").append( "<br>" + war.players[p].winpile.length  );
					}
				}
				
				function display_preferences() {
					var p = new_game_preferences();
					for (var k in p) { $("#" + k + "_value").html('' + p[k]); }		
				}
				
				display_preferences();
				
				function new_game_preferences() {
			     	var ba = [];
					$("input[name=\"beataces\"]:checked").each(function() {
			       		ba.push( parseInt($(this).val().substring(0,1)));
			     	});
			     	
			     	return {
						"beatsace" : ba,
						"shufflewinpile": $("#shuffle").prop('checked'), 
						"warbury": parseInt( $("#warbury").val() )
					}
				}
				
				function war_display() {
					player_display("player1");
					player_display("player2");
				} 
						
				function cardsize_pref() {
					if ( $("#autoresize").prop('checked') ) {
						$(".card").width( $(window).width() / 10.0 );
						$(".card").height( $(".card").width() * 1.4 );
					}
				}
			
				function result_pref() {
					$("#gameresults").css( 
						{ "left": window.innerWidth / 2 - $("#gameresults").width() / 2 , "top": window.innerHeight / 2 - $("#gameresults").height() / 2 } 
					);		
				}
				
				$(window).resize( function() {
					result_pref();
					cardsize_pref();
				});
					
				$("#startgame").click(function () {
					load_deck();
					
					$("#gameresults, .panel").hide();
					
					war.start(new_game_preferences());
					$("#game").show();
					war_display();
					
					if ( $("#autocont").prop("checked") ) {
						$("#continouswar").click();
					}		
				});
						
				$("#gather").click(function () {
					war.gather();
					war_display();
				});		
						
				$("#war").click(function () {
					try {			
						war.war();
						war_display();
					} catch (err) {
						$("#stopcontinouswar").click();
						$("#gameresults").html(err["outcome"]);
						result_pref();
						$("#gameresults").show();
						$("#endgame").click();
						throw err;
					}
				});
			
				$("#continouswar").click(function () {
					$("#continouswar").hide();
					$("#stopcontinouswar").show();
					try {
						$("#war").click();	
						continuoustimer = window.setTimeout( function() {
							$("#continouswar").click();
						}, parseInt( $("#delaymillis").val() ) );
					} catch (err) {
						throw err;				
					}			
				});	
				
				$("#stopcontinouswar").click(function () {
					window.clearTimeout(continuoustimer);
					$("#stopcontinouswar").hide();
					$("#continouswar").show();	
				});	
			
				$("#endgame").click(function () {
			
					war.quit();
					
					if ( !$("#gameresults").is(":visible") ) {
						$("#gameresults").html("Quit Game");
						$("#gameresults").show();
					}
			
					if ( $("#autorestart").prop("checked") ) {
						window.setTimeout( function() {				
							$("#startgame").click();
						}, parseInt( $("#resultdelaymillis").val() ) );
					}			
					
				});
					
				$("#sitecontrols > button").click( function() {
					$("#" + $(this).attr('id') + "Panel").toggle();
				});
				
				$(window).resize();
				
				$("#shuffle, #warbury, input[name=\"beataces\"]").change( function() {
					display_preferences();
				});
				
				if ( $("#autorestart").prop("checked") ) {
					$("#startgame").click();
				} else {
					$("#newgame").click();
				}
    });
	
});

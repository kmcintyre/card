$(document).ready(function() {	

	if ( $('#room').length == 0 ) {
		$(document.body).append('<div id="room"/>');
	}
	if ( $('#players').length == 0 ) {
		$('#room').append('<div id="players"/>');
	}
	if ( $('#games').length == 0 ) {
		$('#room').append('<div id="games"/>');
	}		
	
	$('#room').on('updateplayers', function() {
		for (var key in gameroom.players) {
			if ( $('#players > .' + key).length == 0 ) {
				$('#players').append( '<div class="' + key + '">' + key + '</div>' );
				$('#players > .' + key).on('click', function() {
					$(this).toggleClass('selectedplayer');
				});					
			} 			
		}
	});	

	$('#room').on('updategames', function() {		
		for (var key in gameroom.games) {
			if ( $('#games > .' + key).length == 0 ) {
				$('#games').append( '<div class="' + key + '">' + key + '</div>' );
				$('#games > .' + key).on('click', function() {
					$(this).toggleClass('selectedgame');
				});	
			} 			
		}
	});	
	
	$(document).on('newplayer', function() { $('#room').trigger('updateplayers'); } );
	$(document).on('newgame', function() { $('#room').trigger('updategames'); } );
	
	var gameroom = new Gameroom("test");
	gameroom.enter( new Player("anon") );	
	gameroom.game( new Game("anon") );
});

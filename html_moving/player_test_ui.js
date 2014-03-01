define(["jquery", "player"], function($, player) {
	$(function() {
		console.log('player test ui');
		$("#player1").html( new player().toString() );
		
		$("#playerBob").html( new player('Bob').toString() );
	});
});

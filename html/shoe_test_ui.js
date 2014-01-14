define(["jquery", "shoe"], function($, shoe) {	
	$(function() {
		var s = new shoe();
		$("#shoe1").html( s.toString() + "<br>shuffled:" + s.cards );
		
		s.cut(140);		
		$("#shoe2").html( s.toString() );
		
		$("#burn1").html( s.burn(5).toString() + "<br>" + s.toString() );
		
		s.penetration = 52;
		s.played = 275;
		$("#shoe3").html( s.toString() );
		
		$("#shoe4").html( new shoe(2).toString() );
    });	
});

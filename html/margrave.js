require(['domReady!', 'deck' ], function (doc, deck) {
		
	var autotimer = null;
	var delay = 50;

	var p1array = new Array(0, 4, 8, 12,16,20,24,25)
	var p2array = new Array(26,30,34,38,42,46,50,51);
	
	var statsarray = [0,0,0,0,0,0,0,0];
	
	var plays = 0;	

	if ( delay != doc.getElementById("delay").value ) {
		doc.getElementById("delay").value = delay;
	}
	
	do_play = function(){
		plays++;
		var d = new deck(true);
		for (var i = 0; i < 8; i++) {
			if ( d.cards[p1array[i]].card != d.cards[p2array[i]].card ) {
				statsarray[i]++;
				return;
			} 
		}
		statsarray[7]++;
	};	
				
 	update_occurrence = function() {
		var sum = 0;
		for (var i = 8; i >= 0; i--) {
			sum += parseInt( doc.getElementById("match" + i).value );
			doc.getElementById("occurrence" + i).value = sum / parseInt(document.getElementById("plays").value);
		}
	};
	
	update_totals = function() {
		doc.getElementById("plays").value = plays
		for (var i = 0; i < 8; i++) {		
			doc.getElementById("match" + i).value = statsarray[i];		
		}
	};
	
	automate = function () {	
		try {
			do_play();
			update_totals();
			update_occurrence();
			autotimer = window.setTimeout(function () { automate(); }, delay );						
		} catch (err) {
			alert('shoud not get here!' + err);
			throw err;
		}		
	};

	doc.getElementById("start").onclick = function() {
		automate();
	};
	
	doc.getElementById("end").onclick = function() {
		window.clearTimeout(autotimer);
	};

	doc.getElementById("setdelay").onclick = function() {
		delay = doc.getElementById("delay").value;
	};
		
});

define(['domReady!', 'war' ], function (doc, war) {
	
	var game = new war();
	var autotimer = null;
	
	automate = function(){
					
		game.start( {'beatsace': new Array(2), 'shufflewinpile': true, 'warbury': 3 } );
		
		loopcount = 0;
		try {
			loopcount = 0;
			while (true) {					
				game.war();
				loopcount++;
			}				
		} catch (err) {
			document.getElementById("outcome").value = err["outcome"];
			document.getElementById("warcount").value = loopcount;
			
			document.getElementById("battletotals").value = parseInt(document.getElementById("battletotals").value) + loopcount;
			
			if ( loopcount > parseInt(document.getElementById("battlemax").value) ) {
				document.getElementById("battlemax").value = '' + loopcount; 
			}
	
			if ( loopcount < parseInt(document.getElementById("battlemin").value) ) {
				document.getElementById("battlemin").value = '' + loopcount; 
			}
			
			for (var i = 1; i < 10; i++ ) {
				var w = err["war" + i];
				document.getElementById("war" + i).value = w;
				document.getElementById("war" + i + "totals").value = parseInt(document.getElementById("war" + i + "totals").value) + w;
				if ( document.getElementById("war" + i + "record").value < w ) {
					document.getElementById("war" + i + "record").value = w;
				}
			} 
					
			if ( err["outcome"] == "Player 1 Wins!") {
				document.getElementById("p1w").value++;
			} else if ( err["outcome"] == "Player 2 Wins!") {
				document.getElementById("p2w").value++;
			} else {
				document.getElementById("cg").value++;
				endautomate();
				throw "cat's game";
			}
			
			autotimer = window.setTimeout(function () { automate(); }, 0);
		}		
	}

	doc.getElementById("start").onclick = function() {
		automate();
	};
	
	doc.getElementById("end").onclick = function() {
		window.clearTimeout(autotimer);
	};
});
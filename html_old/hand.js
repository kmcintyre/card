define(function() {
	
    function hand(table) {
    	this.table = table;
    	this.plays = new Array();    	
    	this.isdone = false;
    	this.solicitbet();
    };
    
    hand.prototype.last = function() {
    	return this.plays[this.plays.length - 1];
    }
        
    /*
    hand.prototype.play = function() {
    	console.info('hand play length:' + this.plays.length);
    	if ( !this.isdone ) {    		
    		if ( this.plays.length == 0 ) { 
    			console.info('start hand')
				var p = 'START';
				this.plays[this.plays.length] = p;
				this.play();
    		} else if ( this.last().toString() == 'START' ) {
    			this.solicitbet();
    		    setInterval(function(){
    		       this.play();
    		    }, 5000);
    		} else {
    			console.info('last:' + this.last());    			
    		} 
    	} else {
    		raise 
    		console.info('done last:' + this.last())
    	}
    }
    */
    
    return hand;
});
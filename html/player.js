define(function() {

    function player(client) {
    	this.client = client;
    	this.chips = 5000;
    	this.seat = 'blah';     	
    }
        
    player.prototype.bet = function(b) {
    	console.info('bet:' + b);
    }
    
    player.prototype.toString = function() {
  		return 'player chips:' + this.chips;
    }    
    
    return player;
    
});
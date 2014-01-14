define(function() {

    function player(name, client, chips) {
    	this.name = name;
    	this.client = client;
    	this.chips = chips;
    }
    
    player.prototype.toString = function() {
  		return 'player: ' + this.name;
    }    
    
    return player;
    
});
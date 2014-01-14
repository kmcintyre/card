define(function() {

    function player(name, chips) {
    	this.name = name;
    	this.chips = (chips > 0 ? chips : 0);
    }
    
    player.prototype.give = function(c) {
    	this.chips = this.chips + c;
    }
    
    player.prototype.take = function(c) {
    	this.chips = this.chips - c;
    }
    
    player.prototype.toString = function() {
  		return (this.name ? this.name : 'Unknown') + ' chips:' + this.chips;
    }    
    
    return player;
    
});
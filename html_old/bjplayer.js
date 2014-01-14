define(["bjhand"], function(bjhand) {

	function bjplayer() {
		this.hand = null;
	}
	
	bjplayer.prototype.act = function(dealer_shows) {
    	console.info('act:' + dealer_shows);    	
    }
	
    return bjplayer;
});
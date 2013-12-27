define(["player", "table"], function(player, table) {
	
	var EventEmitter;
	if (typeof process === 'object' && process.title === 'node') {
	  // Node.js
	  EventEmitter = require('events').EventEmitter;
	} else {
	  // Browser
	  EventEmitter = require('emitter');
	}
	
    function tourney() {
    	EventEmitter.call(this);
    	this.disconnected = new Array();
		this.players = new Array();
		this.tables = new Array();		
		this.winners = new Array();
		this.started = false;
    };
    
    tourney.prototype = Object.create(EventEmitter.prototype);

    tourney.prototype.findtable = function(c) {
    	console.info('findtable:' + c);
    	for (x = 0; x < this.tables.length; x++) {
    		for (var y = 0; y < this.tables[x].players.length; y++) {
    			if ( this.tables[x].players[y].client == c) {
    				console.info('found table:' + c);
    				return this.tables[x]
    			}
    		}
    	}    	 
    }
    
    tourney.prototype.findplayer = function(c) {
    	console.info('findplayer:' + c);
    	for (x = 0; x < this.tables.length; x++) {
    		for (var y = 0; y < this.tables[x].players.length; y++) {
    			if ( this.tables[x].players[y].client == c) {
    				console.info('found player:' + c)
    				return this.tables[x].players[y];
    			}
    		}
    	}    	 
    }
    
    tourney.prototype.createtable = function(players) {
    	var t = new table(players);
    	t.on('next', function() { console.info('table next'); })
    	return t;
    } 
    
    tourney.prototype.sitplayers = function() {
    	console.log('tourney sitplayers:' + this.players.length);
    	var pl = this.players.length;
    	if ( pl > 0 ) {
    		if ( pl > 0 && pl < 7 ) {    			
        		this.tables[this.tables.length] = this.createtable(this.players.splice(0,pl));
    		} else if ( pl == 7 ) {
            	this.tables[this.tables.length] = new table(this.players.splice(0,pl));
        	} else if ( pl == 8 || pl == 9 ) {
        		this.tables[this.tables.length] = new table(this.players.splice(0,4));
        		return this.sitplayers(this.players);
        	} else if ( pl == 10 || pl == 11 || pl == 15 || pl == 16 ) {
        		this.tables[this.tables.length] = new table(this.players.splice(0,5));
        		return this.sitplayers(this.players);
        	} else if ( pl == 12 || pl == 13 || pl == 17 || pl == 18 ) {
        		this.tables[this.tables.length] = new table(this.players.splice(0,6));
        		return this.sitplayers(this.players);
        	} else {
        		this.tables[this.tables.length] = new table(this.players.splice(0,7));
        		return this.sitplayers(this.players);
        	}
    	}     	
    }
    
    tourney.prototype.isStarted = function() {
    	return this.started; 
    }
    
    tourney.prototype.start = function() {
    	console.info('tourney start');
    	this.started = true;
    	for (x = 0; x < this.tables.length; x++) {    		
    		this.tables[x].emit('next');
    	}    	
    }
        
    return tourney;
});
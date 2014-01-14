define(function() {

	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000)
		             .toString(16)
		             .substring(1);
	};

	function guid() {
		//return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
	     //    s4() + '-' + s4() + s4() + s4();
		return s4();
	}
	
	function table() {
		this.id = guid(); 
		this.nick = 'Untitled';
		this.seats = new Array();		
	};
	
	table.prototype.paint = function() {
		throw "Paint Shit";
	}
	
	table.prototype.json = function() {
		return JSON.stringify( { id: this.id, nick: this.nick, seats: this.seats } );
	}
	
	table.prototype.act = function(step) {
		try {
			if ( step.action == 'sit' ) {
				this.sit(step.seat, step);
			} else if ( step.action == 'stand' ) {
				this.stand(step.seat);
			}
			this.options();
		} catch (err) {
			console.log('ignore act:' + err);
		}
	}
	
	table.prototype.options = function() {
		for (var x = 0; x < this.seats.length; x++) {
			var opts = [];			
			if ( this.seats[x].player ) {
				opts[opts.length] = 'stand';			
			} else {
				opts[opts.length] = 'sit';
			}
			if ( this.seats[x].hand ) {
				opts = opts.concat(this.seats[x].hand.options());
			}			
			this.seats[x].options = opts;
		}
	}
	
	table.prototype.addseat = function() {
		console.log('add seat:' + this.seats.length);
		this.seats[this.seats.length] = { label : 'Seat ' + this.seats.length };
		this.options();
	}
	
    table.prototype.sit = function(seat, person) {
    	console.log('sit:' + seat + ' name:' + person.name);
    	if ( this.seats[seat].player ) {
    		throw "Seat Unavailable";
    	} else if ( !person.name ) {
    		throw "Need a name";
    	} else {
    		console.log('welcome:' + person.name );
			this.seats[seat].player = { name: person.name };
    	}    	
    }
		
    table.prototype.stand = function(seat) {
    	console.log('stand:' + seat + ' ' + this.seats[seat].player );
    	if ( this.seats[seat] && !this.seats[seat].hand && this.seats[seat].player ) {    		
    		delete this.seats[seat].player;
    		this.seats[seat].options = ['sit']
    	} else if (this.seats[seat].hand) {
    		throw "Active Hand";
    	} else if ( !this.seats[seat].player ) {
    		throw "Seat Not Taken";
    	} else {
    		throw "Something Else";
    	}
    }
	
	table.prototype.toString = function() {
  		return 'id:' + this.id + ' seats:' + this.seats;
    }
	
	return table;
});


/*
if ( t ) {
try {			
	console.log( 'table id-' + t.id );
	this.id = t.id;
	if ( t.seats && t.seats.length > 0 ) {
		console.log('has seats:' + t.seats.length);
		this.seats = new Array();					
		for (var x = 0; x < t.seats.length; x++) {
			this.addseat();
			if ( t.seats[x].player ) {
				console.info('sit incoming');
				this.sit(x, { name: t.seats[x].player.name } );
			}
		}
	} else {
		this.seats = new Array();					
	}
} catch (err) {
	console.log('bad table:' + err);
	throw err;
}			
} else {


	table.prototype.hands = function() {
    	for (var x = 0; x < this.seats.length; x++ ) {
    		if ( this.seats[x].hand != null ) {
    			return true;
    		}
    	}
    	return false;		
	}


*/
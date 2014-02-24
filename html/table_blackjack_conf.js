define(function() {

	var quicktimer = null;
	var autodealer = function(delay, auto_table) { 
		if ( quicktimer == null ) {
			try {
				if ( auto_table.seats[0].activeseat() == null && auto_table.seats[0].options().length > 0 && auto_table.seats[0].options()[0] == 'deal' && !quicktimer ) {
					quicktimer = setTimeout( function() { quicktimer = null; if ( auto_table.seats[0].activeseat() > 0 ) { return; } auto_table.act({ action: auto_table.seats[0].options()[0], seat: 0 }); }, 1000 * auto_table.seats.length);
				} else if ( auto_table.seats[0].activeseat() == 0 && !quicktimer ) {
					if ( auto_table.seats[0].hand0.options()[0] == 'insurance' ) {
						quicktimer = setTimeout( function() { quicktimer = null; if ( auto_table.seats[0].activeseat() > 0 ) { return; } auto_table.act({ action: auto_table.seats[0].hand0.options()[0], seat: 0 }); quicktimer = null; }, 4 * delay);
					} else {
						quicktimer = setTimeout( function() { quicktimer = null; if ( auto_table.seats[0].activeseat() > 0 ) { return; } auto_table.act({ action: auto_table.seats[0].hand0.options()[0], seat: 0 }); }, delay);
					}
				} else {
					console.log(auto_table.seats[0].options().length + ' options as:' + auto_table.seats[0].activeseat());
				}
			} catch (err) {
				console.log(err);
			}			
		}
		if ( auto_table.seats[0].player.name == 'otto' ) {
			setTimeout( function() { autodealer(delay, auto_table); }, delay );
		}
	}	
		
	function table_blackjack_conf(t) {
		this.configureable_table = t;
		this.quicktimer = null;
	}

	
	table_blackjack_conf.prototype.options = function() {
		var opts = new Array();
		opts[opts.length] = 'dealer';		
		opts[opts.length] = 'splits';
		opts[opts.length] = 'for less';			
		opts[opts.length] = 'for nothing';
		opts[opts.length] = 'double on';
		opts[opts.length] = 'ante';
		opts[opts.length] = 'soft 17';
		opts[opts.length] = 'blackjack pays';
		opts[opts.length] = 'insurance pays';
		opts[opts.length] = 'hole cards';
		opts[opts.length] = 'minimum';			
		opts[opts.length] = 'maximum';
		opts[opts.length] = 'denom';
		return opts;
	}

	
	table_blackjack_conf.prototype.act = function(step) {
		console.log(step);
		if ( step.action == 'splits'  ) {
			var nl = prompt("split limit",this.configureable_table.splitlimit);
			if ( !parseInt(nl) > 0 ) {
				nl = 3;
			} 			
			this.configureable_table.splitlimit = nl;
		} else if ( step.action == 'minimum' || step.action == 'maximum'  ) {
			var nm = prompt("table " + step.action,this.configureable_table[step.action]);
			if ( parseInt(nm) > 0 ) {
				this.configureable_table[step.action] = parseInt(nm);
			} else {
				this.configureable_table[step.action] = 0;
			}					
		} else if ( step.action == 'dealer'  ) {
			clearTimeout(quicktimer);
			var nd = prompt("manny or milli delay", this.configureable_table.seats[0].player.name);
			if ( parseInt(nd) >= 0  ) {
				this.configureable_table.seats[0].player.name = 'otto';
				autodealer(parseInt(nd),this.configureable_table);
			} else {
				this.configureable_table.seats[0].player.name = 'manny';
			}
		} else if ( step.action == 'faceup' ) {
			this.configureable_table.downdirty = false;					
		} else if ( step.action == 'ante' ) {
			if ( !step.ante ) {
				step.ante = parseInt(prompt("Ante (pos. integer)",this.configureable_table.ante));
			}
			this.configureable_table.ante = 0;
			if ( step.ante > 0 ) {
				console.log('set ante:' + step.ante);
				this.configureable_table.ante = step.ante;
			}			
		} else if ( step.action == 'downdirty' ) {
			this.configureable_table.downdirty = true;
		} else if ( step.action == 'blackjackpays' ) {			
			var blackjackpays = prompt("3 to 2, 6 to 5 or 1 to 1",this.configureable_table.blackjackpays);
			if ( blackjackpays == '3 to 2' || blackjackpays == '6 to 5' || blackjackpays == '1 to 1') {
				this.configureable_table.blackjackpays = blackjackpays;
			} else {
				this.configureable_table.blackjackpays = '3-2';
			}
		} else if ( step.action == 'denom' ) {									
			var denom = prompt("Any positive integer",this.configureable_table.denomination);
			if ( parseInt(denom) > 0  ) {
				this.configureable_table.denomination = parseInt(denom);
			} else {
				this.configureable_table.denomination = 1;
			}				
		} else if ( step.action == 'holecards' ) {			
			var holecards = prompt("(Not implemented) 2 or 1",this.configureable_table.holecards);
			if ( holecards != 2 || holecards != 1 ) {
				this.configureable_table.holecards = 2;
			} else {
				this.configureable_table.holecards = holecards;
			}
		} else if ( step.action == 'soft17' ) {			
			var soft17 = prompt("hit or stay",this.configureable_table.soft17);
			if ( soft17 == 'hit' || soft17 == 'stay' ) {
				this.configureable_table.soft17 = soft17;
			} else {
				this.configureable_table.soft17 = 'hit';
			}
			if ( this.configureable_table.seats[0].hand0 ) {
				this.configureable_table.seats[0].hand0.soft17 = this.configureable_table.soft17;
			}
		} else if ( step.action == 'insurancepays' ) {			
			var insurancepays = prompt("2 to 1",this.configureable_table.insurancepays);
			if ( insurancepays != '2 to 1' ) {
				this.configureable_table.insurancepays = '2 to 1';
			} else {
				this.configureable_table.insurancepays = insurancepays;
			}
		} else if ( step.action == 'surrender' ) {			
			var surrender = parseInt( prompt("true or false",this.configureable_table.surrender) );
			if ( surrender ) {
				this.configureable_table.surrender = true;
			} else {
				this.configureable_table.surrender = false;
			}					
		} else if ( step.action == 'doubleon' ) {
			var doubleon = prompt("double on (blank any 2 cards, -1 off)",this.configureable_table.doubleon);
			if ( doubleon && doubleon != '-1' ) {
				this.configureable_table.doubleon = new Array();
				$.each(doubleon.split(','), function() { 
					if ( parseInt(this) > 0 ) { console.log('add double on:' + this); this.configureable_table.doubleon[this.configureable_table.doubleon.length]=this;}
				});	
			} else if ( doubleon != '-1' ) {
				console.log('double off');
				this.configureable_table.doubleon = new Array();				
			} else {
				console.log('double any two cards');
				this.configureable_table.doubleon = new Array();				
			}				
		} else if ( step.action == 'fornothing' ) {
			var fornothing = prompt("split or double",this.configureable_table.fornothing);
			this.configureable_table.fornothing = new Array();
			if ( fornothing ) {
				$.each(fornothing.split(','), function() {
					if (this.length > 0 && this.configureable_table.fornothing.indexOf(this) < 0 ) {
						this.configureable_table.fornothing.push(this);
						if ( this.configureable_table.forless.toString().indexOf(this) < 0 ) { 
							this.configureable_table.forless.push(this);
						}
					}
				});	
			}			
		} else if ( step.action == 'forless' ) {
			var forless = prompt("for less (split,double,insurance)",this.configureable_table.forless);
			this.configureable_table.forless = new Array();
			if ( forless ) {
				$.each(forless.split(','), function() {
					if ( this.configureable_table.forless.indexOf(this) < 0 ) {
						console.log('add forless:' + this);
						this.configureable_table.forless.push(this);
					}
				});	
				$.each(this.configureable_table.fornothing, function(i) {
					console.log('wtf?' + i + ' ' + this);
					if ( this.configureable_table.forless.toString().indexOf(this) < 0 ) {
						console.log('slice' + i);
						this.configureable_table.fornothing.slice(i,1);
					}
				});				
			} else {
				this.configureable_table.fornothin = new Array();
			}					
		} 
		
		if ( this.configureable_table.denomination > this.configureable_table.min ) {
			 console.log('maybe raise min');
		}
		if ( this.configureable_table.max < this.configureable_table.min ) {
			 console.log('max below min');
		}		
	} 
	
	return table_blackjack_conf;
});	
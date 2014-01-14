function Game(name, src) {
	if ( name == null ) {
		throw "Game Has No Name"; 
	}
	this.name = name;
	this.src = src;
	this.loadgame();	
}

Game.prototype.isLoaded = function() {
	return this.loaded;
}

Game.prototype.loadgame = function() {

    var script = document.createElement('script');
    
    script.onload = function() {
    	document.dispatchEvent(new CustomEvent('newgame'));
    };
    script.setAttribute('src', 
    	(this.src == null ? this.name + '.js' : this.src)
    );
    script.setAttribute('type', 'text/javascript');    
    document.head.appendChild(script);
}

Game.prototype.toString = function() { 
	return this.name;
}
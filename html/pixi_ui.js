define(["jquery", "pixi", "table_blackjack"], function($, PIXI, table_blackjack) {
	
	$(function() {
		
		//var bj = new table_blackjack();
		
		//bj.addseat();
		//bj.addseat();
		//bj.addseat();
		//bj.addseat();
		//bj.addseat();
		//bj.addseat();
		//bj.addseat();
		
		// create an new instance of a pixi stage
	    var stage = new PIXI.Stage(0x66FF99);	 	   
	    var renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight);	    
	    $(window).resize( function() { console.log('resize'); renderer.resize(window.innerWidth, window.innerHeight); renderer.render(stage);  } );
	 
	    // add the renderer view element to the DOM
	    document.body.appendChild(renderer.view);
	 
	    // create a texture from an image path
	    var texture = PIXI.Texture.fromImage("/deck/Blue_Back.png");
	    
	    // create a new Sprite using the texture
	    var bunny = new PIXI.Sprite(texture);
	 
	    // center the sprites anchor point
	    bunny.anchor.x = 0.5;
	    bunny.anchor.y = 0.5;
	 
	    // move the sprite t the center of the screen
	    bunny.position.x = 400;
	    bunny.position.y = 300;
	 
	    stage.addChild(bunny);
	 
	    function animate() {
	    	console.log('animate')
	        //requestAnimFrame( animate );
	 
	        // just for fun, lets rotate mr rabbit a little
	        //bunny.rotation += 0.1;
	 
	        // render the stage  
	        renderer.render(stage);
	    }
	    
	    requestAnimFrame( animate );
	    
		console.log('got here')
		
		
		/*
		 * http://stackoverflow.com/questions/6061880/html5-canvas-circle-text/6062195#6062195
		 * 
		function textCircle(text,x,y,radius,space,top){
	           space = space || 0;
	           var numRadsPerLetter = (Math.PI - space * 2) / text.length;
	           ctx.save();
	           ctx.translate(x,y);
	           var k = (top) ? 1 : -1; 
	           ctx.rotate(-k * ((Math.PI - numRadsPerLetter) / 2 - space));
	           for(var i=0;i<text.length;i++){
	              ctx.save();
	              ctx.rotate(k*i*(numRadsPerLetter));
	              ctx.textAlign = "center";
	             ctx.textBaseline = (!top) ? "top" : "bottom";
	             ctx.fillText(text[i],0,-k*(radius));
	              ctx.restore();
	           }
	           ctx.restore();
	        }
		*/
	});	
	
});
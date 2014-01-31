requirejs.config({

	urlArgs: "bust=v2",
	
    "paths": {
      "jquery": "//ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min"
    }

});

// Load the main app module to start the app

requirejs(["table_blackjack_client_ui"]);
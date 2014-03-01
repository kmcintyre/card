requirejs.config({

	urlArgs: "bust=v2",
	
    "paths": {
      "jquery": "//ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min"
    }

});

requirejs(["deck_test_ui"]);
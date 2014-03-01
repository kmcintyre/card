requirejs.config({
	urlArgs: "bust=beta",	
    "paths": {
      "jquery": "//ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min"
    }

});
requirejs(["index_ui"]);
requirejs.config({
    "paths": {
      "jquery": "//ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min"
    }
});

// Load the main app module to start the app

requirejs(["shoe_ui"]);
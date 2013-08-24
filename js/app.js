requirejs.config({
	"baseUrl": "js/lib",
	"paths": {
		"app": "../app",
		"jquery": "//ajax.googleapis.com/ajax/libs/jquery/jquery-1.10.2/jquery.min"
	}
});

requirejs(["app/main"]);
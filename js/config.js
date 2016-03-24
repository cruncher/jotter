(function(window) {
	var Sparky = window.Sparky;

	// Change tags to {[property]}
	Sparky.tags(/\{\[{1,2}/, /\]{1,2}\}/);

	// Stop Sparky parsing the DOM automatically
	Sparky.onContentLoaded = Sparky.noop;

})(this);

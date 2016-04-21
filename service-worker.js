importScripts('toolbox/sw-toolbox.js');

//toolbox.options.debug = true;

toolbox.precache([
	"index.html",

	"bolt/css/normalise.css",
	"bolt/css/form.css",
	"bolt/css/block.css",
	"bolt/css/card.css",
	"bolt/css/index.css",
	"bolt/css/layer.css",
	"bolt/css/button.css",
	"bolt/css/bubble.css",
	"bolt/css/thumb.css",
	"bolt/css/grid.css",
	"bolt/css/text.css",
	"bolt/css/color.css",
	"bolt/css/utilities.css",
	"bolt/css/dom.css",
	"bolt/css/nav.css",
	"bolt/css/space.css",
	"bolt/css/action.css",
	"css/bubble.css",
	"css/form.css",
	"css/dom.css",

	"bolt/js/jquery-2.1.4.js",
	"bolt/package/js/bolt-0.9.8.js",
	"showdown/dist/showdown.js",
	"sparky/package/sparky.js",
	"sparky/js/sparky.filters.js",
	"sparky/js/sparky.fn.js",
	"sparky/plugins/sparky.fn.suggest.js",
	"js/jotter.js",
	"js/config.js"
]);

console.log('SERVICE WORKER');

toolbox.router.get(/\/jotter\/[\w\-]+\.txt$/, function(request) {
  return new Response('REQUEST .txt file');
});

toolbox.router.get(/\/jotter\/[\w\-]+\.md$/, function(request) {
  return new Response('REQUEST .md file');
});

toolbox.router.get(/\/jotter\/[\w\-]+\.html$/, function(request) {
  return new Response('REQUEST .html file');
});

toolbox.router.get(/\/jotter\/[\w\-]+\.css$/, function(request) {
  return new Response('REQUEST .css file');
});

toolbox.router.get(/\/jotter\/[\w\-]+\.json$/, function(request) {
  return new Response('REQUEST .json file');
});

toolbox.router.get(/\/fonts.googleapis.com\//, toolbox.cacheFirst);
toolbox.router.get(/\/fonts.gstatic.com\//, toolbox.cacheFirst);

toolbox.router.get(/\/bolt\//, toolbox.cacheFirst);
toolbox.router.get(/\/sparky\//, toolbox.cacheFirst);
toolbox.router.get(/\/showdown\//, toolbox.cacheFirst);
toolbox.router.get(/\/css\//, toolbox.cacheFirst);
toolbox.router.get(/\/js\//, toolbox.cacheFirst);

toolbox.router.get(/\/jotter\/[\w\-]*$/, function(request) {
	return self.caches.match('index.html');
});

// By default, all requests that don't match our custom handler will use the toolbox.networkFirst
// cache strategy, and their responses will be stored in the default cache.
toolbox.router.default = toolbox.networkFirst;

// Boilerplate to ensure our service worker takes control of the page as soon as possible.
//self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
//self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

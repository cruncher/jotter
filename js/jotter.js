(function(window) {
	var assign = Object.assign;
	var Sparky = window.Sparky;
	var dom = Sparky.dom;
	var storage = window.localStorage;
	var slugify = Sparky.filters.slugify;

	var path = '/jotter/';
	var rallspaces =  /^\s*$/;

	var data = {
		slug: '',
		name: '',
		text: '',
		'html-active': false
	};

	var scope = {
		data: data
	};

	var title = Sparky('title', data, returnScope);
	var editor = Sparky('body', data, function(){
		assign(this.fn, {
			'delete-on-click': deleteOnClick,
			'sparkify': sparkify
		});

		return scope;
	});

	function returnScope() {
		return scope;
	}

	function setupStorage(storage) {
		if (!storage.getItem('')) {

			storage.setItem('', JSON.stringify({
				slug: '',
				name: '',
				text: 'This is Jotter.\n\n' +
					'To show a jot enter it\'s name in the ✎ Title bar.\n' +
					'To create or edit the jot, start typing.\n' +
					'Jots are saved locally as you type.\n\n' +
					'Type \'index\' for an html jot that lists your jots.\n',
				'html-active': false
			}));
		}

		if (!storage.getItem('index')) {
			storage.setItem('index', JSON.stringify({
				slug: 'index',
				name: 'Index',
				text: '<h1 class="text-2">Jots</h1>\n\n' +
					'<ul class="index">\n' +
					'  <li data-scope="{[jots]}" data-fn="each">\n' +
					'    <a href="{[slug]}">{[name]}{[name|yesno:"","/"]}</a>\n' +
					'  </li>\n' +
					'</ul>\n',
				'html-active': true
			}));
		}

		scope.jots = getLocalJots();
	}

	function deleteOnClick(node) {
		node.addEventListener('click', function(e) {
			storage.removeItem(data.slug);
			load();
		});
	}

	function sparkify(node) {
		var child;
		var fns = this.interrupt();

		this.on('scope', function(sparky, html) {
			if (child) { child.destroy(); }
			child = undefined;

			if (!html) { return; }

			var converter = new showdown.Converter();
			var template = dom.create('template', converter.makeHtml(html));
			var content = dom.fragmentFromContent(template);

			// Futile attempt to prevent against attacks. I'm sure this is
			// horribly naive.
			dom.remove(content.querySelectorAll('html'));
			dom.remove(content.querySelectorAll('head'));
			dom.remove(content.querySelectorAll('body'));
			dom.remove(content.querySelectorAll('script'));
			dom.remove(content.querySelectorAll('embed'));
			dom.remove(content.querySelectorAll('object'));
			dom.remove(content.querySelectorAll('link'));
			dom.remove(content.querySelectorAll('meta'));

			var div = Sparky.dom.create('div', '');
			dom.append(div, content);

			child = sparky.create(div, undefined, function(node) {
				return {
					barf: 'Barf!',
					jots: getLocalJots()
				};
			});

			Sparky.dom.append(node, child);
		});
	}

	function getLocalJots() {
		var array = [];
		var n = storage.length;

		while (n--) {
			array.push(JSON.parse(storage.getItem(storage.key(n))));
		}

		return Collection(array, { index: 'slug' });
	}

	function update(){
		scope.requested = true;
	}

	function Throttle(fn, time) {
		var flag = false;
		var context, args;

		function update() {
			fn.apply(context, args);
			flag = false;
		}

		return function() {
			context = this;
			args = arguments;

			if (flag) { return; }
			flag = true;

			setTimeout(update, time);
		};
	}

	var save = Throttle(function save() {
		if (!data.text || rallspaces.exec(data.text)) {
			return;
		}

		var location = window.location;

		data.slug = slugify(data.name);
		storage.setItem(data.slug, JSON.stringify(data));
		console.log('Saved', data.slug);
		window.history.pushState(data, data.name, path + data.slug);
		scope.requested = false;
	}, 500);

	var load = Throttle(function load() {
		var json = storage.getItem(slugify(data.name));

		Sparky.unobserve(data, 'name', save);
		Sparky.unobserve(data, 'name', load);
		Sparky.unobserve(data, 'text', save);
		Sparky.unobserve(data, 'text', update);
		Sparky.unobserve(data, 'html-active', save);

		if (json) {
			console.log('Loaded', slugify(data.name));
			assign(data, JSON.parse(json));
		}
		else {
			scope.requested = true;
			data.text = '';
			data.slug = '';
			data['html-active'] = false;
		}

		Sparky.observe(data, 'name', save, false);
		Sparky.observe(data, 'name', load, false);
		Sparky.observe(data, 'text', save, false);
		Sparky.observe(data, 'text', update, false);
		Sparky.observe(data, 'html-active', save, false);
	}, 100);

	setupStorage(storage);

	// If there is a slug in the URL, use it as a name
	var name = (/\/([\w\-]+)$/.exec(window.location.pathname) || [])[1];
	if (name) { data.name = name; }

	load();

	window.jots = getLocalJots();
	window.data = data;
})(this);

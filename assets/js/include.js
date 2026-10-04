/*
	Tiny HTML include loader.

	Any element with a data-include="path/to/file.html" attribute gets that
	file's contents dropped inside it. <style> and <script> tags inside the
	included file work normally.

	Why it exists: it lets each tab of index.html live in its own editable
	.html file under partials/ instead of one giant page.

	IMPORTANT: this uses fetch(), which browsers block on file:// URLs.
	To preview locally, serve the folder over HTTP, e.g. from the repo root:
		python3 -m http.server 8000     ->  http://localhost:8000
	On GitHub Pages it just works.

	Exposes window.includesReady — a Promise that resolves once every
	include on the page has been inserted. index.html waits on it before
	starting assets/js/main.js, because main.js inspects the articles once
	at start-up.
*/

(function() {

	// Re-create <script> tags so the browser actually runs them.
	// (Scripts inserted via innerHTML are inert by spec.)
	function activateScripts(container) {
		var scripts = container.querySelectorAll('script');
		for (var i = 0; i < scripts.length; i++) {
			var old = scripts[i],
				fresh = document.createElement('script');
			for (var a = 0; a < old.attributes.length; a++)
				fresh.setAttribute(old.attributes[a].name, old.attributes[a].value);
			fresh.textContent = old.textContent;
			old.parentNode.replaceChild(fresh, old);
		}
	}

	function warn(el, url, detail) {
		console.error('[include] could not load ' + url, detail);
		el.innerHTML = '<h2 class="major">Hmm</h2><p>This section (<code>'
			+ url + '</code>) failed to load.'
			+ (location.protocol === 'file:'
				? ' You are viewing this page as a local file. Browsers block'
				  + ' file:// includes \u2014 serve the folder instead:'
				  + ' <code>python3 -m http.server 8000</code>'
				: ' See the browser console for details.')
			+ '</p>';
	}

	var targets = document.querySelectorAll('[data-include]'),
		jobs = [];

	for (var i = 0; i < targets.length; i++)
		jobs.push((function(el) {
			var url = el.getAttribute('data-include');
			return fetch(url)
				.then(function(res) {
					if (!res.ok) throw new Error(res.status + ' ' + res.statusText);
					return res.text();
				})
				.then(function(html) {
					el.innerHTML = html;
					activateScripts(el);
				})
				.catch(function(err) { warn(el, url, err); });
		})(targets[i]));

	window.includesReady = Promise.all(jobs);

})();

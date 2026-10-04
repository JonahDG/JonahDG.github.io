# partials/ — one file per tab

`index.html` is now just a shell: the header, the nav, the footer, and one empty
`<article>` per tab. Each article names its content file:

```html
<article id="Research" data-include="partials/research.html"></article>
```

`assets/js/include.js` fetches that file on page load and drops it inside the
article, then starts the theme (`assets/js/main.js`).

| Tab in the nav | File to edit             |
| -------------- | ------------------------ |
| About          | `about.html`             |
| Research       | `research.html`          |
| Timeline & CV  | `timeline-cv.html`       |
| Baking         | `baking.html`            |
| Contact        | `contact.html`           |
| *(unlisted)*   | `elements.html`          |

## Editing a tab

Open the file and edit it. These are HTML **fragments** — start straight in with
`<h2 class="major">…</h2>`; no `<html>`, `<head>`, or `<body>`. Everything that
used to work inside the article still works, including `<style>` and `<script>`
blocks (`timeline-cv.html` carries the CSS and JS for its own carousels).

Paths to images and PDFs are resolved relative to **`index.html`**, not to the
partial — so keep writing `images/research/lightcurve.png`, not `../images/...`.

## Adding a tab

1. Create `partials/my-tab.html`.
2. Add a line to the `<div id="main">` block in `index.html`:
   `<article id="MyTab" data-include="partials/my-tab.html"></article>`
3. Add a link to the `<nav>` in `index.html`:
   `<li><a href="#MyTab">My Tab</a></li>`

The `id` and the `href` anchor must match.

## Previewing locally

`include.js` uses `fetch()`, which browsers refuse on `file://` URLs. Opening
`index.html` by double-clicking it will show a "failed to load" message in each
tab. Serve the folder instead, from the repo root:

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

On GitHub Pages it is served over HTTPS, so it works with no extra setup.

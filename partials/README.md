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

## Recipes are different — they're real pages

Recipes don't live in `partials/`. Each one is a standalone page under
`recipes/`, so it has its own URL you can bookmark, share, or print:

```
recipes/_template.html        copy this to start a new recipe
recipes/chocolate-babka.html  -> jonahdg.github.io/recipes/chocolate-babka.html
assets/css/recipes.css        recipe layout, the Baking card grid, print rules
images/baking/                photos
```

`partials/baking.html` is just the index: a grid of cards linking out to those
pages. To add a recipe:

1. `cp recipes/_template.html recipes/my-recipe.html` and fill in the `[...]`
   placeholders, including the JSON-LD block near the top.
2. Copy one `<li>` card in `partials/baking.html` and point it at the new file.
3. Optional: drop a photo in `images/baking/` and uncomment the `<img>`.

**The one gotcha:** paths inside `recipes/*.html` need a leading `../`
(`../images/baking/babka.jpg`), because those pages sit one folder down.
Paths inside `partials/*.html` do not, because they end up inside `index.html`.

Every recipe page has a Print / Save as PDF button. `recipes.css` has an
`@media print` block that swaps the dark theme for black-on-white, drops the
nav and background, and keeps ingredients and steps from splitting across
pages — so you get a usable kitchen printout without maintaining a separate
PDF of each recipe.

## Previewing locally

`include.js` uses `fetch()`, which browsers refuse on `file://` URLs. Opening
`index.html` by double-clicking it will show a "failed to load" message in each
tab. Serve the folder instead, from the repo root:

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

On GitHub Pages it is served over HTTPS, so it works with no extra setup.

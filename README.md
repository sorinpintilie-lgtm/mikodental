# Miko Dental – Netlify-deployable homepage mockup

Static, fast prototype with modern interactions/animations.

## Files

- [`index.html`](index.html:1) – page structure, content, SEO meta, Netlify form modal
- [`styles.css`](styles.css:1) – design system + layout + responsive
- [`app.js`](app.js:1) – interactions (mobile menu, modals, carousel, reveals, parallax)
- [`netlify.toml`](netlify.toml:1) – publish config + cache headers for media

All images/videos are referenced directly from the project root (the assets you already had in the folder).

## Local preview

Option A (recommended):

1. Run a static server from this folder.
2. Open `http://localhost:5173`.

If you already started Python server in a terminal:

```bat
python -m http.server 5173
```

Option B:

Just open [`index.html`](index.html:1) in a browser (some browsers may restrict autoplay/video behavior without a server).

## Netlify deploy

### Drag-and-drop

1. Go to Netlify → **Add new site** → **Deploy manually**
2. Drag the entire folder contents (including the `.mp4` and `.jpg` files)

### Git-based

1. Push this folder to a GitHub repo.
2. Netlify → **New site from Git** → select repo.
3. Build settings:
   - **Build command:** *(leave empty)*
   - **Publish directory:** `.` (already set in [`netlify.toml`](netlify.toml:1))

## Notes

- Hero uses a 4K video. For faster loading, replace with a smaller `1080p` encode while keeping the same filename referenced in [`index.html`](index.html:1).
- The “Programare” form is a Netlify form inside a modal. It includes the required `form-name` hidden input.
- Telephone links use `tel:` and work on mobile.


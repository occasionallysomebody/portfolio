### Project File Naming Convention

This system uses the filename to categorize, sort, and group images without a database.

**Example Filename:**
`02home-0001-S01-purdueTower-A.jpg`

---

### 1. Naming Components

* **Album ID (`02home`)**
* Links the file to a specific gallery folder.


* **Sequence ID (`0001`)**
* Controls the grid position.
* **Logic**: Higher numbers appear first (Newest work at the top).


### Revised Naming Logic

* **Stack ID (`S01` or `none`)**
* **`S01`, `S02**`: Groups files together into a single carousel.
* **`none`**: Keeps the image as a standalone post.


* **Description (`purdueTower-A`)**
* **Label**: A simple name for the file.
* **Ordering**: For stacks, add `-A`, `-B`, or `-C` to the end to set the order inside the viewer.
* **Single Images**: Files with a `none` Stack ID do not need letter descriptors.


---

### 2. Sorting Behavior

| View | Target Part | Logic |
| --- | --- | --- |
| **Main Grid** | **Sequence ID** | **Descending**: Highest number shows first. |
| **Carousel** | **Description** | **Ascending**: A  B  C sequence. |

---

### 3. The `-cover` Modifier (Thumbnail Override)

By default, the grid shows the first file in the A-Z sequence (usually the `-A` file). Use `-cover` to hand-pick a different image to represent the stack on the main grid.

* **Usage**: Add `-cover` to any filename within a stack.
* **Result**: That image becomes the visible thumbnail on the main page, but the carousel still starts at "A" once opened.

#### Example:

1. `02home-0010-S01-street-A.jpg` (First image in carousel)
2. `02home-0010-S01-street-B-cover.jpg` (**Visible thumbnail on main grid**)
3. `02home-0010-S01-street-C.jpg` (Third image in carousel)

---

### 4. Quick Checklist

* [ ] Use 4-digit Sequence IDs (`0001`) for consistent sorting.
* [ ] Use `none` if an image is not part of a stack.
* [ ] Ensure Stack IDs (e.g., `S01`) match for all images in a group.
* [ ] Limit to one `-cover` per stack.

---

## Project Structure

```
src/                     # Source files (HTML templates, styles)
  _includes/
    nav.html            # Reusable navigation component (injected at build time)
  index.html            # Main gallery page
  input.css             # Tailwind input (builds to dist/output.css)

scripts/                 # Build automation and conversion tools
  optimize.js           # Sharp-based image optimizer (WebP + JPEG)
  get-images.js         # Generates images.json manifest from dist/assets/gallery
  include-nav.js        # Injects nav.html into HTML pages at build time
  md-to-json.js         # Converts markdown posts to thoughts.json
  convert_heic.py       # Python HEIC/HEIF to JPEG converter (via pillow-heif)
  nav-inject.js         # Client-side nav fallback (loads nav.html at runtime)

posts/                   # Markdown source files for blog/shower thoughts
  *.md                  # Write posts in markdown; build step generates thoughts.json

dist/                   # Generated site output (build artifacts)
  index.html            # Built gallery page (output)
  output.css            # Built Tailwind CSS
  about_me.html
  contact.html
  showerThoughts.html
  assets/
    gallery/            # Optimized images (WebP + JPEG fallback)

archive/old-root/       # Archived original files from root (for reference)

.gitignore              # Ignores node_modules/, dist/, thoughts.json, .venv/, etc.
package.json            # Node dependencies and npm scripts
requirements.txt        # Python dependencies (pillow, pillow-heif)
tailwind.config.js      # Tailwind CSS configuration
```

### Build Pipeline

```bash
npm run build              # Full build (runs all steps)
  └─ npm run heic-convert   # Python: HEIC → JPEG
  └─ npm run posts:build    # Node: markdown → thoughts.json
  └─ npm run include-nav    # Node: inject nav.html into pages
  └─ npm run optimize       # Node: optimize images (WebP + JPEG)
  └─ npm run manifest       # Node: generate images.json manifest
  └─ npm run styles         # Tailwind: build CSS
```

### Key Files

- **Source**: Edit files in `src/` and `posts/`
- **Build**: Run `npm run build` or `npm run <script>` for individual steps
- **Output**: Check `dist/` for the final site
- **Images**: Place HEIC files in `dist/assets/gallery/`, then run `npm run heic-convert` to convert to JPEG
- **Blog**: Write Markdown in `posts/`, run `npm run posts:build` to generate `thoughts.json`
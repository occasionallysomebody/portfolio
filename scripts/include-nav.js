const fs = require('fs-extra');
const path = require('path');

(async function() {
  const root = path.join(__dirname, '..');
  const navPath = path.join(root, 'src', '_includes', 'nav.html');
  const targets = [
    path.join(root, 'src', 'index.html'),
    path.join(root, 'dist', 'about_me.html'),
    path.join(root, 'dist', 'contact.html'),
    path.join(root, 'dist', 'showerThoughts.html')
  ];

  if (!await fs.pathExists(navPath)) {
    console.error('nav.html not found at', navPath);
    process.exit(1);
  }

  const navHtml = await fs.readFile(navPath, 'utf8');

  for (const t of targets) {
    if (!await fs.pathExists(t)) {
      console.warn('Skipping missing target:', t);
      continue;
    }

    let content = await fs.readFile(t, 'utf8');

    // Replace placeholder <nav id="site-nav"></nav> optionally followed by the injector script
    const placeholderRegex = /<nav[^>]*id=["']site-nav["'][^>]*>\s*<\/nav>\s*(?:<script[^>]*nav-inject\.js[^>]*>.*?<\/script>)?/is;
    if (placeholderRegex.test(content)) {
      content = content.replace(placeholderRegex, navHtml);
    } else {
      // fallback: replace first <nav>...</nav>
      const firstNavRegex = /<nav[\s\S]*?<\/nav>/i;
      if (firstNavRegex.test(content)) {
        content = content.replace(firstNavRegex, navHtml);
      } else {
        console.warn('No <nav> found in', t);
      }
    }

    // Remove any leftover nav-inject script tags
    content = content.replace(/<script[^>]*nav-inject\.js[^>]*>\s*<\/script>/ig, '');

    await fs.writeFile(t, content, 'utf8');
    console.log('Updated nav in', t);
  }

  console.log('\n✓ Nav include complete');
})();
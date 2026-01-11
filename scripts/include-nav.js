const fs = require('fs-extra');
const path = require('path');

(async function() {
  const root = path.join(__dirname, '..');
  const navPath = path.join(root, 'src', '_includes', 'nav.html');
  
  // Maps source templates to their final production destination
  const targets = [
    { src: 'src/index.html', dest: 'dist/index.html' },
    { src: 'dist/about_me.html', dest: 'dist/about_me.html' },
    { src: 'dist/contact.html', dest: 'dist/contact.html' },
    { src: 'dist/showerThoughts.html', dest: 'dist/showerThoughts.html' }
  ];

  if (!await fs.pathExists(navPath)) {
    console.error('nav.html not found at', navPath);
    process.exit(1);
  }

  const navHtml = await fs.readFile(navPath, 'utf8');

  for (const { src, dest } of targets) {
    const srcPath = path.join(root, src);
    const destPath = path.join(root, dest);

    if (!await fs.pathExists(srcPath)) {
      console.warn('Skipping missing source:', srcPath);
      continue;
    }

    let content = await fs.readFile(srcPath, 'utf8');

    // Regex to find the nav placeholder and the optional client-side injector script
    const placeholderRegex = /<nav[^>]*id=["']site-nav["'][^>]*>\s*<\/nav>\s*(?:<script[^>]*nav-inject\.js[^>]*>.*?<\/script>)?/is;
    const firstNavRegex = /<nav[\s\S]*?<\/nav>/i;

    if (placeholderRegex.test(content)) {
      content = content.replace(placeholderRegex, navHtml);
    } else if (firstNavRegex.test(content)) {
      content = content.replace(firstNavRegex, navHtml);
    } else {
      console.warn('No <nav> found in', src);
    }

    // Clean up any remaining manual injection scripts for a clean production build
    content = content.replace(/<script[^>]*nav-inject\.js[^>]*>\s*<\/script>/ig, '');

    // Ensure the dist directory exists before writing to avoid build errors
    await fs.ensureDir(path.dirname(destPath)); 
    await fs.writeFile(destPath, content, 'utf8');
    console.log(`✓ Processed Nav: ${src} -> ${dest}`);
  }

  console.log('\n✓ Navigation injection complete.');
})();
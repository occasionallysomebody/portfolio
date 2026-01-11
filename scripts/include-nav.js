// ... (keep top of script same)

  const targets = [
    { src: 'src/index.html', dest: 'dist/index.html' },
    { src: 'dist/about_me.html', dest: 'dist/about_me.html' },
    { src: 'dist/contact.html', dest: 'dist/contact.html' },
    { src: 'dist/showerThoughts.html', dest: 'dist/showerThoughts.html' }
  ];

// ... (keep navPath check and navHtml read)

  for (const { src, dest } of targets) {
    const srcPath = path.join(root, src);
    const destPath = path.join(root, dest);

    if (!await fs.pathExists(srcPath)) {
      console.warn('Skipping missing source:', srcPath);
      continue;
    }

    let content = await fs.readFile(srcPath, 'utf8');

    // ... (keep regex replacement logic same)

    // IMPORTANT: Ensure the dist directory exists before writing
    await fs.ensureDir(path.dirname(destPath)); 
    await fs.writeFile(destPath, content, 'utf8');
    console.log(`Updated nav: ${src} -> ${dest}`);
  }
// ...
#!/usr/bin/env node
const fs = require('fs-extra');
const path = require('path');
const matter = require('gray-matter');

(async function main(){
  const root = path.join(__dirname, '..');
  const postsDir = path.join(root, 'posts');
  const outFile = path.join(root, 'thoughts.json');

  await fs.ensureDir(postsDir);

  const files = (await fs.readdir(postsDir)).filter(f => f.toLowerCase().endsWith('.md'));
  if (files.length === 0) {
    console.log('No markdown posts found in', postsDir);
    await fs.writeJson(outFile, [], { spaces: 2 });
    console.log('Wrote empty', outFile);
    return;
  }

  const posts = [];
  for (const fname of files) {
    const full = path.join(postsDir, fname);
    const raw = await fs.readFile(full, 'utf8');
    const parsed = matter(raw);
    const meta = parsed.data || {};
    const content = parsed.content || '';

    // Split content into paragraphs (double-newline) and trim
    const paragraphs = content.split(/\n{2,}/).map(p => p.trim()).filter(Boolean);

    const title = meta.title || path.basename(fname, '.md');
    const date = meta.date || (await fs.stat(full)).mtime.toISOString();

    posts.push({ title, date, content: paragraphs });
  }

  // Sort by date descending
  posts.sort((a,b) => new Date(b.date) - new Date(a.date));

  await fs.writeJson(outFile, posts, { spaces: 2 });
  console.log('Wrote', outFile, 'with', posts.length, 'posts');
})();

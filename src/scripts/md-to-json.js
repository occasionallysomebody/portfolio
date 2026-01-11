#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Define paths based on your actual file tree
const postsDir = path.join(__dirname, '../content/posts/*.md');
const outputFile = path.join(__dirname, '..dist/thoughts.json');

function buildThoughts() {
    if (!fs.existsSync(postsDir)) {
        console.error(`Posts directory not found: ${postsDir}`);
        return;
    }

    // Filter for markdown files
    const files = fs.readdirSync(postsDir).filter(file => file.endsWith('.md'));
    
    const posts = files.map(file => {
        const filePath = path.join(postsDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        
        // Extract front-matter (title, date) and content
        const { data, content } = matter(fileContent);
        
        // Split content by newlines for the list format in showerThoughts.html
        const paragraphs = content
            .split('\n')
            .map(p => p.trim())
            .filter(p => p.length > 0);

        return {
            title: data.title || 'Untitled',
            date: data.date ? new Date(data.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }) : 'Unknown Date',
            content: paragraphs,
            timestamp: data.date ? new Date(data.date).getTime() : 0
        };
    });

    // Sort posts by date descending
    posts.sort((a, b) => b.timestamp - a.timestamp);

    fs.writeFileSync(outputFile, JSON.stringify(posts, null, 2));
    console.log(`✓ Converted ${posts.length} posts to thoughts.json`);
}

buildThoughts();
// Archived original: get-images.js
// Moved to ./scripts/get-images.js

/* original content preserved for reference */
const fs = require('fs');
const path = require('path');

// Use process.cwd() to ensure we are in the root of the Vercel build environment
const rootDir = process.cwd();
const galleryDir = path.join(rootDir, 'dist/assets/gallery');
const outputFile = path.join(rootDir, 'images.json');

const albums = {};

try {
    const folders = fs.readdirSync(galleryDir).filter(file => 
        fs.statSync(path.join(galleryDir, file)).isDirectory()
    );

    folders.forEach(album => {
        const albumPath = path.join(galleryDir, album);
        const photos = fs.readdirSync(albumPath)
            .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
            .sort((a, b) => {
                const aParts = a.split('-');
                const bParts = b.split('-');

                const aPrimary = parseInt(aParts[0], 10) || 0;
                const aSecondary = parseInt(aParts[1], 10) || 0;
                const bPrimary = parseInt(bParts[0], 10) || 0;
                const bSecondary = parseInt(bParts[1], 10) || 0;

                if (aPrimary !== bPrimary) return bPrimary - aPrimary;
                if (aSecondary !== bSecondary) return bSecondary - aSecondary;

                return a.localeCompare(b);
            });

        if (photos.length > 0) albums[album] = photos;
    });

    console.log(`Writing JSON to: ${outputFile}`);
    fs.writeFileSync(outputFile, JSON.stringify(albums, null, 2));
    console.log(`Success! Found ${Object.keys(albums).length} albums.`);
    
} catch (err) {
    console.error("Build failed:", err);
    process.exit(1);
}

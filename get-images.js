/**
 * Description: looks into dist/assets/gallery, 
 *              makes a list of every .jpg it finds, 
 *              and saves that list into a small file called images.json
 * @author occasionallysomebody
 * @version December 20, 2025
 */

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
            // Sorts numerically 1, 2, 3... then flips to 3, 2, 1
            .sort((a, b) => {
                const numA = parseInt(a.match(/\d+/)) || 0;
                const numB = parseInt(b.match(/\d+/)) || 0;
                return numB - numA; // Returns higher numbers first (Reverse)
            })
            .reverse();
            
        if (photos.length > 0) albums[album] = photos;
    });

    // Explicitly log the path for debugging in Vercel logs
    console.log(`Writing JSON to: ${outputFile}`);
    fs.writeFileSync(outputFile, JSON.stringify(albums, null, 2));
    console.log(`Success! Found ${Object.keys(albums).length} albums.`);
} catch (err) {
    console.error("Build failed:", err);
    process.exit(1);
}
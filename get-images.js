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
        let photos = fs.readdirSync(albumPath)
            .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file));

        // LOG FOR DEBUGGING: This will show up in your Vercel Build Logs
        console.log(`Album [${album}] found files:`, photos);

        photos.sort((a, b) => {
            // 1. Extract just the numbers from the filename (e.g., "02_9" becomes "029")
            const matchA = a.match(/\d+/g);
            const matchB = b.match(/\d+/g);
            
            // 2. Convert to numbers (default to 0 if no number found)
            const numA = matchA ? parseInt(matchA.join(''), 10) : 0;
            const numB = matchB ? parseInt(matchB.join(''), 10) : 0;
            
            // 3. Subtract for Reverse order (B - A)
            return numB - numA;
        });

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
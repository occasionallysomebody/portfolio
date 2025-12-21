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
            .sort((a, b) => {
                // Split by hyphen to get [0002, 0001, name]
                const aParts = a.split('-');
                const bParts = b.split('-');

                const aPrimary = parseInt(aParts[0], 10) || 0;
                const aSecondary = parseInt(aParts[1], 10) || 0;

                const bPrimary = parseInt(bParts[0], 10) || 0;
                const bSecondary = parseInt(bParts[1], 10) || 0;

                // Sort by Primary first, then Secondary
                if (aPrimary !== bPrimary) return bPrimary - aPrimary;
                return bSecondary - aSecondary; // Reverse order (Newest/Highest first)
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
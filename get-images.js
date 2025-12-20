/**
 * Description: looks into dist/assets/gallery, 
 *              makes a list of every .jpg it finds, 
 *              and saves that list into a small file called images.json
 * @author occasionallysomebody
 * @version December 20, 2025
 */

const fs = require('fs');
const path = require('path');

// 1. Define where your images are located
const galleryDir = path.join(__dirname, 'dist/assets/gallery');
const outputFile = path.join(__dirname, 'images.json');

const albums = {};

try {
    // 2. Check if the gallery directory exists
    if (!fs.existsSync(galleryDir)) {
        console.error(`Error: Directory not found at ${galleryDir}`);
        process.exit(1);
    }

    // 3. Get all subdirectories (Albums like 02_Home)
    const folders = fs.readdirSync(galleryDir).filter(file => 
        fs.statSync(path.join(galleryDir, file)).isDirectory()
    );

    // 4. Loop through each folder to find .jpg files
    folders.forEach(album => {
        const albumPath = path.join(galleryDir, album);
        const photos = fs.readdirSync(albumPath)
                         .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
                         .sort()
                         .reverse(); // Ensures 02_65 comes before 02_01
        
        if (photos.length > 0) {
            albums[album] = photos;
        }
    });

    // 5. Save the final list as images.json
    fs.writeFileSync(outputFile, JSON.stringify(albums, null, 2));
    console.log(`Success! Found ${Object.keys(albums).length} albums. images.json has been updated.`);

} catch (err) {
    console.error("An error occurred during the scan:", err);
}
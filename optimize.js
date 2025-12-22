/**
 * @file Optimizes gallery images for web performance.
 * Resizes images to max 1920px width and applies compression.
 * @author occasionallysomebody
 * @version December 21, 2025
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const galleryBase = './dist/assets/gallery';

/**
 * Main optimization loop.
 * Processes images sequentially to manage memory and avoid file locks.
 */
async function optimizeGallery() {
    try {
        const albums = fs.readdirSync(galleryBase).filter(file => 
            fs.statSync(path.join(galleryBase, file)).isDirectory() && !file.includes('backup')
        );

        for (const album of albums) {
            const albumPath = path.join(galleryBase, album);
            console.log(`\nOptimizing album: ${album}`);

            const files = fs.readdirSync(albumPath).filter(file => 
                /\.(jpg|jpeg)$/i.test(file) && !file.startsWith('temp_')
            );

            for (const file of files) {
                const filePath = path.join(albumPath, file);
                
                // Read to buffer first to release the file handle immediately
                const inputBuffer = fs.readFileSync(filePath);
                
                const outputBuffer = await sharp(inputBuffer)
                    .resize({ width: 1920, withoutEnlargement: true })
                    .jpeg({ quality: 75, progressive: true })
                    .toBuffer();

                // Write back to the original path
                fs.writeFileSync(filePath, outputBuffer);
                console.log(`  Processed: ${file}`);
            }
        }
        console.log('\nOptimization complete.');
    } catch (err) {
        console.error('Optimization failed:', err);
        process.exit(1);
    }
}

optimizeGallery();
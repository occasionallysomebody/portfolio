const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const galleryBase = './dist/assets/gallery';

// 1. Get all album subfolders
const albums = fs.readdirSync(galleryBase).filter(file => 
    fs.statSync(path.join(galleryBase, file)).isDirectory() && !file.includes('backup')
);

albums.forEach(album => {
    const albumPath = path.join(galleryBase, album);
    console.log(`Optimizing album: ${album}`);

    fs.readdirSync(albumPath).forEach(file => {
        if (file.toLowerCase().endsWith('.jpg')) {
            const filePath = path.join(albumPath, file);
            
            sharp(filePath)
                .resize(1920) 
                .jpeg({ quality: 75 })
                .toBuffer()
                .then(data => {
                    fs.writeFileSync(filePath, data);
                    console.log(`  Done: ${file}`);
                });
        }
    });
});
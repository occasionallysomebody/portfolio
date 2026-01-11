// Archived original: optimize.js
// Moved to ./scripts/optimize.js

/* original content preserved for reference */
const sharp = require('sharp');
const fs = require('fs-extra');
const path = require('path');

const galleryDir = path.join(__dirname, 'dist/assets/gallery');

// TEST_ONLY can be defined during debugging; default to empty to run all
const TEST_ONLY = [];

async function readBuffer(filePath) {
    const buf = await fs.readFile(filePath);
    if (!buf || buf.length === 0) throw new Error('Input Buffer is empty');
    return buf;
}

async function writeOptimized(buffer, destDir, basename) {
    const webpPath = path.join(destDir, `${basename}.webp`);
    const jpgPath = path.join(destDir, `${basename}.jpg`);

    const pipeline = sharp(buffer).rotate().resize({ width: 1920, withoutEnlargement: true });

    await Promise.all([
        pipeline.clone().webp({ quality: 80 }).toFile(webpPath).catch(err => { throw new Error(`WebP: ${err.message}`); }),
        pipeline.clone().jpeg({ quality: 80, progressive: true }).toFile(jpgPath).catch(err => { throw new Error(`JPEG: ${err.message}`); })
    ]);
}

// ...rest preserved

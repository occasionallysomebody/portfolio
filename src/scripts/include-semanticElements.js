const fs = require('fs');
const path = require('path');

// 1. Define the paths to our "ingredients" 🥣
// These now point to your new semanticElements directory
const navHTML = fs.readFileSync(path.join(__dirname, '../semanticElements/nav.html'), 'utf8');
const footerHTML = fs.readFileSync(path.join(__dirname, '../semanticElements/footer.html'), 'utf8');

// 2. Point to the directory containing your page templates 🎯
const pagesDir = path.join(__dirname, '../pages');

// 3. Process every .html file in the pages folder
fs.readdirSync(pagesDir).forEach(file => {
    // We only need to check if the file is an HTML file now! 
    if (path.extname(file) === '.html') {
        const filePath = path.join(pagesDir, file);
        let content = fs.readFileSync(filePath, 'utf8');

        // 4. Inject the content into the placeholders 💉
        content = content.replace('<div id="nav-placeholder"></div>', navHTML);
        content = content.replace('<div id="footer-placeholder"></div>', footerHTML);

        // 5. Save the updated file
        fs.writeFileSync(filePath, content);
        console.log(`Successfully updated: ${file} ✅`);
    }
});
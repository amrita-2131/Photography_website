const fs = require('fs');
const path = require('path');

function processDirectory(directory) {
  const files = fs.readdirSync(directory);

  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (stat.isFile() && /\.(js|jsx|html)$/.test(file)) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // We want to add crossOrigin="anonymous" to all <img tags that don't already have it
      // And we need to make sure we don't break existing attributes.
      let modified = false;
      
      // Match <img followed by spaces and other attributes, but not crossOrigin
      const newContent = content.replace(/<img(?!\s+[^>]*crossOrigin)([^>]+)>/g, (match, p1) => {
        modified = true;
        // If it's JSX, use crossOrigin="anonymous". If HTML, use crossorigin="anonymous"
        const isHtml = fullPath.endsWith('.html');
        const attr = isHtml ? 'crossorigin="anonymous"' : 'crossOrigin="anonymous"';
        return `<img ${attr}${p1}>`;
      });
      
      if (modified) {
        console.log(`Updated ${fullPath}`);
        fs.writeFileSync(fullPath, newContent, 'utf8');
      }
    }
  }
}

processDirectory(path.join(__dirname, 'src'));
console.log('Done fixing img tags.');

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
      
      let modified = false;
      
      // Replace crossOrigin="anonymous" with referrerPolicy="no-referrer" in JSX
      if (content.includes('crossOrigin="anonymous"')) {
        content = content.replace(/crossOrigin="anonymous"/g, 'referrerPolicy="no-referrer"');
        modified = true;
      }
      
      // Replace crossorigin="anonymous" with referrerpolicy="no-referrer" in HTML
      if (content.includes('crossorigin="anonymous"')) {
        content = content.replace(/crossorigin="anonymous"/g, 'referrerpolicy="no-referrer"');
        modified = true;
      }
      
      if (modified) {
        console.log(`Updated ${fullPath}`);
        fs.writeFileSync(fullPath, content, 'utf8');
      }
    }
  }
}

processDirectory(path.join(__dirname, 'src'));
console.log('Done fixing img tags.');

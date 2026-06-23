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
      
      const regexPublic = /https:\/\/images\.unsplash\.com\/photo-[^/]+\/(AB6A)/g;
      const regexPrivate = /https:\/\/images\.unsplash\.com\/photo-[^/]+\/(AP1W)/g;
      
      let modified = false;
      if (regexPublic.test(content)) {
        content = content.replace(regexPublic, 'https://lh3.googleusercontent.com/aida-public/$1');
        modified = true;
      }
      if (regexPrivate.test(content)) {
        content = content.replace(regexPrivate, 'https://lh3.googleusercontent.com/aida/$1');
        modified = true;
      }
      
      if (modified) {
        console.log(`Reverted in ${fullPath}`);
        fs.writeFileSync(fullPath, content, 'utf8');
      }
    }
  }
}

processDirectory(path.join(__dirname, 'src'));
console.log('Done reverting images.');

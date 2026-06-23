const fs = require('fs');
const path = require('path');

const images = [
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1530103862676-de889f4b6987?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=800'
];

function getRandomImage() {
  return images[Math.floor(Math.random() * images.length)];
}

function processDirectory(directory) {
  const files = fs.readdirSync(directory);

  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (stat.isFile() && /\.(js|jsx|html)$/.test(file)) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const regex = /https:\/\/lh3\.googleusercontent\.com\/[a-zA-Z0-9_.-]+/g;
      
      if (regex.test(content)) {
        console.log(`Replacing in ${fullPath}`);
        content = content.replace(regex, () => getRandomImage());
        fs.writeFileSync(fullPath, content, 'utf8');
      }
    }
  }
}

processDirectory(path.join(__dirname, 'src'));
console.log('Done replacing images.');

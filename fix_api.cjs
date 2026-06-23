const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('./frontend/src', function(filePath) {
  if (filePath.endsWith('.jsx') || filePath.endsWith('.js')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    if (content.includes("fetch('/api/") || content.includes("fetch(`/api/") || content.includes("authFetch('/api/") || content.includes("authFetch(`/api/")) {
      if (!content.includes('import.meta.env.VITE_API_URL')) {
        content = "const API_BASE = import.meta.env.VITE_API_URL || '';\n" + content;
      }
      content = content.replace(/fetch\('(\/api\/.*?)'/g, "fetch(`${API_BASE}$1`");
      content = content.replace(/fetch\(`(\/api\/.*?)`/g, "fetch(`${API_BASE}$1`");
      content = content.replace(/authFetch\('(\/api\/.*?)'/g, "authFetch(`${API_BASE}$1`");
      content = content.replace(/authFetch\(`(\/api\/.*?)`/g, "authFetch(`${API_BASE}$1`");
      
      if (content !== original) {
        fs.writeFileSync(filePath, content);
        console.log('Fixed', filePath);
      }
    }
  }
});

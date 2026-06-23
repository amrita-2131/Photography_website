const fs = require('fs');
const path = require('path');
const https = require('https');

const dirsToScan = ['src/pages', 'src/components', 'src/pages/admin', 'src/pages/admin/tabs'];
const urls = [];

function scanDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      scanDir(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.html')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const matches = content.match(/https:\/\/lh3\.googleusercontent\.com[^'"\s]+/g);
      if (matches) {
        matches.forEach(url => {
          urls.push({ url, file: fullPath });
        });
      }
    }
  }
}

dirsToScan.forEach(scanDir);
const uniqueUrls = [...new Set(urls.map(u => u.url))];

function checkUrl(urlStr) {
  return new Promise((resolve) => {
    https.get(urlStr, (res) => {
      resolve(res.statusCode);
    }).on('error', (e) => {
      resolve(500);
    });
  });
}

async function runAudit() {
  const brokenUrls = new Set();
  for (const u of uniqueUrls) {
    const status = await checkUrl(u);
    if (status >= 400) {
      brokenUrls.add(u);
    }
  }
  
  console.log('--- BROKEN URL REPORT ---');
  urls.forEach(u => {
    if (brokenUrls.has(u.url)) {
      console.log(`BROKEN: ${u.file}`);
    }
  });
}

runAudit();

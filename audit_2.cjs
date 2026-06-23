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
  const workingUrls = new Set();
  
  for (const u of uniqueUrls) {
    const status = await checkUrl(u);
    if (status >= 400) {
      brokenUrls.add(u);
    } else {
      workingUrls.add(u);
    }
  }
  
  let report = "=== IMAGE URL AUDIT REPORT ===\n\n";
  report += `Total URLs: ${urls.length}\n`;
  report += `Unique URLs: ${uniqueUrls.length}\n`;
  report += `Working URLs: ${workingUrls.size}\n`;
  report += `Broken URLs: ${brokenUrls.size}\n\n`;
  
  report += "--- BROKEN URL OCCURRENCES ---\n";
  urls.forEach(u => {
    if (brokenUrls.has(u.url)) {
      report += `File: ${u.file} | URL: ${u.url.substring(0, 50)}...\n`;
    }
  });
  
  report += "\n--- WORKING URL OCCURRENCES ---\n";
  urls.forEach(u => {
    if (workingUrls.has(u.url)) {
      report += `File: ${u.file} | URL: ${u.url.substring(0, 50)}...\n`;
    }
  });

  fs.writeFileSync('audit_results.txt', report);
  console.log('Audit complete. Results written to audit_results.txt');
}

runAudit();

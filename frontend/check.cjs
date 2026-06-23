const fs = require('fs');
const https = require('https');
const path = require('path');

const walk = (dir) => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.jsx') || file.endsWith('.js')) {
        results.push(file);
      }
    }
  });
  return results;
};

const files = walk('./src');
const urls = new Set();
const urlRegex = /https?:\/\/[^\s\'\"<>]+/g;

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  let match;
  while ((match = urlRegex.exec(content)) !== null) {
    if (match[0].includes('lh3.googleusercontent.com') || match[0].includes('images.unsplash.com')) {
      urls.add(match[0]);
    }
  }
});

async function checkUrl(url) {
  return new Promise((resolve) => {
    https.request(url, { method: 'HEAD' }, (res) => {
      resolve(res.statusCode);
    }).on('error', () => resolve('ERROR')).end();
  });
}

(async () => {
  for (const url of urls) {
    const status = await checkUrl(url);
    if (status !== 200 && status !== 302 && status !== 304) {
        console.log("BROKEN:", status, url.substring(0, 80) + '...');
    }
  }
  console.log("DONE!");
})();

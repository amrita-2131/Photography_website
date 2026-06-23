const fs = require('fs');

let html = fs.readFileSync('home.html', 'utf8');

// Extract the <main> part (or just body content)
const mainMatch = html.match(/<nav[\s\S]*<\/footer>/);
if (!mainMatch) {
    console.error("Could not find main content");
    process.exit(1);
}
let jsx = mainMatch[0];

// Basic HTML to JSX conversions
jsx = jsx.replace(/class=/g, 'className=');
jsx = jsx.replace(/<!--([\s\S]*?)-->/g, '{/* $1 */}');
jsx = jsx.replace(/<img([^>]*[^\/])>/g, '<img$1 />');
jsx = jsx.replace(/<input([^>]*[^\/])>/g, '<input$1 />');
jsx = jsx.replace(/<br>/g, '<br />');

fs.writeFileSync('home_jsx_template.txt', jsx);
console.log("Transformation complete.");

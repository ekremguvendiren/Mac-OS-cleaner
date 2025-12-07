const fs = require('fs');
const path = require('path');
const cp = require('child_process');

// Configuration
const PROJECT_ROOT = path.resolve(__dirname, '..');
const NEXT_STANDALONE_DIR = path.join(PROJECT_ROOT, '.next/standalone');
const FINAL_OUTPUT_DIR = path.join(PROJECT_ROOT, '.next/standalone-final');

// Ensure clean slate
if (fs.existsSync(FINAL_OUTPUT_DIR)) {
    fs.rmSync(FINAL_OUTPUT_DIR, { recursive: true, force: true });
}
fs.mkdirSync(FINAL_OUTPUT_DIR, { recursive: true });

console.log('📦 Preparing distribution...');

// 1. Locate the deep server.js
// Next.js standalone often duplicates the project structure inside .next/standalone/project-name/...
// We need to find the directory that actually contains server.js
let deepServerDir = NEXT_STANDALONE_DIR;

// Recursive search for server.js to find the "real" root
const findServerDir = (dir) => {
    if (!fs.existsSync(dir)) return null;
    const files = fs.readdirSync(dir);
    if (files.includes('server.js')) return dir;

    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            const found = findServerDir(fullPath);
            if (found) return found;
        }
    }
    return null;
};

const realServerRoot = findServerDir(NEXT_STANDALONE_DIR);

if (!realServerRoot) {
    console.error('❌ Could not find server.js in .next/standalone!');
    process.exit(1);
}

console.log(`📍 Found Next.js server root at: ${realServerRoot}`);

// 2. Copy the contents of the real server root to our final output
console.log('📂 Flattening directory structure...');
cp.execSync(`cp -R "${realServerRoot}/"* "${FINAL_OUTPUT_DIR}/"`);

// 3. Flatten/Merge Static Assets
// standalone folder usually misses the public/ and .next/static folders from the root, 
// or they are inside the structure. We typically need to verify they exist.

// Copy .next/static (from project root) to final/.next/static
const rootStaticDir = path.join(PROJECT_ROOT, '.next/static');
const destStaticDir = path.join(FINAL_OUTPUT_DIR, '.next/static');

if (fs.existsSync(rootStaticDir)) {
    console.log('🎨 Copying static assets (.next/static)...');
    fs.mkdirSync(path.dirname(destStaticDir), { recursive: true });
    // Using cp -R to copy contents
    cp.execSync(`cp -R "${rootStaticDir}" "${path.dirname(destStaticDir)}"`);
} else {
    console.warn('⚠️  .next/static not found in project root. Setup might be incomplete.');
}

// Copy public/ (from project root) to final/public
const rootPublicDir = path.join(PROJECT_ROOT, 'public');
const destPublicDir = path.join(FINAL_OUTPUT_DIR, 'public');

if (fs.existsSync(rootPublicDir)) {
    console.log('🖼️  Copying public assets...');
    cp.execSync(`cp -R "${rootPublicDir}" "${FINAL_OUTPUT_DIR}"`);
}

// 4. Create a package.json for the production install if needed or verify dependencies
// The standalone folder usually has its own minimal package.json.
// We are good to go.

console.log('✅ Distribution preparation complete. Output at: .next/standalone-final');

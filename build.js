const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const publicDir = path.join(__dirname, 'public');
const assetsDir = path.join(__dirname, 'assets');

// 1. Create public directory
if (fs.existsSync(publicDir)) {
    fs.rmSync(publicDir, { recursive: true, force: true });
}
fs.mkdirSync(publicDir);

// 2. Copy static files
const filesToCopy = ['index.html', 'style.css', 'script.js'];
filesToCopy.forEach(file => {
    const src = path.join(__dirname, file);
    const dest = path.join(publicDir, file);
    if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
        console.log(`Copied ${file} to public/`);
    } else {
        console.warn(`Warning: ${file} not found.`);
    }
});

// 3. Copy assets directory
if (fs.existsSync(assetsDir)) {
    const destAssetsDir = path.join(publicDir, 'assets');
    fs.mkdirSync(destAssetsDir);

    // Simple recursive copy function for assets
    function copyRecursive(src, dest) {
        const entries = fs.readdirSync(src, { withFileTypes: true });
        for (const entry of entries) {
            const srcPath = path.join(src, entry.name);
            const destPath = path.join(dest, entry.name);
            if (entry.isDirectory()) {
                fs.mkdirSync(destPath);
                copyRecursive(srcPath, destPath);
            } else {
                fs.copyFileSync(srcPath, destPath);
            }
        }
    }

    copyRecursive(assetsDir, destAssetsDir);
    console.log('Copied assets directory to public/assets/');
} else {
    console.warn('Warning: assets directory not found.');
}

// 4. Build Tailwind CSS
console.log('Building Tailwind CSS...');
try {
    // Output directly to public/output.css
    execSync('npx tailwindcss -i ./input.css -o ./public/output.css --minify', { stdio: 'inherit' });
    console.log('Tailwind CSS built successfully.');
} catch (error) {
    console.error('Error building Tailwind CSS:', error);
    process.exit(1);
}

console.log('Build completed! "public" directory is ready for deployment.');

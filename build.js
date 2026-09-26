#!/usr/bin/env node
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Simple build script that copies files from source to dist
const sourceDir = path.join(__dirname, 'src');
const distDir = path.join(__dirname, 'dist');
const assetsSourceDir = path.join(__dirname, 'assets');
const assetsDistDir = path.join(distDir, 'assets');

// Create dist directory if it doesn't exist
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

function copyDirectory(source, destination) {
  if (!fs.existsSync(source)) {
    return;
  }

  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }

  const entries = fs.readdirSync(source, { withFileTypes: true });

  entries.forEach(entry => {
    const sourcePath = path.join(source, entry.name);
    const destinationPath = path.join(destination, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(sourcePath, destinationPath);
      return;
    }

    fs.copyFileSync(sourcePath, destinationPath);
    console.log(`  ✓ Copied ${path.relative(__dirname, destinationPath)}`);
  });
}

// Copy files
const filesToCopy = ['index.html', 'style.css', 'siren.mp3'];

console.log('Building project...');

filesToCopy.forEach(file => {
  const sourcePath = path.join(sourceDir, file);
  const destPath = path.join(distDir, file);
  
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destPath);
    console.log(`  ✓ Copied ${file}`);
  } else {
    console.log(`  ⚠ Skipped ${file} (not found)`);
  }
});

// Copy .well-known directory
const wellKnownSrcDir = path.join(sourceDir, '.well-known');
const wellKnownDistDir = path.join(distDir, '.well-known');

copyDirectory(wellKnownSrcDir, wellKnownDistDir);
copyDirectory(assetsSourceDir, assetsDistDir);

console.log('Bundling JavaScript with Webpack...');
execFileSync('npx', ['webpack', '--mode', 'production'], {
  cwd: __dirname,
  stdio: 'inherit'
});

console.log('Build complete! Files are in the dist/ directory.');

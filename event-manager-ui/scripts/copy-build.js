#!/usr/bin/env node

/**
 * Build Post-Processing Script
 * Copies the React build output to the Spring Boot static resources folder
 * This allows the backend to serve the frontend from src/main/resources/static
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Define paths
const buildDir = path.join(__dirname, '../build');
const staticDir = path.join(__dirname, '../../event-manager-service/src/main/resources/static');
const uiDir = path.join(staticDir, 'ui');

console.log('📦 Post-Build: Copying React build to Spring Boot static folder...\n');

// Step 1: Check if build directory exists
if (!fs.existsSync(buildDir)) {
  console.error('❌ Error: Build directory not found:', buildDir);
  process.exit(1);
}

console.log(`✓ Source build directory: ${buildDir}`);

// Step 2: Create static directory structure
if (!fs.existsSync(staticDir)) {
  console.log(`✓ Creating static directory: ${staticDir}`);
  fs.mkdirSync(staticDir, { recursive: true });
}

// Create ui subdirectory
if (!fs.existsSync(uiDir)) {
  console.log(`✓ Creating ui subdirectory: ${uiDir}`);
  fs.mkdirSync(uiDir, { recursive: true });
} else {
  console.log(`✓ Cleaning existing ui subdirectory...`);
  // Clean the ui subdirectory
  try {
    fs.rmSync(uiDir, { recursive: true, force: true });
    fs.mkdirSync(uiDir, { recursive: true });
    console.log(`✓ ui subdirectory cleaned`);
  } catch (err) {
    console.error('❌ Error cleaning ui subdirectory:', err.message);
    process.exit(1);
  }
}

// Step 3: Copy files
console.log(`\n📋 Copying files from ${buildDir} to ${uiDir}...`);

try {
// Use platform-specific copy command
  if (process.platform === 'win32') {
    // Windows
    execSync(`xcopy "${buildDir}" "${uiDir}" /E /I /Y`, { stdio: 'inherit' });
  } else {
    // Unix-like (Linux, macOS)
    execSync(`cp -r "${buildDir}"/* "${uiDir}"/`, { stdio: 'inherit' });
  }
console.log('\n✅ Build files successfully copied to Spring Boot static folder!');
  console.log(`\n📁 Output directory: ${uiDir}\n`);
} catch (err) {
  console.error('\n❌ Error copying files:', err.message);
  process.exit(1);
}

// Step 4: Verify copy was successful
const files = fs.readdirSync(uiDir);
console.log(`✓ Files in ui subdirectory: ${files.length} items`);
console.log(`  - ${files.slice(0, 5).join(', ')}${files.length > 5 ? '...' : ''}`);

console.log('\n✅ Build post-processing completed successfully!');
console.log('\n📝 Next steps:');
console.log('   1. Run: mvn clean package -DskipTests');
console.log('   2. The React app will be served from the Spring Boot JAR');
console.log('   3. Access at: http://localhost:8003\n');

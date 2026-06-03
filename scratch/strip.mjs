import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';
import decomment from 'decomment';

// Ensure the modules to target
const TARGET_MODULES = ['users', 'projects', 'developers', 'properties', 'bookings', 'activity'];

const files = globSync('src/{app/admin,features}/**/*.{ts,tsx}', { absolute: true });

const targetFiles = files.filter(f => {
  const norm = f.replace(/\\/g, '/');
  return TARGET_MODULES.some(mod => norm.includes(`/${mod}/`));
});

console.log(`Found ${targetFiles.length} files to process.`);

targetFiles.forEach(file => {
  try {
    const code = fs.readFileSync(file, 'utf-8');
    
    if (!code.includes('//') && !code.includes('/*')) return;
    
    // safe: true ensures it doesn't break JSX or regex literals
    let newCode = decomment(code, { safe: true });
    
    // Remove extra empty lines left by comment removal
    newCode = newCode.replace(/^\s*[\r\n]/gm, '\n');

    if (code !== newCode) {
      fs.writeFileSync(file, newCode, 'utf-8');
      console.log(`Cleaned: ${file}`);
    }
  } catch (err) {
    console.error(`Error processing ${file}: ${err.message}`);
  }
});

console.log('Comment cleanup complete.');

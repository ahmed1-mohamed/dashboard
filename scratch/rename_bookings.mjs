import fs from 'fs';
import { globSync } from 'glob';

const files = globSync('src/**/*.{ts,tsx}', { absolute: true });
let updatedCount = 0;

files.forEach(file => {
  try {
    const code = fs.readFileSync(file, 'utf-8');
    
    // Replace imports and route paths
    const newCode = code
      .replace(/features\/bookings/g, 'features/reservations')
      .replace(/\/admin\/bookings/g, '/admin/reservations');

    if (code !== newCode) {
      fs.writeFileSync(file, newCode, 'utf-8');
      console.log(`Updated references in: ${file}`);
      updatedCount++;
    }
  } catch (err) {
    console.error(`Error processing ${file}: ${err.message}`);
  }
});

console.log(`Updated ${updatedCount} files.`);

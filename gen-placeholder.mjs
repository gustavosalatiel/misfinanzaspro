import sharp from 'sharp';
import fs from 'node:fs/promises';

const SRC = 'assets/hero-mockup.webp';

// Tiny blurred placeholder (64px wide, heavy blur → ~1KB)
const tinyBuf = await sharp(SRC)
  .resize({ width: 64 })
  .blur(8)
  .webp({ quality: 30, effort: 6 })
  .toBuffer();

const base64 = `data:image/webp;base64,${tinyBuf.toString('base64')}`;
await fs.writeFile('hero-placeholder-b64.txt', base64);

console.log(`placeholder size: ${tinyBuf.length} bytes`);
console.log(`base64 length: ${base64.length} chars`);
console.log(`first 100 chars: ${base64.slice(0, 100)}...`);

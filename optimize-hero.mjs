import sharp from 'sharp';
import fs from 'node:fs/promises';

const SRC = 'assets/hero-mockup.webp';

// Smaller, higher-compression versions
await sharp(SRC).resize({ width: 880, withoutEnlargement: true }).webp({ quality: 70, effort: 6 }).toFile('assets/hero-mockup-v2.webp');
await sharp(SRC).resize({ width: 880, withoutEnlargement: true }).avif({ quality: 55, effort: 6 }).toFile('assets/hero-mockup.avif');

const w1 = (await fs.stat('assets/hero-mockup-v2.webp')).size;
const a1 = (await fs.stat('assets/hero-mockup.avif')).size;
console.log(`hero-mockup-v2.webp: ${(w1/1024).toFixed(1)}KB`);
console.log(`hero-mockup.avif: ${(a1/1024).toFixed(1)}KB`);

// Replace the old webp with v2
await fs.rename('assets/hero-mockup-v2.webp', 'assets/hero-mockup.webp');
const meta = await sharp('assets/hero-mockup.webp').metadata();
console.log(`final hero-mockup.webp dims: ${meta.width}x${meta.height}`);

import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';

const A = 'assets';
const badges = [
  ['badge-diseno-moderno-DivtoFrp.png', 'badge-diseno-moderno.webp'],
  ['badge-editable-JviLgfcG.png', 'badge-editable.webp'],
  ['badge-facil-usar-BYdYr_HK.png', 'badge-facil-usar.webp'],
  ['badge-graficos-D5T4RW7U.png', 'badge-graficos.webp'],
  ['badge-ingresos-gastos-_ma_WsvQ.png', 'badge-ingresos-gastos.webp'],
  ['badge-moneda-local-D_AGvJH2.png', 'badge-moneda-local.webp'],
];

let savedTotal = 0;
for (const [src, out] of badges) {
  const inp = path.join(A, src);
  const dst = path.join(A, out);
  await sharp(inp).webp({ quality: 85, effort: 6 }).toFile(dst);
  const before = (await fs.stat(inp)).size;
  const after = (await fs.stat(dst)).size;
  savedTotal += (before - after);
  console.log(`${src} -> ${out}: ${(before/1024).toFixed(1)}KB -> ${(after/1024).toFixed(1)}KB`);
}

// Also shrink hero a bit more
const heroSrc = path.join(A, 'hero-mockup.webp');
const heroTmp = path.join(A, 'hero-mockup-new.webp');
await sharp(heroSrc).resize({ width: 1100, withoutEnlargement: true }).webp({ quality: 75, effort: 6 }).toFile(heroTmp);
const hb = (await fs.stat(heroSrc)).size;
const ha = (await fs.stat(heroTmp)).size;
await fs.rename(heroTmp, heroSrc);
console.log(`hero-mockup.webp: ${(hb/1024).toFixed(1)}KB -> ${(ha/1024).toFixed(1)}KB`);
savedTotal += (hb - ha);

console.log(`\nTotal saved: ${(savedTotal/1024).toFixed(1)}KB`);

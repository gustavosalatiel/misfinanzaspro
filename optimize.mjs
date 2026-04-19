import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';

const ASSETS = 'assets';

const heavyPngsToWebp = [
  ['testimonial-adrian-BplXc6pG.png', 'testimonial-adrian.webp', 128],
  ['testimonial-nicolas-Czpz9FO7.png', 'testimonial-nicolas.webp', 128],
  ['testimonial-sebastian-Cxc_wN3k.png', 'testimonial-sebastian.webp', 128],
  ['presupuesto-mensual-B1YXHDsP.png', 'presupuesto-mensual.webp', 1200],
  ['dashboard-monitor-DyUt0VEx.png', 'dashboard-monitor.webp', 1200],
];

const webpsToShrink = [
  ['hero-mockup-D1ZZVWh_.webp', 'hero-mockup.webp', 1500],
  ['pago-deudas-CsIqHXMn.webp', 'pago-deudas.webp', 900],
  ['fondo-ahorros-6wn_w5YK.webp', 'fondo-ahorros.webp', 900],
  ['devices-mockup-DDJKGfvc.webp', 'devices-mockup.webp', 900],
  ['iphone-hand-B1-63cas.webp', 'iphone-hand.webp', 480],
];

for (const [src, out, w] of heavyPngsToWebp) {
  const inp = path.join(ASSETS, src);
  const dst = path.join(ASSETS, out);
  const meta = await sharp(inp).metadata();
  await sharp(inp).resize({ width: Math.min(w, meta.width), withoutEnlargement: true }).webp({ quality: 80, effort: 6 }).toFile(dst);
  const before = (await fs.stat(inp)).size;
  const after = (await fs.stat(dst)).size;
  console.log(`${src} -> ${out}: ${(before/1024).toFixed(0)}KB -> ${(after/1024).toFixed(0)}KB`);
}

for (const [src, out, w] of webpsToShrink) {
  const inp = path.join(ASSETS, src);
  const dst = path.join(ASSETS, out);
  const meta = await sharp(inp).metadata();
  await sharp(inp).resize({ width: Math.min(w, meta.width), withoutEnlargement: true }).webp({ quality: 80, effort: 6 }).toFile(dst);
  const before = (await fs.stat(inp)).size;
  const after = (await fs.stat(dst)).size;
  console.log(`${src} -> ${out}: ${(before/1024).toFixed(0)}KB -> ${(after/1024).toFixed(0)}KB`);
}

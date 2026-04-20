import fs from 'node:fs/promises';

const b64 = (await fs.readFile('hero-placeholder-b64.txt', 'utf8')).trim();
let html = await fs.readFile('index.html', 'utf8');

// Replace the hero <picture> block with one that uses the tiny placeholder first + JS swap
const oldBlock = `    <picture>
      <source type="image/avif" srcset="assets/hero-mockup.avif" />
      <img
        src="assets/hero-mockup.webp"
        alt="Mis Finanzas Pro - Vista de plantilla"
        class="hero-img"
        width="880" height="645"
        loading="eager"
        fetchpriority="high"
        decoding="async"
      />
    </picture>`;

const newBlock = `    <img
      src="${b64}"
      data-src="assets/hero-mockup.avif"
      data-src-fallback="assets/hero-mockup.webp"
      alt="Mis Finanzas Pro - Vista de plantilla"
      class="hero-img"
      width="880" height="645"
      loading="eager"
      fetchpriority="high"
      decoding="async"
    />`;

if (html.includes(oldBlock)) {
  html = html.replace(oldBlock, newBlock);
  console.log("Replaced hero block");
} else {
  console.log("ERROR: old block not found");
  process.exit(1);
}

// Add blur filter transition CSS
const cssInject = `    .hero-img { filter: blur(8px); transition: filter .4s ease; will-change: filter; }
    .hero-img.loaded { filter: none; }
`;
html = html.replace(/\.hero-img \{([^}]*)\}/, (m, inner) => {
  // Keep existing .hero-img rule and append transition class via new rule
  return m;
});

// Insert the loaded class rule after .hero-img rule
if (!html.includes('.hero-img.loaded')) {
  html = html.replace(/(\.hero-img \{[^}]*\})/, `$1\n    .hero-img.loaded-full { filter: none; }\n    .hero-img:not(.loaded-full) { filter: blur(12px); transition: filter .3s ease; }`);
}

// Add JS to swap image after load
const swapScript = `
  // Hero image swap: tiny placeholder → full AVIF
  (function() {
    var img = document.querySelector('.hero-img');
    if (!img || !img.dataset.src) return;
    var supportsAvif = document.createElement('canvas').toDataURL('image/avif').indexOf('data:image/avif') === 0;
    var full = new Image();
    full.onload = function() {
      img.src = full.src;
      img.classList.add('loaded-full');
    };
    full.onerror = function() {
      if (img.dataset.srcFallback) {
        var fb = new Image();
        fb.onload = function() { img.src = fb.src; img.classList.add('loaded-full'); };
        fb.src = img.dataset.srcFallback;
      }
    };
    full.src = supportsAvif ? img.dataset.src : img.dataset.srcFallback;
  })();
`;
html = html.replace(/(\s+\/\/ Header scroll state)/, swapScript + '$1');

await fs.writeFile('index.html', html);
console.log("Done");

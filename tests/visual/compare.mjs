// Verificación visual (FIGMA_REPLICA.md §9): renderiza cada pantalla a 480×800 y la compara con docs/figma/cache.
// Uso: npm run preview (en otra terminal) y luego `node tests/visual/compare.mjs [baseUrl]`
import { chromium } from 'playwright-core';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import fs from 'node:fs';
import path from 'node:path';

const base = process.argv[2] ?? 'http://localhost:4173';
const outDir = 'tests/visual/__diff__';
fs.mkdirSync(outDir, { recursive: true });

const screens = [
  { node: '2-113', route: '#/acceso/inicio-sesion' },
  { node: '13-133', route: '#/acceso/menu' },
  { node: '139-3540', route: '#/acceso/revision-paqueterias' },
];

const browser = await chromium.launch({ channel: 'msedge' });
const page = await browser.newPage({ viewport: { width: 480, height: 800 }, deviceScaleFactor: 1 });
let failed = false;

for (const s of screens) {
  await page.goto(`${base}/${s.route}`);
  await page.addStyleTag({ content: '.demo-toggle{display:none!important}' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  const actualBuf = await page.locator('.device').screenshot();
  fs.writeFileSync(path.join(outDir, `${s.node}.actual.png`), actualBuf);

  const expected = PNG.sync.read(fs.readFileSync(`docs/figma/cache/${s.node}.png`));
  const actual = PNG.sync.read(actualBuf);
  const { width, height } = expected;
  const diff = new PNG({ width, height });
  const n = pixelmatch(expected.data, actual.data, diff.data, width, height, { threshold: 0.1 });
  fs.writeFileSync(path.join(outDir, `${s.node}.diff.png`), PNG.sync.write(diff));
  const pct = (n / (width * height)) * 100;
  if (pct > 1) failed = true;
  console.log(`${s.node}  ${pct.toFixed(2)}% píxeles distintos  ${pct <= 1 ? 'OK' : 'REVISAR'}`);
}

await browser.close();
process.exit(failed ? 1 : 0);

import { readFile, access, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
const root = fileURLToPath(new URL('../dist/', import.meta.url));
const html = await readFile(path.join(root, 'index.html'), 'utf8');
const css = await readFile(path.join(root, 'styles.css'), 'utf8');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
if (new Set(ids).size !== ids.length) throw new Error('Duplicate HTML IDs');
for (const [, hash] of html.matchAll(/href="#([^"]+)"/g)) if (!ids.includes(hash)) throw new Error(`Broken anchor #${hash}`);
const htmlAssets = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map(match => match[1]);
const cssWithoutData = css.replace(/url\("data:[^"]*"\)/g, '');
const cssAssets = [...cssWithoutData.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)].map(match => match[1]);
const assets = [...new Set([...htmlAssets, ...cssAssets].filter(value => !/^(#|data:|https?:|mailto:|tel:)/.test(value)).map(value => value.split('#')[0]))];
for (const asset of assets) await access(path.join(root, asset));
for (const name of ['anton', 'dm-sans']) {
  const file = await readFile(path.join(root, 'assets', `${name}.woff2`));
  if (file.toString('ascii', 0, 4) !== 'wOF2') throw new Error(`Invalid WOFF2: ${name}`);
}
const context = { window: {} };
vm.runInNewContext(await readFile(path.join(root, 'content.js'), 'utf8'), context);
if (!context.window.PORTFOLIO) throw new Error('Missing editable content');
const dynamicImages = [context.window.PORTFOLIO.portrait, context.window.PORTFOLIO.heroPortrait, ...(context.window.PORTFOLIO.projects || []).map(item => item.image)].filter(value => value && !/^https?:/.test(value));
for (const asset of dynamicImages) await access(path.join(root, asset));
const mediaAssets = (context.window.PORTFOLIO.projects || []).flatMap(item => [item.video, item.captions]).filter(Boolean);
for (const asset of mediaAssets) await access(path.join(root, asset));
const tech = await readFile(path.join(root, 'fundamentos.html'), 'utf8');
const techIds = [...tech.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
for (const [, href] of tech.matchAll(/href="([^"]+)"/g)) {
  if (/^(https?:|mailto:|tel:|data:)/.test(href)) continue;
  const [file, hash] = href.split('#');
  if (file) await access(path.join(root, file));
  if (hash && !(file === 'index.html' ? ids : techIds).includes(hash)) throw new Error(`Broken page anchor ${href}`);
}
if (!html.includes('DE LA IDEA AL CÓDIGO')) throw new Error('Missing process section');
if ((html.match(/class="education-item"/g) || []).length !== 4) throw new Error('Missing education');
let bytes = 0;
for (const file of assets) bytes += (await stat(path.join(root, file))).size;
console.log(`PASS: ${assets.length} static asset references, ${dynamicImages.length} content images, ${ids.length} unique IDs, internal anchors, two WOFF2 fonts, editable content.`);
console.log(`Referenced initial assets: ${(bytes / 1024).toFixed(0)} KB.`);

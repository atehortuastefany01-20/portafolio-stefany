import { writeFile } from 'node:fs/promises';
const root = new URL('../dist/assets/', import.meta.url);
for (const [family, local] of [['Anton', 'anton'], ['DM+Sans:wght@100..1000', 'dm-sans']]) {
  const response = await fetch(`https://fonts.googleapis.com/css2?family=${family}&display=swap`, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36' } });
  if (!response.ok) throw new Error(`CSS ${family}: ${response.status}`);
  const css = await response.text();
  const faces = css.match(/@font-face\s*\{[^}]*\}/g) || [];
  const latin = faces.find(face => /U\+0000-00FF/i.test(face)) || faces.at(-1);
  const url = latin?.match(/url\((https:[^)]+)\)/)?.[1];
  if (!url || !url.endsWith('.woff2')) throw new Error(`Missing WOFF2 font URL: ${family}`);
  const font = await fetch(url);
  if (!font.ok) throw new Error(`Font ${family}: ${font.status}`);
  await writeFile(new URL(`${local}.woff2`, root), Buffer.from(await font.arrayBuffer()));
  console.log(`Ready ${local}.woff2`);
}

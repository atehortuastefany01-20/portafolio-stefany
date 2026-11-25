import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {fileURLToPath,pathToFileURL} from 'node:url';
import path from 'node:path';
import vm from 'node:vm';
import {renderPortfolio,seo,publicBase} from './render.mjs';
export const root=fileURLToPath(new URL('../',import.meta.url));
export async function buildSite({output=path.join(root,'dist'),siteUrl}={}) {
  const context={window:{}};
  vm.runInNewContext(await readFile(path.join(root,'dist/content.js'),'utf8'),context);
  vm.runInNewContext(await readFile(path.join(root,'dist/banners.js'),'utf8'),context);
  const data=context.window.PORTFOLIO;
  const config=JSON.parse(await readFile(path.join(root,'site.config.json'),'utf8'));
  const base=publicBase(siteUrl??process.env.SITE_URL??config.publicUrl);
  await mkdir(output,{recursive:true});
  let html=renderPortfolio(await readFile(path.join(root,'templates/index.html'),'utf8'),data,context.window.PortfolioBanners.render(data.marketingBanners));
  html=html.replace('<!-- SEO_GENERADO -->',seo(data,config.description,base));
  // El título y descripción social se emiten una sola vez, con la URL real al publicar.
  html=html.replace(/  <meta property="og:(title|description)"[^>]+>\r?\n/g,'');
  await writeFile(path.join(output,'index.html'),html);
  const tech=await readFile(path.join(root,'templates/fundamentos.html'),'utf8');
  await writeFile(path.join(output,'fundamentos.html'),tech.replace('<!-- SEO_GENERADO -->',seo(data,'Arquitectura, accesibilidad, SEO, publicación y decisiones técnicas de este portafolio.',base,'fundamentos.html')));
  await writeFile(path.join(output,'robots.txt'),base?`User-agent: *\nAllow: /\nSitemap: ${base}sitemap.xml\n`:'User-agent: *\nDisallow: /\n');
  const urls=base?[base,new URL('fundamentos.html',base).href]:[];
  await writeFile(path.join(output,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(url=>`<url><loc>${url.replace(/&/g,'&amp;')}</loc></url>`).join('')}</urlset>\n`);
  await writeFile(path.join(output,'.nojekyll'),'');
  return {base,pages:2,education:data.educationHistory.length};
}
if(process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href) console.log('Build completo:',await buildSite());

import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,mkdtemp,rm} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {buildSite} from '../scripts/build.mjs';
import {escapeHtml,assetPath,publicBase} from '../scripts/render.mjs';
import {createStaticServer} from '../scripts/server.mjs';
test('El contenido no puede introducir HTML ni rutas externas',()=>{
 assert.equal(escapeHtml('<script>"&'), '&lt;script&gt;&quot;&amp;');
 assert.throws(()=>assetPath('assets/../../private.txt'));
 assert.throws(()=>assetPath('javascript:alert(1)'));
 assert.throws(()=>publicBase('https://user:password@example.com/'));
});
test('SEO de producción y cuatro estudios legibles sin JavaScript',async()=>{
 const output=await mkdtemp(path.join(os.tmpdir(),'stefany-build-'));
 try{
  const result=await buildSite({output,siteUrl:'https://example.org/portafolio/'});
  assert.equal(result.education,4);
  const html=await readFile(path.join(output,'index.html'),'utf8');
  for(const value of ['Tecnología en Análisis y Desarrollo de Software','En curso','Técnico en Sistemas Teleinformáticos','Curso en Marketing Digital','Bachiller académico','IED Manuel Cepeda Vargas','Amor y Paz','atehortuastefany01@gmail.com','Mi enfoque combina'])assert.ok(html.includes(value),value);
  assert.equal((html.match(/class="education-item"/g)||[]).length,4);
  assert.ok(html.includes('href="https://atehortuastefany01-20.github.io/amor-y-paz-landing/"'));
  assert.ok(html.includes('Visitar Amor y Paz'));
  assert.ok(!/\bT\.?I\.?\s*\d{6,}/i.test(html));
  assert.ok(!/Nivel A1|mucho gusto/i.test(html));
  assert.ok(!html.match(/<section class="hero"[\s\S]*?<\/section>/)[0].includes('<img'));
  assert.ok(html.includes('rel="canonical" href="https://example.org/portafolio/"'));
  assert.equal((html.match(/property="og:title"/g)||[]).length,1);
  assert.ok((await readFile(path.join(output,'sitemap.xml'),'utf8')).includes('https://example.org/portafolio/fundamentos.html'));
  await buildSite({output,siteUrl:''});
  const local=await readFile(path.join(output,'index.html'),'utf8');
  assert.ok(local.includes('noindex,follow'));
  assert.ok(!local.includes('rel="canonical"'));
 }finally{await rm(output,{recursive:true,force:true});}
});
test('Páginas, subtítulos, rangos de video y errores HTTP',async()=>{
 const server=createStaticServer();
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const base=`http://127.0.0.1:${server.address().port}`;
 try{
  assert.equal((await fetch(base+'/')).status,200);
  assert.equal((await fetch(base+'/fundamentos.html')).status,200);
  assert.match((await fetch(base+'/assets/amor-y-paz.vtt')).headers.get('content-type'),/text\/vtt/);
  const range=await fetch(base+'/assets/amor-y-paz.mp4',{headers:{Range:'bytes=0-99'}});
  assert.equal(range.status,206);assert.equal((await range.arrayBuffer()).byteLength,100);
  assert.match(range.headers.get('content-type'),/video\/mp4/);
  assert.equal((await fetch(base+'/assets/amor-y-paz.mp4',{headers:{Range:'bytes=90-10'}})).status,416);
  assert.equal((await fetch(base+'/assets/amor-y-paz.mp4',{headers:{Range:'bytes=-10'}})).status,206);
  assert.equal((await fetch(base+'/%2e%2e%5cREADME.md')).status,403);
  assert.equal((await fetch(base+'/%ZZ')).status,400);
  assert.equal((await fetch(base+'/',{method:'POST'})).status,405);
  assert.equal((await (await fetch(base+'/',{method:'HEAD'})).text()).length,0);
  assert.equal((await fetch(base+'/archivo-inexistente')).status,404);
 }finally{await new Promise(resolve=>server.close(resolve));}
});

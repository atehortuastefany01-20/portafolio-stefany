import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
const source=await readFile(new URL('../dist/banners.js',import.meta.url),'utf8');
function element() {
  const handlers=new Map(),classes=new Set();
  return {dataset:{},hidden:false,textContent:'',attrs:{},
    classList:{add:value=>classes.add(value),toggle:(value,on)=>on?classes.add(value):classes.delete(value)},
    addEventListener:(name,fn)=>handlers.set(name,fn),
    emit:(name,event={})=>handlers.get(name)?.(event),
    setAttribute(name,value){this.attrs[name]=value;},contains:()=>false};
}
function harness({reduce=false,count=2}={}) {
  const timers=new Map();let nextId=0;
  const doc=element();doc.hidden=false;
  const media=element();media.matches=reduce;
  const host=element(),slides=Array.from({length:count},element);
  const controls=Object.fromEntries(['.banner-controls','[data-banner-toggle]','[data-banner-current]','[data-banner-status]','[data-banner-prev]','[data-banner-next]','.banner-track'].map(selector=>[selector,element()]));
  host.querySelector=selector=>controls[selector];host.querySelectorAll=()=>slides;
  const context={window:{},document:doc,matchMedia:()=>media,queueMicrotask:fn=>fn(),setTimeout:fn=>{const id=++nextId;timers.set(id,fn);return id;},clearTimeout:id=>timers.delete(id)};
  vm.runInNewContext(source,context);
  return {api:context.window.PortfolioBanners,doc,media,host,slides,controls,timers,tick(){const entry=timers.entries().next().value;assert.ok(entry,'Hay una rotación programada');timers.delete(entry[0]);entry[1]();}};
}
test('Solo los banners reales con ruta y descripción válidas generan galería',()=>{
  const h=harness();assert.equal(h.api.render([]),'');
  const markup=h.api.render([{image:'assets/banner.webp',alt:'Oferta de temporada',title:'Oferta <especial>'},{image:'assets/../private.jpg',alt:'Inválido'},{image:'https://example.org/stock.jpg',alt:'Externo'},{image:'assets/sin-alt.webp'}]);
  assert.equal((markup.match(/class="banner-slide/g)||[]).length,1);
  assert.ok(markup.includes('Oferta &lt;especial&gt;'));
  assert.ok(!markup.includes('stock.jpg'));
});
test('Rotación cíclica, controles, pausa manual, cursor, foco y pestaña oculta',()=>{
  const h=harness();h.api.mount(h.host);
  assert.equal(h.timers.size,1);h.tick();
  assert.equal(h.controls['[data-banner-current]'].textContent,'2');
  h.tick();assert.equal(h.controls['[data-banner-current]'].textContent,'1');
  h.host.emit('mouseenter');assert.equal(h.timers.size,0);
  h.controls['[data-banner-next]'].emit('click');assert.equal(h.controls['[data-banner-current]'].textContent,'2');
  h.host.emit('mouseleave');assert.equal(h.timers.size,1);
  h.host.emit('focusin');assert.equal(h.timers.size,0);
  h.host.emit('focusout');assert.equal(h.timers.size,1);
  h.controls['[data-banner-toggle]'].emit('click');assert.equal(h.timers.size,0);
  h.host.emit('mouseleave');assert.equal(h.timers.size,0,'La pausa manual se conserva');
  h.controls['[data-banner-toggle]'].emit('click');assert.equal(h.timers.size,1);
  h.doc.hidden=true;h.doc.emit('visibilitychange');assert.equal(h.timers.size,0);
  h.doc.hidden=false;h.doc.emit('visibilitychange');assert.equal(h.timers.size,1);
  let prevented=false;
  h.controls['.banner-track'].emit('keydown',{key:'ArrowLeft',preventDefault(){prevented=true;}});
  assert.ok(prevented);assert.equal(h.controls['[data-banner-current]'].textContent,'1');
});
test('Movimiento reducido y un único banner no inician reproducción automática',()=>{
  const reduced=harness({reduce:true});reduced.api.mount(reduced.host);
  assert.equal(reduced.timers.size,0);assert.ok(reduced.controls['[data-banner-toggle]'].hidden);
  reduced.controls['[data-banner-next]'].emit('click');assert.equal(reduced.controls['[data-banner-current]'].textContent,'2');
  const single=harness({count:1});single.api.mount(single.host);
  assert.equal(single.timers.size,0);assert.ok(single.controls['.banner-controls'].hidden);
  const changing=harness();changing.api.mount(changing.host);changing.media.matches=true;changing.media.emit('change');assert.equal(changing.timers.size,0);
});

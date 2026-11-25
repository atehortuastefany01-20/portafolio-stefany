export const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
export function assetPath(value) {
  if (!value || !/^assets\/[a-z\d_./-]+$/i.test(value) || value.split('/').includes('..')) throw new Error('Ruta de recurso inválida: '+value);
  return escapeHtml(value);
}
export function publicBase(value) {
  if (!value) return '';
  const url=new URL(value);
  if (url.protocol!=='https:' || url.username || url.password || url.search || url.hash) throw new Error('SITE_URL debe ser una URL HTTPS pública sin parámetros ni credenciales.');
  return url.href.replace(/\/?$/, '/');
}
export function seo(data, description, base, page='') {
  const title=page?'Fundamentos del portafolio · Stefany Atehortua Rivera':`${data.fullName} · Portafolio`;
  const graph={'@context':'https://schema.org','@type':'Person',name:data.fullName,jobTitle:data.discipline,sameAs:[data.github,data.linkedin]};
  if(base){ graph.url=base;graph.image=new URL(data.portrait,base).href; }
  const json=JSON.stringify(graph).replace(/</g,'\\u003c');
  return `<meta name="robots" content="${base?'index,follow':'noindex,follow'}">\n<meta property="og:title" content="${escapeHtml(title)}">\n<meta property="og:description" content="${escapeHtml(description)}">\n${base?`<link rel="canonical" href="${escapeHtml(new URL(page,base).href)}">\n<meta property="og:url" content="${escapeHtml(new URL(page,base).href)}">\n<meta property="og:image" content="${escapeHtml(new URL(data.portrait,base).href)}">`:''}\n<script type="application/ld+json">${json}</script>`;
}
export function renderPortfolio(template,data,bannersMarkup='') {
  let html=template;
  const values={'data-name':data.name,'data-full-name':data.fullName,'data-discipline':data.discipline,'data-tagline':data.tagline,'data-bio':data.bio,'data-note':data.personalNote,'data-education':data.education,'data-location':data.location,'data-footer-name':`${data.fullName} · Portafolio personal`};
  for(const [attr,value] of Object.entries(values)) html=html.replace(new RegExp(`<([a-z0-9]+)([^>]*\\b${attr}\\b[^>]*)>[\\s\\S]*?<\\/\\1>`,'gi'),(_,tag,attrs)=>`<${tag}${attrs}>${escapeHtml(value)}</${tag}>`);
  const fill=(id,body)=>{html=html.replace(new RegExp(`(<div[^>]*\\bid="${id}"[^>]*>)\\s*<\\/div>`),(_,open)=>open+body+'</div>');};
  fill('skills-list',data.skills.map(skill=>`<div class="skill-row"><span aria-hidden="true">✳</span><div><span class="skill-name">${escapeHtml(skill.name)}</span><span class="skill-value">${escapeHtml(skill.items.join(' · '))}</span></div></div>`).join(''));
  html=html.replace('<span class="small-note">Conocimientos por completar</span>','<span class="small-note" hidden>Conocimientos por completar</span>');
  html=html.replace(/<div class="polaroid-photo portrait-placeholder">[\s\S]*?<\/div>/,`<div class="polaroid-photo"><img src="${assetPath(data.portrait)}" alt="${escapeHtml(data.portraitAlt)}" width="900" height="1200" loading="lazy" decoding="async"></div>`);
  fill('education-timeline',data.educationHistory.map(item=>`<article class="education-item"><span class="education-year">${escapeHtml(item.year)}</span><div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.institution)}</p>${item.status?`<span class="education-status">${escapeHtml(item.status)}</span>`:''}</div></article>`).join(''));
  fill('language-list',data.languages.map(item=>`<p><strong>${escapeHtml(item.name)}</strong></p>`).join(''));
  fill('services-list',data.services.map(service=>`<p class="service-row">${escapeHtml(service)}</p>`).join(''));
  fill('contact-links',`<a class="email-link" href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a><a class="phone-link" href="tel:${escapeHtml(data.phone)}">${escapeHtml(data.phoneDisplay)}</a><a class="social-link" href="${escapeHtml(data.github)}" target="_blank" rel="noopener noreferrer">GitHub<span class="sr-only"> (abre en otra pestaña)</span></a><a class="social-link" href="${escapeHtml(data.linkedin)}" target="_blank" rel="noopener noreferrer">LinkedIn<span class="sr-only"> (abre en otra pestaña)</span></a>`);
  const projectLink = project => {
    if (!project.url) return '';
    try {
      const url = new URL(project.url);
      if (!['https:', 'http:'].includes(url.protocol)) return '';
      return `<div class="project-live-link"><a href="${escapeHtml(url.href)}" target="_blank" rel="noopener noreferrer">Visitar ${escapeHtml(project.title)}<span class="sr-only"> (abre en otra pestaña)</span></a></div>`;
    } catch { return ''; }
  };
  const projectEntries=data.projects.slice(0,2).map(project=>`<article class="project-item project-item--video"><div class="project-image"><video controls playsinline preload="metadata" poster="${assetPath(project.image)}" aria-label="Video del proyecto ${escapeHtml(project.title)}"><source src="${assetPath(project.video)}" type="video/mp4"><track kind="captions" src="${assetPath(project.captions)}" srclang="es" label="Español" default>Tu navegador no puede reproducir este video.</video></div><h3>${escapeHtml(project.title)}</h3><p>${escapeHtml(project.kind)}</p><p>${escapeHtml(project.summary)}</p><p>${escapeHtml(project.technologies.join(' · '))}</p>${projectLink(project)}</article>`);
  if (projectEntries.length<2 && bannersMarkup) projectEntries.push(bannersMarkup);
  while (projectEntries.length<2) projectEntries.push(`<article class="project-item"><div class="project-image"><span class="project-placeholder"><span class="signature">Vista del proyecto</span></span></div><h3>Proyecto por publicar</h3><p>Descripción, tecnologías y alcance.</p></article>`);
  fill('project-gallery',projectEntries.join(''));
  return html;
}

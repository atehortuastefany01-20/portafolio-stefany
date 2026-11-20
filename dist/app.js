(() => {
  'use strict';
  const data = window.PORTFOLIO || {};
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
  const text = (selector, value) => { if (value) $$(selector).forEach(el => { el.textContent = value; }); };
  const escape = (value = '') => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const safeImage = value => {
    if (typeof value !== 'string' || !value.trim()) return '';
    try { const url = new URL(value, location.href); return ['http:', 'https:', 'file:'].includes(url.protocol) ? value : ''; } catch { return ''; }
  };
  const safeLink = value => {
    if (typeof value !== 'string' || !value.trim()) return '';
    try { const url = new URL(value); return ['http:', 'https:'].includes(url.protocol) ? url.href : ''; } catch { return ''; }
  };
  const external = (url, label) => `<a href="${escape(url)}" target="_blank" rel="noopener noreferrer">${escape(label)}<span class="sr-only"> (abre en otra pestaña)</span></a>`;
  const icon = path => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${path}" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const icons = [
    'M8 7 3 12l5 5m8-10 5 5-5 5M14 4l-4 16',
    'M3 5h18v13H3zM8 21h8m-4-3v3M3 9h18',
    'M20 6c0 2-3.6 3-8 3S4 8 4 6s3.6-3 8-3 8 1 8 3ZM4 6v12c0 2 3.6 3 8 3s8-1 8-3V6M4 12c0 2 3.6 3 8 3s8-1 8-3',
    'M14 6a5 5 0 0 0-6 6l-5 5 4 4 5-5a5 5 0 0 0 6-6l-3 3-4-4 3-3Z',
  ];
  const pictureIcon = icon('M3 4h18v16H3zM3 16l5-5 5 5 3-3 5 5M16 8h.01');
  text('[data-name]', data.name);
  text('[data-full-name]', data.fullName || data.name);
  text('[data-discipline]', data.discipline);
  text('[data-tagline]', data.tagline);
  text('[data-bio]', data.bio);
  text('[data-note]', data.personalNote);
  text('[data-education]', data.education);
  text('[data-location]', data.location);
  if (data.name) {
    document.title = `${data.fullName || data.name} · Portafolio`;
    text('[data-footer-name]', `${data.fullName || data.name} · Portafolio personal`);
  }
  function mountPortrait(value, target) {
    const src = safeImage(value);
    if (!src) return;
    const host = $(target);
    if (!host) return;
    const img = document.createElement('img');
    img.src = src;
    img.alt = data.portraitAlt || `Retrato de ${data.fullName || data.name || 'la persona autora del portafolio'}`;
    img.decoding = 'async';
    img.loading = 'lazy';
    const fallback = [...host.childNodes];
    img.addEventListener('error', () => { host.replaceChildren(...fallback); }, { once: true });
    host.replaceChildren(img);
  }
  mountPortrait(data.portrait, '.polaroid-photo');

  const skills = Array.isArray(data.skills) ? data.skills : [];
  $('#skills-list').innerHTML = skills.map((skill, index) => {
    const values = Array.isArray(skill.items) ? skill.items.filter(Boolean).join(' · ') : '';
    return `<div class="skill-row">${icon(icons[index % icons.length])}<div><span class="skill-name">${escape(skill.name)}</span><span class="skill-value">${escape(values || 'Por añadir')}</span></div></div>`;
  }).join('');
  if (skills.some(skill => skill.items?.some(Boolean))) $('.small-note').hidden = true;
  if (!skills.length) $('#skills-list').innerHTML = '<p class="small-note">Conocimientos por añadir.</p>';

  const education = Array.isArray(data.educationHistory) ? data.educationHistory : [];
  $('#education-timeline').innerHTML = education.map(item => `<article class="education-item"><span class="education-year">${escape(item.year)}</span><div><h3>${escape(item.title)}</h3><p>${escape(item.institution)}</p>${item.status ? `<span class="education-status">${escape(item.status)}</span>` : ''}</div></article>`).join('');
  const languages = Array.isArray(data.languages) ? data.languages : [];
  $('#language-list').innerHTML = languages.map(item => `<p><strong>${escape(item.name)}</strong>${item.level ? `<span>${escape(item.level)}</span>` : ''}</p>`).join('');

  const realProjects = Array.isArray(data.projects) ? data.projects.filter(p => p && p.title).slice(0, 2) : [];
  const projects = [...realProjects];
  while (projects.length < 2) projects.push({ title: 'Proyecto por publicar', placeholder: true });
  if (realProjects.length) $('#project-gallery').classList.add('has-real-projects');
  $('#project-gallery').innerHTML = projects.map((project, index) => {
    const src = safeImage(project.image);
    const video = safeImage(project.video);
    const captions = safeImage(project.captions);
    if (video) {
      const technology = Array.isArray(project.technologies) ? project.technologies.filter(Boolean).join(' · ') : '';
      return `<article class="project-item project-item--video"><div class="project-image"><video controls playsinline preload="metadata"${src ? ` poster="${escape(src)}"` : ''} aria-label="Video del proyecto ${escape(project.title)}"><source src="${escape(video)}" type="video/mp4">${captions ? `<track kind="captions" src="${escape(captions)}" srclang="es" label="Español" default>` : ''}Tu navegador no puede reproducir este video.</video></div><h3>${escape(project.title)}</h3><p>${escape(project.kind || '')}</p><p>${escape(project.summary || '')}</p>${technology ? `<p class="project-technologies">${escape(technology)}</p>` : ''}</article>`;
    }
    const image = src ? `<img src="${escape(src)}" alt="Captura de ${escape(project.title)}" loading="lazy">` : `<span class="project-placeholder">${pictureIcon}<span class="signature">Vista del proyecto</span></span>`;
    return `<button class="project-item" type="button" data-open-project="${index}" aria-label="${escape(project.placeholder ? 'Explorar espacio de proyecto' : `Explorar ${project.title}`)}"><span class="project-image">${image}<span class="project-hover">${project.placeholder ? 'Ver espacio del proyecto' : 'Ver proyecto'}</span></span><h3>${escape(project.title)}</h3><p>${escape(project.kind || (project.placeholder ? 'Descripción, tecnologías y alcance.' : 'Explorar el caso de trabajo.'))}</p></button>`;
  }).join('');
  const services = Array.isArray(data.services) ? data.services.filter(Boolean) : [];
  $('#services-list').innerHTML = services.length ? services.map(item => `<p class="service-row">${escape(item)}</p>`).join('') : '<p class="service-empty">Un espacio para las soluciones que puedes ofrecer.<span class="signature">Tus servicios, por añadir. ♡</span></p>';
  const contacts = [];
  const email = typeof data.email === 'string' && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(data.email.trim()) ? data.email.trim() : '';
  if (email) contacts.push(`<a class="email-link" href="mailto:${encodeURIComponent(email).replace(/%40/g, '@')}">${escape(email)}</a>`);
  else contacts.push('<span class="email-pending">Tu correo profesional, por añadir.</span>');
  if (typeof data.phone === 'string' && /^\+?[\d\s()-]{6,20}$/.test(data.phone)) contacts.push(`<a class="phone-link" href="tel:${escape(data.phone.replace(/[\s()-]/g, ''))}">${escape(data.phoneDisplay || data.phone)}</a>`);
  for (const [key, label] of [['github', 'GitHub'], ['linkedin', 'LinkedIn']]) {
    const url = safeLink(data[key]);
    if (url) contacts.push(external(url, label).replace('<a ', '<a class="social-link" '));
  }
  $('#contact-links').innerHTML = contacts.join('');

  const menuButton = $('.menu-toggle');
  const nav = $('#main-nav');
  function closeMenu(restore = false) {
    menuButton.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
    if (restore) menuButton.focus();
  }
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
  });
  nav.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('click', event => { if (!event.target.closest('.site-header')) closeMenu(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') closeMenu(true); });
  const mobileMedia = matchMedia('(max-width: 820px)');
  mobileMedia.addEventListener('change', () => closeMenu());

  const dialog = $('#project-dialog');
  let previousFocus;
  let previousOverflow;
  function projectDetail(label, value, fallback) {
    return `<div class="dialog-detail"><h3>${label}</h3><p>${escape(value || fallback)}</p></div>`;
  }
  function openProject(index, trigger) {
    const project = projects[index] || projects[0];
    if (!project) return;
    previousFocus = trigger;
    $('#dialog-title').textContent = project.title;
    const image = safeImage(project.image);
    const picture = image ? `<img class="dialog-image" src="${escape(image)}" alt="Captura de ${escape(project.title)}">` : '<div class="dialog-empty-image"><span class="signature">Vista del proyecto</span><p>Contenido disponible próximamente.</p></div>';
    const technology = Array.isArray(project.technologies) ? project.technologies.filter(Boolean) : [];
    const links = [['url', 'Visitar proyecto'], ['repository', 'Ver repositorio']].map(([key, label]) => { const url = safeLink(project[key]); return url ? external(url, label) : ''; }).join('');
    $('#dialog-body').innerHTML = `${picture}<p class="dialog-summary">${escape(project.summary || 'Próximamente: propósito, alcance y tecnologías de este desarrollo.')}</p>${project.placeholder ? '' : `<div class="dialog-details">${projectDetail('El reto', project.challenge, 'Información pendiente de publicación.')}${projectDetail('Mi aporte', project.contribution, 'Información pendiente de publicación.')}${projectDetail('Resultados', project.result, 'Información pendiente de publicación.')}${projectDetail('Tecnologías', technology.join(' · '), 'Información pendiente de publicación.')}</div>`}${links ? `<div class="project-external-links">${links}</div>` : ''}`;
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
  }
  document.addEventListener('click', event => {
    const trigger = event.target.closest('[data-open-project]');
    if (trigger) openProject(Number(trigger.dataset.openProject), trigger);
  });
  $('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => { document.body.style.overflow = previousOverflow || ''; previousFocus?.focus({ preventScroll: true }); });

  if ('IntersectionObserver' in window) {
    const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); reveal.unobserve(entry.target); }
    }), { threshold: 0.08, rootMargin: '0px 0px -15px 0px' });
    document.documentElement.classList.add('motion-ready');
    $$('.reveal').forEach(el => reveal.observe(el));
    const navObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      $$('#main-nav a').forEach(link => {
        if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }), { rootMargin: '-15% 0px -55% 0px', threshold: 0 });
    ['sobre-mi', 'habilidades', 'proyectos', 'formacion', 'contacto'].forEach(id => navObserver.observe(document.getElementById(id)));
  }
  const progress = $('.reading-progress');
  let scrollQueued = false;
  function updateScroll() {
    const height = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${height > 0 ? Math.min(1, Math.max(0, scrollY / height)) : 0})`;
    scrollQueued = false;
  }
  addEventListener('scroll', () => { if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(updateScroll); } }, { passive: true });
  addEventListener('resize', updateScroll, { passive: true });
  updateScroll();
})();

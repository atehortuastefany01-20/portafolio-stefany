(function (root) {
  'use strict';
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  function validItems(items) {
    return (Array.isArray(items) ? items : []).filter(item => item && typeof item.image === 'string' && /^assets\/[a-z\d_./-]+$/i.test(item.image) && !item.image.split('/').includes('..') && typeof item.alt === 'string' && item.alt.trim());
  }
  function render(items) {
    const banners = validItems(items);
    if (!banners.length) return '';
    return `<article class="project-item project-item--banners"><div class="banner-carousel" role="region" aria-roledescription="carrusel" aria-label="Trabajos de marketing visual"><div class="banner-track" tabindex="0" aria-label="Banners de marketing: usa las teclas izquierda y derecha">${banners.map((banner, index) => `<figure class="banner-slide${index === 0 ? ' is-active' : ''}" role="group" aria-roledescription="diapositiva" aria-label="${index + 1} de ${banners.length}"><img src="${escape(banner.image)}" alt="${escape(banner.alt)}" loading="lazy" decoding="async">${banner.title ? `<figcaption>${escape(banner.title)}</figcaption>` : ''}</figure>`).join('')}</div><div class="banner-controls" hidden><button type="button" data-banner-prev aria-label="Banner anterior">Anterior</button><p class="banner-counter" aria-live="off"><span data-banner-current>1</span> / ${banners.length}</p><button type="button" data-banner-next aria-label="Banner siguiente">Siguiente</button><button type="button" data-banner-toggle aria-pressed="false">Pausar</button></div><p class="sr-only" data-banner-status role="status" aria-live="polite"></p></div><h3>Marketing visual</h3><p>Banners y piezas gráficas</p><p>Una selección de mis trabajos de marketing.</p></article>`;
  }
  function mount(host) {
    if (!host || host.dataset.mounted) return;
    const slides = [...host.querySelectorAll('.banner-slide')];
    if (!slides.length) return;
    host.dataset.mounted = 'true';
    const controls = host.querySelector('.banner-controls');
    const toggle = host.querySelector('[data-banner-toggle]');
    const current = host.querySelector('[data-banner-current]');
    const status = host.querySelector('[data-banner-status]');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let index = 0;
    let wantsPlay = !reduced.matches;
    let hovered = false;
    let focused = false;
    let inView = !('IntersectionObserver' in root);
    let timer;
    function schedule() {
      clearTimeout(timer);
      if (slides.length > 1 && wantsPlay && !reduced.matches && !hovered && !focused && !document.hidden && inView) timer = setTimeout(() => { show(index + 1); }, 4500);
    }
    function show(next, announce = false) {
      index = (next + slides.length) % slides.length;
      slides.forEach((slide, i) => {
        slide.classList.toggle('is-active', i === index);
        slide.setAttribute('aria-hidden', String(i !== index));
        slide.inert = i !== index;
      });
      current.textContent = String(index + 1);
      if (announce) status.textContent = `Banner ${index + 1} de ${slides.length}`;
      schedule();
    }
    host.classList.add('is-enhanced');
    controls.hidden = slides.length < 2;
    toggle.hidden = reduced.matches;
    host.querySelector('[data-banner-prev]').addEventListener('click', () => show(index - 1, true));
    host.querySelector('[data-banner-next]').addEventListener('click', () => show(index + 1, true));
    toggle.addEventListener('click', () => {
      wantsPlay = !wantsPlay;
      toggle.textContent = wantsPlay ? 'Pausar' : 'Reanudar';
      toggle.setAttribute('aria-pressed', String(!wantsPlay));
      schedule();
    });
    host.querySelector('.banner-track').addEventListener('keydown', event => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      show(index + (event.key === 'ArrowRight' ? 1 : -1), true);
    });
    host.addEventListener('mouseenter', () => { hovered = true; schedule(); });
    host.addEventListener('mouseleave', () => { hovered = false; schedule(); });
    host.addEventListener('focusin', () => { focused = true; schedule(); });
    host.addEventListener('focusout', () => queueMicrotask(() => { focused = host.contains(document.activeElement); schedule(); }));
    document.addEventListener('visibilitychange', schedule);
    reduced.addEventListener('change', () => { toggle.hidden = reduced.matches; schedule(); });
    if ('IntersectionObserver' in root) {
      const observer = new IntersectionObserver(entries => { inView = entries.some(entry => entry.isIntersecting); schedule(); }, { threshold: 0.15 });
      observer.observe(host);
    }
    show(0);
  }
  root.PortfolioBanners = { render, mount, validItems };
})(window);

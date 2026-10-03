(() => {
  const button = document.getElementById('menuBtn');
  const nav = document.getElementById('mobileNav');
  const mobile = matchMedia('(max-width:980px)');
  function setMenu(open, restoreFocus = false) {
    nav.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
    if (restoreFocus) button.focus();
  }
  if (button && nav) {
    button.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', e => {
      if (!nav.classList.contains('open')) return;
      if (e.key === 'Escape') { setMenu(false, true); return; }
      if (e.key !== 'Tab') return;
      const links = [...nav.querySelectorAll('a')];
      if (e.shiftKey && document.activeElement === button) { e.preventDefault(); links.at(-1).focus(); }
      else if (!e.shiftKey && document.activeElement === links.at(-1)) { e.preventDefault(); button.focus(); }
    });
    mobile.addEventListener('change', () => setMenu(false));
  }
  document.querySelectorAll('.top-carousel').forEach(section => {
    const track = section.querySelector('.top-track');
    const controls = section.querySelector('.carousel-controls');
    const [prev, next] = controls.querySelectorAll('button');
    const update = () => {
      const max = track.scrollWidth - track.clientWidth;
      controls.hidden = max <= 2;
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= max - 2;
    };
    [prev, next].forEach((b, i) => b.addEventListener('click', () => track.scrollBy({left:(i ? 1 : -1) * (track.firstElementChild.getBoundingClientRect().width + 16), behavior:matchMedia('(prefers-reduced-motion:reduce)').matches ? 'instant' : 'smooth'})));
    track.addEventListener('scroll', update, {passive:true});
    new ResizeObserver(update).observe(track);
    update();
  });
  document.querySelectorAll('img[data-safe]').forEach(img => {
    const failed = () => { img.hidden = true; const fallback = img.nextElementSibling; if (fallback?.classList.contains('media-fallback')) fallback.style.display = 'flex'; };
    img.addEventListener('error', failed);
    if (img.complete && !img.naturalWidth) failed();
  });
})();

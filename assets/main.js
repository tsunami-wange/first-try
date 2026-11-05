// Add data-zoom to a real project image to enable the accessible enlarged view.
document.addEventListener('click', function (event) {
  const image = event.target.closest('img[data-zoom]');
  if (!image) return;
  const dialog = document.createElement('dialog');
  dialog.className = 'image-dialog';
  const close = document.createElement('button');
  close.textContent = '关闭 ×';
  close.setAttribute('aria-label', '关闭图片');
  const enlarged = document.createElement('img');
  enlarged.src = image.currentSrc || image.src;
  enlarged.alt = image.alt;
  dialog.append(close, enlarged);
  document.body.append(dialog);
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => { dialog.remove(); image.focus(); });
  dialog.showModal();
});
document.addEventListener('keydown', function (event) {
  if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('img[data-zoom]')) {
    event.preventDefault(); event.target.click();
  }
});

// Highlight the section currently being read in the homepage navigation.
const sectionDots = document.querySelector('.section-dots');
if (sectionDots) {
  const links = Array.from(sectionDots.querySelectorAll('a'));
  const sections = links.map(link => document.querySelector(link.getAttribute('href')));
  function updateSectionDots() {
    const marker = window.innerHeight * 0.35;
    let current = 0;
    sections.forEach((section, index) => {
      if (section && section.getBoundingClientRect().top <= marker) current = index;
    });
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) current = links.length - 1;
    links.forEach((link, index) => {
      if (index === current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  window.addEventListener('scroll', updateSectionDots, { passive: true });
  window.addEventListener('resize', updateSectionDots);
  updateSectionDots();
}

// Account for the actual header height when the navigation wraps on small screens.
if (sectionDots) {
  const header = document.querySelector('.site-header');
  const syncHeaderHeight = () => document.documentElement.style.setProperty('--home-header-height', `${header.getBoundingClientRect().height}px`);
  syncHeaderHeight();
  window.addEventListener('resize', syncHeaderHeight);
  if ('ResizeObserver' in window) new ResizeObserver(syncHeaderHeight).observe(header);
}

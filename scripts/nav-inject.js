(function(){
  async function loadNav() {
    try {
      const resp = await fetch('/src/_includes/nav.html');
      if (!resp.ok) return console.warn('Nav load failed:', resp.status);
      const html = await resp.text();
      const target = document.getElementById('site-nav');
      if (target) {
        target.innerHTML = html;
      } else {
        // Fallback: replace first <nav> if placeholder not present
        const existing = document.querySelector('nav');
        if (existing) existing.outerHTML = html;
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('Nav injection error:', err.message);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadNav);
  } else {
    loadNav();
  }
})();

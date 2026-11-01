// system-map prototype (#166): section entrances and the M0 node info. No dependencies.
(function () {
  var root = document.documentElement;
  root.classList.add('js');

  // Entrances: each section's parts rise in order, once. Without the script everything is shown.
  var sections = document.querySelectorAll('main section, footer');
  sections.forEach(function (sec) {
    sec.querySelectorAll('[data-r]').forEach(function (el, i) { el.style.setProperty('--i', String(i)); });
  });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.querySelectorAll('[data-r]').forEach(function (el) { el.classList.add('in'); });
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -12% 0px' });
    sections.forEach(function (sec) { io.observe(sec); });
  } else {
    document.querySelectorAll('[data-r]').forEach(function (el) { el.classList.add('in'); });
  }

  // M0: a node shows the fact of its group below the map. Without the script all groups are listed.
  var nodes = document.querySelectorAll('.m0 .node');
  var groups = document.querySelectorAll('.m0-g');
  function show(node) {
    var id = node.getAttribute('data-g');
    nodes.forEach(function (n) { n.setAttribute('aria-pressed', String(n === node)); });
    groups.forEach(function (g) { g.hidden = g.id !== id; });
  }
  nodes.forEach(function (n) { n.addEventListener('click', function () { show(n); }); });
  var first = document.querySelector('.m0 .node[aria-pressed="true"]');
  if (first) show(first);
})();

// ========== PARTICLE SYSTEM ==========
(function initParticles() {
  var c = document.getElementById('particles-canvas');
  if (!c) return;
  var ctx = c.getContext('2d');
  var W, H;
  function resize() { W = c.width = window.innerWidth; H = c.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  var dots = [];
  var COUNT = window.innerWidth < 768 ? 50 : 120;
  var mx = W / 2, my = H / 2;
  document.addEventListener('mousemove', function (e) { mx = e.clientX; my = e.clientY; });

  for (var i = 0; i < COUNT; i++) {
    var z = Math.random() * 2 + 0.5;
    dots.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 0.6 * z, vy: (Math.random() - 0.5) * 0.6 * z, r: (Math.random() * 1.5 + 0.5) * z, z: z });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < dots.length; i++) {
      var d = dots[i];
      d.x += d.vx; d.y += d.vy;
      if (d.x < 0 || d.x > W) d.vx *= -1;
      if (d.y < 0 || d.y > H) d.vy *= -1;

      var dx = d.x - mx, dy = d.y - my;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 200 && dist > 0) { d.x += (dx / dist) * 1.5 * d.z; d.y += (dy / dist) * 1.5 * d.z; }

      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(129,140,248,' + (0.4 * d.z) + ')';
      ctx.fill();

      for (var j = i + 1; j < dots.length; j++) {
        var d2 = dots[j];
        var dd = Math.sqrt((d.x - d2.x) * (d.x - d2.x) + (d.y - d2.y) * (d.y - d2.y));
        if (dd < 130) {
          ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(d2.x, d2.y);
          var opacity = (1 - dd / 130) * 0.35;
          ctx.strokeStyle = 'rgba(129,140,248,' + opacity + ')';
          ctx.lineWidth = Math.min(d.z, d2.z) * 0.8;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

// ========== TYPEWRITER ==========
(function typewriter() {
  var el = document.getElementById('hero-subtitle');
  if (!el) return;
  var phrases = ['Robotics Student', 'Innovator', 'Hackathon Winner'];
  var pi = 0, ci = 0;
  var cursor = document.createElement('span');
  cursor.className = 'cursor';
  cursor.innerHTML = '&nbsp;';
  var textNode = document.createTextNode('');
  el.appendChild(textNode);
  el.appendChild(cursor);

  function type() {
    var phrase = phrases[pi];
    var prefix = '';
    for (var k = 0; k < pi; k++) { prefix += phrases[k] + ' | '; }
    textNode.textContent = prefix + phrase.substring(0, ci);
    ci++;
    if (ci > phrase.length) {
      if (pi < phrases.length - 1) { pi++; ci = 0; setTimeout(type, 800); }
      return;
    }
    setTimeout(type, 70 + Math.random() * 40);
  }
  setTimeout(type, 600);
})();

// ========== SCROLL REVEALS ==========
var revealEls = document.querySelectorAll('.reveal-up,.reveal-left,.reveal-right,.reveal-scale');
// First hide them via JS (so they're visible if JS fails)
revealEls.forEach(function (el) { el.classList.add('hidden-anim'); });
var revealObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (e) {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
revealEls.forEach(function (el) { revealObserver.observe(el); });

// ========== STAT COUNTER ==========
var statObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      var el = entry.target;
      var target = parseInt(el.getAttribute('data-target'));
      var dur = 2000;
      var start = performance.now();
      function tick(now) {
        var p = Math.min((now - start) / dur, 1);
        var ease = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(ease * target).toLocaleString();
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target.toLocaleString();
      }
      requestAnimationFrame(tick);
      statObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-number').forEach(function (el) { statObserver.observe(el); });

// ========== MAGNETIC BUTTONS ==========
document.querySelectorAll('.magnetic-btn').forEach(function (btn) {
  btn.addEventListener('mousemove', function (e) {
    var r = btn.getBoundingClientRect();
    var x = e.clientX - r.left - r.width / 2;
    var y = e.clientY - r.top - r.height / 2;
    btn.style.transform = 'translate(' + (x * 0.25) + 'px,' + (y * 0.25) + 'px)';
  });
  btn.addEventListener('mouseleave', function () { btn.style.transform = ''; });
  btn.addEventListener('click', function (e) {
    var ripple = document.createElement('span');
    ripple.className = 'ripple';
    var r = btn.getBoundingClientRect();
    ripple.style.left = (e.clientX - r.left) + 'px';
    ripple.style.top = (e.clientY - r.top) + 'px';
    var size = Math.max(r.width, r.height) + 'px';
    ripple.style.width = size; ripple.style.height = size;
    btn.appendChild(ripple);
    setTimeout(function () { ripple.remove(); }, 600);
  });
});

// ========== PROJECT TILT ==========
document.querySelectorAll('.project-card').forEach(function (card) {
  card.addEventListener('mousemove', function (e) {
    var r = card.getBoundingClientRect();
    var x = (e.clientX - r.left) / r.width - 0.5;
    var y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = 'perspective(600px) rotateY(' + (x * 8) + 'deg) rotateX(' + (-y * 8) + 'deg) translateY(-4px)';
  });
  card.addEventListener('mouseleave', function () { card.style.transform = ''; });
});

// ========== PROJECT FILTERS ==========
document.querySelectorAll('.filter-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.filter-btn').forEach(function (b) { b.classList.remove('active'); });
    btn.classList.add('active');
    var f = btn.getAttribute('data-filter');
    document.querySelectorAll('.project-card').forEach(function (card) {
      if (f === 'all' || card.getAttribute('data-category') === f) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ========== RADAR CHART ==========
(function drawRadar() {
  var canvas = document.getElementById('radar-chart');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var W = canvas.width, H = canvas.height;
  var cx = W / 2, cy = H / 2, R = 160;
  var labels = ['Robotics', 'Hardware', 'Programming', 'CAD Design', 'Simulation', 'Leadership'];
  var values = [0.90, 0.95, 0.85, 0.88, 0.82, 0.95];
  var n = labels.length;
  var progress = 0;

  function angle(i) { return (Math.PI * 2 * i) / n - Math.PI / 2; }

  function render() {
    ctx.clearRect(0, 0, W, H);
    var ri, ai, pi2, lx, ly;
    for (ri = 1; ri <= 5; ri++) {
      ctx.beginPath();
      for (ai = 0; ai <= n; ai++) {
        var a2 = angle(ai % n);
        var rad = R * (ri / 5);
        var px2 = cx + Math.cos(a2) * rad, py2 = cy + Math.sin(a2) * rad;
        ai === 0 ? ctx.moveTo(px2, py2) : ctx.lineTo(px2, py2);
      }
      ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 1; ctx.stroke();
    }
    for (ai = 0; ai < n; ai++) {
      var a3 = angle(ai);
      ctx.beginPath(); ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(a3) * R, cy + Math.sin(a3) * R);
      ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.stroke();
      lx = cx + Math.cos(a3) * (R + 28); ly = cy + Math.sin(a3) * (R + 28);
      ctx.fillStyle = '#6b7280'; ctx.font = '13px Space Grotesk, sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(labels[ai], lx, ly);
    }
    ctx.beginPath();
    for (ai = 0; ai <= n; ai++) {
      var a4 = angle(ai % n);
      var v = values[ai % n] * Math.min(progress, 1);
      var px4 = cx + Math.cos(a4) * R * v, py4 = cy + Math.sin(a4) * R * v;
      ai === 0 ? ctx.moveTo(px4, py4) : ctx.lineTo(px4, py4);
    }
    ctx.fillStyle = 'rgba(129,140,248,0.12)'; ctx.fill();
    ctx.strokeStyle = '#818cf8'; ctx.lineWidth = 2; ctx.stroke();
    for (ai = 0; ai < n; ai++) {
      var a5 = angle(ai);
      var v2 = values[ai] * Math.min(progress, 1);
      ctx.beginPath();
      ctx.arc(cx + Math.cos(a5) * R * v2, cy + Math.sin(a5) * R * v2, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#818cf8'; ctx.fill();
    }
  }

  var radarObs = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting) {
      var start = performance.now();
      function anim(now) {
        progress = (now - start) / 1200;
        render();
        if (progress < 1) requestAnimationFrame(anim);
      }
      requestAnimationFrame(anim);
      radarObs.unobserve(canvas);
    }
  }, { threshold: 0.3 });
  radarObs.observe(canvas);
  render();
})();

// ========== NAV TOGGLE ==========
document.getElementById('nav-toggle').addEventListener('click', function () {
  document.getElementById('nav-links').classList.toggle('open');
});
document.querySelectorAll('#nav-links a').forEach(function (a) {
  a.addEventListener('click', function () { document.getElementById('nav-links').classList.remove('open'); });
});

// ========== CONTACT FORM ==========
document.getElementById('contact-form').addEventListener('submit', function (e) {
  e.preventDefault();
  var btn = document.getElementById('contact-submit');
  btn.classList.add('loading');
  setTimeout(function () {
    btn.classList.remove('loading');
    btn.classList.add('success');
    setTimeout(function () { btn.classList.remove('success'); }, 2500);
  }, 1500);
});

// ========== SMOOTH SCROLL ==========
document.querySelectorAll('a[href^="#"]').forEach(function (a) {
  a.addEventListener('click', function (e) {
    e.preventDefault();
    var target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

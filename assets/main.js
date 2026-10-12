(function () {
  "use strict";

  // Mobile-Navigation
  var btn = document.querySelector(".menu-btn");
  var nav = document.getElementById("nav");
  if (btn && nav) {
    btn.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) { nav.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); }
    });
  }

  // Kopieren-Knöpfe (Telefon, E-Mail)
  document.querySelectorAll("[data-copy]").forEach(function (b) {
    b.addEventListener("click", function () {
      var text = b.getAttribute("data-copy");
      var done = function () { var t = b.textContent; b.textContent = "Kopiert"; setTimeout(function () { b.textContent = t; }, 1600); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { selectText(b); });
      } else { selectText(b); }
    });
  });
  function selectText(b) {
    var target = b.parentElement.querySelector(".value");
    if (!target) return;
    var r = document.createRange(); r.selectNodeContents(target);
    var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
  }

  // Jetzt geöffnet? (Schweizer Zeit; Mo–Fr 08–12, 13–17)
  var status = document.querySelector(".open-now");
  if (status) {
    try {
      var parts = new Intl.DateTimeFormat("de-CH", { timeZone: "Europe/Zurich", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date());
      var get = function (t) { var p = parts.find(function (x) { return x.type === t; }); return p ? p.value : ""; };
      var day = get("weekday").replace(".", "");
      var mins = parseInt(get("hour"), 10) * 60 + parseInt(get("minute"), 10);
      var workday = ["Mo", "Di", "Mi", "Do", "Fr"].indexOf(day) !== -1;
      var open = workday && ((mins >= 480 && mins < 720) || (mins >= 780 && mins < 1020));
      status.classList.toggle("is-open", open);
      status.textContent = open ? "Jetzt erreichbar" : "Zurzeit geschlossen – E-Mail jederzeit möglich";
      status.hidden = false;
    } catch (e) { /* Anzeige bleibt verborgen */ }
  }

  // Jahr im Footer
  var y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());

  // Hero: 12 Fasern im IEC-Farbkode laufen in einer Spleissstelle zusammen, Lichtimpulse wandern hindurch.
  var canvas = document.getElementById("fibers");
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext("2d");
  var colors = ["#d7262e", "#2a9a45", "#2560b8", "#f2c200", "#c7ccd3", "#8c959c", "#8a5a2b", "#7b3fa6", "#25b5b0", "#3a3f44", "#ef7d1a", "#ef8fb4"];
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var W = 0, H = 0, dpr = 1, pulses = [], raf = 0;

  function resize() {
    var r = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = r.width; H = r.height;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw(0);
  }

  // Faser i: Bezierkurve von rechts (gefächert) zur Spleissstelle und weiter als gebündelte Leitung nach links
  function point(i, t) {
    var n = colors.length;
    var spread = (i - (n - 1) / 2) / ((n - 1) / 2);   // -1 … 1
    var narrow = W < 700;
    var sx = W * (narrow ? 0.6 : 0.68), sy = H * (narrow ? 0.88 : 0.72);   // Spleissstelle
    var x0 = W + 20, y0 = H * 0.5 + spread * H * 0.48;
    var x1 = W * 0.78, y1 = y0;
    var x2 = sx + W * 0.12, y2 = sy + spread * 6;
    var x3 = sx, y3 = sy + spread * 3;
    if (t <= 1) {
      var u = 1 - t;
      return [u*u*u*x0 + 3*u*u*t*x1 + 3*u*t*t*x2 + t*t*t*x3, u*u*u*y0 + 3*u*u*t*y1 + 3*u*t*t*y2 + t*t*t*y3];
    }
    var k = t - 1; // gerade, gebündelte Strecke nach links
    return [x3 - k * (sx + 40), y3];
  }

  function draw(now) {
    ctx.clearRect(0, 0, W, H);
    ctx.lineCap = "round";
    for (var i = 0; i < colors.length; i++) {
      ctx.beginPath();
      for (var s = 0; s <= 60; s++) {
        var p = point(i, (s / 60) * 2);
        if (s === 0) ctx.moveTo(p[0], p[1]); else ctx.lineTo(p[0], p[1]);
      }
      ctx.strokeStyle = colors[i];
      ctx.globalAlpha = 0.8;
      ctx.lineWidth = 1.8;
      ctx.stroke();
    }
    // Spleissschutz
    var sp = point(5.5, 1);
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = "#c9d3db";
    ctx.fillRect(sp[0] - 34, sp[1] - 9, 68, 18);
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#8892a0";
    ctx.fillRect(sp[0] - 30, sp[1] - 1, 60, 2);

    // Lichtimpulse
    for (var j = 0; j < pulses.length; j++) {
      var pl = pulses[j];
      var q = point(pl.fiber, pl.t);
      var g = ctx.createRadialGradient(q[0], q[1], 0, q[0], q[1], 14);
      g.addColorStop(0, "rgba(255,255,255,1)");
      g.addColorStop(0.3, colors[pl.fiber]);
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.globalAlpha = Math.min(1, (2 - pl.t) * 2);
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(q[0], q[1], 14, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  var last = 0;
  function tick(ts) {
    var dt = last ? Math.min(50, ts - last) : 16; last = ts;
    if (Math.random() < 0.05 && pulses.length < 10) pulses.push({ fiber: Math.floor(Math.random() * colors.length), t: 0, v: 0.00035 + Math.random() * 0.0002 });
    for (var i = pulses.length - 1; i >= 0; i--) { pulses[i].t += pulses[i].v * dt; if (pulses[i].t > 2) pulses.splice(i, 1); }
    draw(ts);
    raf = requestAnimationFrame(tick);
  }

  resize();
  window.addEventListener("resize", resize);
  // Mausbewegung über dem Hero schickt zusätzliche Lichtimpulse los
  var hero = canvas.parentElement, lastSpawn = 0;
  hero.addEventListener("pointermove", function (e) {
    if (reduce || e.timeStamp - lastSpawn < 120 || pulses.length > 24) return;
    lastSpawn = e.timeStamp;
    var r = hero.getBoundingClientRect();
    var f = Math.max(0, Math.min(colors.length - 1, Math.round(((e.clientY - r.top) / r.height) * (colors.length - 1))));
    pulses.push({ fiber: f, t: 0, v: 0.0006 + Math.random() * 0.0003 });
  });
  if (!reduce) {
    // Startzustand: einige Impulse bereits unterwegs, damit das erste Bild nicht leer wirkt
    for (var k = 0; k < 6; k++) pulses.push({ fiber: (k * 5) % colors.length, t: k * 0.3, v: 0.0004 });
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) { cancelAnimationFrame(raf); } else { last = 0; raf = requestAnimationFrame(tick); }
    });
    raf = requestAnimationFrame(tick);
  }
})();

(function () {
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Scroll-Fortschritt im Header
  var bar = document.querySelector(".progress span");
  if (bar) {
    var upd = function () {
      var h = document.documentElement.scrollHeight - innerHeight;
      bar.style.setProperty("--p", h > 0 ? Math.min(1, scrollY / h).toFixed(4) : 0);
    };
    addEventListener("scroll", upd, { passive: true }); addEventListener("resize", upd); upd();
  }

  // Statusanzeige der Spleiss-Illustration im Takt der Animation (6 s)
  var state = document.querySelector(".splice-state");
  if (state && !reduce) {
    var t0 = performance.now();
    var labels = [[0.35, "Fasern ausrichten"], [0.56, "Lichtbogen"], [1, "Signal durchgängig"]];
    (function loop(now) {
      var p = ((now - t0) % 6000) / 6000, txt = labels[labels.length - 1][1];
      for (var i = 0; i < labels.length; i++) { if (p < labels[i][0]) { txt = labels[i][1]; break; } }
      if (state.textContent !== txt) state.textContent = txt;
      requestAnimationFrame(loop);
    })(t0);
  }

  // Einblenden: nur Elemente, die beim Laden unterhalb des Bildschirms liegen
  if (reduce || !("IntersectionObserver" in window)) return;
  var els = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target;
      el.classList.remove("armed");
      el.classList.add(el.classList.contains("trace") ? "drawn" : "shown");
      io.unobserve(el);
    });
  }, { rootMargin: "0px 0px -10% 0px", threshold: 0.12 });
  els.forEach(function (el) {
    if (el.getBoundingClientRect().top > innerHeight) {
      el.classList.add("armed");
      if (el.classList.contains("trace")) { el.classList.remove("reveal"); }
      io.observe(el);
    }
  });
})();

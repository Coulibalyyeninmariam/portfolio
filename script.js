var $ = function (i) {
    return document.getElementById(i);
  },
  RM = matchMedia("(prefers-reduced-motion:reduce)").matches;
var tl = function (a) {
  return a
    .map(function (e) {
      return (
        '<div class="ev"><small>' +
        e.y +
        "</small><h4>" +
        e.t +
        "</h4><p>" +
        e.d +
        "</p></div>"
      );
    })
    .join("");
};
$("edu").innerHTML = tl(EDU);
$("exp").innerHTML = tl(EXP);
$("sk").innerHTML = SK.map(function (g) {
  return (
    "<div><h3>" +
    g.g +
    "</h3>" +
    g.i
      .map(function (s) {
        return (
          '<div class="bar"><div><span>' +
          s[0] +
          "</span><span>" +
          s[1] +
          '%</span></div><div class="trk"><i data-w="' +
          s[1] +
          '"></i></div></div>'
        );
      })
      .join("") +
    "</div>"
  );
}).join("");
$("cg").innerHTML = CE.map(function (c) {
  return (
    '<div class="card"><div class="cb"><small>' +
    c.y +
    "</small><h3>" +
    c.n +
    "</h3><p>" +
    c.o +
    '</p><a href="' +
    c.f +
    '" target="_blank">Vérifier le certificat</a></div></div>'
  );
}).join("");
var F = "Tous",
  K = ["Tous"].concat(
    P.map(function (p) {
      return p.k;
    }).filter(function (v, i, a) {
      return a.indexOf(v) === i;
    }),
  );
function pj() {
  $("filters").innerHTML = K.map(function (k) {
    return (
      '<button class="chip" aria-pressed="' +
      (F === k) +
      '" data-k="' +
      k +
      '">' +
      k +
      "</button>"
    );
  }).join("");
  $("pg").innerHTML = P.filter(function (p) {
    return F === "Tous" || p.k === F;
  })
    .map(function (p) {
      return (
        '<article class="card"><div class="shot" style="background:' +
        p.c +
        '">' +
  (p.i
    ? '<img src="' + p.i + '" alt="Capture d’écran de ' + p.n + '" />'
    : "Ta capture d’écran ici") +
  '</div><div class="cb"><h3>' +
        p.n +
        "</h3><p>" +
        p.d +
        '</p><div class="tags">' +
        p.s
          .map(function (s) {
            return '<span class="tag">' + s + "</span>";
          })
          .join("") +
        '</div><a href="public/toiletfinder-maquette (2).png">Voir le projet</a></div></article>'
      );
    })
    .join("");
}
pj();
$("filters").onclick = function (e) {
  var b = e.target.closest("[data-k]");
  if (b) {
    F = b.dataset.k;
    pj();
  }
};

/* inclinaison des cartes */
document.addEventListener("pointermove", function (e) {
  if (RM || e.pointerType === "touch") return;
  var c = e.target.closest(".card");
  document.querySelectorAll(".card").forEach(function (x) {
    if (x !== c) x.style.transform = "";
  });
  if (!c) return;
  var r = c.getBoundingClientRect(),
    px = (e.clientX - r.left) / r.width - 0.5,
    py = (e.clientY - r.top) / r.height - 0.5;
  c.style.transform =
    "rotateY(" + px * 9 + "deg) rotateX(" + -py * 9 + "deg) translateY(-4px)";
});

/* curseur-anneau (le curseur normal reste visible) */
var ring = $("ring");
addEventListener("pointermove", function (e) {
  if (e.pointerType === "touch") return;
  ring.style.opacity = 1;
  ring.style.transform =
    "translate(" + (e.clientX - 17) + "px," + (e.clientY - 17) + "px)";
  ring.classList.toggle("big", !!e.target.closest("a,button,.card"));
});
document.addEventListener("pointerleave", function () {
  ring.style.opacity = 0;
});

/* particules */
var cv = $("cv"),
  cx = cv.getContext("2d"),
  pts = [],
  mx = -999,
  my = -999,
  col = "#00B8D9",
  fr = 0;
function rs() {
  cv.width = cv.offsetWidth;
  cv.height = cv.offsetHeight;
  pts = [];
  var n = Math.min(70, Math.round((cv.width * cv.height) / 16000));
  for (var i = 0; i < n; i++)
    pts.push({
      x: Math.random() * cv.width,
      y: Math.random() * cv.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
    });
}
function dr() {
  if (fr++ % 30 === 0)
    col = getComputedStyle(document.documentElement).getPropertyValue("--mint").trim();
  cx.clearRect(0, 0, cv.width, cv.height);
  cx.fillStyle = col;
  cx.strokeStyle = col;
  pts.forEach(function (p, i) {
    if (!RM) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > cv.width) p.vx *= -1;
      if (p.y < 0 || p.y > cv.height) p.vy *= -1;
    }
    cx.globalAlpha = 0.7;
    cx.beginPath();
    cx.arc(p.x, p.y, 2, 0, 6.3);
    cx.fill();
    for (var j = i + 1; j < pts.length; j++) {
      var d = Math.hypot(p.x - pts[j].x, p.y - pts[j].y);
      if (d < 120) {
        cx.globalAlpha = 0.25 * (1 - d / 120);
        cx.beginPath();
        cx.moveTo(p.x, p.y);
        cx.lineTo(pts[j].x, pts[j].y);
        cx.stroke();
      }
    }
    var m = Math.hypot(p.x - mx, p.y - my);
    if (m < 160) {
      cx.globalAlpha = 0.6 * (1 - m / 160);
      cx.beginPath();
      cx.moveTo(p.x, p.y);
      cx.lineTo(mx, my);
      cx.stroke();
    }
  });
  if (!RM) requestAnimationFrame(dr);
}
rs();
dr();
addEventListener("resize", rs);
cv.parentNode.addEventListener("pointermove", function (e) {
  var r = cv.getBoundingClientRect();
  mx = e.clientX - r.left;
  my = e.clientY - r.top;
});

/* texte qui s'écrit */
var R = ["développement mobile", "développement web"],
  ri = 0,
  ci = 0,
  del = false;
(function ty() {
  var w = R[ri];
  $("role").textContent = "Je fais du " + w.slice(0, ci);
  if (RM) {
    $("role").textContent = "Je fais du " + R[0];
    return;
  }
  if (!del && ci < w.length) {
    ci++;
    setTimeout(ty, 70);
  } else if (!del) {
    del = true;
    setTimeout(ty, 1400);
  } else if (ci > 0) {
    ci--;
    setTimeout(ty, 35);
  } else {
    del = false;
    ri = (ri + 1) % R.length;
    setTimeout(ty, 300);
  }
})();

/* compteurs et barres au défilement */
var io = new IntersectionObserver(
  function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      var t = e.target;
      if (t.dataset.n) {
        var n = +t.dataset.n,
          i = 0;
        (function up() {
          t.textContent = ++i;
          if (i < n) setTimeout(up, 250);
        })();
        if (RM) t.textContent = n;
      }
      if (t.dataset.w) t.style.width = t.dataset.w + "%";
    });
  },
  { threshold: 0.4 },
);
document.querySelectorAll("[data-n],[data-w]").forEach(function (e) {
  io.observe(e);
});

/* menu actif, retour en haut */
var secs = [].slice.call(document.querySelectorAll("section"));
function sc() {
  var y = scrollY + 120,
    id = secs[0].id;
  secs.forEach(function (s) {
    if (s.offsetTop <= y) id = s.id;
  });
  document.querySelectorAll("#links a").forEach(function (a) {
    a.classList.toggle("on", a.getAttribute("href") === "#" + id);
  });
  $("top").classList.toggle("on", scrollY > 600);
}
addEventListener("scroll", sc, { passive: true });
sc();
$("top").onclick = function () {
  scrollTo({ top: 0 });
};

/* thème et formulaire */
$("tg").onclick = function () {
  var d = document.documentElement,
    l = d.dataset.theme
      ? d.dataset.theme === "light"
      : matchMedia("(prefers-color-scheme:light)").matches;
  d.dataset.theme = l ? "dark" : "light";
};
$("f").onsubmit = function (e) {
  e.preventDefault();
  location.href =
    "mailto:coulbalyyenin2005@email.com?subject=" +
    encodeURIComponent("Message de " + $("fn").value) +
    "&body=" +
    encodeURIComponent($("fm").value + "\n\n" + $("fe").value);
};
/* menu burger (mobile) */
var bg = $("bg");

function fermerMenu() {
  $("links").classList.remove("open");
  bg.setAttribute("aria-expanded", "false");
  bg.textContent = "☰";
}

bg.onclick = function () {
  var ouvert = $("links").classList.toggle("open");
  bg.setAttribute("aria-expanded", ouvert);
  bg.textContent = ouvert ? "✕" : "☰";
};

$("links").onclick = function (e) {
  if (e.target.tagName === "A") fermerMenu();
};
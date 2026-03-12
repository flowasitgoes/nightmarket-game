/**
 * Bubbles effect (inspired by Frank's Laboratory).
 * When the player clicks/drags on the game viewport, particles near the cursor inflate.
 */
(function (window) {
  'use strict';

  var canvas = null;
  var ctx = null;
  var effect = null;
  var animationId = null;
  var viewportEl = null;
  var gradient = null;
  var currentThemeKey = null;
  var themeGradient = null;
  var themeTimeoutId = null;

  var DEFAULT_COLOR_STOPS = [
    [0, 'rgba(255,255,255,0.95)'],
    [0.5, 'rgba(255, 220, 180, 0.9)'],
    [1, 'rgba(196, 92, 62, 0.85)']
  ];

  var BUBBLE_THEMES = {
    basil: [
      [0, 'rgba(240,255,240,0.95)'],
      [0.4, 'rgba(144,238,144,0.9)'],
      [0.8, 'rgba(34,139,34,0.9)'],
      [1, 'rgba(0,100,0,0.85)']
    ],
    'oil-pot': [
      [0, 'rgba(255,250,240,0.95)'],
      [0.5, 'rgba(255,215,0,0.85)'],
      [1, 'rgba(218,165,32,0.9)']
    ],
    'garlic-pile': [
      [0, 'rgba(255,255,255,0.95)'],
      [0.5, 'rgba(248,248,255,0.9)'],
      [1, 'rgba(216,191,216,0.85)']
    ],
    'sauce-bottles': [
      [0, 'rgba(255,240,245,0.95)'],
      [0.4, 'rgba(255,99,71,0.9)'],
      [1, 'rgba(178,34,34,0.85)']
    ],
    lantern: [
      [0, 'rgba(255,255,220,0.95)'],
      [0.5, 'rgba(255,200,100,0.9)'],
      [1, 'rgba(255,140,0,0.85)']
    ],
    stall: [
      [0, 'rgba(255,248,240,0.95)'],
      [0.5, 'rgba(255,218,185,0.9)'],
      [1, 'rgba(210,105,30,0.85)']
    ],
    'stall-buy': [
      [0, 'rgba(255,250,245,0.95)'],
      [0.5, 'rgba(255,160,122,0.9)'],
      [1, 'rgba(220,20,60,0.85)']
    ],
    'traveler-iceland': [
      [0, 'rgba(255,255,255,0.95)'],
      [0.4, 'rgba(175,238,238,0.9)'],
      [0.8, 'rgba(0,206,209,0.9)'],
      [1, 'rgba(0,139,139,0.85)']
    ],
    'traveler-mongolia': [
      [0, 'rgba(255,250,240,0.95)'],
      [0.4, 'rgba(210,180,140,0.9)'],
      [0.8, 'rgba(139,119,101,0.9)'],
      [1, 'rgba(101,67,33,0.85)']
    ],
    'traveler-bhutan': [
      [0, 'rgba(255,248,240,0.95)'],
      [0.4, 'rgba(255,165,79,0.9)'],
      [0.8, 'rgba(255,99,71,0.9)'],
      [1, 'rgba(178,34,34,0.85)']
    ],
    'traveler-madagascar': [
      [0, 'rgba(255,255,240,0.95)'],
      [0.4, 'rgba(255,215,0,0.9)'],
      [0.8, 'rgba(189,183,107,0.9)'],
      [1, 'rgba(107,142,35,0.85)']
    ],
    'traveler-paraguay': [
      [0, 'rgba(240,255,240,0.95)'],
      [0.4, 'rgba(154,205,50,0.9)'],
      [0.8, 'rgba(34,139,34,0.9)'],
      [1, 'rgba(0,100,0,0.85)']
    ],
    'traveler-slovenia': [
      [0, 'rgba(255,255,255,0.95)'],
      [0.4, 'rgba(173,216,230,0.9)'],
      [0.8, 'rgba(135,206,235,0.9)'],
      [1, 'rgba(70,130,180,0.85)']
    ],
    'traveler-namibia': [
      [0, 'rgba(255,245,238,0.95)'],
      [0.4, 'rgba(255,218,185,0.9)'],
      [0.8, 'rgba(210,180,140,0.9)'],
      [1, 'rgba(184,134,11,0.85)']
    ],
    'traveler-albania': [
      [0, 'rgba(255,240,245,0.95)'],
      [0.4, 'rgba(205,92,92,0.9)'],
      [0.8, 'rgba(139,0,0,0.9)'],
      [1, 'rgba(80,0,0,0.85)']
    ],
    'traveler-greenland': [
      [0, 'rgba(240,255,255,0.95)'],
      [0.4, 'rgba(176,224,230,0.9)'],
      [0.8, 'rgba(95,158,160,0.9)'],
      [1, 'rgba(0,128,128,0.85)']
    ],
    'traveler-bolivia': [
      [0, 'rgba(255,255,224,0.95)'],
      [0.4, 'rgba(255,215,0,0.9)'],
      [0.8, 'rgba(124,252,0,0.9)'],
      [1, 'rgba(50,205,50,0.85)']
    ]
  };

  function createGradientFromStops(stops) {
    if (!ctx || !canvas || !stops) return null;
    var g = ctx.createLinearGradient(0, 0, canvas.width, 0);
    for (var i = 0; i < stops.length; i++) g.addColorStop(stops[i][0], stops[i][1]);
    return g;
  }

  function createGradient() {
    return createGradientFromStops(DEFAULT_COLOR_STOPS);
  }

  function getActiveGradient() {
    if (currentThemeKey && themeGradient) return themeGradient;
    return gradient || createGradient();
  }

  function setTheme(themeKey, durationMs) {
    if (themeTimeoutId) clearTimeout(themeTimeoutId);
    themeTimeoutId = null;
    durationMs = durationMs == null ? 15000 : durationMs;
    var stops = BUBBLE_THEMES[themeKey];
    if (stops) {
      currentThemeKey = themeKey;
      themeGradient = createGradientFromStops(stops);
    } else {
      currentThemeKey = null;
      themeGradient = null;
    }
    if (durationMs > 0) {
      themeTimeoutId = setTimeout(function () {
        themeTimeoutId = null;
        currentThemeKey = null;
        themeGradient = null;
      }, durationMs);
    }
  }

  function Particle(effect) {
    this.effect = effect;
    this.radius = 0.3;
    this.minRadius = this.radius;
    this.maxRadius = Math.random() * 50 + 15;
    this.x = this.radius + Math.random() * (this.effect.width - this.radius * 2);
    this.y = this.radius + Math.random() * (this.effect.height - this.radius * 2);
    this.vx = Math.random() * 0.2 - 0.1;
    this.vy = Math.random() * 0.2 - 0.1;
  }

  Particle.prototype.draw = function (context, gradientRef) {
    if (this.radius > 0.4) {
      context.fillStyle = gradientRef;
      context.beginPath();
      context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      context.fill();
      context.strokeStyle = 'rgba(255,255,255,0.3)';
      context.stroke();

      context.fillStyle = 'rgba(255,255,255,0.4)';
      context.beginPath();
      context.arc(
        this.x - this.radius * 0.2,
        this.y - this.radius * 0.3,
        this.radius * 0.6,
        0,
        Math.PI * 2
      );
      context.fill();
    }
  };

  Particle.prototype.update = function () {
    var dx = this.x - this.effect.mouse.x;
    var dy = this.y - this.effect.mouse.y;
    var distance = Math.hypot(dx, dy);
    if (distance < this.effect.mouse.radius && this.radius < this.maxRadius) {
      this.radius += 2.5;
    }
    if (this.radius > this.minRadius) this.radius -= 0.15;

    this.x += this.vx;
    this.y += this.vy;

    if (this.x < this.radius) {
      this.x = this.radius;
      this.vx *= -1;
    } else if (this.x > this.effect.width - this.radius) {
      this.x = this.effect.width - this.radius;
      this.vx *= -1;
    }
    if (this.y < this.radius) {
      this.y = this.radius;
      this.vy *= -1;
    } else if (this.y > this.effect.height - this.radius) {
      this.y = this.effect.height - this.radius;
      this.vy *= -1;
    }
  };

  Particle.prototype.reset = function () {
    this.x = this.radius + Math.random() * (this.effect.width - this.radius * 2);
    this.y = this.radius + Math.random() * (this.effect.height - this.radius * 2);
    this.radius = this.minRadius;
  };

  function Effect(canvasEl, context) {
    this.canvas = canvasEl;
    this.context = context;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.particles = [];
    this.numberOfParticles = 280;
    this.createParticles();

    this.mouse = {
      x: 0,
      y: 0,
      pressed: false,
      radius: 70
    };
  }

  Effect.prototype.createParticles = function () {
    for (var i = 0; i < this.numberOfParticles; i++) {
      this.particles.push(new Particle(this));
    }
  };

  Effect.prototype.handleParticles = function (context, gradientRef) {
    var i;
    for (i = 0; i < this.particles.length; i++) {
      this.particles[i].draw(context, gradientRef);
      this.particles[i].update();
    }
  };

  Effect.prototype.setMouse = function (x, y, pressed) {
    this.mouse.x = x;
    this.mouse.y = y;
    this.mouse.pressed = pressed;
  };

  Effect.prototype.resize = function (width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.width = width;
    this.height = height;
    var i;
    for (i = 0; i < this.particles.length; i++) {
      this.particles[i].reset();
    }
  };

  function getCanvasCoords(e) {
    if (!viewportEl || !canvas) return { x: 0, y: 0 };
    var rect = canvas.getBoundingClientRect();
    var scaleX = canvas.width / rect.width;
    var scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  }

  function animate() {
    if (!ctx || !effect || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var activeGradient = getActiveGradient();
    if (activeGradient) effect.handleParticles(ctx, activeGradient);
    animationId = requestAnimationFrame(animate);
  }

  function stop() {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    if (ctx && canvas) ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function init(containerOrViewport) {
    var container = typeof containerOrViewport === 'object' && containerOrViewport
      ? containerOrViewport
      : document.getElementById('scene-container');
    viewportEl = container;
    canvas = document.getElementById('game-bubbles-canvas');
    if (!canvas || !viewportEl) return;

    var w = viewportEl.offsetWidth;
    var h = viewportEl.offsetHeight;
    canvas.width = w;
    canvas.height = h;
    ctx = canvas.getContext('2d');
    gradient = createGradient();
    effect = new Effect(canvas, ctx);

    viewportEl.addEventListener('mousedown', function (e) {
      var coords = getCanvasCoords(e);
      effect.setMouse(coords.x, coords.y, true);
    });
    viewportEl.addEventListener('mousemove', function (e) {
      if (effect.mouse.pressed) {
        var coords = getCanvasCoords(e);
        effect.setMouse(coords.x, coords.y, true);
      }
    });
    viewportEl.addEventListener('mouseup', function () {
      effect.setMouse(effect.mouse.x, effect.mouse.y, false);
    });
    viewportEl.addEventListener('mouseleave', function () {
      effect.setMouse(effect.mouse.x, effect.mouse.y, false);
    });

    window.addEventListener('resize', function () {
      if (!viewportEl || !effect) return;
      var nw = viewportEl.offsetWidth;
      var nh = viewportEl.offsetHeight;
      canvas.width = nw;
      canvas.height = nh;
      effect.resize(nw, nh);
      gradient = createGradient();
      if (currentThemeKey && BUBBLE_THEMES[currentThemeKey]) {
        themeGradient = createGradientFromStops(BUBBLE_THEMES[currentThemeKey]);
      }
    });

    animate();
  }

  window.BubblesEffect = {
    init: init,
    stop: stop,
    setTheme: setTheme
  };
})(window);

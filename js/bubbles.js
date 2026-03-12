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

  function createGradient() {
    if (!ctx || !canvas) return null;
    var g = ctx.createLinearGradient(0, 0, canvas.width, 0);
    g.addColorStop(0, 'rgba(255,255,255,0.95)');
    g.addColorStop(0.5, 'rgba(255, 220, 180, 0.9)');
    g.addColorStop(1, 'rgba(196, 92, 62, 0.85)');
    return g;
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
    gradient = gradient || createGradient();
    if (gradient) effect.handleParticles(ctx, gradient);
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
    });

    animate();
  }

  window.BubblesEffect = {
    init: init,
    stop: stop
  };
})(window);

/**
 * ZzFXMicro - Zuper Zmall Zound Zynth - v1.3.2 by Frank Force
 * https://zzfx.3d2k.com - procedural sound effects, no assets.
 * Exposes: window.zzfx, window.zzfxV (volume 0–1)
 */
'use strict';
(function (window) {
  var zzfxV = 0.3;
  var zzfxX = null;

  function getCtx() {
    if (zzfxX) return zzfxX;
    try {
      var Ctx = window.AudioContext || window.webkitAudioContext;
      if (Ctx) zzfxX = new Ctx();
    } catch (e) {}
    return zzfxX;
  }

  function zzfx(p, k, b, e, r, t, q, D, u, y, v, z, l, E, A, F, c, w, m, B, N) {
    p = p === undefined ? 1 : p;
    k = k === undefined ? 0.05 : k;
    b = b === undefined ? 220 : b;
    e = e === undefined ? 0 : e;
    r = r === undefined ? 0 : r;
    t = t === undefined ? 0.1 : t;
    q = q === undefined ? 0 : q;
    D = D === undefined ? 1 : D;
    u = u === undefined ? 0 : u;
    y = y === undefined ? 0 : y;
    v = v === undefined ? 0 : v;
    z = z === undefined ? 0 : z;
    l = l === undefined ? 0 : l;
    E = E === undefined ? 0 : E;
    A = A === undefined ? 0 : A;
    F = F === undefined ? 0 : F;
    c = c === undefined ? 0 : c;
    w = w === undefined ? 1 : w;
    m = m === undefined ? 0 : m;
    B = B === undefined ? 0 : B;
    N = N === undefined ? 0 : N;

    var M = Math;
    var d = 2 * M.PI;
    var R = 44100;
    var G = u *= (500 * d / R / R);
    var C = b *= (1 - k + 2 * k * M.random());
    k = [];
    var g = 0;
    var H = 0;
    var a = 0;
    var n = 1;
    var I = 0;
    var J = 0;
    var f = 0;
    var h = N < 0 ? -1 : 1;
    var x = d * h * N * 2 / R;
    var L = M.cos(x);
    var Z = M.sin;
    var K = Z(x) / 4;
    var O = 1 + K;
    var X = -2 * L / O;
    var Y = (1 - K) / O;
    var P = (1 + h * L) / 2 / O;
    var Q = -(h + L) / O;
    var S = P;
    var T = 0;
    var U = 0;
    var V = 0;
    var W = 0;
    e = R * e + 9;
    m *= R;
    r *= R;
    t *= R;
    c *= R;
    y *= (500 * d / Math.pow(R, 3));
    A *= d / R;
    v *= d / R;
    z *= R;
    l = R * l | 0;
    p *= zzfxV;
    var bufLen = (e + m + r + t + c) | 0;

    for (h = bufLen; a < h; k[a++] = f * p) {
      ++J % (100 * F | 0) || (
        f = q ? (q < 1 ? 1 - 4 * M.abs(M.round(g / d) - g / d) : q < 2 ? Z(g) : q < 3 ? M.max(M.min(M.tan(g), 1), -1) : q < 4 ? (g / d % 1 < D / 2) * 2 - 1 : M.abs(M.abs(M.sin(g)) ** D) * (g > 0 ? 1 : -1)) : Z(g),
        f = (l ? 1 - B + B * Z(d * a / l) : 1) * (q < 4 ? f : (f < 0 ? -1 : 1) * M.abs(f) ** D) * (a < e ? a / e : a < e + m ? 1 - (a - e) / m * (1 - w) : a < e + m + r ? w : a < bufLen - c ? (bufLen - a - c) / t * w : 0),
        f = c ? f / 2 + (c > a ? 0 : (a < bufLen - c ? 1 : (bufLen - a) / c) * k[a - c | 0] / 2 / p) : f,
        N ? (f = W = S * T + Q * (T = U) + P * (U = f) - Y * V - X * (V = W)) : 0
      );
      x = (b += u += y) * M.cos(A * H++);
      g += x + x * E * Z(Math.pow(a, 5));
      n && ++n > z && (b += v, C += v, n = 0);
      !l || ++I % l || (b = C, u = G, n = n || 1);
    }

    var ctx = getCtx();
    if (!ctx) return;
    var buffer = ctx.createBuffer(1, bufLen, R);
    buffer.getChannelData(0).set(k);
    var src = ctx.createBufferSource();
    src.buffer = buffer;
    src.connect(ctx.destination);
    src.start(0);
  }

  Object.defineProperty(window, 'zzfxV', {
    get: function () { return zzfxV; },
    set: function (v) { zzfxV = Math.max(0, Math.min(1, v)); },
    configurable: true
  });
  window.zzfx = zzfx;
})(window);

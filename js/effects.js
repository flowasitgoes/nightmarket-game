/**
 * Effects: ambient particles (steam, glow) near oil pot and lantern.
 * Called after SceneSetup.placeHotspots() so scene is ready.
 */
(function (window) {
  'use strict';

  function placeParticles() {
    var scene = document.getElementById('scene');
    if (!scene) return;

    // Oil pot area: steam / heat (left ~30–110, top ~42%)
    var oil = document.createElement('div');
    oil.className = 'effect effect-steam effect-oil';
    oil.setAttribute('aria-hidden', 'true');
    oil.style.left = '50px';
    oil.style.top = '38%';
    scene.appendChild(oil);

    // Lantern area: soft glow (left ~360, top ~15%)
    var lantern = document.createElement('div');
    lantern.className = 'effect effect-glow effect-lantern';
    lantern.setAttribute('aria-hidden', 'true');
    lantern.style.left = '380px';
    lantern.style.top = '12%';
    scene.appendChild(lantern);
  }

  window.Effects = {
    placeParticles: placeParticles
  };
})(window);

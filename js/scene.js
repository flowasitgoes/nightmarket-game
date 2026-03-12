/**
 * Scene: street coordinates, clickable hotspots, scroll position.
 * The scene is one wide "strip" we translate horizontally (no real image yet = use CSS background).
 */
(function (window) {
  'use strict';

  var SCENE_WIDTH = 3000;   // total strip width (px)
  var CONTENT_WIDTH = 3000; // scroll to end of strip so player can reach far right
  var VIEWPORT_WIDTH = 0;
  var currentScroll = 0;
  var sceneEl = null;

  function init(viewportWidth) {
    VIEWPORT_WIDTH = Math.max(0, viewportWidth);
    sceneEl = document.getElementById('scene');
    if (!sceneEl) return;
    sceneEl.style.width = SCENE_WIDTH + 'px';
    setScroll(currentScroll);
  }

  function setScroll(x) {
    var safeViewport = Math.max(1, VIEWPORT_WIDTH);
    var maxScroll = Math.max(0, CONTENT_WIDTH - safeViewport);
    currentScroll = Math.max(0, Math.min(maxScroll, Math.round(x)));
    if (sceneEl) sceneEl.style.transform = 'translateX(-' + currentScroll + 'px)';
    return currentScroll;
  }

  function getScroll() {
    return currentScroll;
  }

  function moveBy(delta) {
    return setScroll(currentScroll + delta);
  }

  function getSceneWidth() {
    return SCENE_WIDTH;
  }

  function getViewportWidth() {
    return VIEWPORT_WIDTH;
  }

  /**
   * Add a hotspot from full config. config: { id, left, top, width, height, label, flag?, icon? }
   */
  function addHotspotFromConfig(h) {
    if (!sceneEl) return null;
    var el = document.createElement('button');
    el.type = 'button';
    el.className = 'hotspot';
    el.dataset.hotspotId = h.id;
    el.style.left = h.left + 'px';
    el.style.top = typeof h.top === 'string' ? h.top : h.top + 'px';
    el.style.width = h.width + 'px';
    el.style.height = h.height + 'px';
    el.setAttribute('aria-label', h.label || h.id);
    if (h.label) el.setAttribute('data-label', h.label);
    if (h.flag) {
      var badge = document.createElement('span');
      badge.className = 'hotspot-badge hotspot-badge-flag';
      badge.setAttribute('aria-hidden', 'true');
      badge.textContent = h.flag;
      el.appendChild(badge);
    } else if (h.icon) {
      var iconSpan = document.createElement('span');
      iconSpan.className = 'hotspot-badge hotspot-badge-icon';
      iconSpan.setAttribute('aria-hidden', 'true');
      iconSpan.textContent = h.icon;
      el.appendChild(iconSpan);
    }
    sceneEl.appendChild(el);
    return el;
  }

  /**
   * Add a hotspot element to the scene (legacy signature).
   */
  function addHotspot(id, left, top, width, height, label) {
    return addHotspotFromConfig({ id: id, left: left, top: top, width: width, height: height, label: label });
  }

  window.Scene = {
    init: init,
    setScroll: setScroll,
    getScroll: getScroll,
    moveBy: moveBy,
    getSceneWidth: getSceneWidth,
    getViewportWidth: getViewportWidth,
    addHotspot: addHotspot,
    getSceneElement: function () { return sceneEl; }
  };

  /**
   * Place all hotspots on the street. Called after game starts.
   */
  function placeHotspots() {
    if (!sceneEl || typeof window.HOTSPOT_CONFIG === 'undefined') return;
    var cfg = window.HOTSPOT_CONFIG;
    for (var i = 0; i < cfg.length; i++) {
      addHotspotFromConfig(cfg[i]);
    }
  }

  window.SceneSetup = { placeHotspots: placeHotspots };
})(window);

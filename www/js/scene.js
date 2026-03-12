/**
 * Scene: street coordinates, clickable hotspots, scroll position.
 * The scene is one wide "strip" we translate horizontally (no real image yet = use CSS background).
 */
(function (window) {
  'use strict';

  var SCENE_WIDTH = 3000;
  var CONTENT_WIDTH = 3000;
  var VIEWPORT_WIDTH = 0;
  var currentScroll = 0;
  /** 水平捲動速度（px/ frame），用於慣性平滑移動 */
  var scrollSpeed = 0;
  var sceneEl = null;
  var FRICTION = 0.88;
  var MAX_SPEED = 14;

  function init(viewportWidth) {
    VIEWPORT_WIDTH = Math.max(0, viewportWidth);
    sceneEl = document.getElementById('scene');
    if (!sceneEl) return;
    sceneEl.style.width = CONTENT_WIDTH + 'px';
    var maxScroll = Math.max(0, CONTENT_WIDTH - Math.max(1, VIEWPORT_WIDTH));
    if (window.__SCENE_DEBUG) {
      console.log('[Scene.init]', {
        viewportWidthArg: viewportWidth,
        VIEWPORT_WIDTH: VIEWPORT_WIDTH,
        SCENE_WIDTH: SCENE_WIDTH,
        CONTENT_WIDTH: CONTENT_WIDTH,
        maxScroll: maxScroll,
        currentScroll: currentScroll
      });
    }
    setScroll(currentScroll);
  }

  function setScroll(x) {
    var safeViewport = Math.max(1, VIEWPORT_WIDTH);
    var maxScroll = Math.max(0, CONTENT_WIDTH - safeViewport);
    var prevScroll = currentScroll;
    currentScroll = Math.max(0, Math.min(maxScroll, Math.round(x)));
    scrollSpeed = 0;
    if (sceneEl) sceneEl.style.transform = 'translateX(-' + currentScroll + 'px)';
    if (window.__SCENE_DEBUG) {
      console.log('[Scene.setScroll]', {
        input: x,
        prevScroll: prevScroll,
        currentScroll: currentScroll,
        maxScroll: maxScroll,
        VIEWPORT_WIDTH: VIEWPORT_WIDTH,
        CONTENT_WIDTH: CONTENT_WIDTH,
        atLeft: currentScroll <= 0,
        atRight: currentScroll >= maxScroll
      });
    }
    return currentScroll;
  }

  function getScroll() {
    return currentScroll;
  }

  function moveBy(delta) {
    if (window.__SCENE_DEBUG) {
      var maxScroll = Math.max(0, CONTENT_WIDTH - Math.max(1, VIEWPORT_WIDTH));
      var atLeft = currentScroll <= 0;
      var atRight = currentScroll >= maxScroll;
      console.log('[Scene.moveBy]', {
        delta: delta,
        currentScrollBefore: currentScroll,
        willBe: currentScroll + delta,
        atLeft: atLeft,
        atRight: atRight
      });
      if (delta < 0 && atLeft) console.warn('[Scene] 已經在最左邊 (currentScroll=0)，無法再往左。');
      if (delta > 0 && atRight) console.warn('[Scene] 已經在最右邊，無法再往右。');
    }
    return setScroll(currentScroll + delta);
  }

  /**
   * 每幀加入水平速度（按住鍵時由 main 呼叫，仿平台遊戲的 Player.walk）
   * @param {number} delta - 本幀要加的速度，正=往右、負=往左
   */
  function addMomentum(delta) {
    scrollSpeed += delta;
    if (scrollSpeed > MAX_SPEED) scrollSpeed = MAX_SPEED;
    if (scrollSpeed < -MAX_SPEED) scrollSpeed = -MAX_SPEED;
  }

  /**
   * 每幀更新：摩擦力、位移、邊界 clamp（仿平台遊戲的 updateX + 邊界）
   */
  function tick() {
    var safeViewport = Math.max(1, VIEWPORT_WIDTH);
    var maxScroll = Math.max(0, CONTENT_WIDTH - safeViewport);
    scrollSpeed *= FRICTION;
    currentScroll += scrollSpeed;
    if (currentScroll <= 0) {
      currentScroll = 0;
      scrollSpeed = 0;
    }
    if (currentScroll >= maxScroll) {
      currentScroll = maxScroll;
      scrollSpeed = 0;
    }
    if (sceneEl) sceneEl.style.transform = 'translateX(-' + Math.round(currentScroll) + 'px)';
  }

  function getSceneWidth() {
    return CONTENT_WIDTH;
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
    addMomentum: addMomentum,
    tick: tick,
    getSceneWidth: getSceneWidth,
    getViewportWidth: getViewportWidth,
    addHotspot: addHotspot,
    getSceneElement: function () { return sceneEl; },
    /** Debug: 在 console 打 Scene.debug() 或 Scene.debug(true) 開啟/關閉每次移動的 log */
    debug: function (on) {
      window.__SCENE_DEBUG = on !== undefined ? !!on : true;
      console.log('[Scene.debug]', window.__SCENE_DEBUG ? 'ON — 按左/右鍵會 log' : 'OFF');
      if (window.__SCENE_DEBUG) {
        var safe = Math.max(1, VIEWPORT_WIDTH);
        var max = Math.max(0, CONTENT_WIDTH - safe);
        console.log('[Scene 目前狀態]', {
          currentScroll: currentScroll,
          maxScroll: max,
          VIEWPORT_WIDTH: VIEWPORT_WIDTH,
          CONTENT_WIDTH: CONTENT_WIDTH,
          atLeft: currentScroll <= 0,
          atRight: currentScroll >= max
        });
      }
    }
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

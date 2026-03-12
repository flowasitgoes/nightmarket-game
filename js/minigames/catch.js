/**
 * Minigame: Catch ingredients. Ingredients fall; player moves basket to catch 5. Miss 3 = fail.
 * API: open({ onComplete: function(success) {} }), close().
 */
(function (window) {
  'use strict';

  var overlay = null;
  var basketEl = null;
  var playArea = null;
  var progressEl = null;
  var onCompleteCallback = null;
  var basketX = 0;
  var basketSpeed = 14;
  var keys = { left: false, right: false };
  var ingredients = [];
  var caught = 0;
  var missed = 0;
  var goal = 3;
  var maxMiss = 6;
  var rafId = null;
  var lastTime = 0;
  var spawnInterval = 1800;
  var lastSpawn = 0;
  var playing = false;
  var PLAY_AREA_WIDTH = 0;
  var PLAY_AREA_HEIGHT = 0;
  var BASKET_WIDTH = 100;
  var INGREDIENT_EMOJIS = ['🍗', '🌿', '🧄', '🥢', '🍄'];

  function getEl(id) {
    return document.getElementById(id);
  }

  function open(options) {
    if (!overlay) return;
    onCompleteCallback = (options && options.onComplete) || null;
    overlay.classList.remove('hidden');
    overlay.classList.add('minigame-visible');
    progressEl = getEl('minigame-catch-progress');
    playArea = getEl('minigame-catch-area');
    basketEl = getEl('minigame-catch-basket');
    if (progressEl) progressEl.textContent = 'Caught: 0 / ' + goal + ' · Missed: 0 / ' + maxMiss;
    if (playArea) {
      PLAY_AREA_WIDTH = playArea.offsetWidth;
      PLAY_AREA_HEIGHT = playArea.offsetHeight;
    }
    basketX = PLAY_AREA_WIDTH / 2 - BASKET_WIDTH / 2;
    caught = 0;
    missed = 0;
    ingredients = [];
    lastSpawn = 0;
    playing = true;
    updateBasketPosition();
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    if (window.AudioManager) window.AudioManager.playMinigameNeutral();
    lastTime = 0;
    rafId = requestAnimationFrame(function measureAndStart(ts) {
      if (playArea) {
        PLAY_AREA_WIDTH = playArea.offsetWidth;
        PLAY_AREA_HEIGHT = playArea.offsetHeight;
        basketX = PLAY_AREA_WIDTH / 2 - BASKET_WIDTH / 2;
        updateBasketPosition();
      }
      lastSpawn = ts;
      rafId = requestAnimationFrame(tick);
    });
  }

  function close() {
    playing = false;
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    document.removeEventListener('keydown', onKeyDown);
    document.removeEventListener('keyup', onKeyUp);
    if (overlay) {
      overlay.classList.add('hidden');
      overlay.classList.remove('minigame-visible');
    }
    // Remove falling ingredients
    if (playArea) {
      var nodes = playArea.querySelectorAll('.minigame-ingredient');
      for (var i = 0; i < nodes.length; i++) nodes[i].remove();
    }
    ingredients = [];
  }

  function onKeyDown(e) {
    if (!playing) return;
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
      e.preventDefault();
      keys.left = true;
    } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
      e.preventDefault();
      keys.right = true;
    }
  }

  function onKeyUp(e) {
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = false;
    else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = false;
  }

  function updateBasketPosition() {
    if (keys.left) basketX = Math.max(0, basketX - basketSpeed);
    if (keys.right) basketX = Math.min(PLAY_AREA_WIDTH - BASKET_WIDTH, basketX + basketSpeed);
    if (basketEl) basketEl.style.left = basketX + 'px';
  }

  function spawnIngredient() {
    if (!playArea) return;
    var el = document.createElement('div');
    el.className = 'minigame-ingredient';
    el.textContent = INGREDIENT_EMOJIS[Math.floor(Math.random() * INGREDIENT_EMOJIS.length)];
    var x = Math.random() * (PLAY_AREA_WIDTH - 40) + 20;
    el.style.left = x + 'px';
    el.style.top = '-30px';
    playArea.appendChild(el);
    ingredients.push({
      el: el,
      x: x,
      y: 0,
      vy: 1.2 + Math.random() * 0.8
    });
  }

  function tick(timestamp) {
    if (!playing) return;
    var dt = lastTime ? Math.min(timestamp - lastTime, 50) : 16;
    lastTime = timestamp;

    updateBasketPosition();

    if (timestamp - lastSpawn > spawnInterval) {
      lastSpawn = timestamp;
      spawnIngredient();
    }

    for (var i = ingredients.length - 1; i >= 0; i--) {
      var ing = ingredients[i];
      ing.y += ing.vy;
      ing.el.style.top = ing.y + 'px';

      if (ing.y > PLAY_AREA_HEIGHT - 45) {
        missed++;
        ing.el.remove();
        ingredients.splice(i, 1);
        if (progressEl) progressEl.textContent = 'Caught: ' + caught + ' / ' + goal + ' · Missed: ' + missed + ' / ' + maxMiss;
        if (missed >= maxMiss) {
          endGame(false);
          return;
        }
      } else {
        var ingCenter = ing.x + 15;
        var basketLeft = basketX;
        var basketRight = basketX + BASKET_WIDTH;
        if (ing.y >= PLAY_AREA_HEIGHT - 70 && ing.y <= PLAY_AREA_HEIGHT - 15 && ingCenter >= basketLeft - 8 && ingCenter <= basketRight + 8) {
          caught++;
          ing.el.remove();
          ingredients.splice(i, 1);
          if (window.AudioManager) window.AudioManager.playMinigameSuccess();
          if (progressEl) progressEl.textContent = 'Caught: ' + caught + ' / ' + goal + ' · Missed: ' + missed + ' / ' + maxMiss;
          if (caught >= goal) {
            endGame(true);
            return;
          }
        }
      }
    }

    rafId = requestAnimationFrame(tick);
  }

  function endGame(success) {
    playing = false;
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    document.removeEventListener('keydown', onKeyDown);
    document.removeEventListener('keyup', onKeyUp);
    if (window.AudioManager) {
      if (success) window.AudioManager.playMinigameSuccess();
      else window.AudioManager.playMinigameFail();
    }
    var card = overlay && overlay.querySelector('.minigame-card');
    if (card) {
      card.classList.add(success ? 'minigame-card--success' : 'minigame-card--fail');
      window.setTimeout(function () {
        card.classList.remove('minigame-card--success', 'minigame-card--fail');
        close();
        if (onCompleteCallback) onCompleteCallback(success);
      }, 520);
    } else {
      close();
      if (onCompleteCallback) onCompleteCallback(success);
    }
  }

  function skip() {
    if (window.AudioManager) window.AudioManager.playClick();
    if (onCompleteCallback) onCompleteCallback(false);
    close();
  }

  function retry() {
    if (window.AudioManager) window.AudioManager.playClick();
    close();
    open({ onComplete: onCompleteCallback });
  }

  function init() {
    overlay = getEl('minigame-catch-overlay');
    if (!overlay) return;
    var skipBtn = getEl('minigame-catch-skip');
    var retryBtn = getEl('minigame-catch-retry');
    if (skipBtn) skipBtn.addEventListener('click', skip);
    if (retryBtn) retryBtn.addEventListener('click', retry);
    // Touch: move basket by tapping left/right half of play area
    playArea = getEl('minigame-catch-area');
    if (playArea) {
      playArea.addEventListener('touchstart', function (e) {
        if (!playing) return;
        e.preventDefault();
        var touch = e.touches[0] || e.changedTouches[0];
        var x = touch.clientX - playArea.getBoundingClientRect().left;
        if (x < PLAY_AREA_WIDTH / 2) keys.left = true;
        else keys.right = true;
      }, { passive: false });
      playArea.addEventListener('touchend', function (e) {
        keys.left = false;
        keys.right = false;
      });
    }
  }

  window.MinigameCatch = {
    open: open,
    close: close,
    skip: skip,
    retry: retry
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(window);

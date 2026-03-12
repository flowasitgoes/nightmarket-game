/**
 * Minigame: Chop garlic. Mash the button quickly before the short timer ends.
 * API: open({ onComplete: function(success) {} }), close(), skip(), retry().
 */
(function (window) {
  'use strict';

  var overlay = null;
  var progressEl = null;
  var chopBtn = null;
  var skipBtn = null;
  var retryBtn = null;
  var onCompleteCallback = null;
  var chops = 0;
  var goal = 18;
  var durationMs = 5000;
  var startTime = 0;
  var rafId = null;
  var playing = false;

  function getEl(id) {
    return document.getElementById(id);
  }

  function updateProgress(remainingMs) {
    if (!progressEl) return;
    var remainingSec = Math.max(0, Math.ceil(remainingMs / 1000));
    progressEl.textContent = 'Chops: ' + chops + ' / ' + goal + ' · Time: ' + remainingSec + 's';
  }

  function tick(timestamp) {
    if (!playing) return;
    if (!startTime) startTime = timestamp;
    var elapsed = timestamp - startTime;
    var remaining = durationMs - elapsed;
    if (remaining <= 0) {
      endGame(chops >= goal);
      return;
    }
    updateProgress(remaining);
    rafId = window.requestAnimationFrame(tick);
  }

  function handleChop() {
    if (!playing) return;
    chops++;
    if (typeof window.AudioManager !== 'undefined') window.AudioManager.playChop();
    var now = window.performance && window.performance.now ? window.performance.now() : Date.now();
    var elapsed = now - startTime;
    updateProgress(Math.max(0, durationMs - elapsed));
    if (chops >= goal) {
      endGame(true);
    }
  }

  function open(options) {
    if (!overlay) return;
    onCompleteCallback = (options && options.onComplete) || null;
    overlay.classList.remove('hidden');
    overlay.classList.add('minigame-visible');
    chops = 0;
    startTime = 0;
    playing = true;
    updateProgress(durationMs);
    if (typeof window.AudioManager !== 'undefined') window.AudioManager.playMinigameNeutral();
    rafId = window.requestAnimationFrame(tick);
  }

  function endGame(success) {
    playing = false;
    if (rafId) {
      window.cancelAnimationFrame(rafId);
      rafId = null;
    }
    if (typeof window.AudioManager !== 'undefined') {
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

  function close() {
    playing = false;
    if (rafId) {
      window.cancelAnimationFrame(rafId);
      rafId = null;
    }
    if (overlay) {
      overlay.classList.add('hidden');
      overlay.classList.remove('minigame-visible');
    }
  }

  function skip() {
    if (typeof window.AudioManager !== 'undefined') window.AudioManager.playClick();
    if (onCompleteCallback) onCompleteCallback(false);
    close();
  }

  function retry() {
    if (typeof window.AudioManager !== 'undefined') window.AudioManager.playClick();
    close();
    open({ onComplete: onCompleteCallback });
  }

  function init() {
    overlay = getEl('minigame-garlic-overlay');
    if (!overlay) return;
    progressEl = getEl('minigame-garlic-progress');
    chopBtn = getEl('minigame-garlic-chop');
    skipBtn = getEl('minigame-garlic-skip');
    retryBtn = getEl('minigame-garlic-retry');
    if (chopBtn) chopBtn.addEventListener('click', handleChop);
    if (skipBtn) skipBtn.addEventListener('click', skip);
    if (retryBtn) retryBtn.addEventListener('click', retry);
  }

  window.MinigameGarlic = {
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


/**
 * Minigame: Frying timer. A bar fills; press the button in the golden zone (e.g. 70–90%) to succeed.
 * API: open({ onComplete: function(success) {} }), close().
 */
(function (window) {
  'use strict';

  var overlay = null;
  var barEl = null;
  var zoneEl = null;
  var onCompleteCallback = null;
  var progress = 0;
  var barSpeed = 4.0;
  var zoneStart = 55;
  var zoneEnd = 92;
  var rafId = null;
  var playing = false;
  var lastTime = 0;
  var countdownDone = false;
  var countdownStart = 0;
  var hintEl = null;

  function getEl(id) {
    return document.getElementById(id);
  }

  function open(options) {
    if (!overlay) return;
    onCompleteCallback = (options && options.onComplete) || null;
    overlay.classList.remove('hidden');
    overlay.classList.add('minigame-visible');
    barEl = getEl('minigame-timer-bar');
    zoneEl = getEl('minigame-timer-zone');
    hintEl = getEl('minigame-timer-hint');
    if (zoneEl) {
      zoneEl.style.left = zoneStart + '%';
      zoneEl.style.width = (zoneEnd - zoneStart) + '%';
    }
    if (barEl) barEl.style.width = '0%';
    if (hintEl) {
      hintEl.textContent = 'Get ready...';
      hintEl.classList.remove('minigame-hint-done');
    }
    progress = 0;
    playing = true;
    lastTime = 0;
    countdownDone = false;
    countdownStart = 0;
    if (window.AudioManager) window.AudioManager.playMinigameNeutral();
    rafId = requestAnimationFrame(tick);
  }

  function close() {
    playing = false;
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    if (overlay) {
      overlay.classList.add('hidden');
      overlay.classList.remove('minigame-visible');
    }
  }

  function tick(timestamp) {
    if (!playing) return;
    if (!countdownDone) {
      if (!countdownStart) countdownStart = timestamp;
      var elapsed = timestamp - countdownStart;
      if (elapsed < 1500) {
        if (hintEl && elapsed > 800) hintEl.textContent = 'Watch the bar...';
        rafId = requestAnimationFrame(tick);
        return;
      }
      countdownDone = true;
      lastTime = timestamp;
      if (hintEl) {
        hintEl.textContent = 'Press "Now!" when the bar is in the gold zone';
        hintEl.classList.add('minigame-hint-done');
      }
    }
    var dt = lastTime ? Math.min(timestamp - lastTime, 50) : 16;
    lastTime = timestamp;
    progress += barSpeed * (dt / 1000);
    if (progress >= 100) {
      progress = 100;
      endGame(false);
      return;
    }
    if (barEl) barEl.style.width = progress + '%';
    rafId = requestAnimationFrame(tick);
  }

  function tryHit() {
    if (!playing) return;
    if (progress >= zoneStart && progress <= zoneEnd) {
      endGame(true);
    } else {
      endGame(false);
    }
  }

  function endGame(success) {
    playing = false;
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    if (success && window.AudioManager) window.AudioManager.playMinigameSuccess();
    else if (!success && window.AudioManager) window.AudioManager.playMinigameFail();
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
    overlay = getEl('minigame-timer-overlay');
    if (!overlay) return;
    var hitBtn = getEl('minigame-timer-hit');
    var skipBtn = getEl('minigame-timer-skip');
    var retryBtn = getEl('minigame-timer-retry');
    if (hitBtn) hitBtn.addEventListener('click', tryHit);
    if (skipBtn) skipBtn.addEventListener('click', skip);
    if (retryBtn) retryBtn.addEventListener('click', retry);
  }

  window.MinigameTimer = {
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

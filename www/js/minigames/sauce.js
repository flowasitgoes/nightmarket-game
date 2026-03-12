/**
 * Minigame: Mix sauce. Tap ingredients in the right order.
 * API: open({ onComplete: function(success) {} }), close(), skip(), retry().
 */
(function (window) {
  'use strict';

  var overlay = null;
  var progressEl = null;
  var onCompleteCallback = null;
  var currentStep = 0;
  var mistakes = 0;
  var maxMistakes = 2;
  var ORDER = ['garlic', 'basil', 'chili'];

  function getEl(id) {
    return document.getElementById(id);
  }

  function updateProgress() {
    if (!progressEl) return;
    var stepNumber = Math.min(ORDER.length, currentStep + 1);
    if (currentStep >= ORDER.length) {
      progressEl.textContent = 'Done! Mistakes: ' + mistakes + ' / ' + maxMistakes;
    } else {
      progressEl.textContent = 'Step ' + stepNumber + ' of ' + ORDER.length + ' · Mistakes: ' + mistakes + ' / ' + maxMistakes;
    }
  }

  function handleChoice(type) {
    if (!overlay || overlay.classList.contains('hidden')) return;
    if (currentStep >= ORDER.length) return;
    if (type === ORDER[currentStep]) {
      if (typeof window.AudioManager !== 'undefined') window.AudioManager.playStepCorrect();
      currentStep++;
      if (currentStep >= ORDER.length) {
        updateProgress();
        endGame(true);
        return;
      }
    } else {
      mistakes++;
      if (typeof window.AudioManager !== 'undefined') window.AudioManager.playClick();
      if (mistakes > maxMistakes) {
        updateProgress();
        endGame(false);
        return;
      }
    }
    updateProgress();
  }

  function open(options) {
    if (!overlay) return;
    onCompleteCallback = (options && options.onComplete) || null;
    overlay.classList.remove('hidden');
    overlay.classList.add('minigame-visible');
    currentStep = 0;
    mistakes = 0;
    updateProgress();
    if (typeof window.AudioManager !== 'undefined') window.AudioManager.playMinigameNeutral();
  }

  function endGame(success) {
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
    overlay = getEl('minigame-sauce-overlay');
    if (!overlay) return;
    progressEl = getEl('minigame-sauce-progress');
    var btnGarlic = getEl('minigame-sauce-btn-garlic');
    var btnBasil = getEl('minigame-sauce-btn-basil');
    var btnChili = getEl('minigame-sauce-btn-chili');
    var skipBtn = getEl('minigame-sauce-skip');
    var retryBtn = getEl('minigame-sauce-retry');
    if (btnGarlic) btnGarlic.addEventListener('click', function () { handleChoice('garlic'); });
    if (btnBasil) btnBasil.addEventListener('click', function () { handleChoice('basil'); });
    if (btnChili) btnChili.addEventListener('click', function () { handleChoice('chili'); });
    if (skipBtn) skipBtn.addEventListener('click', skip);
    if (retryBtn) retryBtn.addEventListener('click', retry);
  }

  window.MinigameSauce = {
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


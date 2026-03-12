/**
 * Dialogue: show/hide box, next line, close. showForHotspot(id) looks up HOTSPOT_DIALOGUES[id].
 */
(function (window) {
  'use strict';

  var overlay = null;
  var speakerEl = null;
  var textEl = null;
  var imageWrap = null;
  var imageEl = null;
  var nextBtn = null;
  var closeBtn = null;
  var lines = [];
  var index = 0;
  var currentHotspotId = null;
  var onCloseCallback = null;

  function init() {
    overlay = document.getElementById('dialogue-overlay');
    speakerEl = document.getElementById('dialogue-speaker');
    textEl = document.getElementById('dialogue-text');
    imageWrap = document.getElementById('dialogue-image-wrap');
    imageEl = document.getElementById('dialogue-image');
    nextBtn = document.getElementById('dialogue-next');
    closeBtn = document.getElementById('dialogue-close');
    if (!overlay || !textEl) return;

    nextBtn.addEventListener('click', next);
    closeBtn.addEventListener('click', close);
    document.addEventListener('keydown', onKeyDown);
  }

  function onKeyDown(e) {
    if (!overlay || overlay.classList.contains('hidden')) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
    } else if (e.key === ' ' || e.key === 'Enter') {
      if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
      e.preventDefault();
      next();
    }
  }

  function show(speaker, singleLineOrLines, imageUrl) {
    var arr = Array.isArray(singleLineOrLines) ? singleLineOrLines : [singleLineOrLines];
    lines = arr;
    index = 0;
    if (speakerEl) speakerEl.textContent = speaker || '';
    textEl.textContent = lines[0] || '';
    if (imageWrap && imageEl) {
      if (imageUrl) {
        imageEl.src = imageUrl;
        imageEl.alt = speaker ? speaker + ' — ' : '';
        imageWrap.classList.remove('hidden');
      } else {
        imageEl.src = '';
        imageEl.alt = '';
        imageWrap.classList.add('hidden');
      }
    }
    nextBtn.classList.toggle('only-close', lines.length <= 1);
    overlay.classList.remove('hidden');
    overlay.classList.add('visible');
  }

  function next() {
    index++;
    if (index >= lines.length) {
      close();
      return;
    }
    textEl.textContent = lines[index];
    nextBtn.classList.toggle('only-close', index >= lines.length - 1);
  }

  function close() {
    var id = currentHotspotId;
    overlay.classList.add('hidden');
    overlay.classList.remove('visible');
    if (imageWrap && imageEl) {
      imageEl.src = '';
      imageWrap.classList.add('hidden');
    }
    currentHotspotId = null;
    if (onCloseCallback && id) onCloseCallback(id);
  }

  function setOnClose(fn) {
    onCloseCallback = fn;
  }

  function showForHotspot(id) {
    currentHotspotId = id;
    var data = window.HOTSPOT_DIALOGUES[id];
    if (!data) {
      show('', 'Nothing here.');
      return;
    }
    var speaker = data.speaker || '';
    var dialogue = data.lines || data.line;
    var imageUrl = data.image || '';
    if (typeof dialogue === 'string') dialogue = [dialogue];
    show(speaker, dialogue, imageUrl);
  }

  window.Dialogue = {
    init: init,
    show: show,
    next: next,
    close: close,
    setOnClose: setOnClose,
    showForHotspot: showForHotspot
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(window);

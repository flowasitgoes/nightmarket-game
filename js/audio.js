/**
 * Audio: background loop, occasional sounds, mute, UI click.
 * Kenney Impact Sounds / UI Pack (CC0) for click-a.ogg
 */
(function (window) {
  'use strict';

  var muted = false;
  var ambient = null;
  var motorcycleInterval = null;

  function toggleMute() {
    muted = !muted;
    if (ambient) ambient.muted = muted;
    return muted;
  }

  function isMuted() {
    return muted;
  }

  function playClick() {
    if (muted) return;
    try {
      var snd = new Audio('assets/audio/click-a.ogg');
      snd.volume = 0.4;
      snd.play().catch(function () {});
    } catch (e) {}
  }

  function startAmbient() {
    try {
      ambient = new Audio('assets/audio/frying-loop.mp3');
      ambient.loop = true;
      ambient.volume = 0.25;
      ambient.muted = muted;
      ambient.play().catch(function () {});
    } catch (e) {}
    scheduleMotorcycle();
  }

  function scheduleMotorcycle() {
    if (motorcycleInterval) clearInterval(motorcycleInterval);
    motorcycleInterval = setInterval(function () {
      if (muted) return;
      try {
        var snd = new Audio('assets/audio/motorcycle.mp3');
        snd.volume = 0.35;
        snd.play().catch(function () {});
      } catch (e) {}
    }, 15000 + Math.random() * 10000);
  }

  window.AudioManager = {
    toggleMute: toggleMute,
    isMuted: isMuted,
    playClick: playClick,
    startAmbient: startAmbient
  };
})(window);

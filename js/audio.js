/**
 * Audio: background loop, occasional sounds, mute, UI click.
 * Minigame sounds: Web Audio API synthesis (no assets).
 */
(function (window) {
  'use strict';

  var muted = false;
  var ambient = null;
  var motorcycleInterval = null;
  var audioCtx = null;

  function getAudioCtx() {
    if (audioCtx) return audioCtx;
    try {
      var Ctx = window.AudioContext || window.webkitAudioContext;
      if (Ctx) audioCtx = new Ctx();
    } catch (e) {}
    return audioCtx;
  }

  function playTone(frequency, duration, type, volume) {
    var ctx = getAudioCtx();
    if (!ctx || muted) return;
    try {
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      osc.type = type || 'sine';
      gain.gain.setValueAtTime(volume || 0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  }

  function playMinigameSuccessSynth() {
    var ctx = getAudioCtx();
    if (!ctx || muted) return;
    try {
      var t = ctx.currentTime;
      var osc1 = ctx.createOscillator();
      var osc2 = ctx.createOscillator();
      var gain = ctx.createGain();
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, t);
      osc1.frequency.setValueAtTime(659.25, t + 0.08);
      osc2.frequency.setValueAtTime(783.99, t + 0.16);
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.12, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
      osc1.start(t);
      osc1.stop(t + 0.2);
      osc2.start(t + 0.08);
      osc2.stop(t + 0.35);
    } catch (e) {}
  }

  function playMinigameFailSynth() {
    var ctx = getAudioCtx();
    if (!ctx || muted) return;
    try {
      var t = ctx.currentTime;
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, t);
      osc.frequency.exponentialRampToValueAtTime(60, t + 0.2);
      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      osc.start(t);
      osc.stop(t + 0.25);
    } catch (e) {}
  }

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

  function playMinigameNeutral() {
    if (muted) return;
    playTone(440, 0.06, 'sine', 0.08);
  }

  function playMinigameSuccess() {
    if (muted) return;
    playMinigameSuccessSynth();
  }

  function playMinigameFail() {
    if (muted) return;
    playMinigameFailSynth();
  }

  window.AudioManager = {
    toggleMute: toggleMute,
    isMuted: isMuted,
    playClick: playClick,
    startAmbient: startAmbient,
    playMinigameNeutral: playMinigameNeutral,
    playMinigameSuccess: playMinigameSuccess,
    playMinigameFail: playMinigameFail
  };
})(window);

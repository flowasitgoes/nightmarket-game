/**
 * Audio: background loop, occasional sounds, mute, UI click.
 * UI & minigame sounds: ZzFX (when available) or Web Audio / fallback.
 */
(function (window) {
  'use strict';

  var muted = false;
  var ambient = null;
  var bgm = null;
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

  function setZzfxVolume() {
    if (typeof window.zzfxV !== 'undefined') {
      window.zzfxV = muted ? 0 : 0.35;
    }
  }

  function playBassLayer() {
    if (muted || typeof window.zzfx !== 'function') return;
    try {
      window.zzfx.apply(window, [0.5,,95,.02,.06,.12,0,1,,,,,,,,,.04]);
    } catch (e) {}
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

  function toggleMute() {
    muted = !muted;
    if (ambient) ambient.muted = muted;
    if (bgm) bgm.muted = muted;
    setZzfxVolume();
    return muted;
  }

  function isMuted() {
    return muted;
  }

  function playClick() {
    if (muted) return;
    var ctx = getAudioCtx();
    if (ctx && ctx.state === 'suspended') ctx.resume().catch(function () {});
    setZzfxVolume();
    if (typeof window.zzfx === 'function') {
      try {
        playBassLayer();
        window.zzfx.apply(window, [,,320,0,.06,.35,0,1.2,,,380,.02,.03,,,,.06]);
      } catch (e) {
        fallbackClick();
      }
    } else {
      fallbackClick();
    }
  }

  function fallbackClick() {
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
    try {
      bgm = new Audio('assets/audio/walking-dreaming-chill-lofi-317143.mp3');
      bgm.loop = true;
      bgm.volume = 0.35;
      bgm.muted = muted;
      bgm.play().catch(function () {});
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
    setZzfxVolume();
    if (typeof window.zzfx === 'function') {
      try {
        playBassLayer();
        window.zzfx.apply(window, [1.2,.4,220,.05,.12,.18,0,1.4,,,,,,,,.08,.02]);
      } catch (e) {
        playTone(440, 0.06, 'sine', 0.08);
      }
    } else {
      playTone(440, 0.06, 'sine', 0.08);
    }
  }

  function playMinigameSuccess() {
    if (muted) return;
    setZzfxVolume();
    if (typeof window.zzfx === 'function') {
      try {
        playBassLayer();
        window.zzfx.apply(window, [,,880,.08,.12,.3,0,1.5,,,440,.08,.1,,,,.06]);
      } catch (e) {
        playMinigameSuccessSynth();
      }
    } else {
      playMinigameSuccessSynth();
    }
  }

  function playMinigameFail() {
    if (muted) return;
    setZzfxVolume();
    if (typeof window.zzfx === 'function') {
      try {
        playBassLayer();
        window.zzfx.apply(window, [,,165,.02,.08,.5,0,.6,-8,,,,,.38,3.5,,,,.05]);
      } catch (e) {
        playMinigameFailSynth();
      }
    } else {
      playMinigameFailSynth();
    }
  }

  function playChop() {
    if (muted) return;
    setZzfxVolume();
    if (typeof window.zzfx === 'function') {
      try {
        playBassLayer();
        window.zzfx.apply(window, [,,420,.05,.22,.5,0,.45,,4,-100,.08,.14,,,,.04]);
      } catch (e) {
        playClick();
      }
    } else {
      playClick();
    }
  }

  function playStepCorrect() {
    if (muted) return;
    setZzfxVolume();
    if (typeof window.zzfx === 'function') {
      try {
        playBassLayer();
        window.zzfx.apply(window, [,,360,.03,.04,.26,0,1.3,-5,4,.02,,,,,.05]);
      } catch (e) {
        playClick();
      }
    } else {
      playClick();
    }
  }

  var changeUpAudio = null;
  var changeDownAudio = null;

  function playChangeUp() {
    if (muted) return;
    try {
      if (changeUpAudio) {
        changeUpAudio.currentTime = 0;
        changeUpAudio.play().catch(function () {});
      } else {
        changeUpAudio = new Audio('assets/audio/change-up-1s.mp3');
        changeUpAudio.volume = 0.5;
        changeUpAudio.play().catch(function () {});
      }
    } catch (e) {}
  }

  function playChangeDown() {
    if (muted) return;
    try {
      if (changeDownAudio) {
        changeDownAudio.currentTime = 0;
        changeDownAudio.play().catch(function () {});
      } else {
        changeDownAudio = new Audio('assets/audio/change-down-1s.mp3');
        changeDownAudio.volume = 0.5;
        changeDownAudio.play().catch(function () {});
      }
    } catch (e) {}
  }

  function playMinigameSuccessSynth() {
    var ctx = getAudioCtx();
    if (!ctx || muted) return;
    try {
      var t = ctx.currentTime;
      var oscLow = ctx.createOscillator();
      var osc1 = ctx.createOscillator();
      var osc2 = ctx.createOscillator();
      var gain = ctx.createGain();
      oscLow.connect(gain);
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      oscLow.type = 'sine';
      osc1.type = 'sine';
      osc2.type = 'sine';
      oscLow.frequency.setValueAtTime(220, t);
      osc1.frequency.setValueAtTime(440, t);
      osc1.frequency.setValueAtTime(554, t + 0.08);
      osc2.frequency.setValueAtTime(622, t + 0.16);
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.1, t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
      oscLow.start(t);
      oscLow.stop(t + 0.35);
      osc1.start(t);
      osc1.stop(t + 0.25);
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
      osc.type = 'sine';
      osc.frequency.setValueAtTime(85, t);
      osc.frequency.exponentialRampToValueAtTime(55, t + 0.25);
      gain.gain.setValueAtTime(0.06, t);
      gain.gain.linearRampToValueAtTime(0.04, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
      osc.start(t);
      osc.stop(t + 0.35);
    } catch (e) {}
  }

  window.AudioManager = {
    toggleMute: toggleMute,
    isMuted: isMuted,
    playClick: playClick,
    startAmbient: startAmbient,
    playMinigameNeutral: playMinigameNeutral,
    playMinigameSuccess: playMinigameSuccess,
    playMinigameFail: playMinigameFail,
    playChop: playChop,
    playStepCorrect: playStepCorrect,
    playChangeUp: playChangeUp,
    playChangeDown: playChangeDown
  };
})(window);

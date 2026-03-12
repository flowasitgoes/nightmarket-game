/**
 * Main: init, title → game, scroll, hotspot click routing.
 */
(function (window) {
  'use strict';

  var gameViewport = null;
  var nameOverlay = null;
  var nameInput = null;
  var btnNameNext = null;
  var titleOverlay = null;
  var btnStart = null;
  var btnLeft = null;
  var btnRight = null;
  var scrollStep = 280;
  var playerName = 'Traveler';
  var visitedHotspots = new Set();
  var idleTimeout = null;
  var playerEl = null;
  var playerSpriteEl = null;
  var PLAYER_SPRITES = [
    'https://s3-us-west-2.amazonaws.com/s.cdpn.io/21542/WalkingDemo-HANK-2-SHEET.png',
    'https://s3-us-west-2.amazonaws.com/s.cdpn.io/21542/WalkingDemo-EMMY-SHEET.png',
    'https://s3-us-west-2.amazonaws.com/s.cdpn.io/21542/WalkingDemo-SHIRMOND-SHEET.png',
    'https://s3-us-west-2.amazonaws.com/s.cdpn.io/21542/WalkingDemo-SARA-SHEET.png',
    'https://s3-us-west-2.amazonaws.com/s.cdpn.io/21542/WalkingDemo-PATTY-SHEET.png',
    'https://s3-us-west-2.amazonaws.com/s.cdpn.io/21542/WalkingDemo-JESSIE-SHEET.png',
    'https://s3-us-west-2.amazonaws.com/s.cdpn.io/21542/WalkingDemo-KIM-SHEET.png',
    'https://s3-us-west-2.amazonaws.com/s.cdpn.io/21542/WalkingDemo-MINDY-SHEET.png',
    'https://s3-us-west-2.amazonaws.com/s.cdpn.io/21542/WalkingDemo-ZAK-SHEET.png',
    'https://s3-us-west-2.amazonaws.com/s.cdpn.io/21542/WalkingDemo-BEAR-SHEET.png'
  ];
  var playerSpriteIndex = 5;
  var TRAVELER_IDS = [
    'traveler-iceland', 'traveler-mongolia', 'traveler-bhutan', 'traveler-madagascar',
    'traveler-paraguay', 'traveler-slovenia', 'traveler-namibia', 'traveler-albania',
    'traveler-greenland', 'traveler-bolivia'
  ];

  function setPlayerDirection(direction) {
    if (!playerEl) return;
    playerEl.classList.remove('idle', 'Character--walk-down', 'Character--walk-left', 'Character--walk-right', 'Character--walk-up');
    playerEl.classList.add('Character--walk-' + direction);
    if (idleTimeout) clearTimeout(idleTimeout);
    idleTimeout = setTimeout(function () {
      playerEl.classList.remove('Character--walk-left', 'Character--walk-right', 'Character--walk-up');
      playerEl.classList.add('Character--walk-down', 'idle');
      idleTimeout = null;
    }, 320);
  }

  function cyclePlayerSprite(delta) {
    playerSpriteIndex = (playerSpriteIndex + delta + PLAYER_SPRITES.length) % PLAYER_SPRITES.length;
    if (playerSpriteEl) playerSpriteEl.src = PLAYER_SPRITES[playerSpriteIndex];
  }

  function updateProgress() {
    var n = TRAVELER_IDS.filter(function (id) { return visitedHotspots.has(id); }).length;
    var progressEl = document.getElementById('progress-text');
    var hintEl = document.getElementById('hint-text');
    var hudEl = document.getElementById('game-hud');
    if (progressEl) progressEl.textContent = 'Travelers: ' + n + '/10';
    if (n >= 10 && hintEl && hudEl) {
      hintEl.textContent = "You've met everyone! Buy a bag at the stall.";
      hudEl.classList.add('all-met');
    }
  }

  function showControlsHint() {
    var hint = document.getElementById('controls-hint');
    if (!hint) return;
    hint.classList.remove('hidden');
    function dismiss() {
      hint.classList.add('hidden');
      document.removeEventListener('keydown', dismiss);
      document.removeEventListener('click', dismiss);
      if (document.getElementById('controls-hint-dismiss')) {
        document.getElementById('controls-hint-dismiss').removeEventListener('click', dismiss);
      }
    }
    document.getElementById('controls-hint-dismiss').addEventListener('click', dismiss);
    document.addEventListener('keydown', dismiss, { once: true });
    setTimeout(dismiss, 5000);
  }

  function goToIntro() {
    var raw = (nameInput && nameInput.value) ? nameInput.value.trim() : '';
    if (raw.length === 0) {
      if (nameInput) {
        nameInput.classList.add('error');
        nameInput.placeholder = 'Enter your name';
        nameInput.focus();
      }
      return;
    }
    if (nameInput) nameInput.classList.remove('error');
    playerName = raw;
    window.playerName = playerName;
    if (typeof AudioManager !== 'undefined') AudioManager.playClick();
    if (nameOverlay) nameOverlay.classList.add('slide-out');
    setTimeout(function () {
      if (nameOverlay) nameOverlay.classList.add('hidden');
      if (titleOverlay) {
        titleOverlay.classList.remove('hidden');
        titleOverlay.classList.add('intro-visible');
      }
    }, 500);
  }

  function init() {
    gameViewport = document.getElementById('game-viewport');
    nameOverlay = document.getElementById('name-overlay');
    nameInput = document.getElementById('name-input');
    btnNameNext = document.getElementById('btn-name-next');
    titleOverlay = document.getElementById('title-overlay');
    btnStart = document.getElementById('btn-start');
    btnLeft = document.getElementById('btn-left');
    btnRight = document.getElementById('btn-right');
    playerEl = document.getElementById('player-character');
    playerSpriteEl = document.getElementById('player-sprite-sheet');

    var viewportWidth = document.getElementById('scene-container').offsetWidth;
    Scene.init(viewportWidth);

    if (btnNameNext) btnNameNext.addEventListener('click', goToIntro);
    if (nameInput) {
      nameInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); goToIntro(); }
      });
      nameInput.addEventListener('input', function () { nameInput.classList.remove('error'); });
    }

    btnStart.addEventListener('click', startGame);
    btnLeft.addEventListener('click', function () {
      Scene.moveBy(-scrollStep);
      setPlayerDirection('left');
    });
    btnRight.addEventListener('click', function () {
      Scene.moveBy(scrollStep);
      setPlayerDirection('right');
    });

    document.addEventListener('keydown', function (e) {
      if (!gameViewport || !gameViewport.classList.contains('active')) return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        Scene.moveBy(-scrollStep);
        setPlayerDirection('left');
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        Scene.moveBy(scrollStep);
        setPlayerDirection('right');
      } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        cyclePlayerSprite(-1); // 上一個精靈
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        cyclePlayerSprite(1);  // 下一個精靈
      }
    });

    window.addEventListener('resize', function () {
      var c = document.getElementById('scene-container');
      if (c && gameViewport && gameViewport.classList.contains('active')) {
        Scene.init(c.offsetWidth);
      }
    });

    // Hotspot clicks: delegate from scene
    var scene = document.getElementById('scene');
    if (scene) {
      scene.addEventListener('click', function (e) {
        var t = e.target;
        if (t.classList && t.classList.contains('hotspot')) {
          var id = t.dataset.hotspotId;
          if (id) handleHotspotClick(id);
        }
      });
    }

    // Audio mute button
    if (typeof AudioManager !== 'undefined') {
      var btnMute = document.getElementById('btn-mute');
      if (btnMute) {
        btnMute.addEventListener('click', function () {
          AudioManager.toggleMute();
          btnMute.textContent = AudioManager.isMuted() ? '🔇' : '🔊';
          btnMute.classList.toggle('muted', AudioManager.isMuted());
        });
      }
    }

    if (typeof Dialogue !== 'undefined') {
      Dialogue.setOnClose(function (hotspotId) {
        if (hotspotId === 'stall-buy') {
          runBuyFlow();
        } else if (hotspotId === 'garlic-pile') {
          runGarlicMinigame();
        } else if (hotspotId === 'sauce-bottles') {
          runSauceMinigame();
        }
      });
    }
  }

  function startGame() {
    if (!titleOverlay || !gameViewport) return;
    if (typeof AudioManager !== 'undefined') AudioManager.playClick();
    titleOverlay.classList.add('fade-out');
    setTimeout(function () {
      titleOverlay.classList.add('hidden');
      gameViewport.classList.add('active');
      if (typeof SceneSetup !== 'undefined') SceneSetup.placeHotspots();
      if (typeof Effects !== 'undefined') Effects.placeParticles();
      if (typeof AudioManager !== 'undefined') AudioManager.startAmbient();
      if (playerEl) {
        playerEl.classList.remove('Character--walk-left', 'Character--walk-right', 'Character--walk-up');
        playerEl.classList.add('Character--walk-down', 'idle');
      }
      // Re-init scene with real viewport width (was 0 when game-viewport was hidden)
      var container = document.getElementById('scene-container');
      if (container && typeof Scene !== 'undefined') {
        function measureAndInit() {
          var w = container.offsetWidth;
          Scene.init(w);
          Scene.setScroll(0);
        }
        measureAndInit();
        requestAnimationFrame(measureAndInit);
        setTimeout(measureAndInit, 100);
      }
      setTimeout(showControlsHint, 400);
    }, 900);
  }

  function handleHotspotClick(id) {
    visitedHotspots.add(id);
    var btn = document.querySelector('[data-hotspot-id="' + id + '"]');
    if (btn) btn.classList.add('visited');
    updateProgress();
    if (typeof AudioManager !== 'undefined') AudioManager.playClick();
    if (typeof Dialogue !== 'undefined') {
      Dialogue.showForHotspot(id);
    }
  }

  function runGarlicMinigame() {
    if (typeof window.MinigameGarlic !== 'undefined') {
      window.MinigameGarlic.open({ onComplete: function () {} });
    }
  }

  function runSauceMinigame() {
    if (typeof window.MinigameSauce !== 'undefined') {
      window.MinigameSauce.open({ onComplete: function () {} });
    }
  }

  function runBuyFlow() {
    if (typeof window.MinigameCatch !== 'undefined') {
      window.MinigameCatch.open({
        onComplete: function () {
          startEnding();
        }
      });
    } else {
      startEnding();
    }
  }

  function startEnding() {
    var gameEl = document.getElementById('game-viewport');
    var endingEl = document.getElementById('ending-overlay');
    var contentEl = document.getElementById('ending-content');
    if (!endingEl || !contentEl) return;
    if (gameEl) gameEl.classList.remove('active');
    endingEl.classList.remove('hidden');
    var name = (typeof window.playerName !== 'undefined' && window.playerName) ? window.playerName : 'Traveler';
    contentEl.innerHTML =
      '<p class="ending-title">2:03 AM</p>' +
      '<p>' + name + ', you take the warm bag. The travelers gather around — from Iceland, Mongolia, Bhutan, Madagascar, Paraguay, Slovenia, Namibia, Albania, Greenland, Bolivia. One by one they try a piece.</p>' +
      '<p>First confusion. Then nods. Then smiles.</p>' +
      '<p>This is Taiwan\'s late-night culture. Friends, garlic, and a paper bag of fried chicken under the lanterns. Everyone gets it now.</p>' +
      '<p><button type="button" id="ending-back-btn" class="ending-back-btn">Back to street</button></p>';
    var backBtn = document.getElementById('ending-back-btn');
    if (backBtn) backBtn.addEventListener('click', backToGame);
  }

  function backToGame() {
    var gameEl = document.getElementById('game-viewport');
    var endingEl = document.getElementById('ending-overlay');
    if (endingEl) endingEl.classList.add('hidden');
    if (gameEl) gameEl.classList.add('active');
  }

  window.Main = { init: init, startGame: startGame };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(window);

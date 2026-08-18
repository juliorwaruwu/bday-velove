// ---------- helpers ----------
function $(sel){ return document.querySelector(sel); }
function $all(sel){ return document.querySelectorAll(sel); }

function showStage(id){
  $all('.stage').forEach(s => s.classList.remove('active'));
  const el = document.getElementById(id);
  if(el) el.classList.add('active');
}

// ---------- lock screen ----------
(function initLock(){
  try {
    var L = CONFIG.lock;
    var enabled = L && L.enabled;
  } catch(e){
    console.error('initLock: CONFIG.lock missing', e);
    enabled = false;
  }

  if(!enabled){
    showStage('stage-loading');
    loadingSequence();
    return;
  }

  var elQ = $('#lock-question');
  var elInput = $('#lock-input');
  var elHint = $('#lock-hint');
  var elHintText = $('#lock-hint-text');
  var elError = $('#lock-error');
  var elSuccess = $('#lock-success');
  var elBtn = $('#lock-unlock-btn');

  if(!elQ || !elInput || !elBtn){ console.error('initLock: missing DOM elements'); return; }

  elQ.textContent = L.question;
  elInput.placeholder = L.placeholder || 'your answer…';
  if(elHintText) elHintText.textContent = L.hint || '';

  var hintOpen = false;
  if(elHint){
    elHint.addEventListener('click', function(){
      hintOpen = !hintOpen;
      if(elHintText) elHintText.classList.toggle('show', hintOpen);
    });
  }

  function normalize(s){ return s.trim().toLowerCase().replace(/\s+/g,' '); }

  function unlock(){
    var val = normalize(elInput.value);
    var answer = normalize(L.answer);

    if(val !== answer){
      if(elError){
        elError.textContent = L.errorMsg || 'Not quite, my love. Try again 💗';
        elError.classList.add('show');
      }
      elInput.value = '';
      elInput.focus();
      elInput.classList.remove('shake');
      void elInput.offsetWidth;
      elInput.classList.add('shake');
      return;
    }

    if(elError){ elError.textContent = ''; elError.classList.remove('show'); }
    elInput.disabled = true;
    if(elSuccess){
      elSuccess.textContent = L.successMsg || "✨ There's my girl. Welcome. ✨";
      elSuccess.classList.add('show');
    }
    if(elBtn) elBtn.textContent = '…';

    setTimeout(function(){
      showStage('stage-loading');

      var curtain = $('#curtain-scene');
      if(curtain){
        curtain.classList.remove('parting','open');
      }

      loadingSequence();
    }, 1200);
  }

  elBtn.addEventListener('click', unlock);
  elInput.addEventListener('keydown', function(e){
    if(e.key === 'Enter'){
      e.preventDefault();
      unlock();
    }
  });
  elInput.focus();
})();

// ---------- theme ----------
(function initTheme(){
  const saved = localStorage.getItem('birthday-theme');
  let theme;
  if(saved){
    theme = saved;
  } else {
    const hour = new Date().getHours();
    const isNight = hour >= 19 || hour < 6;
    theme = isNight ? 'midnight' : (CONFIG.defaultTheme || 'romantic');
  }
  document.documentElement.setAttribute('data-theme', theme);

  $('#theme-toggle').addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'romantic' ? 'midnight' : 'romantic';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('birthday-theme', next);
  });
})();

// ---------- music toggle ----------
var bgAudio = null;
var bgAudioPlaying = false;
(function initMusic(){
  const btn = $('#music-toggle');
  bgAudio = new Audio(CONFIG.music.src);
  bgAudio.loop = true;
  bgAudio.preload = 'auto';
  bgAudio.volume = CONFIG.music.volume;

  // start playing on the very first user interaction (prevents browser autoplay block)
  function autoStart(){
    if(bgAudioPlaying) return;
    bgAudio.play().then(function(){
      bgAudioPlaying = true;
      btn.classList.add('playing');
      btn.textContent = '🎶 Playing';
    }).catch(function(){});
  }
  document.addEventListener('click', autoStart, { once: false });
  document.addEventListener('keydown', autoStart, { once: false });
  document.addEventListener('touchstart', autoStart, { once: false });

  btn.addEventListener('click', function(e){
    e.stopPropagation();
    if(bgAudioPlaying){
      bgAudio.pause();
      bgAudioPlaying = false;
      btn.classList.remove('playing');
      btn.textContent = '🎵 Music';
    } else {
      bgAudio.play().then(function(){
        bgAudioPlaying = true;
        btn.classList.add('playing');
        btn.textContent = '🎶 Playing';
      }).catch(function(){});
    }
  });

  // resume music when tab becomes visible again (browsers suspend background audio)
  document.addEventListener('visibilitychange', function(){
    if(!bgAudioPlaying) return;
    if(document.hidden) return;
    bgAudio.play().catch(function(){});
  });
})();

// ---------- live animated background (never stops) ----------
(function initLiveBg(){
  const canvas = $('#live-bg');
  const ctx = canvas.getContext('2d');
  let W, H;

  function resize(){ W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  window.addEventListener('resize', resize);
  resize();

  // ---- bokeh orbs ----
  const orbs = [];
  const orbCount = window.innerWidth < 600 ? 14 : 24;
  const orbPalette = [
    [232,92,130],[255,233,168],[255,182,193],[255,107,138],
    [255,215,138],[199,67,106],[255,240,212],[255,160,180]
  ];
  const orbPaletteMidnight = [
    [63,178,127],[143,227,179],[100,200,160],[80,180,140],
    [120,210,170],[50,160,110],[160,230,190],[70,190,130]
  ];

  function getPalette(){
    return document.documentElement.getAttribute('data-theme') === 'midnight' ? orbPaletteMidnight : orbPalette;
  }

  for(let i = 0; i < orbCount; i++){
    const c = orbPalette[i % orbPalette.length];
    orbs.push({
      x: Math.random() * 2000 - 500,
      y: Math.random() * 2000 - 500,
      r: 40 + Math.random() * 120,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.4,
      cr: c[0], cg: c[1], cb: c[2],
      baseAlpha: 0.06 + Math.random() * 0.10,
      pulseSpeed: 0.003 + Math.random() * 0.006,
      pulseAmp: 0.03 + Math.random() * 0.04,
      phase: Math.random() * Math.PI * 2,
      colorShift: Math.random() * 0.001,
      isHeart: i < 6
    });
  }

  // ---- aurora wave bands ----
  const auroraBands = [];
  for(let i = 0; i < 5; i++){
    auroraBands.push({
      yBase: 0.15 + Math.random() * 0.7,
      amplitude: 30 + Math.random() * 60,
      wavelength: 400 + Math.random() * 600,
      speed: 0.0003 + Math.random() * 0.0005,
      thickness: 60 + Math.random() * 100,
      hue: Math.random() * 360,
      hueSpeed: 0.1 + Math.random() * 0.2,
      alpha: 0.03 + Math.random() * 0.04,
      phase: Math.random() * Math.PI * 2
    });
  }

  // ---- light streaks (shooting stars) ----
  const streaks = [];
  function spawnStreak(){
    streaks.push({
      x: Math.random() * W,
      y: Math.random() * H * 0.6,
      len: 80 + Math.random() * 160,
      angle: Math.PI * 0.15 + Math.random() * Math.PI * 0.2,
      speed: 3 + Math.random() * 5,
      life: 1,
      decay: 0.008 + Math.random() * 0.012,
      width: 1 + Math.random() * 2,
      hue: Math.random() < 0.5 ? 340 + Math.random() * 30 : 30 + Math.random() * 30
    });
  }
  let streakTimer = 0;

  // ---- floating dust motes (tiny slow dots) ----
  const motes = [];
  const moteCount = window.innerWidth < 600 ? 30 : 60;
  for(let i = 0; i < moteCount; i++){
    motes.push({
      x: Math.random() * 2000,
      y: Math.random() * 2000,
      r: 1 + Math.random() * 2.5,
      vx: (Math.random() - 0.5) * 0.2,
      vy: -0.1 - Math.random() * 0.3,
      alpha: 0.2 + Math.random() * 0.5,
      pulsePhase: Math.random() * Math.PI * 2
    });
  }

  function drawHeart(ctx, x, y, size){
    const s = size;
    ctx.beginPath();
    ctx.moveTo(x, y + s * 0.3);
    ctx.bezierCurveTo(x, y - s * 0.1, x - s * 0.5, y - s * 0.3, x - s * 0.5, y + s * 0.05);
    ctx.bezierCurveTo(x - s * 0.5, y + s * 0.35, x, y + s * 0.55, x, y + s * 0.7);
    ctx.bezierCurveTo(x, y + s * 0.55, x + s * 0.5, y + s * 0.35, x + s * 0.5, y + s * 0.05);
    ctx.bezierCurveTo(x + s * 0.5, y - s * 0.3, x, y - s * 0.1, x, y + s * 0.3);
    ctx.closePath();
  }

  let t = 0;
  function frame(){
    t++;
    ctx.clearRect(0, 0, W, H);

    const palette = getPalette();

    // draw orbs
    for(let i = 0; i < orbs.length; i++){
      const o = orbs[i];
      o.phase += o.pulseSpeed;
      o.x += o.vx;
      o.y += o.vy;
      o.colorShift += 0.001;
      if(o.x < -o.r*2) o.x = W + o.r;
      if(o.x > W + o.r*2) o.x = -o.r;
      if(o.y < -o.r*2) o.y = H + o.r;
      if(o.y > H + o.r*2) o.y = -o.r;

      // shift color gently
      const ci = i % palette.length;
      const shift = Math.sin(o.colorShift) * 30;
      const cr = palette[ci][0] + shift;
      const cg = palette[ci][1] + shift * 0.5;
      const cb = palette[ci][2] + shift * 0.3;
      const alpha = o.baseAlpha + Math.sin(o.phase) * o.pulseAmp;

      const grad = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
      grad.addColorStop(0, `rgba(${cr|0},${cg|0},${cb|0},${alpha})`);
      grad.addColorStop(0.5, `rgba(${cr|0},${cg|0},${cb|0},${alpha*0.4})`);
      grad.addColorStop(1, `rgba(${cr|0},${cg|0},${cb|0},0)`);
      ctx.fillStyle = grad;
      if(o.isHeart){
        ctx.save();
        ctx.globalAlpha = alpha * 1.2;
        drawHeart(ctx, o.x, o.y, o.r * 0.8);
        ctx.fill();
        ctx.restore();
      } else {
        ctx.beginPath();
        ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // draw aurora bands
    for(let i = 0; i < auroraBands.length; i++){
      const a = auroraBands[i];
      a.phase += a.speed;
      a.hue += a.hueSpeed;

      ctx.save();
      ctx.globalAlpha = a.alpha;
      ctx.beginPath();

      const segments = 20;
      for(let s = 0; s <= segments; s++){
        const sx = (s / segments) * (W + 200) - 100;
        const normalizedX = sx / W;
        const sy = H * a.yBase + Math.sin(normalizedX * Math.PI * 2 + a.phase) * a.amplitude
          + Math.sin(normalizedX * Math.PI * 4 + a.phase * 1.5) * a.amplitude * 0.3;
        if(s === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.strokeStyle = `hsla(${a.hue}, 70%, 65%, 1)`;
      ctx.lineWidth = a.thickness;
      ctx.shadowColor = `hsla(${a.hue}, 80%, 60%, 0.6)`;
      ctx.shadowBlur = a.thickness * 1.5;
      ctx.stroke();
      ctx.restore();
    }

    // draw streaks
    streakTimer++;
    if(streakTimer > 80 + Math.random() * 120){
      spawnStreak();
      streakTimer = 0;
    }
    for(let i = streaks.length - 1; i >= 0; i--){
      const s = streaks[i];
      s.x += Math.cos(s.angle) * s.speed;
      s.y += Math.sin(s.angle) * s.speed;
      s.life -= s.decay;
      if(s.life <= 0){ streaks.splice(i, 1); continue; }

      const endX = s.x - Math.cos(s.angle) * s.len * s.life;
      const endY = s.y - Math.sin(s.angle) * s.len * s.life;

      const grad = ctx.createLinearGradient(s.x, s.y, endX, endY);
      grad.addColorStop(0, `hsla(${s.hue},90%,85%,${s.life * 0.7})`);
      grad.addColorStop(1, `hsla(${s.hue},90%,85%,0)`);
      ctx.strokeStyle = grad;
      ctx.lineWidth = s.width * s.life;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      // head glow
      ctx.save();
      ctx.globalAlpha = s.life * 0.5;
      ctx.fillStyle = `hsla(${s.hue},90%,90%,1)`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, 2 + s.life * 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // draw floating dust motes
    for(let i = 0; i < motes.length; i++){
      const m = motes[i];
      m.x += m.vx;
      m.y += m.vy;
      m.pulsePhase += 0.02;
      if(m.y < -10){ m.y = H + 10; m.x = Math.random() * W; }
      if(m.x < -10) m.x = W + 10;
      if(m.x > W + 10) m.x = -10;

      const a = m.alpha * (0.5 + Math.sin(m.pulsePhase) * 0.5);
      ctx.save();
      ctx.globalAlpha = a;
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();

// ---------- rose petal rain (continuous, CSS-driven) ----------
(function initPetalRain(){
  const layer = $('#rose-petal-rain');
  const petalColors = ['#E85C82','#ff8fab','#ffb3c6','#ff6b8a','#ffd6e0','#ffc2d1','#ffccd5','#d83f6a'];
  const count = window.innerWidth < 600 ? 16 : 28;

  for(let i = 0; i < count; i++){
    const p = document.createElement('div');
    p.className = 'petal-drop';
    const pw = 10 + Math.random() * 12;
    const ph = 12 + Math.random() * 14;
    p.style.setProperty('--pw', pw + 'px');
    p.style.setProperty('--ph', ph + 'px');
    p.style.setProperty('--pc', petalColors[i % petalColors.length]);
    p.style.left = Math.random() * 100 + 'vw';
    const dur = 6 + Math.random() * 8;
    p.style.setProperty('--pdur', dur + 's');
    p.style.setProperty('--pdel', (-Math.random() * dur) + 's');
    p.style.setProperty('--pxdrift', ((Math.random() - 0.5) * 80) + 'px');
    layer.appendChild(p);
  }
})();

// ---------- mouse sparkle trail ----------
(function initSparkles(){
  const trail = $('#sparkle-trail');
  let lastTime = 0;
  let mx = 0, my = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    const now = Date.now();
    if(now - lastTime < 50) return;
    lastTime = now;

    const count = 2 + Math.floor(Math.random() * 3);
    for(let i = 0; i < count; i++){
      const s = document.createElement('div');
      s.className = 'sparkle-particle';
      const ox = (Math.random() - 0.5) * 16;
      const oy = (Math.random() - 0.5) * 16;
      s.style.left = (mx + ox) + 'px';
      s.style.top = (my + oy) + 'px';
      s.style.width = (3 + Math.random() * 5) + 'px';
      s.style.height = s.style.width;
      s.style.setProperty('--sx', ((Math.random()-0.5)*40) + 'px');
      s.style.setProperty('--sy', (-10 - Math.random()*30) + 'px');
      s.style.animationDuration = (0.4 + Math.random()*0.5) + 's';
      trail.appendChild(s);
      setTimeout(() => s.remove(), 900);
    }
  });
})();

// ---------- confetti system ----------
const Confetti = (function(){
  const canvas = $('#confetti-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let running = false;

  function resize(){ canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  window.addEventListener('resize', resize);
  resize();

  const colors = ['#E85C82','#FFE9A8','#C7436A','#FFB6C1','#FF6B8A','#FFD700','#FF69B4','#87CEEB'];

  function createPiece(){
    return {
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * 60,
      w: 6 + Math.random() * 6,
      h: 4 + Math.random() * 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 4,
      vy: 2 + Math.random() * 4,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 12,
      oscillateAmp: Math.random() * 3,
      oscillateSpeed: 0.02 + Math.random() * 0.04,
      phase: Math.random() * Math.PI * 2,
      gravity: 0.04 + Math.random() * 0.03,
      opacity: 1
    };
  }

  function draw(p){
    ctx.save();
    ctx.globalAlpha = p.opacity;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation * Math.PI / 180);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
    ctx.restore();
  }

  function update(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let i = particles.length - 1; i >= 0; i--){
      const p = particles[i];
      p.phase += p.oscillateSpeed;
      p.x += p.vx + Math.sin(p.phase) * p.oscillateAmp;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rotation += p.rotSpeed;
      if(p.y > canvas.height + 40){
        p.opacity -= 0.02;
      }
      if(p.opacity <= 0){ particles.splice(i, 1); continue; }
      draw(p);
    }
    if(particles.length > 0){
      requestAnimationFrame(update);
    } else {
      running = false;
    }
  }

  return {
    burst(count){
      count = count || 200;
      for(let i = 0; i < count; i++) particles.push(createPiece());
      if(!running){ running = true; update(); }
    }
  };
})();

// ---------- floating balloons ----------
(function initBalloons(){
  const layer = $('#balloon-layer');
  const balloonColors = ['#E85C82','#FFB6C1','#FF6B8A','#FFD700','#87CEEB','#DDA0DD','#F0E68C','#98FB98'];
  const count = window.innerWidth < 600 ? 8 : 14;

  for(let i = 0; i < count; i++){
    const wrap = document.createElement('div');
    wrap.style.cssText = `position:absolute; bottom:-140px; left:${5 + Math.random()*90}vw;`;

    const b = document.createElement('div');
    b.className = 'balloon';
    const bw = 40 + Math.random() * 30;
    b.style.setProperty('--bw', bw + 'px');
    b.style.setProperty('--bc', balloonColors[i % balloonColors.length]);
    const dur = 12 + Math.random() * 10;
    b.style.setProperty('--bdur', dur + 's');
    b.style.setProperty('--bdelay', (-Math.random() * dur) + 's');
    b.style.setProperty('--bx', ((Math.random()-0.5) * 120) + 'px');

    const string = document.createElement('div');
    string.className = 'balloon-string';
    b.appendChild(string);
    wrap.appendChild(b);
    layer.appendChild(wrap);
  }
})();

// ---------- romantic 3D birthday backdrop ----------
(function initPetals(){
  const layer = $('#petal-layer');
  const particleLayer = $('#particle-layer');
  const types = ['heart', 'rose', 'spark', 'star'];
  const icons = { heart: '💖', rose: '🌹', spark: '✨', star: '⭐' };
  const count = window.innerWidth < 600 ? 18 : 30;

  for(let i = 0; i < count; i++){
    const type = types[i % types.length];
    const el = document.createElement('div');
    el.className = `scene-ornament ${type}`;
    el.textContent = icons[type];

    const size = 18 + Math.random() * 24;
    el.style.left = Math.random() * 100 + 'vw';
    el.style.fontSize = size + 'px';
    el.style.setProperty('--drift-x', `${(Math.random() - 0.5) * 220}px`);

    const dur = 12 + Math.random() * 10;
    el.style.setProperty('--duration', dur + 's');
    el.style.animationDuration = `${dur}s`;
    el.style.animationDelay = `${-Math.random() * dur}s`;
    layer.appendChild(el);
  }

  const particleCount = window.innerWidth < 600 ? 40 : 70;
  for(let i = 0; i < particleCount; i++){
    const p = document.createElement('span');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + 'vw';
    p.style.top = Math.random() * 100 + 'vh';
    p.style.width = (2 + Math.random() * 4) + 'px';
    p.style.height = p.style.width;
    p.style.opacity = (0.35 + Math.random() * 0.65).toFixed(2);
    p.style.setProperty('--drift-x', `${(Math.random() - 0.5) * 220}px`);
    const dur = 8 + Math.random() * 10;
    p.style.setProperty('--particle-duration', `${dur}s`);
    p.style.animationDelay = `${-Math.random() * dur}s`;
    particleLayer.appendChild(p);
  }
})();

// ---------- parallax mouse tracking on cake image ----------
(function initParallax(){
  const cake = $('.cake');

  document.addEventListener('mousemove', e => {
    const cx = (e.clientX / window.innerWidth - 0.5) * 2;
    const cy = (e.clientY / window.innerHeight - 0.5) * 2;

    if(cake){
      cake.style.transform = `translateX(${cx * 8}px) translateY(${cy * 5}px)`;
    }

    // Subtle parallax on ornaments
    const ornaments = $all('.scene-ornament');
    ornaments.forEach((o, i) => {
      const depth = 0.3 + (i % 5) * 0.15;
      o.style.marginLeft = (cx * depth * 12) + 'px';
      o.style.marginTop = (cy * depth * 8) + 'px';
    });
  });
})();

// ---------- theatrical petal curtain ----------
(function buildCurtain(){
  var leftPanel = $('#curtain-left');
  var rightPanel = $('#curtain-right');
  var valance = $('#curtain-valance');
  if(!leftPanel || !rightPanel) return;

  var mobile = window.innerWidth < 600;
  function rand(min,max){ return Math.random()*(max-min)+min; }
  function pick(a){ return a[Math.floor(Math.random()*a.length)]; }

  var palettes = [
    ['#FFD1DC','#FFB6C1','#FF8FAA','#E8637A'],
    ['#FFC2D1','#FF9EBB','#F2789B','#D44C68'],
    ['#FFE0E8','#FFCAD6','#FF7EA0','#E05575'],
    ['#FFD6E0','#FFA8BB','#F06888','#CC4466'],
    ['#FFE8EE','#FFBCCC','#FF90AA','#D95070'],
    ['#FFF0F3','#FFD0DC','#FFA0B4','#E87090'],
    ['#FFDAE5','#FFB0C4','#F48098','#D05878'],
  ];

  function makePetalEl(pal, w, h, x, y, rot, op, opts){
    var gr = opts.gr || rand(100,170);
    var petal = document.createElement('div');
    petal.className = 'rpetal';
    petal.style.cssText =
      'left:'+x+'%;top:'+y+'%;width:'+w+'px;height:'+h+'px;'+
      '--px:0;--py:0;--pr:'+rot+'deg;--ps:1;--po:'+op+';'+
      '--pc1:'+pal[0]+';--pc2:'+pal[1]+';--pc3:'+pal[2]+';--pc4:'+pal[3]+';'+
      '--pgr:'+gr+'deg;';

    petal.style.setProperty('--dx1', (opts.dx1||rand(-6,6))+'px');
    petal.style.setProperty('--dy1', (opts.dy1||rand(-5,5))+'px');
    petal.style.setProperty('--dx2', (opts.dx2||rand(-5,5))+'px');
    petal.style.setProperty('--dy2', (opts.dy2||rand(-4,4))+'px');
    petal.style.setProperty('--dx3', (opts.dx3||rand(-6,6))+'px');
    petal.style.setProperty('--dy3', (opts.dy3||rand(-5,5))+'px');
    petal.style.setProperty('--r1', (opts.r1||rand(-10,10))+'deg');
    petal.style.setProperty('--r2', (opts.r2||rand(-8,8))+'deg');
    petal.style.setProperty('--r3', (opts.r3||rand(-10,10))+'deg');
    petal.style.animation = 'petalFloat '+(opts.fDur||rand(6,12).toFixed(1))+'s ease-in-out '+(opts.fDel||rand(-6,0).toFixed(1))+'s infinite';

    // scatter params for when curtains part
    var sdx = rand(-350, 350);
    var sdy = rand(150, window.innerHeight * 0.8);
    var srot = rand(120, 400);
    var sDur = rand(0.8, 1.4).toFixed(2);
    petal.style.setProperty('--sdx', sdx+'px');
    petal.style.setProperty('--sdy', sdy+'px');
    petal.style.setProperty('--srot', srot+'deg');
    petal.style.setProperty('--sDur', sDur+'s');

    var inner = document.createElement('div');
    inner.className = 'rpetal-inner';
    var shape = document.createElement('div');
    shape.className = 'rpetal-shape';
    inner.appendChild(shape);
    petal.appendChild(inner);
    return petal;
  }

  // Fill each panel with dense petals — top to bottom, layered
  [leftPanel, rightPanel].forEach(function(panel){
    // background layer — large, dim petals
    var bgCount = mobile ? 35 : 55;
    for(var i=0; i<bgCount; i++){
      var pal = pick(palettes);
      var w = rand(20, 38);
      var h = w * rand(1.2, 1.5);
      var x = rand(2, 98);
      var y = rand(-2, 100);
      var rot = rand(0, 360);
      var op = rand(0.5, 0.7);
      panel.appendChild(makePetalEl(pal, w, h, x, y, rot, op, {}));
    }
    // mid layer — medium petals, brighter
    var midCount = mobile ? 30 : 50;
    for(var i=0; i<midCount; i++){
      var pal = pick(palettes);
      var w = rand(16, 30);
      var h = w * rand(1.15, 1.4);
      var x = rand(2, 98);
      var y = rand(-2, 100);
      var rot = rand(0, 360);
      var op = rand(0.65, 0.85);
      panel.appendChild(makePetalEl(pal, w, h, x, y, rot, op, {}));
    }
    // front layer — small detail petals
    var fgCount = mobile ? 20 : 35;
    for(var i=0; i<fgCount; i++){
      var pal = pick(palettes);
      var w = rand(12, 22);
      var h = w * rand(1.2, 1.4);
      var x = rand(5, 95);
      var y = rand(-2, 100);
      var rot = rand(0, 360);
      var op = rand(0.75, 0.95);
      panel.appendChild(makePetalEl(pal, w, h, x, y, rot, op, {}));
    }
  });

  // fill valance with small dense petals
  if(valance){
    var valCount = mobile ? 30 : 50;
    for(var v=0; v<valCount; v++){
      var pal = pick(palettes);
      var w = rand(10, 20);
      var h = w * rand(1.2, 1.4);
      var x = rand(2, 98);
      var y = rand(5, 85);
      var rot = rand(0, 360);
      var op = rand(0.7, 0.95);
      var petal = makePetalEl(pal, w, h, x, y, rot, op, {});
      petal.style.zIndex = '1';
      valance.appendChild(petal);
    }
  }
})();

// ---------- STAGE 0: loading (romantic countdown) ----------
function loadingSequence(){
  var numEl = $('#countdown-num');
  if(!numEl){ console.error('loadingSequence: #countdown-num missing'); return; }

  var digits = [5, 4, 3, 2, 1, 0];
  var step = 0;
  var HOLD = 1000; // each number shows for exactly one second

  function playNumber(n, done){
    numEl.textContent = String(n);
    numEl.classList.remove('show');
    void numEl.offsetWidth;
    numEl.classList.add('show');
    setTimeout(done, HOLD);
  }

  function playStep(){
    var n = digits[step];
    step++;
    if(n === 0){
      playNumber(n, function(){
        // auto-play music as the surprise reveals
        if(bgAudio && !bgAudioPlaying){
          bgAudio.play().then(function(){
            bgAudioPlaying = true;
            var btn = $('#music-toggle');
            if(btn){ btn.classList.add('playing'); btn.textContent = '🎶 Playing'; }
          }).catch(function(){});
        }
        revealSurprise(function(){
          showStage('stage-cake');
          animateAgeCounter();
          tryStartMicBlow();
        });
      });
    } else {
      playNumber(n, playStep);
    }
  }

  playStep();
}

function revealSurprise(done){
  var scene = $('#curtain-scene');
  if(scene){
    requestAnimationFrame(function(){
      requestAnimationFrame(function(){
        scene.classList.add('parting');
        spawnBurst();
        setTimeout(function(){
          scene.classList.add('open');
        }, 500);
      });
    });
  }
  setTimeout(done, 1600);
}

function spawnBurst(){
  var scene = $('#curtain-scene');
  if(!scene) return;
  var fx = document.createElement('div');
  fx.className = 'countdown-fx';
    scene.appendChild(fx);

  function rand(min,max){ return Math.random()*(max-min)+min; }
  var i, el;

  for(i=0;i<18;i++){ // sparkling particles flying outward
    el = document.createElement('i');
    el.className = 'cd-sparkle';
    el.style.setProperty('--dx', rand(-260,260).toFixed(0) + 'px');
    el.style.setProperty('--dy', rand(-260,260).toFixed(0) + 'px');
    el.style.setProperty('--dur', rand(0.9,1.4).toFixed(2) + 's');
    el.style.setProperty('--dly', '0s');
    el.style.animationIterationCount = '1';
    fx.appendChild(el);
  }
  for(i=0;i<20;i++){ // burst petals
    el = document.createElement('i');
    el.className = 'burst-petal';
    el.style.setProperty('--pw', rand(6,11).toFixed(1) + 'px');
    el.style.setProperty('--dx', rand(-280,280).toFixed(0) + 'px');
    el.style.setProperty('--dy', rand(-280,280).toFixed(0) + 'px');
    el.style.setProperty('--pt', rand(0,360).toFixed(0) + 'deg');
    el.style.setProperty('--dur', rand(1,1.6).toFixed(2) + 's');
    fx.appendChild(el);
  }
  for(i=0;i<10;i++){ // floating hearts
    el = document.createElement('i');
    el.className = 'cd-heart';
    el.style.setProperty('--dx', rand(-200,200).toFixed(0) + 'px');
    el.style.setProperty('--dy', rand(-200,200).toFixed(0) + 'px');
    el.style.setProperty('--dur', rand(1.1,1.7).toFixed(2) + 's');
    el.style.setProperty('--dly', rand(0,0.3).toFixed(2) + 's');
    el.style.animationIterationCount = '1';
    fx.appendChild(el);
  }

  setTimeout(function(){
    if(fx.parentNode) fx.parentNode.removeChild(fx);
  }, 2200);
}

// countdown ambient FX — soft light particles, tiny hearts, sparkles
(function buildCountdownFX(){
  var fx = $('#countdown-fx');
  if(!fx) return;
  function rand(min,max){ return Math.random()*(max-min)+min; }
  var i, el;

  for(i=0;i<12;i++){ // soft light motes
    el = document.createElement('i');
    el.className = 'cd-particle';
    el.style.setProperty('--dx', rand(-60,60).toFixed(0) + 'px');
    el.style.setProperty('--dy', rand(-150,-30).toFixed(0) + 'px');
    el.style.setProperty('--dur', rand(4.5,7).toFixed(1) + 's');
    el.style.setProperty('--dly', (-rand(0,6)).toFixed(1) + 's');
    fx.appendChild(el);
  }
  for(i=0;i<6;i++){ // tiny floating hearts
    el = document.createElement('i');
    el.className = 'cd-heart';
    el.style.setProperty('--dx', rand(-70,70).toFixed(0) + 'px');
    el.style.setProperty('--dy', rand(-130,-30).toFixed(0) + 'px');
    el.style.setProperty('--dur', rand(4,6).toFixed(1) + 's');
    el.style.setProperty('--dly', (-rand(0,5)).toFixed(1) + 's');
    fx.appendChild(el);
  }
  for(i=0;i<10;i++){ // twinkling sparkles
    el = document.createElement('i');
    el.className = 'cd-sparkle';
    el.style.setProperty('--dx', rand(-80,80).toFixed(0) + 'px');
    el.style.setProperty('--dy', rand(-140,-20).toFixed(0) + 'px');
    el.style.setProperty('--dur', rand(3,5).toFixed(1) + 's');
    el.style.setProperty('--dly', (-rand(0,4)).toFixed(1) + 's');
    fx.appendChild(el);
  }
})();

function tryStartMicBlow(){
  if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(function(stream){
      var ctx = new (window.AudioContext || window.webkitAudioContext)();
      var source = ctx.createMediaStreamSource(stream);
      var analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      source.connect(analyser);
      var data = new Uint8Array(analyser.frequencyBinCount);
      var loudFrames = 0;
      var micActive = true;

      function poll(){
        if(!micActive || candlesBlownOut){
          stream.getTracks().forEach(function(t){ t.stop(); });
          ctx.close();
          return;
        }
        if(!document.getElementById('stage-cake').classList.contains('active')){
          requestAnimationFrame(poll);
          return;
        }
        analyser.getByteFrequencyData(data);
        var avg = data.reduce(function(a,b){ return a+b; }, 0) / data.length;
        if(avg > 42){
          loudFrames++;
          if(loudFrames > 4){ blowOutCandles(); micActive = false; }
        } else {
          loudFrames = Math.max(0, loudFrames - 1);
        }
        requestAnimationFrame(poll);
      }
      poll();
    })
    .catch(function(){});
}

// ---------- STAGE 1: cake + candles ----------
const DIGIT_PATTERNS = {
  0: ["01110","10001","10011","10101","11001","10001","01110"],
  1: ["00100","01100","00100","00100","00100","00100","01110"],
  2: ["01110","10001","00001","00010","00100","01000","11111"],
  3: ["11111","00010","00100","00010","00001","10001","01110"],
  4: ["00010","00110","01010","10010","11111","00010","00010"],
  5: ["11111","10000","11110","00001","00001","10001","01110"],
  6: ["00110","01000","10000","11110","10001","10001","01110"],
  7: ["11111","00001","00010","00100","01000","01000","01000"],
  8: ["01110","10001","10001","01110","10001","10001","01110"],
  9: ["01110","10001","10001","01111","00001","00010","01100"]
};

function buildCandles(){
  const wrap = $('#candles-wrap');
  wrap.innerHTML = '';
  String(CONFIG.age).split('').forEach(digitChar => {
    const rows = DIGIT_PATTERNS[digitChar] || DIGIT_PATTERNS[0];
    const grid = document.createElement('div');
    grid.className = 'digit-grid';
    rows.forEach(row => {
      row.split('').forEach(cell => {
        const cellDiv = document.createElement('div');
        if(cell === '1'){
          cellDiv.className = 'candle';
          cellDiv.innerHTML = '<div class="flame"></div><div class="stick"></div>';
        }
        grid.appendChild(cellDiv);
      });
    });
    wrap.appendChild(grid);
  });
  $('#cake-heading').textContent = CONFIG.age + ' candles, one wish.';
  const cakeName = $('#cake-name-sign');
  if(cakeName){ cakeName.innerHTML = CONFIG.cakeMessage.replace(/\n/g, '<br>'); }
  var cake = $('.cake');
  if(cake) cake.classList.add('lit');
}
buildCandles();

let candlesBlownOut = false;

function blowOutCandles(){
  if(candlesBlownOut) return;
  candlesBlownOut = true;
  const btn = $('#blow-btn');
  btn.style.pointerEvents = 'none';
  btn.style.opacity = '0.4';
  const candles = $all('#candles-wrap .candle');

  // Phase 1: each candle starts blowing — flames lean and flicker hard
  candles.forEach((c, i) => {
    setTimeout(() => {
      c.classList.add('blowing');
    }, i * 55 + Math.random() * 40);
  });

  // Phase 2: each candle goes out after its blowing animation
  candles.forEach((c, i) => {
    const blowStart = i * 55 + Math.random() * 40;
    setTimeout(() => {
      c.classList.remove('blowing');
      c.classList.add('out');
      const smoke = document.createElement('div');
      smoke.className = 'smoke';
      smoke.style.left = '50%';
      smoke.style.top = '0';
      c.appendChild(smoke);
    }, blowStart + 650);
  });

  // Fire heart burst + confetti after candles blow out
  const lastBlow = (candles.length - 1) * 55 + 40 + 650;
  setTimeout(function(){
    var cake = $('.cake');
    if(cake) cake.classList.remove('lit');
  }, lastBlow + 200);
  setTimeout(heartBurst, lastBlow + 200);
  setTimeout(() => { Confetti.burst(250); }, lastBlow + 400);

  setTimeout(() => {
    showStage('stage-message');
    startMessageSequence();
  }, lastBlow + 900);
}

$('#blow-btn').addEventListener('click', blowOutCandles);

// ---------- STAGE 2: message (typewriter letter) ----------
function startMessageSequence(){
  const container = $('#message-lines');
  container.innerHTML = '';
  const lines = CONFIG.birthdayMessage.map(l => l.replace('{name}', CONFIG.partnerName));

  const items = lines.map((text, i) => {
    const el = document.createElement('p');
    el.className = 'love-line' + (i === lines.length - 1 ? ' script' : '');
    el.innerHTML = '<span class="love-text"></span>';
    container.appendChild(el);
    return { el, text, textNode: el.querySelector('.love-text') };
  });

  let idx = 0;

  function charDelay(ch, next){
    let d = 26 + Math.random() * 18;
    if(next === ' ') d += 22;
    if(ch === ',' || ch === ';' || ch === ':' || ch === '—' || ch === '…') d += 190;
    if(ch === '.' || ch === '!' || ch === '?') d += 420;
    return d;
  }

  function typeLine(){
    if(idx >= items.length){ finish(); return; }
    const item = items[idx];
    const lineEl = item.el;
    lineEl.classList.add('typing');
    lineEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });

    const cursor = document.createElement('span');
    cursor.className = 'type-cursor';
    lineEl.appendChild(cursor);

    let pos = 0;
    const tick = () => {
      if(pos < item.text.length){
        const ch = item.text.charAt(pos);
        pos++;
        item.textNode.textContent = item.text.slice(0, pos);
        setTimeout(tick, charDelay(ch, item.text.charAt(pos)));
      } else {
        setTimeout(() => {
          lineEl.classList.remove('typing');
          lineEl.classList.add('done');
          idx++;
          setTimeout(typeLine, 620);
        }, 480);
      }
    };
    setTimeout(tick, 80);
  }

  function finish(){
    $('#to-wish-btn').classList.add('show');
  }

  typeLine();
}

$('#to-wish-btn').addEventListener('click', () => showStage('stage-wish'));

// ---------- STAGE 3: wishlist ----------
const wishes = [];
const wishInput = $('#wish-input');
const wishListEl = $('#wish-list');
const wishSaveBtn = $('#wish-save-btn');

function addWish(){
  const val = wishInput.value.trim();
  if(!val) return;
  wishes.push(val);
  const li = document.createElement('li');
  li.textContent = val;
  wishListEl.appendChild(li);
  wishInput.value = '';
  wishSaveBtn.disabled = wishes.length === 0;
}

$('#wish-add-btn').addEventListener('click', addWish);
wishInput.addEventListener('keydown', e => { if(e.key === 'Enter'){ e.preventDefault(); addWish(); } });

wishSaveBtn.addEventListener('click', () => {
  wishSaveBtn.disabled = true;
  wishInput.disabled = true;
  $('#wish-add-btn').disabled = true;

  // show sealed area
  $('#wish-sealed').classList.add('show');

  // hide input area
  const inputRow = $('.wish-input-row');
  if(inputRow) inputRow.style.opacity = '0.3';
  wishInput.style.pointerEvents = 'none';

  // reveal wishes one by one
  const reveal = $('#wish-reveal');
  reveal.innerHTML = '';
  wishes.forEach((w, i) => {
    const card = document.createElement('div');
    card.className = 'wish-reveal-card';
    card.innerHTML = `<span class="wish-star">✧</span><span class="wish-word">${w}</span>`;
    card.style.animationDelay = (i * 0.3) + 's';
    reveal.appendChild(card);
  });

  // prayer appears after all wishes revealed
  const prayerDelay = wishes.length * 300 + 600;
  setTimeout(() => {
    const prayers = [
      `May every wish you whispered tonight bloom into something beautiful. You deserve the whole world and more, ${CONFIG.partnerName}.`,
      `With all my heart, I pray these wishes find their way to you — each one a piece of how deeply you are loved.`,
      `God bless every dream you hold, every hope you carry. May this new year of your life overflow with joy, ${CONFIG.partnerName}.`,
      `These wishes are seeds planted in love. May they grow into moments that take your breath away.`,
      `I pray that every single thing your heart desires comes true — and that you always know how precious you are to me.`
    ];
    const chosen = prayers[Math.floor(Math.random() * prayers.length)];
    $('#prayer-text').textContent = chosen;
    $('#wish-prayer').classList.add('show');
  }, prayerDelay);

  Confetti.burst(80);

  // scroll the wish card so sealed area is visible
  setTimeout(() => {
    const sealed = $('#wish-sealed');
    sealed.scrollIntoView({ behavior:'smooth', block:'nearest' });
  }, prayerDelay - 200);
});

$('#to-gallery-btn').addEventListener('click', () => {
  buildGallery();
  showStage('stage-gallery');
});

// ---------- STAGE 4: gallery (Museum of Us) ----------
function openExhibitLightbox(src, caption, date, isVideo){
  const lb = $('#lightbox');
  if(!lb) return;
  if(isVideo){
    $('#lightbox-img').style.display = 'none';
    $('#lightbox-video').style.display = 'block';
    $('#lightbox-video').src = src;
    $('#lightbox-video').load();
    $('#lightbox-video').play().catch(function(){});
  } else {
    $('#lightbox-video').pause();
    $('#lightbox-video').src = '';
    $('#lightbox-video').style.display = 'none';
    $('#lightbox-img').style.display = '';
    $('#lightbox-img').src = src;
  }
  $('#lightbox-caption').textContent = caption || '';
  $('#lightbox-date').textContent = date || '';
  lb.classList.add('open');
  lb.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function buildGallery(){
  const grid = $('#gallery-grid');
  grid.innerHTML = '';
  CONFIG.gallery.forEach((item, i) => {
    const exhibit = document.createElement('div');
    exhibit.className = 'exhibit' + (i % 3 === 1 ? ' featured' : '');
    const no = String(i + 1).padStart(2, '0');

    const photoHtml = item.video
      ? `<div class="photo video-thumb">
           <video src="${item.video}" muted preload="metadata" playsinline></video>
           <span class="play-icon">▶</span>
         </div>`
      : item.src
        ? `<img class="photo" src="${item.src}" alt="${item.caption}" loading="lazy" onerror="this.outerHTML='<div class=&quot;photo-fallback&quot;>♡</div>'">`
        : `<div class="photo-fallback">♡</div>`;

    exhibit.innerHTML = `
      <div class="artwork">
        <div class="mat">
          <div class="painting">
            ${photoHtml}
          </div>
        </div>
      </div>
      <div class="exhibit-label">
        <span class="label-no">Exhibit ${no}</span>
        <span class="cap">${item.caption}</span>
        <span class="date">${item.date}</span>
      </div>
    `;

    exhibit.addEventListener('click', () => {
      const videoEl = exhibit.querySelector('.video-thumb video');
      const photo = exhibit.querySelector('img.photo');
      const caption = exhibit.querySelector('.cap');
      const date = exhibit.querySelector('.date');
      openExhibitLightbox(
        videoEl ? videoEl.src : (photo ? photo.src : null),
        caption ? caption.textContent : '',
        date ? date.textContent : '',
        !!videoEl
      );
    });

    grid.appendChild(exhibit);
  });

  $('#closing-name').textContent = CONFIG.partnerName;
  $('#closing-signature').textContent = 'forever yours, ' + CONFIG.yourName;

  if(!('IntersectionObserver' in window)){
    grid.querySelectorAll('.exhibit').forEach(ex => ex.classList.add('revealed'));
    return;
  }
  if(window._galleryObserver) window._galleryObserver.disconnect();
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if(en.isIntersecting){ en.target.classList.add('revealed'); io.unobserve(en.target); }
    });
  }, { threshold: 0.12 });
  window._galleryObserver = io;
  grid.querySelectorAll('.exhibit').forEach(function(ex, i){
    ex.style.transitionDelay = (i % 6) * 0.06 + 's';
    io.observe(ex);
  });
}

// ---------- AGE COUNTER ANIMATION ----------
function animateAgeCounter(){
  const el = $('#age-counter');
  if(!el) return;
  const target = CONFIG.age;
  const digits = String(target).split('');
  el.innerHTML = '';
  digits.forEach((d, i) => {
    const span = document.createElement('span');
    span.className = 'digit';
    span.textContent = d;
    el.appendChild(span);
  });
  el.style.animation = 'none';
  void el.offsetHeight;
  el.style.animation = '';
}

// ---------- HEART BURST ON CANDLE BLOWOUT ----------
function heartBurst(){
  const layer = $('#heart-burst-layer');
  const hearts = ['💖','💗','💕','💞','💓','💘','❤️','🩷','🤍'];
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight * 0.45;
  const count = window.innerWidth < 600 ? 16 : 28;

  for(let i = 0; i < count; i++){
    const h = document.createElement('div');
    h.className = 'burst-heart';
    h.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
    const dist = 80 + Math.random() * 160;
    h.style.left = cx + 'px';
    h.style.top = cy + 'px';
    h.style.setProperty('--hx', Math.cos(angle) * dist + 'px');
    h.style.setProperty('--hy', (Math.sin(angle) * dist - 60) + 'px');
    h.style.setProperty('--hs', (0.8 + Math.random() * 1) + 'rem');
    h.style.setProperty('--hdur', (1 + Math.random() * 0.8) + 's');
    h.style.setProperty('--hrot', ((Math.random() - 0.5) * 60) + 'deg');
    layer.appendChild(h);
    setTimeout(() => h.remove(), 2200);
  }
}

// ---------- MUSIC VISUALIZER BARS ----------
(function initMusicBars(){
  const bars = $('#music-bars');
  const btn = $('#music-toggle');
  const observer = new MutationObserver(() => {
    bars.classList.toggle('active', btn.classList.contains('playing'));
  });
  observer.observe(btn, { attributes:true, attributeFilter:['class'] });
})();

// ---------- LIGHTBOX ----------
(function initLightbox(){
  const lb = $('#lightbox');
  const lbVideo = $('#lightbox-video');
  const lbImg = $('#lightbox-img');
  const lbClose = $('#lightbox-close');

  function closeLB(){
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lbVideo.pause();
    lbVideo.src = '';
    setTimeout(function(){ lbImg.src = ''; }, 400);
  }

  lbClose.addEventListener('click', closeLB);
  lb.addEventListener('click', function(e){ if(e.target === lb) closeLB(); });
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closeLB(); });
})();

// ---------- DOUBLE-TAP HEART EXPLOSION ----------
(function initDoubleTap(){
  let lastTap = 0;
  const hearts = ['💖','💗','💕','❤️','🩷','✨','💘'];

  document.addEventListener('touchend', e => {
    const now = Date.now();
    if(now - lastTap < 350){
      const x = e.changedTouches[0].clientX;
      const y = e.changedTouches[0].clientY;
      for(let i = 0; i < 8; i++){
        const h = document.createElement('div');
        h.className = 'burst-heart';
        h.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        const angle = (Math.PI * 2 * i) / 8;
        const dist = 40 + Math.random() * 80;
        h.style.left = x + 'px';
        h.style.top = y + 'px';
        h.style.setProperty('--hx', Math.cos(angle) * dist + 'px');
        h.style.setProperty('--hy', (Math.sin(angle) * dist - 40) + 'px');
        h.style.setProperty('--hs', (0.7 + Math.random() * 0.7) + 'rem');
        h.style.setProperty('--hdur', (0.8 + Math.random() * 0.6) + 's');
        h.style.setProperty('--hrot', ((Math.random() - 0.5) * 40) + 'deg');
        $('#heart-burst-layer').appendChild(h);
        setTimeout(() => h.remove(), 1600);
      }
    }
    lastTap = now;
  });
})();

// ---------- STAGE TRANSITION BURSTS ----------
(function initStageTransitions(){
  var stages = ['stage-locked','stage-loading','stage-cake','stage-message','stage-wish','stage-gallery'];
  var autoTransitions = {'stage-loading':'stage-cake'};
  var lastStage = '';
  var observer = new MutationObserver(function(){
    var active = document.querySelector('.stage.active');
    if(!active) return;
    var id = active.id;
    if(id !== lastStage && lastStage !== '' && stages.includes(id)){
      if(!(lastStage in autoTransitions && autoTransitions[lastStage] === id)){
        Confetti.burst(window.innerWidth < 600 ? 40 : 70);
      }
    }
    lastStage = id;
  });
  stages.forEach(sid => {
    const el = document.getElementById(sid);
    if(el) observer.observe(el, { attributes:true, attributeFilter:['class'] });
  });
})();

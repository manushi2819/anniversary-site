function toggleEnvelope(element) {
  // Close all other envelopes (only one open at a time)
  document.querySelectorAll('.envelope-card').forEach(envelope => {
    if (envelope !== element && envelope.classList.contains('open')) {
      envelope.classList.remove('open');
    }
  });
  
  // Toggle the clicked envelope
  element.classList.toggle('open');
}

// Close envelope when clicking outside (optional)
document.addEventListener('click', function(e) {
  if (!e.target.closest('.envelope-card')) {
    document.querySelectorAll('.envelope-card.open').forEach(envelope => {
      envelope.classList.remove('open');
    });
  }
});


 // ---------- SECRET PASSWORD LOGIC with 4-digit boxes ----------
const digit1 = document.getElementById('digit1');
const digit2 = document.getElementById('digit2');
const digit3 = document.getElementById('digit3');
const digit4 = document.getElementById('digit4');
const unlockBtn = document.getElementById('unlock-btn');
const secretEntry = document.getElementById('secret-entry');
const mainApp = document.getElementById('main-app');
const errorMsg = document.getElementById('pw-error');
const secretInput = document.getElementById('secret-input');

// ---------- BACKGROUND MUSIC ----------
const audioElement = new Audio('music.mp3');
audioElement.loop = true;
audioElement.volume = 0.5;
const musicToggleBtn = document.getElementById('musicToggle');
const musicStatusSpan = document.getElementById('musicStatus');
let musicPlaying = false;

function toggleMusic() {
  if (musicPlaying) {
    audioElement.pause();
    if (musicToggleBtn) musicToggleBtn.innerHTML = '<i class="fas fa-music"></i>';
  } else {
    audioElement.play().catch(e => console.log("user gesture needed"));
    if (musicToggleBtn) musicToggleBtn.innerHTML = '<i class="fas fa-music" style="color: #ff4d6d; text-shadow: 0 0 5px rgba(255,77,109,0.5);"></i>';
  }
  musicPlaying = !musicPlaying;
}

// Optional: Add a pulsing effect when music is playing
function updateMusicIcon() {
  if (musicPlaying && musicToggleBtn) {
    musicToggleBtn.innerHTML = '<i class="fas fa-music" style="color: #ff4d6d; text-shadow: 0 0 5px rgba(255,77,109,0.5); animation: musicPulse 1s ease-in-out infinite;"></i>';
  } else if (musicToggleBtn) {
    musicToggleBtn.innerHTML = '<i class="fas fa-music"></i>';
  }
}

// Add pulse animation to CSS
const musicStyle = document.createElement('style');
musicStyle.textContent = `
  @keyframes musicPulse {
    0%, 100% { opacity: 0.6; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.1); }
  }
`;
document.head.appendChild(musicStyle);
if (musicToggleBtn) {
  musicToggleBtn.addEventListener('click', toggleMusic);
}

function startMusic() {
  audioElement.play().then(() => {
    musicPlaying = true;
    if (musicToggleBtn) {
      musicToggleBtn.innerHTML = '<i class="fas fa-music" style="color: #ff4d6d; text-shadow: 0 0 5px rgba(255,77,109,0.5); animation: musicPulse 1s ease-in-out infinite;"></i>';
    }
  }).catch(e => console.log("Music play error:", e));
}
// Auto-focus and move to next box
function moveToNext(current, next) {
  if (current.value.length === 1) {
    if (next) next.focus();
  }
}

// Move to previous on backspace
function moveToPrevious(current, prev, event) {
  if (event.key === 'Backspace' && current.value.length === 0) {
    if (prev) prev.focus();
  }
}

// Add event listeners for each digit box
if (digit1) {
  digit1.addEventListener('input', () => moveToNext(digit1, digit2));
  digit1.addEventListener('keydown', (e) => moveToPrevious(digit1, null, e));
}

if (digit2) {
  digit2.addEventListener('input', () => moveToNext(digit2, digit3));
  digit2.addEventListener('keydown', (e) => moveToPrevious(digit2, digit1, e));
}

if (digit3) {
  digit3.addEventListener('input', () => moveToNext(digit3, digit4));
  digit3.addEventListener('keydown', (e) => moveToPrevious(digit3, digit2, e));
}

if (digit4) {
  digit4.addEventListener('input', () => {
    if (digit4.value.length === 1) {
      setTimeout(() => {
        checkPassword();
      }, 100);
    }
  });
  digit4.addEventListener('keydown', (e) => moveToPrevious(digit4, digit3, e));
}

// Function to get entered PIN
function getEnteredPIN() {
  return (digit1?.value || '') + (digit2?.value || '') + (digit3?.value || '') + (digit4?.value || '');
}

// Clear all boxes
function clearBoxes() {
  if (digit1) digit1.value = '';
  if (digit2) digit2.value = '';
  if (digit3) digit3.value = '';
  if (digit4) digit4.value = '';
  if (digit1) digit1.focus();
}

// Show error animation
function showError() {
  if (errorMsg) errorMsg.innerText = "💔 Wrong code, love. Try our special day (DDMM)";
  const boxes = [digit1, digit2, digit3, digit4];
  boxes.forEach(box => {
    if (box) {
      box.style.borderColor = "#d90429";
      box.style.animation = "shake 0.5s ease-in-out";
      setTimeout(() => {
        if (box) {
          box.style.borderColor = "#ffb7c5";
          box.style.animation = "";
        }
      }, 500);
    }
  });
  clearBoxes();
}

// Add shake animation if not already added
if (!document.querySelector('#shake-style')) {
  const style = document.createElement('style');
  style.id = 'shake-style';
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }
  `;
  document.head.appendChild(style);
}

// Function to unlock the app
function unlockAppContent() {
  secretEntry.style.opacity = "0";
  secretEntry.style.visibility = "hidden";
  mainApp.style.opacity = "1";
  mainApp.style.visibility = "visible";
  
  // Start floating hearts
  if (typeof initFloatingHearts === 'function') {
    initFloatingHearts();
  }
  
  // Start music immediately
  startMusic();
}

// Check password function
function checkPassword() {
  let entered = getEnteredPIN();
  // Correct password: 0806 (8th June) or 806
  if (entered === "0806" || entered === "806") {
    unlockAppContent();
  } else {
    showError();
  }
}

// Unlock button click
if (unlockBtn) {
  unlockBtn.addEventListener('click', checkPassword);
}

// Enter key on any digit
document.querySelectorAll('.pin-digit').forEach(digit => {
  digit.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      checkPassword();
    }
  });
});

// Restrict to numbers only
document.querySelectorAll('.pin-digit').forEach(digit => {
  digit.addEventListener('input', (e) => {
    digit.value = digit.value.replace(/[^0-9]/g, '');
  });
});

// Make sure main app is hidden initially
mainApp.style.opacity = "0";
mainApp.style.visibility = "hidden";
  
// ========== FLOATING HEARTS ANIMATION ==========
let heartsCanvas, ctx, heartsArray = [], animationId;
let animationRunning = false;

function initFloatingHearts() {
  // Stop previous animation if running
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
  
  heartsCanvas = document.getElementById('hearts-canvas');
  if (!heartsCanvas) return;
  
  ctx = heartsCanvas.getContext('2d');
  
  function resizeCanvas() {
    heartsCanvas.width = window.innerWidth;
    heartsCanvas.height = window.innerHeight;
  }
  
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  
  class Heart {
    constructor() {
      this.x = Math.random() * heartsCanvas.width;
      this.y = heartsCanvas.height + 10;
      this.size = Math.random() * 25 + 15; // Slightly larger hearts
      this.speedY = Math.random() * 0.8 + 0.3; // SLOWER: reduced from 1.8 to 0.8
      this.opacity = Math.random() * 0.5 + 0.2; // More subtle opacity
      this.angle = Math.random() * Math.PI * 2;
      this.wobble = Math.random() * 0.01; // SLOWER: reduced wobble
    }
    update() {
      this.y -= this.speedY;
      this.x += Math.sin(this.angle) * 0.3; // Less horizontal movement
      this.angle += this.wobble;
      if (this.y + this.size < 0) {
        this.y = heartsCanvas.height + 30;
        this.x = Math.random() * heartsCanvas.width;
      }
    }
    draw() {
      if(!ctx) return;
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.font = `${this.size}px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji"`;
      ctx.fillStyle = `rgba(255, 100, 140, ${this.opacity + 0.1})`;
      ctx.fillText("💗", this.x, this.y);
      ctx.restore();
    }
  }
  
  // REDUCED: from 45 hearts to 20 hearts
  heartsArray = [];
  for (let i = 0; i < 20; i++) {
    heartsArray.push(new Heart());
  }
  
  function animateHearts() {
    if (!heartsCanvas || !ctx) return;
    ctx.clearRect(0, 0, heartsCanvas.width, heartsCanvas.height);
    for (let h of heartsArray) {
      h.update();
      h.draw();
    }
    animationId = requestAnimationFrame(animateHearts);
  }
  
  animateHearts();
  animationRunning = true;
}

// Optional: Function to stop hearts animation (if needed)
function stopFloatingHearts() {
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
    animationRunning = false;
  }
  if (heartsCanvas && ctx) {
    ctx.clearRect(0, 0, heartsCanvas.width, heartsCanvas.height);
  }
}

// Optional: Function to restart hearts with different density
function restartFloatingHearts(count = 20) {
  stopFloatingHearts();
  heartsArray = [];
  for (let i = 0; i < count; i++) {
    heartsArray.push(new Heart());
  }
  animateHearts();
}
  
  // ========== NAVIGATION WITH SMOOTH ==========
  window.navigateTo = function(nextId) {
    let current = document.querySelector('.section.active');
    let nextSection = document.getElementById(nextId);
    if(current) current.classList.remove('active');
    nextSection.classList.add('active');
  };
  
  // ========== SCRATCH CARD EFFECT (real scratch simulation) ==========
  const scratchModal = document.getElementById('scratchModal');
  const showScratchBtn = document.getElementById('showScratchBtn');
  const closeScratchBtn = document.getElementById('closeScratchBtn');
  let scratchCanvas = null, scratchCtx = null, isDrawing = false;
  
  function setupScratch() {
    scratchCanvas = document.getElementById('scratchCanvas');
    if (!scratchCanvas) return;
    scratchCtx = scratchCanvas.getContext('2d');
    const container = document.getElementById('scratchContainer');
    const rect = container.getBoundingClientRect();
    scratchCanvas.width = 300;
    scratchCanvas.height = 300;
    // draw scratch cover (gray metallic)
    scratchCtx.fillStyle = '#b0a07c';
    scratchCtx.fillRect(0, 0, scratchCanvas.width, scratchCanvas.height);
    scratchCtx.fillStyle = '#d9c8a9';
    for(let i=0; i<150; i++) {
      scratchCtx.fillRect(Math.random()*300, Math.random()*300, 2, 2);
    }
    scratchCtx.fillStyle = '#a58e6f';
    scratchCtx.font = "bold 24px 'Poppins'";
    scratchCtx.fillText("✨", 130, 160);
    scratchCtx.fillStyle = "white";
    scratchCtx.font = "12px Poppins";
    scratchCtx.fillText("scratch me", 110, 280);
  }
  
  function getMousePos(e) {
    const rect = scratchCanvas.getBoundingClientRect();
    const scaleX = scratchCanvas.width / rect.width;
    const scaleY = scratchCanvas.height / rect.height;
    let clientX, clientY;
    if(e.touches) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    let x = (clientX - rect.left) * scaleX;
    let y = (clientY - rect.top) * scaleY;
    return { x, y };
  }
  
  function scratch(e) {
    if (!scratchCtx) return;
    e.preventDefault();
    const pos = getMousePos(e);
    scratchCtx.globalCompositeOperation = 'destination-out';
    scratchCtx.beginPath();
    scratchCtx.arc(pos.x, pos.y, 18, 0, Math.PI*2);
    scratchCtx.fill();
    scratchCtx.globalCompositeOperation = 'source-over';
  }
  
  function startScratch(e) { isDrawing = true; scratch(e); }
  function endScratch() { isDrawing = false; }
  function onScratchMove(e) { if(isDrawing) scratch(e); }
  
  if(showScratchBtn) {
    showScratchBtn.addEventListener('click', () => {
      scratchModal.style.display = 'flex';
      setupScratch();
      // attach events
      scratchCanvas.addEventListener('mousedown', startScratch);
      window.addEventListener('mousemove', onScratchMove);
      window.addEventListener('mouseup', endScratch);
      scratchCanvas.addEventListener('touchstart', startScratch);
      window.addEventListener('touchmove', onScratchMove);
      window.addEventListener('touchend', endScratch);
    });
  }
  if(closeScratchBtn) {
    closeScratchBtn.addEventListener('click', () => {
      scratchModal.style.display = 'none';
      if(scratchCanvas) {
        scratchCanvas.removeEventListener('mousedown', startScratch);
        window.removeEventListener('mousemove', onScratchMove);
        window.removeEventListener('mouseup', endScratch);
      }
    });
  }
  
 
  
  // manual fallback
  window.surprise = function() { alert("I love you forever and always 💗 Happy 4th Anniversary 💕"); };
  
  // init floating hearts only after unlock? but call inside unlock but also safety
  window.initFloatingHearts = initFloatingHearts;
  
  // ensure if mainapp visible, hearts appear
  setTimeout(() => {
    if(mainApp.style.visibility === "visible") initFloatingHearts();
  }, 500);
  
  // make sure that if someone clicks final surprise
  document.querySelectorAll('.btn-love').forEach(btn => {
    if(btn.innerText.includes('Click Me')) {
      btn.onclick = () => alert("I love you forever and always 💗 Happy 4th Anniversary 💕");
    }
  });




    // Countdown - Time since June 8, 2022 (your anniversary)
// Advanced Countdown - Time since June 8, 2022
function updateCountdown() {
  const startDate = new Date("June 8, 2022 00:00:00").getTime();
  
  function animateNumber(element, newValue) {
    const currentValue = parseInt(element.innerText) || 0;
    if (currentValue === newValue) return;
    
    let start = currentValue;
    let end = newValue;
    let duration = 300;
    let startTime = null;
    
    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }
    
    function update(currentTime) {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / duration);
      const eased = easeOutCubic(progress);
      const value = Math.floor(start + (end - start) * eased);
      element.innerText = value;
      
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    
    requestAnimationFrame(update);
  }
  
  const interval = setInterval(() => {
    const now = new Date().getTime();
    const diff = now - startDate;
    
    if (diff < 0) {
      document.querySelector('.countdown-card').innerHTML = '<div style="padding:20px;">✨ The journey begins soon! ✨</div>';
      return;
    }
    
    // Calculate all time units
    const millisecondsPerYear = 1000 * 60 * 60 * 24 * 365.25;
    const years = Math.floor(diff / millisecondsPerYear);
    const remainingAfterYears = diff % millisecondsPerYear;
    
    const days = Math.floor(remainingAfterYears / (1000 * 60 * 60 * 24));
    const remainingAfterDays = remainingAfterYears % (1000 * 60 * 60 * 24);
    
    const hours = Math.floor(remainingAfterDays / (1000 * 60 * 60));
    const remainingAfterHours = remainingAfterDays % (1000 * 60 * 60);
    
    const minutes = Math.floor(remainingAfterHours / (1000 * 60));
    const seconds = Math.floor((remainingAfterHours % (1000 * 60)) / 1000);
    
    // Animate each number
    animateNumber(document.getElementById('years'), years);
    animateNumber(document.getElementById('days'), days);
    animateNumber(document.getElementById('hours'), hours);
    animateNumber(document.getElementById('minutes'), minutes);
    animateNumber(document.getElementById('seconds'), seconds);
    
    // Add celebration effect when seconds change
    const secondsElement = document.getElementById('seconds');
    secondsElement.style.transform = 'scale(1.1)';
    setTimeout(() => {
      secondsElement.style.transform = 'scale(1)';
    }, 100);
    
  }, 1000);
}

// Initialize countdown when page loads
document.addEventListener('DOMContentLoaded', () => {
  updateCountdown();
});
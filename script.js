const audio = document.getElementById("songPlayer");
const intro = document.getElementById("intro");
const enterBtn = document.getElementById("enterBtn");
const soundNote = document.getElementById("soundNote");
const musicToggle = document.getElementById("musicToggle");
const musicLabel = document.getElementById("musicLabel");
const playSongBtn = document.getElementById("playSongBtn");
const progressBar = document.getElementById("progressBar");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");
const beginBtn = document.getElementById("beginBtn");
const messageReveal = document.getElementById("messageReveal");
const messageStars = [...document.querySelectorAll(".message-star")];
const wishBtn = document.getElementById("wishBtn");
const wishResult = document.getElementById("wishResult");

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
}
function updatePlayUI() {
  const playing = !audio.paused;
  musicLabel.textContent = playing ? "Pausar canción" : "Nuestra canción";
  playSongBtn.innerHTML = `${playing ? "❚❚" : "▶"} <span>${playing ? "Pausar canción" : "Reproducir nuestra canción"}</span>`;
}
async function startMusic() {
  try {
    audio.volume = 0.78;
    await audio.play();
    soundNote.textContent = "♫ Nuestra canción está sonando";
    updatePlayUI();
  } catch (err) {
    soundNote.textContent = "Toca «Entrar» para comenzar la música ♫";
  }
}
function enterUniverse() {
  document.body.classList.add("entered");
  startMusic();
  intro.classList.add("hidden");
}
enterBtn.addEventListener("click", enterUniverse);
musicToggle.addEventListener("click", async () => {
  if (audio.paused) await startMusic();
  else audio.pause();
  updatePlayUI();
});
playSongBtn.addEventListener("click", async () => {
  if (audio.paused) await startMusic();
  else audio.pause();
  updatePlayUI();
});
audio.addEventListener("play", updatePlayUI);
audio.addEventListener("pause", updatePlayUI);
audio.addEventListener("timeupdate", () => {
  if (Number.isFinite(audio.duration) && audio.duration > 0) {
    progressBar.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
    currentTimeEl.textContent = formatTime(audio.currentTime);
  }
});
audio.addEventListener("loadedmetadata", () => {
  durationEl.textContent = formatTime(audio.duration);
});
audio.addEventListener("error", () => {
  soundNote.textContent = "No se pudo cargar el audio. Revisa assets/musica/nuestra-cancion.mp3";
});
// Attempt autoplay on arrival. Browsers often block sound until the visitor interacts;
// the Enter button is the reliable fallback and starts the song immediately.
window.addEventListener("load", () => {
  startMusic();
});

beginBtn?.addEventListener("click", () => {
  document.getElementById("historia").scrollIntoView({behavior:"smooth"});
});
messageStars.forEach(button => {
  button.addEventListener("click", () => {
    messageStars.forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    messageReveal.textContent = button.dataset.message;
  });
});
wishBtn?.addEventListener("click", () => {
  wishResult.textContent = "Mi deseo es que sigamos encontrando motivos para sonreír juntos. ✨";
  wishBtn.textContent = "Deseo guardado en nuestro universo ♡";
  wishBtn.disabled = true;
  createSparkles();
});
function createSparkles() {
  for (let i=0; i<22; i++) {
    const sparkle = document.createElement("span");
    sparkle.textContent = Math.random() > .5 ? "✦" : "✧";
    sparkle.style.cssText = `position:fixed;left:${8+Math.random()*84}%;top:${22+Math.random()*58}%;z-index:10;pointer-events:none;color:#d7d1ff;font-size:${12+Math.random()*18}px;text-shadow:0 0 14px #a6c5ff;transition:transform 1.8s ease,opacity 1.8s ease`;
    document.body.appendChild(sparkle);
    requestAnimationFrame(() => { sparkle.style.transform=`translateY(-${45+Math.random()*100}px) rotate(${Math.random()*100}deg)`; sparkle.style.opacity="0"; });
    window.setTimeout(() => sparkle.remove(), 1900);
  }
}
// Star particles for the cosmic background.
const canvas = document.getElementById("starCanvas");
const ctx = canvas.getContext("2d");
let stars = [];
let width = 0, height = 0, dpr = 1;
function resizeCanvas() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth; height = window.innerHeight;
  canvas.width = width*dpr; canvas.height = height*dpr;
  ctx.setTransform(dpr,0,0,dpr,0,0);
  const count = Math.min(220, Math.floor(width*height/5000));
  stars = Array.from({length:count},()=>({x:Math.random()*width,y:Math.random()*height,r:.35+Math.random()*1.3,a:.2+Math.random()*.75,s:.08+Math.random()*.28,h:Math.random()>.8?195+Math.random()*55:245+Math.random()*35}));
}
function drawStars() {
  ctx.clearRect(0,0,width,height);
  for (const star of stars) {
    star.y -= star.s;
    if(star.y < -3){star.y=height+3;star.x=Math.random()*width;}
    const alpha=star.a*(.7+.3*Math.sin(Date.now()/900+star.x));
    ctx.beginPath();ctx.arc(star.x,star.y,star.r,0,Math.PI*2);
    ctx.fillStyle=`hsla(${star.h},90%,85%,${alpha})`;ctx.shadowBlur=star.r>1?8:0;ctx.shadowColor="#a9c9ff";ctx.fill();
  }
  ctx.shadowBlur=0;
  requestAnimationFrame(drawStars);
}
window.addEventListener("resize",resizeCanvas);
resizeCanvas();drawStars();

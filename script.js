document.addEventListener("DOMContentLoaded", () => {
  // 1. Carregar Configurações de Aparência Dinamicamente
  applyConfig();

  // 2. Elementos de Áudio e Player
  const bgVideo = document.getElementById("bg-video");
  const useVideoAudio = (CONFIG.appearance.backgroundType === "video" && bgVideo);
  
  let audio;
  if (useVideoAudio) {
    audio = bgVideo;
    audio.muted = true; // Começa muted por restrições do navegador
  } else {
    audio = new Audio(CONFIG.music.url);
  }
  
  audio.loop = true;
  audio.volume = 0.5; // volume inicial 50%

  const playPauseBtn = document.getElementById("play-pause-btn");
  const playIcon = playPauseBtn.querySelector("i");
  const volumeSlider = document.getElementById("volume-slider");
  const volumeIcon = document.getElementById("volume-icon");

  let isPlaying = false;

  // Função para alternar play/pause da música
  function togglePlay() {
    if (isPlaying) {
      audio.pause();
      playIcon.className = "fas fa-play";
      isPlaying = false;
    } else {
      if (useVideoAudio) {
        audio.muted = false; // Desmuta ao dar play pelo gesto do usuário
      }
      audio.play().then(() => {
        playIcon.className = "fas fa-pause";
        isPlaying = true;
      }).catch(err => console.log("Erro ao iniciar áudio: ", err));
    }
  }

  playPauseBtn.addEventListener("click", togglePlay);

  // Controle de Volume
  volumeSlider.addEventListener("input", (e) => {
    const val = e.target.value;
    audio.volume = val / 100;
    updateVolumeIcon(val);
  });

  function updateVolumeIcon(val) {
    if (val == 0) {
      volumeIcon.className = "fas fa-volume-mute";
    } else if (val < 50) {
      volumeIcon.className = "fas fa-volume-down";
    } else {
      volumeIcon.className = "fas fa-volume-up";
    }
  }

  // Mutar ao clicar no ícone do volume
  let preMuteVolume = 50;
  volumeIcon.addEventListener("click", () => {
    if (audio.volume > 0) {
      preMuteVolume = volumeSlider.value;
      audio.volume = 0;
      volumeSlider.value = 0;
      volumeIcon.className = "fas fa-volume-mute";
    } else {
      audio.volume = preMuteVolume / 100;
      volumeSlider.value = preMuteVolume;
      updateVolumeIcon(preMuteVolume);
    }
  });

  // 3. Efeito de Entrada (Enter Overlay)
  const enterOverlay = document.getElementById("enter-overlay");
  const contentWrapper = document.getElementById("content-wrapper");
  const visibilityToggle = document.getElementById("visibility-toggle");

  enterOverlay.addEventListener("click", () => {
    // Fade out overlay
    enterOverlay.classList.add("fade-out");
    
    // Fade in content
    contentWrapper.classList.add("fade-in");

    // Mostrar botão de ocultar painel
    if (visibilityToggle) {
      visibilityToggle.classList.add("visible");
    }
    
    // Iniciar áudio (e consequentemente o vídeo, se configurado)
    togglePlay();
    
    // Iniciar efeito de digitação após entrar
    startTypewriter();
  });

  // Botão Ocultar/Mostrar Painel (Eye Toggle)
  if (visibilityToggle && contentWrapper) {
    visibilityToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const isHidden = contentWrapper.classList.toggle("card-hidden");
      
      const eyeIcon = visibilityToggle.querySelector("i");
      if (isHidden) {
        eyeIcon.className = "fas fa-eye-slash";
        visibilityToggle.title = "Mostrar Painel";
        visibilityToggle.classList.add("panel-hidden");
      } else {
        eyeIcon.className = "fas fa-eye";
        visibilityToggle.title = "Ocultar Painel";
        visibilityToggle.classList.remove("panel-hidden");
      }
    });
  }

  // 4. Efeito de Digitação (Bio Lines)
  let lineIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const bioTextSpan = document.getElementById("bio-text");

  function startTypewriter() {
    const currentLine = CONFIG.bioLines[lineIndex];
    
    if (isDeleting) {
      // Apagando caracteres
      bioTextSpan.textContent = currentLine.substring(0, charIndex - 1);
      charIndex--;
    } else {
      // Escrevendo caracteres
      bioTextSpan.textContent = currentLine.substring(0, charIndex + 1);
      charIndex++;
    }

    let typingSpeed = isDeleting ? 40 : 80;

    // Se terminou de escrever a frase inteira
    if (!isDeleting && charIndex === currentLine.length) {
      typingSpeed = 2000; // Tempo de pausa no final da frase
      isDeleting = true;
    } 
    // Se terminou de apagar a frase
    else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      lineIndex = (lineIndex + 1) % CONFIG.bioLines.length; // Passa para a próxima frase
      typingSpeed = 500; // Pequeno delay antes de iniciar a próxima
    }

    setTimeout(startTypewriter, typingSpeed);
  }

  // 5. Canvas de Partículas (Estrelas / Neve)
  const canvas = document.getElementById("particle-canvas");
  const ctx = canvas.getContext("2d");

  let particles = [];
  const particleCount = CONFIG.appearance.particlesEffect === "stars" ? 100 : (CONFIG.appearance.particlesEffect === "snow" ? 60 : 0);

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 1.5 + 0.5;
      
      // Velocidade do efeito
      if (CONFIG.appearance.particlesEffect === "stars") {
        this.speedX = (Math.random() - 0.5) * 0.2;
        this.speedY = (Math.random() - 0.5) * 0.2;
      } else { // snow
        this.speedX = (Math.random() - 0.2) * 0.3;
        this.speedY = Math.random() * 0.8 + 0.3;
      }
      
      this.opacity = Math.random() * 0.8 + 0.2;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Resetar partícula se sair da tela
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
        if (CONFIG.appearance.particlesEffect === "snow") {
          // Neve reaparece sempre no topo
          this.y = 0;
          this.x = Math.random() * canvas.width;
        } else {
          this.reset();
        }
      }
    }

    draw() {
      ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Inicializar partículas
  if (particleCount > 0) {
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (particleCount > 0) {
      particles.forEach(p => {
        p.update();
        p.draw();
      });
    }
    
    requestAnimationFrame(animate);
  }

  if (particleCount > 0) {
    animate();
  }

  // 6. Aplicar as Configurações Dinâmicas do config.js
  function applyConfig() {
    // Configurar Título da Aba
    document.title = CONFIG.pageTitle;

    // Configurar Variáveis CSS de Cores Acordes com CONFIG
    document.documentElement.style.setProperty("--accent-color", CONFIG.appearance.accentColor);
    document.documentElement.style.setProperty("--accent-glow", CONFIG.appearance.glowColor);

    // Definir Cursor customizado
    if (CONFIG.appearance.cursor) {
      document.body.style.cursor = CONFIG.appearance.cursor;
    }

    // Configurar Fundo (Vídeo ou Imagem)
    const bgContainer = document.getElementById("bg-container");
    const bgVideo = document.getElementById("bg-video");
    const bgImage = document.getElementById("bg-image");
    
    if (CONFIG.appearance.backgroundBrightness !== undefined) {
      bgContainer.style.filter = `brightness(${CONFIG.appearance.backgroundBrightness}) contrast(1.15)`;
    }
    
    if (CONFIG.appearance.backgroundType === "video") {
      bgVideo.src = CONFIG.appearance.backgroundUrl;
      bgVideo.style.display = "block";
      bgImage.style.display = "none";
      
      // Tenta iniciar o autoplay silencioso do vídeo de fundo
      bgVideo.play().catch(err => console.log("Vídeo de fundo autoplay bloqueado:", err));
    } else {
      bgImage.style.backgroundImage = `url('${CONFIG.appearance.backgroundUrl}')`;
      bgImage.style.display = "block";
      bgVideo.style.display = "none";
    }

    // Configurar Avatar
    const avatarImg = document.getElementById("avatar-img");
    if (CONFIG.appearance.avatarUrl) {
      avatarImg.src = CONFIG.appearance.avatarUrl;
    }

    // Configurar Nome do Usuário
    const usernameSpan = document.getElementById("username-text");
    usernameSpan.textContent = CONFIG.username;

    // Configurar Tagline
    const taglineDiv = document.getElementById("tagline-text");
    taglineDiv.textContent = CONFIG.tagline;

    // Renderizar Badges
    const badgesContainer = document.getElementById("badges-container");
    badgesContainer.innerHTML = ""; // Limpar padrão
    CONFIG.badges.forEach(badge => {
      const badgeDiv = document.createElement("div");
      badgeDiv.className = "badge";
      badgeDiv.innerHTML = `<i class="${badge.icon}" style="color: ${badge.color || 'var(--text-primary)'}"></i> ${badge.text}`;
      badgesContainer.appendChild(badgeDiv);
    });

    // Renderizar Botões Sociais
    const socialsContainer = document.getElementById("socials-container");
    socialsContainer.innerHTML = ""; // Limpar padrão
    CONFIG.socials.forEach(social => {
      const a = document.createElement("a");
      a.href = social.url;
      a.target = "_blank";
      a.className = "social-button";
      a.innerHTML = `
        <div class="social-button-left">
          <i class="${social.icon}" style="color: ${social.color}"></i>
          <span>${social.name}</span>
        </div>
        <i class="fas fa-chevron-right arrow-icon"></i>
      `;
      socialsContainer.appendChild(a);
    });

    // Configurar Informações da Faixa de Música
    document.getElementById("track-title").textContent = CONFIG.music.title;
    document.getElementById("track-artist").textContent = CONFIG.music.artist;

    // Contador de visualizações aleatório/simulado realístico
    const viewsSpan = document.getElementById("views-count");
    const uidSpan = document.getElementById("uid-text");
    
    // Gera um número realista de visualizações
    const randomViews = Math.floor(Math.random() * 5000) + 1243;
    viewsSpan.textContent = randomViews.toLocaleString();

    // Gera um UID aleatório para o clone
    const randomUID = Math.floor(Math.random() * 90000) + 10000;
    uidSpan.textContent = `uid: #${randomUID}`;
  }
});

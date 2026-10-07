document.addEventListener("DOMContentLoaded", () => {
  const { site, profile, expertise, services, socials, appearance } = CONFIG;

  document.title = site.title;
  document.querySelector('meta[name="description"]').content = site.description;
  document.documentElement.style.setProperty("--accent", appearance.accentColor);

  const codeCanvas = document.getElementById("code-background");
  const codeContext = codeCanvas.getContext("2d");
  const codeSnippets = [
    ["RegisterNetEvent('player:ready')", "AddEventHandler('player:ready', function()", "  local player = source", "end)"],
    ["CreateThread(function()", "  while true do", "    Wait(0)", "    UpdatePlayerState()", "  end", "end)"],
    ["local function createResource()", "  local ped = PlayerPedId()", "  if DoesEntityExist(ped) then", "    SetEntityVisible(ped, true)", "  end", "end"],
    ["ESX.RegisterServerCallback(", "  'garage:getVehicles',", "  function(source, callback)", "    callback(vehicles)", "  end", ")"],
    ["local Config = {}", "Config.Framework = 'standalone'", "Config.Debug = false", "return Config"],
    ["exports('getPlayerData', function()", "  return PlayerData", "end)"],
    ["if IsPauseMenuActive() then", "  DisableControlAction(0, 1, true)", "end"],
    ["TriggerServerEvent(", "  'inventory:requestItems'", ")"]
  ];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let codeStreams = [];
  let codeFrame = 0;
  let previousFrameTime = 0;

  function resizeCodeCanvas() {
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
    const width = window.innerWidth;
    const height = window.innerHeight;
    codeCanvas.width = Math.round(width * pixelRatio);
    codeCanvas.height = Math.round(height * pixelRatio);
    codeContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    const columnWidth = width < 600 ? 220 : 260;
    const streamCount = Math.ceil(width / columnWidth) + 1;

    codeStreams = Array.from({ length: streamCount }, (_, index) => {
      const snippet = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
      return {
        x: index * columnWidth + Math.random() * 70,
        y: Math.random() * height - snippet.length * 18,
        speed: 7 + Math.random() * 9,
        opacity: 0.18 + Math.random() * 0.16,
        snippet
      };
    });
    drawCodeBackground();
  }

  function drawCodeBackground(deltaSeconds = 0) {
    const width = window.innerWidth;
    const height = window.innerHeight;
    codeContext.clearRect(0, 0, width, height);
    codeContext.font = '12px "JetBrains Mono", monospace';
    codeContext.textBaseline = "top";

    codeStreams.forEach((stream) => {
      stream.y += stream.speed * deltaSeconds;
      codeContext.fillStyle = `rgba(103, 212, 192, ${stream.opacity})`;
      stream.snippet.forEach((line, lineIndex) => {
        codeContext.fillText(line, stream.x, stream.y + lineIndex * 18, 235);
      });
      if (stream.y > height + stream.snippet.length * 18) {
        stream.snippet = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
        stream.y = -stream.snippet.length * 18 - Math.random() * height * 0.35;
        stream.x = Math.min(width - 240, Math.max(0, stream.x + (Math.random() - 0.5) * 80));
      }
    });
  }

  function animateCodeBackground(timestamp) {
    if (document.hidden || reduceMotion.matches) {
      codeFrame = 0;
      previousFrameTime = 0;
      return;
    }
    const deltaSeconds = previousFrameTime
      ? Math.min((timestamp - previousFrameTime) / 1000, 0.05)
      : 0;
    previousFrameTime = timestamp;
    drawCodeBackground(deltaSeconds);
    codeFrame = window.requestAnimationFrame(animateCodeBackground);
  }

  function startCodeAnimation() {
    if (!reduceMotion.matches && !document.hidden && !codeFrame) {
      codeFrame = window.requestAnimationFrame(animateCodeBackground);
    } else if (reduceMotion.matches) {
      drawCodeBackground();
    }
  }

  window.addEventListener("resize", resizeCodeCanvas);
  document.addEventListener("visibilitychange", startCodeAnimation);
  reduceMotion.addEventListener("change", startCodeAnimation);
  resizeCodeCanvas();
  startCodeAnimation();

  document.getElementById("brand-name").textContent = `${profile.name}.`;
  document.getElementById("hero-name").textContent = profile.name;
  document.getElementById("panel-name").textContent = profile.name;
  document.getElementById("footer-name").textContent = `${profile.name}.`;
  document.getElementById("profile-status").textContent = profile.status;
  document.getElementById("profile-summary").textContent = profile.summary;
  document.getElementById("profile-tagline").textContent = profile.role;
  document.getElementById("avatar-img").src = profile.avatarUrl;
  document.getElementById("avatar-img").alt = `Foto de perfil de ${profile.name}`;
  document.getElementById("current-year").textContent = new Date().getFullYear();
  const discordProfileUrl = socials.find((social) => social.name.includes("Discord"))?.url;
  if (discordProfileUrl) {
    document.getElementById("header-discord-link").href = discordProfileUrl;
    document.getElementById("hero-discord-link").href = discordProfileUrl;
  }

  const expertiseList = document.getElementById("expertise-list");
  expertise.forEach((item) => {
    const tag = document.createElement("span");
    tag.className = "expertise-item";
    tag.textContent = item;
    expertiseList.appendChild(tag);
  });

  const servicesList = document.getElementById("services-list");
  services.forEach((service) => {
    const card = document.createElement("article");
    card.className = "service-card";

    const icon = document.createElement("span");
    icon.className = "service-icon";
    icon.setAttribute("aria-hidden", "true");
    const iconElement = document.createElement("i");
    iconElement.className = service.icon;
    icon.appendChild(iconElement);

    const content = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = service.title;
    const description = document.createElement("p");
    description.textContent = service.description;
    content.append(title, description);
    card.append(icon, content);
    servicesList.appendChild(card);
  });

  const socialsContainer = document.getElementById("socials-container");
  socials.forEach((social) => {
    const link = document.createElement("a");
    link.className = "social-button";
    link.href = social.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    const label = document.createElement("span");
    label.className = "social-button-left";
    const icon = document.createElement("i");
    icon.className = social.icon;
    icon.setAttribute("aria-hidden", "true");
    const name = document.createElement("span");
    name.textContent = social.name;
    label.append(icon, name);

    const arrow = document.createElement("i");
    arrow.className = "fa-solid fa-arrow-up-right-from-square arrow-icon";
    arrow.setAttribute("aria-hidden", "true");
    link.append(label, arrow);
    socialsContainer.appendChild(link);
  });

  const copyIdButton = document.getElementById("copy-discord-id");
  const statusMessage = document.getElementById("interaction-status");
  copyIdButton.addEventListener("click", async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(profile.discordUserId);
      } else {
        const temporaryInput = document.createElement("textarea");
        temporaryInput.value = profile.discordUserId;
        temporaryInput.setAttribute("readonly", "");
        temporaryInput.style.position = "fixed";
        temporaryInput.style.opacity = "0";
        document.body.appendChild(temporaryInput);
        temporaryInput.select();
        const copied = document.execCommand("copy");
        temporaryInput.remove();
        if (!copied) throw new Error("O navegador não permitiu a cópia.");
      }
      statusMessage.textContent = "ID do Discord copiado.";
      copyIdButton.querySelector("span").textContent = "ID copiado";
      copyIdButton.querySelector("i").className = "fa-solid fa-check";
      window.setTimeout(() => {
        copyIdButton.querySelector("span").textContent = "Copiar ID do Discord";
        copyIdButton.querySelector("i").className = "fa-regular fa-copy";
        statusMessage.textContent = "";
      }, 2200);
    } catch (error) {
      statusMessage.textContent = `Não foi possível copiar automaticamente. Seu ID: ${profile.discordUserId}`;
      console.warn("Não foi possível copiar o ID do Discord.", error);
      window.setTimeout(() => {
        statusMessage.textContent = "";
      }, 5000);
    }
  });

  const revealElements = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    document.body.classList.add("js-ready");
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealElements.forEach((element) => revealObserver.observe(element));

    const navLinks = [...document.querySelectorAll(".main-nav a")];
    const navSections = navLinks
      .map((link) => document.querySelector(link.getAttribute("href")))
      .filter(Boolean);

    function updateActiveNavigation() {
      const activeSection = navSections.reduce((active, section) => {
        return section.getBoundingClientRect().top <= window.innerHeight * 0.4
          ? section
          : active;
      }, null);
      navLinks.forEach((link) => {
        if (activeSection && link.hash === `#${activeSection.id}`) {
          link.setAttribute("aria-current", "location");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    }

    updateActiveNavigation();
    window.addEventListener("scroll", updateActiveNavigation, { passive: true });

    const scrollProgress = document.getElementById("scroll-progress");
    let progressFrame = 0;
    window.addEventListener("scroll", () => {
      if (progressFrame) return;
      progressFrame = window.requestAnimationFrame(() => {
        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
        scrollProgress.style.transform = `scaleX(${progress})`;
        progressFrame = 0;
      });
    }, { passive: true });
  }
});

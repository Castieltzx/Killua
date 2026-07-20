// Configuração do site
const CONFIG = {
  // Título da aba do navegador
  pageTitle: "Killua",

  // Nome de usuário principal
  username: "Killua",

  // Subtítulo ou tags abaixo do nome
  tagline: "Desenvolvedor .Lua",

  // Descrição/Biografia (efeito de digitação)
  // Cada item da lista é digitado consecutivamente
  bioLines: [
    "Bem Vindo Seus Noia",
    "discord.gg/strikepvp",
    "twitch.tv/castieltzx",
    "Fissurado Em Code"
  ],

  // Badges (Medalhas de destaque)
  // Suporta ícones do FontAwesome (ex: "fab fa-discord", "fas fa-check-circle")
  badges: [
    { icon: "fas fa-check-circle", text: "Tudo 3", color: "#1DA1F2" },
    { icon: "fab fa-discord", text: "Discord Member", color: "#5865F2" },
    { icon: "fab fa-twitch", text: "Twitch Streamer", color: "#9146FF" },
    { icon: "fas fa-bolt", text: "Developer", color: "#FFD700" }
  ],

  // Links sociais
  socials: [
    {
      name: "Discord",
      url: "https://discord.gg/strikepvp",
      icon: "fab fa-discord",
      color: "#5865F2"
    },
    {
      name: "Twitch",
      url: "https://www.twitch.tv/castieltzx",
      icon: "fab fa-twitch",
      color: "#9146FF"
    }
  ],

  music: {
    title: "Áudio Original",
    artist: "@_santossss6",
    url: "assets/music.mp3"
  },

  // Customizações visuais
  appearance: {
    // Tipo de fundo: "video" ou "image" (GIFs são considerados "image")
    backgroundType: "video",
    
    backgroundUrl: "assets/background.mp4",
    
    // Brilho do fundo (0.0 a 1.0)
    backgroundBrightness: 0.75,
    
    // URL do Avatar do perfil (imagem de perfil)
    avatarUrl: "https://i.pinimg.com/736x/b1/bb/c3/b1bbc3836dbec66c5a315bce061d108f.jpg", // Avatar gerado automaticamente com visual cyberpunk/pixelado
    
    // Estilo do cursor ("crosshair", "pointer", "default", ou uma URL de imagem .png/.cur)
    cursor: "crosshair",
    
    // Cores principais
    accentColor: "#9146FF", // Roxo (combina com Twitch/Discord)
    glowColor: "rgba(145, 70, 255, 0.6)",
    
    // Efeito de fundo ("snow", "stars", "none")
    particlesEffect: "stars"
  }
};

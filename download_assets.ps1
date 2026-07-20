# PowerShell script to download TikTok background video and MP3 music
$ErrorActionPreference = "Stop"

try {
    $assetsDir = "C:\Users\Castiel\.gemini\antigravity\scratch\guns-lol-clone\assets"
    if (!(Test-Path $assetsDir)) {
        New-Item -ItemType Directory -Force -Path $assetsDir | Out-Null
    }

    # 1. Baixar Vídeo do TikTok
    Write-Host "Buscando link do video do TikTok..."
    $tiktokUrl = "https://www.tiktok.com/@_santossss6/video/7520744770277297464?q=maio%20de%202006&t=1784526337198"
    $escapedUrl = [Uri]::EscapeDataString($tiktokUrl)
    $apiUrl = "https://tikwm.com/api/?url=" + $escapedUrl

    # Configurar Tls12 para conexões seguras
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

    $response = Invoke-RestMethod -Uri $apiUrl -UserAgent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    
    if ($response.code -eq 0) {
        $videoUrl = $response.data.play
        $videoPath = Join-Path $assetsDir "background.mp4"
        Write-Host "Link obtido! Baixando video sem marca d'agua para $videoPath..."
        Invoke-WebRequest -Uri $videoUrl -OutFile $videoPath -UserAgent "Mozilla/5.0"
        Write-Host "Video do TikTok baixado com sucesso!"
    } else {
        Write-Warning "Erro retornado pela API tikwm: $($response.msg)"
    }
} catch {
    Write-Warning "Falha no download do video: $_"
}

try {
    # 2. Baixar Música de Fundo
    $musicUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    $musicPath = Join-Path $assetsDir "music.mp3"
    Write-Host "Baixando musica de fundo para $musicPath..."
    Invoke-WebRequest -Uri $musicUrl -OutFile $musicPath -UserAgent "Mozilla/5.0"
    Write-Host "Musica baixada com sucesso!"
} catch {
    Write-Warning "Falha no download da musica: $_"
}

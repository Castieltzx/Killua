import urllib.request
import json
import os

def download_assets():
    print("Iniciando download dos assets...")
    
    # Criar pasta de assets se não existir
    assets_dir = r"C:\Users\Castiel\.gemini\antigravity\scratch\guns-lol-clone\assets"
    os.makedirs(assets_dir, exist_ok=True)
    
    # 1. Download do Vídeo do TikTok (Sem marca d'água)
    tiktok_url = "https://www.tiktok.com/@_santossss6/video/7520744770277297464?q=maio%20de%202006&t=1784526337198"
    api_url = f"https://tikwm.com/api/?url={tiktok_url}"
    video_path = os.path.join(assets_dir, "background.mp4")
    
    print("Obtendo link do vídeo do TikTok via API tikwm...")
    try:
        req = urllib.request.Request(
            api_url, 
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}
        )
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            
        if data.get("code") == 0:
            video_url = data["data"]["play"]
            print("Link do vídeo obtido com sucesso. Baixando vídeo...")
            
            video_req = urllib.request.Request(video_url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(video_req) as video_response:
                with open(video_path, "wb") as f:
                    f.write(video_response.read())
            print("Vídeo do TikTok baixado com sucesso!")
        else:
            print("Erro da API ao buscar o vídeo:", data.get("msg", "Erro desconhecido"))
    except Exception as e:
        print("Falha ao baixar o vídeo:", str(e))

    # 2. Download da Música de Fundo (MP3)
    music_url = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    music_path = os.path.join(assets_dir, "music.mp3")
    
    print("Baixando música de fundo lo-fi/chill (MP3)...")
    try:
        music_req = urllib.request.Request(music_url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(music_req) as music_response:
            with open(music_path, "wb") as f:
                f.write(music_response.read())
        print("Música baixada com sucesso!")
    except Exception as e:
        print("Falha ao baixar a música:", str(e))

if __name__ == "__main__":
    download_assets()

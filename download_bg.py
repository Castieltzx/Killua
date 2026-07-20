import urllib.request
import json
import os
import sys

def download_tiktok():
    tiktok_url = "https://www.tiktok.com/@_santossss6/video/7520744770277297464?q=maio%20de%202006&t=1784526337198"
    api_url = f"https://tikwm.com/api/?url={tiktok_url}"
    
    print("Enviando requisição para a API tikwm...")
    try:
      req = urllib.request.Request(
          api_url, 
          headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}
      )
      with urllib.request.urlopen(req) as response:
          data = json.loads(response.read().decode())
          
      if data.get("code") == 0:
          video_url = data["data"]["play"]
          print("Sucesso! URL do vídeo obtida:", video_url)
          
          # Garantir que a pasta assets existe
          assets_dir = r"C:\Users\Castiel\.gemini\antigravity\scratch\guns-lol-clone\assets"
          os.makedirs(assets_dir, exist_ok=True)
          
          output_path = os.path.join(assets_dir, "background.mp4")
          
          print("Baixando o vídeo para:", output_path)
          video_req = urllib.request.Request(
              video_url,
              headers={'User-Agent': 'Mozilla/5.0'}
          )
          with urllib.request.urlopen(video_req) as video_response:
              with open(output_path, "wb") as f:
                  f.write(video_response.read())
          print("Download concluído com sucesso!")
          return True
      else:
          print("Erro da API tikwm:", data.get("msg", "Erro desconhecido"))
          return False
    except Exception as e:
      print("Erro ao executar script:", str(e))
      return False

if __name__ == "__main__":
    download_tiktok()

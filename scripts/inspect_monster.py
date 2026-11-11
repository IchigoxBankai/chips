import urllib.request
import re

url = 'https://monster-energy-website.vercel.app/'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as resp:
        html = resp.read().decode('utf-8')
        print('HTML length:', len(html))
        # Look for script assets
        scripts = re.findall(r'src=["\']([^"\']+\.js)["\']', html)
        print('Found scripts:', scripts)
        
        # Check script contents for .glb or .gltf
        for s in scripts:
            s_url = s if s.startswith('http') else url.rstrip('/') + '/' + s.lstrip('/')
            try:
                s_req = urllib.request.Request(s_url, headers={'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(s_req) as s_resp:
                    js = s_resp.read().decode('utf-8', errors='ignore')
                    found_models = re.findall(r'[\w\-\.\/]+\.(?:glb|gltf|hdr|bin)', js, re.I)
                    if found_models:
                        print('Found 3D assets in', s, ':', set(found_models))
                    if 'MeshStandardMaterial' in js or 'MeshPhysicalMaterial' in js:
                        print('Uses Three.js PBR materials in', s)
            except Exception as e:
                pass
except Exception as e:
    print('Failed:', e)


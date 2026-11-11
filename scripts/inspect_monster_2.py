import urllib.request
import re

url = 'https://monster-energy-website.vercel.app/assets/index-BxTeGS0M.js'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as resp:
    js = resp.read().decode('utf-8', errors='ignore')

# Search for GLTFLoader or model paths
m = re.findall(r'["\'`]([^"\'`]*\.(?:glb|gltf|hdr|exr|png|jpg)[^"\'`]*)["\'`]', js)
print('Assets found:', set(m))

if 'GLTFLoader' in js:
    print('Uses GLTFLoader!')
if 'CylinderGeometry' in js:
    print('Uses CylinderGeometry!')

# Search for can or mesh creation
print('\nKey patterns:')
for pat in ['environment', 'hdr', 'metalness', 'roughness', 'clearcoat', 'cylinder']:
    matches = len(re.findall(pat, js, re.I))
    print(f'{pat}: {matches} matches')


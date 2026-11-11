import urllib.request
import re

url = 'https://monster-energy-website.vercel.app/assets/index-BxTeGS0M.js'
with urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})) as resp:
    js = resp.read().decode('utf-8', errors='ignore')

# Search for mouse move or tilt on hero
idx = js.find('hero-can-img')
if idx != -1:
    print('Found hero-can-img in JS:')
    print(js[max(0, idx - 200):min(len(js), idx + 600)])

# Search for Three.js canvas in the page
print('\nCanvas usages in JS:')
for m in re.finditer(r'<canvas', js):
    print(js[m.start():m.start() + 200])


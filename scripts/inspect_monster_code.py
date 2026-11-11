import urllib.request
import re

url = 'https://monster-energy-website.vercel.app/hero_can_v3.png'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as resp:
        data = resp.read()
        print('hero_can_v3.png size:', len(data))
        with open('public/assets/hero_can_v3.png', 'wb') as f:
            f.write(data)
except Exception as e:
    print('Failed:', e)

# Also let's inspect the code around hero_can_v3 in index-BxTeGS0M.js
js_url = 'https://monster-energy-website.vercel.app/assets/index-BxTeGS0M.js'
with urllib.request.urlopen(urllib.request.Request(js_url, headers={'User-Agent': 'Mozilla/5.0'})) as resp:
    js = resp.read().decode('utf-8', errors='ignore')
    idx = js.find('hero_can')
    if idx != -1:
        start = max(0, idx - 400)
        end = min(len(js), idx + 800)
        print('\nCode snippet around hero_can:')
        print(js[start:end])


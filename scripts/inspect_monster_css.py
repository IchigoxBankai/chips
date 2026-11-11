import urllib.request
import re

url = 'https://monster-energy-website.vercel.app/'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as resp:
    html = resp.read().decode('utf-8')

css_files = re.findall(r'href=["\']([^"\']+\.css)["\']', html)
print('CSS files:', css_files)

for c in css_files:
    c_url = c if c.startswith('http') else url.rstrip('/') + '/' + c.lstrip('/')
    with urllib.request.urlopen(urllib.request.Request(c_url, headers={'User-Agent': 'Mozilla/5.0'})) as c_resp:
        css = c_resp.read().decode('utf-8', errors='ignore')
        print(f'\n--- CSS from {c} (length: {len(css)}) ---')
        # Find hero-can rules
        for line in css.split('}'):
            if 'hero-can' in line or 'hero-glow' in line or 'hero-orbit' in line:
                print(line.strip() + '}')


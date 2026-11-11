from PIL import Image, ImageFilter
import numpy as np
import os

files = [
    ('sour-cream-onion', r'C:\Users\Nishant Puthran\.gemini\antigravity\brain\c644ac0c-26e7-4362-8a66-aae6c8cec7f0\cruncha_sour_cream_onion_hero_1793887380461.jpg'),
    ('classic-salted', r'C:\Users\Nishant Puthran\.gemini\antigravity\brain\c644ac0c-26e7-4362-8a66-aae6c8cec7f0\cruncha_classic_salted_hero_1793887406012.jpg'),
    ('tangy-masala', r'C:\Users\Nishant Puthran\.gemini\antigravity\brain\c644ac0c-26e7-4362-8a66-aae6c8cec7f0\cruncha_tangy_masala_hero_1793887429914.jpg'),
    ('cheese-blast', r'C:\Users\Nishant Puthran\.gemini\antigravity\brain\c644ac0c-26e7-4362-8a66-aae6c8cec7f0\cruncha_cheese_blast_hero_1793887453047.jpg')
]

for fid, path in files:
    if not os.path.exists(path):
        print('Not found:', path)
        continue
    img = Image.open(path).convert('RGBA')
    arr = np.array(img, dtype=np.float32)

    rgb = arr[:, :, :3]
    max_rgb = np.max(rgb, axis=2)

    # Black background thresholding with smooth feathering
    alpha = np.clip((max_rgb - 22.0) / 22.0, 0.0, 1.0) * 255.0
    alpha_img = Image.fromarray(alpha.astype(np.uint8), mode='L').filter(ImageFilter.GaussianBlur(0.8))
    arr[:, :, 3] = np.array(alpha_img)

    result = Image.fromarray(arr.astype(np.uint8))
    bbox = result.getbbox()
    if bbox:
        result = result.crop(bbox)

    dest = f'public/assets/cruncha-{fid}-hero.png'
    result.save(dest, format='PNG')
    print(f'Successfully processed & saved {dest} with size {result.size}')


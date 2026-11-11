from PIL import Image, ImageFilter
import numpy as np
import glob

flavours = [
    ('sour-cream-onion', 'cruncha_sour_cream_pouch_*.jpg'),
    ('classic-salted', 'cruncha_classic_salted_pouch_*.jpg'),
    ('tangy-masala', 'cruncha_tangy_masala_pouch_*.jpg'),
    ('cheese-blast', 'cruncha_cheese_blast_pouch_*.jpg')
]

for fid, pattern in flavours:
    matches = glob.glob(f'public/assets/{pattern}')
    if not matches:
        continue
    img = Image.open(matches[0]).convert('RGBA')
    arr = np.array(img, dtype=np.float32)
    rgb = arr[:, :, :3]
    max_rgb = np.max(rgb, axis=2)

    alpha = np.clip((max_rgb - 25.0) / 25.0, 0.0, 1.0) * 255.0
    alpha_img = Image.fromarray(alpha.astype(np.uint8), mode='L').filter(ImageFilter.GaussianBlur(0.8))
    arr[:, :, 3] = np.array(alpha_img)
    res = Image.fromarray(arr.astype(np.uint8))
    bbox = res.getbbox()
    if bbox:
        res = res.crop(bbox)
    res.save(f'public/assets/cruncha-{fid}-hero.png', format='PNG')
    print(f'Saved public/assets/cruncha-{fid}-hero.png:', res.size)


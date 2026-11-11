from PIL import Image, ImageFilter
import numpy as np

img = Image.open('public/assets/cruncha-fire-chilli-reference.jpg').convert('RGBA')
arr = np.array(img, dtype=np.float32)

# The background in the reference is near-black (R<18, G<18, B<18)
# The pouch has bright red, orange, white, and yellow colors
rgb = arr[:, :, :3]
max_rgb = np.max(rgb, axis=2)

# Create high-precision alpha mask
# Background is dark: threshold around 22 with smooth transition up to 38
alpha = np.clip((max_rgb - 20.0) / 20.0, 0.0, 1.0) * 255.0
alpha = alpha.astype(np.uint8)

# Remove any isolated tiny dark islands or specks
alpha_img = Image.fromarray(alpha, mode='L')
# Smooth mask with tiny radius to eliminate harsh pixels
alpha_img = alpha_img.filter(ImageFilter.GaussianBlur(0.8))

# Apply alpha
arr[:, :, 3] = np.array(alpha_img)
result = Image.fromarray(arr.astype(np.uint8))

# Find tight bounding box of non-transparent pixels
bbox = result.getbbox()
print('Bounding box:', bbox)
cropped = result.crop(bbox)

# Save as high-res hero pouch PNG
cropped.save('public/assets/cruncha-fire-chilli-hero.png', format='PNG')
print('Saved public/assets/cruncha-fire-chilli-hero.png with size:', cropped.size)


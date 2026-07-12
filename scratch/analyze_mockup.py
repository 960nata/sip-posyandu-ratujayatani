import numpy as np
from PIL import Image

def analyze():
    img = Image.open('public/images/permendagri_mockup.png')
    img_rgba = img.convert('RGBA')
    data = np.array(img_rgba)
    
    # Let's save a test image where we highlight pixels that are close to the background gradient
    # The background is a gradient from dark green to light gray/green to orange-yellow.
    # Let's print out the RGB values at various coordinates to understand the gradient.
    h, w, _ = data.shape
    print(f"Image dimensions: {w}x{h}")
    
    # Print sample pixels from a grid
    for y in range(0, h, h // 5):
        row_str = []
        for x in range(0, w, w // 5):
            r, g, b, a = data[y, x]
            row_str.append(f"({x},{y}): [{r},{g},{b}]")
        print(" | ".join(row_str))

if __name__ == '__main__':
    analyze()

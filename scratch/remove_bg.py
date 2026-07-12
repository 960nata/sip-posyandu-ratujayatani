import numpy as np
from PIL import Image

def remove_background():
    # Open the image
    img = Image.open('public/images/permendagri_mockup.png')
    img_rgba = img.convert('RGBA')
    data = np.array(img_rgba)
    h, w, _ = data.shape
    
    # We want to remove the green-yellow gradient background.
    # Let's define the logic to identify background pixels.
    # Background pixels are generally green/dark green/gray-green,
    # whereas the document is white/light-gray and the woman's photo has distinct skin tones, hair, and clothing.
    
    # Let's convert to HSV to make it easier to separate colors.
    # HSV conversion:
    # R, G, B in [0, 255]
    r = data[:, :, 0].astype(float)
    g = data[:, :, 1].astype(float)
    b = data[:, :, 2].astype(float)
    
    # Simple color thresholding:
    # The background is a gradient. Let's look at the colors.
    # For a pixel (x, y), if it's part of the paper, it is very bright and white-ish:
    # R, G, B are all high and very close to each other.
    # If it's part of the background, it has green/yellow/dark hues.
    
    # Let's create an alpha mask.
    alpha = np.ones((h, w), dtype=np.uint8) * 255
    
    for y in range(h):
        for x in range(w):
            rv, gv, bv = r[y, x], g[y, x], b[y, x]
            
            # White/light-gray paper detection:
            # High value, low saturation
            max_c = max(rv, gv, bv)
            min_c = min(rv, gv, bv)
            diff = max_c - min_c
            
            # If it's extremely bright and desaturated, it is definitely the paper.
            if max_c > 200 and diff < 30:
                continue
                
            # If it's dark and desaturated (text on paper), it's also paper:
            # But wait, the text is inside the paper.
            # The paper coordinates are generally in the range x > 400 or x between 400 and 950.
            # Let's look at the elements.
            # Let's test a simple distance threshold.
            # In the background, the green component is usually dominant or the colors have a certain signature.
            # Let's print out what colors we get if we filter out pixels that have:
            # - green component larger than red and blue, and not very bright white.
            # Let's check:
            is_bg = False
            
            # Left side is mostly dark background:
            if x < 420:
                # The document starts around x=420.
                # So anything on the left is background!
                is_bg = True
            else:
                # On the right, we have the document and the photo.
                # The photo is on the right, x > 650, y > 200.
                # Let's check if the pixel matches the background green.
                # The background on the right is a dark green: e.g. [75, 93, 81], [91, 114, 104], etc.
                # The background at the top-right is light grayish-green: [218, 224, 220]
                # Let's see: if gv > 1.05 * rv and gv > 1.05 * bv:
                # or if it's very dark green: gv > rv and gv > bv and max_c < 100
                if (gv > rv * 1.02 and gv > bv * 1.02) or (max_c < 70 and gv > 20):
                    is_bg = True
                
                # Near-corner pixels at the top-right and bottom-right:
                # Top right corner is [218, 224, 220] - which is a light gray-green.
                # If x is very large and y is small (top-right corner):
                if x > 850 and y < 250:
                    # check if it is light gray-green:
                    if abs(rv - 218) < 40 and abs(gv - 224) < 40 and abs(bv - 220) < 40:
                        is_bg = True
                
                # Bottom right corner is [75, 93, 81] or [91, 114, 104] or [74, 90, 80]:
                if x > 850 and y > 600:
                    if gv > rv and gv > bv:
                        is_bg = True
            
            if is_bg:
                alpha[y, x] = 0
                
    # Apply alpha mask
    data[:, :, 3] = alpha
    
    # Save the output image
    out_img = Image.fromarray(data, 'RGBA')
    out_img.save('public/images/permendagri_mockup_transparent_test.png')
    print("Test image saved.")

if __name__ == '__main__':
    remove_background()

import numpy as np
from PIL import Image

def analyze_segments():
    img = Image.open('public/images/permendagri_mockup.png')
    data = np.array(img)
    h, w, c = data.shape
    
    # We want to classify pixels into:
    # 1. Background wall (white/light-green stripes, shadows)
    # 2. Background table (dark green surface at the bottom)
    # 3. Scroll (cream paper, green borders)
    # 4. Tablet (black bezel, golden frame, screen content)
    
    # Let's write a test script that outputs several thresholded masks to see which color ranges match which parts.
    # We will save these masks to the scratch directory so we can inspect them.
    
    # Mask A: Cream color of the scroll
    # Cream is high R, high G, slightly lower B (e.g., R > 200, G > 190, B > 160)
    cream_mask = (data[:, :, 0] > 200) & (data[:, :, 1] > 190) & (data[:, :, 2] > 150) & (data[:, :, 0] > data[:, :, 2] + 15)
    
    # Mask B: Tablet screen columns
    # Gold/yellow columns: high R, G, low B (R > 180, G > 150, B < 120)
    gold_mask = (data[:, :, 0] > 170) & (data[:, :, 1] > 140) & (data[:, :, 2] < 120)
    
    # Mask C: White/light parts of the wall vs paper
    # The wall has some vertical white stripes. The paper also has white areas.
    # Let's inspect where the scroll and tablet are located.
    # Let's find the bounding box of the scroll and tablet by coordinates.
    # From the mockup image:
    # The scroll is on the left-center.
    # The tablet is on the right-center.
    # Let's output these masks as images to see how clean they are.
    
    Image.fromarray((cream_mask * 255).astype(np.uint8)).save('scratch/mask_cream.png')
    Image.fromarray((gold_mask * 255).astype(np.uint8)).save('scratch/mask_gold.png')
    
    print("Masks saved to scratch directory.")

if __name__ == '__main__':
    analyze_segments()

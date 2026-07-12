import cv2
import numpy as np

def run_grabcut():
    # Load original image
    img = cv2.imread('public/images/permendagri_mockup.png')
    h, w, _ = img.shape
    print(f"Loaded image {w}x{h}")
    
    # Create mask
    mask = np.zeros(img.shape[:2], np.uint8)
    
    # Bounding box containing the foreground (x, y, w, h)
    # The scroll and tablet are centered. Let's define a rect that excludes the borders.
    # From coordinates, they are in the range:
    # x: 40 to 980, y: 150 to 880
    rect = (40, 120, w - 80, h - 200)
    
    # GrabCut internal arrays
    bgdModel = np.zeros((1, 65), np.float64)
    fgdModel = np.zeros((1, 65), np.float64)
    
    # Initial run with rectangle
    cv2.grabCut(img, mask, rect, bgdModel, fgdModel, 7, cv2.GC_INIT_WITH_RECT)
    
    # Let's post-process the mask.
    # In GrabCut, mask values 0 and 2 are background, 1 and 3 are foreground.
    mask2 = np.where((mask==2)|(mask==0), 0, 1).astype('uint8')
    
    # Let's perform a minor morphological opening to remove small noise/hairs on the edges
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
    mask2 = cv2.morphologyEx(mask2, cv2.MORPH_OPEN, kernel)
    mask2 = cv2.morphologyEx(mask2, cv2.MORPH_CLOSE, kernel)
    
    # Convert mask to 255 for alpha channel
    alpha = mask2 * 255
    
    # Merge with original image channels to create RGBA
    b_channel, g_channel, r_channel = cv2.split(img)
    rgba = cv2.merge((b_channel, g_channel, r_channel, alpha))
    
    # Save the test output
    cv2.imwrite('scratch/grabcut_result.png', rgba)
    
    # Print statistics
    total_pixels = alpha.size
    transparent_pixels = np.sum(alpha == 0)
    print(f"Total pixels: {total_pixels}")
    print(f"Transparent pixels: {transparent_pixels} ({transparent_pixels/total_pixels:.2%})")

if __name__ == '__main__':
    run_grabcut()

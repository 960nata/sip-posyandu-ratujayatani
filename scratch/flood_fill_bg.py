import numpy as np
from PIL import Image
from collections import deque

def flood_fill_bg(tolerance=12):
    img = Image.open('public/images/permendagri_mockup.png')
    img_rgba = img.convert('RGBA')
    data = np.array(img_rgba)
    h, w, _ = data.shape
    
    # Visited grid
    visited = np.zeros((h, w), dtype=bool)
    
    # Queue for BFS
    queue = deque()
    
    # Initialize queue with border pixels
    # Left edge, top edge, right edge, bottom edge
    # Let's add them
    for y in range(h):
        queue.append((0, y))
        visited[0, y] = True
        queue.append((w - 1, y))
        visited[w - 1, y] = True
        
    for x in range(1, w - 1):
        queue.append((x, 0))
        visited[x, 0] = True
        queue.append((x, h - 1))
        visited[x, h - 1] = True
        
    # Directions for 4-connectivity
    dy = [-1, 1, 0, 0]
    dx = [0, 0, -1, 1]
    
    # BFS
    while queue:
        cy, cx = queue.popleft()
        curr_color = data[cy, cx][:3].astype(int)
        
        for i in range(4):
            ny, nx = cy + dy[i], cx + dx[i]
            if 0 <= ny < h and 0 <= nx < w:
                if not visited[ny, nx]:
                    neigh_color = data[ny, nx][:3].astype(int)
                    # Color difference (Euclidean distance)
                    dist = np.linalg.norm(curr_color - neigh_color)
                    
                    # We also want to make sure we don't accidentally flood-fill into the white paper
                    # The white paper is very bright and has low saturation.
                    # The background is green/gray/yellow.
                    # If neighbor is very bright and white (e.g. all R, G, B > 200 and very close), we stop.
                    is_white_paper = (
                        neigh_color[0] > 200 and 
                        neigh_color[1] > 200 and 
                        neigh_color[2] > 200 and 
                        max(neigh_color) - min(neigh_color) < 25
                    )
                    
                    if dist < tolerance and not is_white_paper:
                        visited[ny, nx] = True
                        queue.append((ny, nx))
                        
    # Set visited pixels to transparent
    for y in range(h):
        for x in range(w):
            if visited[y, x]:
                data[y, x, 3] = 0
                
    # Save output
    out_img = Image.fromarray(data, 'RGBA')
    out_img.save('public/images/permendagri_mockup_transparent.png')
    print(f"Done! Background removed with tolerance={tolerance}.")

if __name__ == '__main__':
    flood_fill_bg()

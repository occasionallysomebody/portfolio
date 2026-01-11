#!/usr/bin/env python3
"""
Directions:
Convert HEIC/HEIF files to JPEG using pillow-heif + Pillow.
Usage:
  python scripts/convert_heic.py                # create converted copy of all files under gallery
  python scripts/convert_heic.py                # write those files to a dist folder that contains only the optimized, production ready images, retaining the order and folder structure
                                                # original uncompressed images should not be sent to server to begin with

Make sure to install dependencies first:
  pip install pillow pillow-heif

This script intentionally keeps converted JPEGs next to the originals.
"""

#!/usr/bin/env python3
import os
from pathlib import Path
from PIL import Image
from pillow_heif import register_heif_opener

# Register HEIF opener with Pillow
register_heif_opener()

def convert_heic_to_jpg(source_root, dist_root):
    """
    Traverses the source gallery, converts HEIC files to JPEG, 
    and saves them to the dist folder while maintaining structure.
    """
    source_path = Path(source_root)
    dist_path = Path(dist_root)

    # Ensure source directory exists
    if not source_path.exists():
        print(f"Error: Source directory {source_root} not found.")
        return

    print(f"Starting conversion: {source_path} -> {dist_path}")

    # Walk through the source directory
    for root, dirs, files in os.walk(source_path):
        for file in files:
            if file.lower().endswith(('.heic', '.heif')):
                # Define full source path
                file_source_path = Path(root) / file
                
                # Define relative path to maintain structure
                rel_path = file_source_path.relative_to(source_path)
                
                # Define destination path (changing extension to .jpg)
                file_dist_path = (dist_path / rel_path).with_suffix('.jpg')

                # Create destination directory if it doesn't exist
                file_dist_path.parent.mkdir(parents=True, exist_ok=True)

                try:
                    # Open and convert image
                    image = Image.open(file_source_path)
                    
                    # Convert to RGB to ensure JPEG compatibility
                    image.convert("RGB").save(file_dist_path, "JPEG", quality=95)
                    print(f"✓ Converted: {rel_path} -> {file_dist_path.name}")
                except Exception as e:
                    print(f"✗ Failed to convert {file}: {e}")

if __name__ == "__main__":
    # Alignment with your project structure
    SOURCE_GALLERY = "content/gallery"
    DIST_GALLERY = "dist/assets/gallery"
    
    convert_heic_to_jpg(SOURCE_GALLERY, DIST_GALLERY)
    print("\nConversion complete. Production-ready JPEGs are in dist/assets/gallery/.")
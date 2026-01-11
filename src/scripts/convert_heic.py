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
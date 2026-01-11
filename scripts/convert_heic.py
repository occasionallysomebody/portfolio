#!/usr/bin/env python3
"""
Convert HEIC/HEIF files to JPEG using pillow-heif + Pillow.
Usage:
  python scripts/convert_heic.py                # convert all files under dist/assets/gallery
  python scripts/convert_heic.py --album 0002-Home --files file1.HEIC,file2.jpg
  python scripts/convert_heic.py --delete-original  # remove HEIC after successful conversion

Make sure to install dependencies first:
  pip install pillow pillow-heif

This script intentionally keeps converted JPEGs next to the originals.
"""

import argparse
import os
from pathlib import Path
import sys

try:
    import pillow_heif
    from PIL import Image
except Exception as e:
    print("Missing dependency: please run `pip install pillow pillow-heif`")
    raise

pillow_heif.register_heif_opener()

GALLERY_DIR = Path(__file__).resolve().parents[1] / 'dist' / 'assets' / 'gallery'


def convert_file(in_path: Path, delete_original: bool = False) -> bool:
    try:
        print(f"Converting: {in_path}")
        with Image.open(in_path) as img:
            rgb = img.convert('RGB')
            out_path = in_path.with_suffix('.jpg')
            rgb.save(out_path, format='JPEG', quality=90, optimize=True)
        if delete_original:
            in_path.unlink()
        print(f"  ✓ Saved: {out_path.name}")
        return True
    except Exception as e:
        print(f"  ✗ Failed: {in_path.name}: {e}")
        return False


def iter_album(album_dir: Path, filenames=None, delete_original=False):
    if filenames:
        for fname in filenames:
            p = album_dir / fname
            if p.exists():
                convert_file(p, delete_original)
            else:
                print(f"  ! Not found: {fname}")
    else:
        for p in sorted(album_dir.iterdir()):
            if p.suffix.lower() in ['.heic', '.heif']:
                convert_file(p, delete_original)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--album', help='Album folder under dist/assets/gallery')
    parser.add_argument('--files', help='Comma-separated file names to convert (only within album)')
    parser.add_argument('--delete-original', action='store_true', help='Delete original HEIC files after successful conversion')

    args = parser.parse_args()

    if not GALLERY_DIR.exists():
        print(f"Gallery directory not found: {GALLERY_DIR}")
        sys.exit(1)

    if args.album:
        album_path = GALLERY_DIR / args.album
        if not album_path.exists():
            print(f"Album not found: {args.album}")
            sys.exit(1)
        filenames = args.files.split(',') if args.files else None
        iter_album(album_path, filenames=filenames, delete_original=args.delete_original)
    else:
        # iterate all albums
        for album in sorted(GALLERY_DIR.iterdir()):
            if album.is_dir():
                print(f"\nAlbum: {album.name}")
                iter_album(album, filenames=None, delete_original=args.delete_original)


if __name__ == '__main__':
    main()

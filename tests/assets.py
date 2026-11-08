import unittest
from pathlib import Path
from PIL import Image
class Artwork(unittest.TestCase):
 def test_17_is_large_square_original(self):
  p=Path('public/assets/official-album-17.jpg')
  with Image.open(p) as im:
   self.assertEqual(im.width,im.height)
   self.assertGreaterEqual(im.width,1000,'17 must not use the old 500px thumbnail')
 def test_wiu_is_not_the_group_portrait(self):
  self.assertTrue(Path('public/assets/artist-wiu-verified.webp').read_bytes()!=Path('public/assets/artist-trio.jpg').read_bytes(),'WIU must use the credited individual source')
if __name__=='__main__':unittest.main()

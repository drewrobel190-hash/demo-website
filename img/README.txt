VELOCE Selezione — vehicle photos
=================================

HOW TO PUT REAL PHOTOS ON THE SITE (2 minutes, no coding):

1. Get 6 free-to-use car photos. Good sources (all royalty-free, legal):
     - https://www.pexels.com/search/supercar/
     - https://unsplash.com/s/photos/sports-car
   Download 6 you like (studio/plain backgrounds look best on the cards).

2. Rename them exactly:
     1.jpg   2.jpg   3.jpg   4.jpg   5.jpg   6.jpg
   (1.jpg is the main/first photo.)

3. Drop all 6 into THIS img/ folder.

4. Refresh the site. Done — they now show on every listing card,
   the photo gallery, and the vehicle pages.

Notes:
- PNG works too — just name them 1.png etc. and change the extensions in
  app.js (the SHARED_PHOTOS line) from .jpg to .png.
- Until you add real photos, each car shows a colour-matched supercar
  illustration so nothing looks broken.
- To give ONE specific car its own photos, edit that car in app.js and set
  its `images` array, e.g. images: ['img/roma-1.jpg','img/roma-2.jpg'].

Only use images you own or that are licensed for use. Do NOT use a car maker's
official photos or logos (e.g. Ferrari's) — those are copyrighted.

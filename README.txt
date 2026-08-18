HOW TO USE
==========

1. Edit js/config.js — that's the only file you need to touch:
   - yourName / partnerName
   - age (the candles will form this number's shape)
   - birthdayMessage (the lines that appear after she blows out the candles)
   - gallery (your photos + captions)
   - defaultTheme: "romantic" (pink & yellow) or "midnight" (navy & green)

2. Replace the placeholder photos in /images with your real ones,
   keeping the same file names (photo1.jpg, photo2.jpg, ... photo17.jpg)
   — or use your own file names, just update the "src" paths in
   config.js to match.

3. (Optional but nice) Drop a song file named music.mp3 into the
   project folder to enable the 🎵 Music button. Any format the
   browser can play works (mp3, ogg, wav, m4a). To use a different
   file name or an online URL instead, edit the "music" section in
   js/config.js.

4. Deploy the whole folder as-is to any static host:
   - Netlify / Vercel: drag-and-drop the folder
   - GitHub Pages: push the folder to a repo and enable Pages
   Just make sure index.html, /css, /js, and /images stay together
   in the same folder structure.

5. Point your QR code / barcode at the deployed URL.

FILES
=====
index.html       — page structure
css/style.css    — all styling + both color themes
js/config.js     — your editable content (names, message, photos)
js/script.js     — the logic (candles, animations, gallery, theme switch)
images/          — placeholder photos, swap these for real ones
music.mp3        — your song, add this to enable the 🎵 Music button

A small 🎨 Theme button in the top-right corner lets her flip between
the pink/yellow and navy/green looks herself, any time.

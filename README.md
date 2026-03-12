# 2:03 AM — Taiwanese Popcorn Chicken

A short, atmospheric web game about Taiwan's night market and 鹹酥雞 (popcorn chicken) culture, seen through the eyes of travelers who have never seen people line up for fried chicken at 2 in the morning.

**Play time:** about 3–5 minutes.

## How to play

- **Enter the street** from the title screen.
- Use **arrow keys** or **A / D** or the **‹ ›** buttons to move left and right along the street.
- **Click** on the stall, lantern, oil pot, basil, or any of the 10 travelers to read short dialogues and observations.
- When you're ready, click **「Buy a bag」** at the stall to get your chicken and see the ending.

## Publish on itch.io

1. Zip the project so that `index.html` is at the root of the ZIP:
   - Include: `index.html`, `css/`, `js/`, `assets/`
2. On [itch.io](https://itch.io), create a new project and choose **Upload**.
3. Set the kind to **HTML**.
4. Upload the ZIP. itch.io will host it; players can run the game in the browser without downloading.

**Note:** The game runs entirely in the browser. If you add audio files (see below), they are loaded from the same origin; no extra network is required after load.

## Optional: add your own assets

- **Images:** The game uses a built-in night-market SVG (`assets/images/street-bg.svg`). You can replace it with your own background (e.g. from [驚青網遊戲書籤](https://www.kchkd.com/games/resources/bookmarks) 素材分類): put a PNG in `assets/images/` and set `#scene-bg` in `css/style.css` to use it.
- **Audio:** To enable sound, add these files under `assets/audio/`:
  - `frying-loop.mp3` — looping frying ambience (played at low volume).
  - `motorcycle.mp3` — occasional motorcycle pass-by.

If these files are missing, the game runs silently; the mute button still works.

For a curated list of free game assets (itch.io, OpenGameArt, Kenney, いらすとや) and direct links for street backgrounds and fonts, see **[ASSETS.md](ASSETS.md)** (resources from 驚青網 kchkd 遊戲書籤).

## Structure

- `index.html` — single entry point.
- `css/style.css` — layout, dialogue box, title, buttons, ending overlay.
- `js/main.js` — init, title → game, scroll, hotspot routing, ending trigger.
- `js/scene.js` — scene width, scroll, hotspot placement (`Scene`, `SceneSetup`).
- `js/dialogue.js` — dialogue show/next/close, `showForHotspot(id)`, `setOnClose(cb)`.
- `js/characters.js` — `CHARACTERS`, `HOTSPOT_CONFIG`, `HOTSPOT_DIALOGUES`.
- `js/audio.js` — ambient loop, occasional motorcycle, mute.

## License

Use and modify as you like. If you publish on itch.io, credit is appreciated.

## SEO (when deploying to your own domain)

1. **Replace placeholder URLs** in these files with your live site URL (e.g. `https://yoursite.com`):
   - `index.html`: `<link rel="canonical">`, `og:image`, `og:url`, `twitter:image`, and the JSON-LD `url` / `image`.
   - `robots.txt`: `Sitemap:` URL.
   - `sitemap.xml`: `<loc>` URL and optionally `<lastmod>`.

2. **Submit** `https://yoursite.com/sitemap.xml` in Google Search Console and Bing Webmaster Tools.

3. **Test** sharing on Facebook (Sharing Debugger) or Twitter (Card Validator) to confirm OG/Twitter images and titles.

**Asset credits (this build):**  
- Street background: [Pixel Art Street Backgrounds](https://opengameart.org/content/pixel-art-street-backgrounds) by CraftPix on OpenGameArt.org (OGA-BY 3.0).  
- UI arrows & click sound: [Kenney UI Pack](https://kenney.nl/assets/ui-pack) (CC0).  
- Hotspot hint icon: [Kenney Game Icons](https://kenney.nl/assets/game-icons) (CC0).
# nightmarket-game

# 遊戲素材資源

本專案可搭配以下免費素材使用，整理自 [驚青網 kchkd 遊戲書籤](https://www.kchkd.com/games/resources/bookmarks) 的**素材**分類與其他常用來源。

## 快速連結（五大素材站）

| 網站 | 連結 |
|------|------|
| itch.io 遊戲素材 | https://itch.io/game-assets |
| OpenGameArt | https://opengameart.org/ |
| Kenney | https://kenney.nl/assets |
| Poly Haven | https://polyhaven.com/ |
| いらすとや | https://www.irasutoya.com/ |

---

## 本專案已使用的素材（已下載並整合）

| 用途 | 來源 | 授權 | 說明 |
|------|------|------|------|
| 街道背景 | [Pixel Art Street Backgrounds](https://opengameart.org/content/pixel-art-street-backgrounds) (CraftPix / OpenGameArt) | OGA-BY 3.0 | 使用 City2 Pale 圖，檔名 `street-bg-opengameart.png` |
| 左右箭頭按鈕 | [Kenney UI Pack](https://kenney.nl/assets/ui-pack) | CC0 | `btn-left.png`, `btn-right.png`（arrow_basic_w/e） |
| 點擊音效 | [Kenney UI Pack](https://kenney.nl/assets/ui-pack) Sounds | CC0 | `click-a.ogg` 用於按鈕與熱區點擊 |
| 熱區懸停提示圖示 | [Kenney Game Icons](https://kenney.nl/assets/game-icons) | CC0 | `hotspot-hint.png`（information icon），懸停時顯示於熱區中央 |

完整 ZIP 與其他檔案暫存於 `assets/downloads/`，可依需要再複製使用。替換背景圖時請在 `css/style.css` 修改 `#scene-bg` 的 `background-image`。

---

## 驚青網書籤 — 素材類推薦

| 網站 | 連結 | 說明 |
|------|------|------|
| **itch.io** | [itch.io Game Assets](https://itch.io/game-assets) | 大量 2D/像素/插畫素材，可搜 "night market"、"food"、"street" |
| **OpenGameArt** | [OpenGameArt.org](https://opengameart.org/) | 免費 2D/像素背景、角色、UI，需註冊下載 |
| **Kenney** | [Kenney Assets](https://kenney.nl/assets) | CC0 免費素材，食物、UI、音效等 |
| **PolyHaven** | [PolyHaven](https://polyhaven.com/) | 免費 HDR/紋理，偏 3D；2D 可當背景圖用 |
| **いらすとや** | [いらすとや](https://www.irasutoya.com/) | 日文可愛插圖，可找 食べ物、屋台、夜市 等 |

---

## 本專案推薦素材（可直接下載使用）

### 背景 / 街道

- **[Pixel Art Street Backgrounds](https://opengameart.org/content/pixel-art-street-backgrounds)**（OpenGameArt）  
  - 授權：OGA-BY 3.0（標註來源即可）  
  - 下載：[pixel-art-street-2d-backgrounds.zip](https://opengameart.org/sites/default/files/pixel-art-street-2d-backgrounds.zip)  
  - 解壓後挑一張 PNG 放到 `assets/images/`，在 `css/style.css` 裡將 `#scene-bg` 的 `background-image` 改為該檔（例如 `url("../assets/images/street-bg.png")`）。

### 食物 / 攤位

- **[Food Kit](https://kenney.nl/assets/food-kit)**（Kenney）  
  - 授權：CC0（可商用、免標註）  
  - 多為 3D 模型；若需要 2D 圖，可到 [Kenney 的 itch.io](https://kenney-assets.itch.io/food-kit) 看是否有 2D 或圖示版。  

- **itch.io 搜尋**：`free 2D food`、`night market`、`street food`，可找到攤位、鹹酥雞等插圖。

### 音效

- **Kenney → Audio**：<https://kenney.nl/assets/category:Audio>  
  - 有環境音、UI 音效等，可挑選油炸、人群、街道感音效。  
- 將 `frying-loop.mp3`、`motorcycle.mp3` 等放入 `assets/audio/` 即可（詳見 README）。

### 字體（繁中 / 標題）

驚青網書籤的**繁中字體庫**可當標題或 UI 用：

- [辰宇落雁體](https://blog.justfont.com/2025/02/chenyuluoyan-story/)
- [粉圓體](https://blog.justfont.com/2019/04/huninn-2020/)
- [Google Noto Sans TC](https://fonts.google.com/noto/specimen/Noto+Sans+TC)

---

## 在專案中使用

1. **街道背景**：下載上述 Pixel Art Street 的 ZIP，取一張 PNG 放到 `assets/images/`，在 `css/style.css` 中將 `#scene-bg` 的 `background-image` 改為該檔路徑。
2. **音效**：將 MP3 檔放入 `assets/audio/`，檔名對應 `audio.js` 中的路徑（如 `frying-loop.mp3`、`motorcycle.mp3`）。  
3. **其他圖片**：可自行加入 `assets/images/`，再在 CSS 或 JS 中引用路徑即可。

更多說明見專案根目錄的 [README.md](README.md)。

# NoteSlide Design System: Digital Alchemy

## 1. Core Philosophy (核心理念)
**Digital Alchemy (數位煉金術)** 結合了「結構精準度 (Architectural Precision)」與「高端藝術感 (High-End Artistry)」。
我們拒絕通用的扁平化設計，轉而追求透過光影、材質與空間感來構建介面。

## 2. Color Palette (配色系統)

### Architectural Ice (Day Mode / Default)
營造明亮、冷靜且專業的公務氛圍，但去除傳統公部門網站的沉悶感。

- **Canvas (Background)**: `#FDFDFD` (Not pure white)
- **Ink (Text)**: 
  - Primary: `#020617` (Slate 950)
  - Secondary: `#475569` (Slate 600)
- **Accent (Highlight)**: 
  - Brand Blue: `#2563EB` (Blue 600) -> for actions
  - Electric Sky: `#38BDF8` (Sky 400) -> for gradients/glows
- **Alert**: `#EF4444` (Red 500)
- **Success**: `#10B981` (Emerald 500)

### Surfaces (Glassmorphism)
- **Glass Panel**: `bg-white/70 backdrop-blur-md border border-white/20 shadow-xl`
- **Solid Structure**: `bg-slate-50 border border-slate-200`

## 3. Typography (字型學)
- **Font Family**: `Inter`, `Noto Sans TC`, system-ui.
- **Weights**:
  - **Hero**: 900 (Black) - used for impact.
  - **Headers**: 700 (Bold) - used for structure.
  - **Body**: 400 (Regular) - used for readability.
- **Tracking (Letter Spacing)**:
  - Headers: `-0.025em` (tracking-tight) to `-0.05em` (tracking-tighter) for a modern, compact look.

## 4. UI Components (元件規範)

### Buttons
- **Primary**: Pill-shaped or super-rounded. Gradient background or Solid Blue 600 with subtle inner shadow.
- **Secondary**: Glassmorphism effect. Bordered.

### Cards (De-containerized)
- 避免使用沉重的陰影卡片。
- 使用 **重邊框 (Thick Borders)** 或 **懸浮光暈 (Hover Glow)** 代替。
- 內容區塊使用 Grid 佈局切割空間。

## 5. Imagery (影像風格)
- **Hero**: Abstract 3D structures. Glass, Chrome, Light.
- **Icons**: Lucide React icons, but used sparingly. Use text size/weight hierarchy first.

## 6. Layout (佈局)
- **Grid**: 12-column grid.
- **Spacing**: Generous whitespace (`gap-8`, `py-24`).
- **Asymmetry**: Use offset grids to create dynamic tension.

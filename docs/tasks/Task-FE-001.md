# Task-FE-001: 前台入口網 UI (Layout & Home)

---

## 1. 任務元數據 (Metadata)
*   **優先級 (Priority):** 高
*   **難易度 (Difficulty):** 中
*   **依賴項 (Dependencies):** `Task-Bootstrap-000`

---

## 2. 參考規範 (Reference Specifications)
*   **設計系統:** [設計系統](../design_system.md)
*   **線框圖:** [全域佈局](../wireframes/00_Global_Layout.md), [前台首頁](../wireframes/01_Public_Home.md)
*   **前端規範:** [前端開發規範](../frontend/CODING_STYLE.md)

---

## 3. 任務描述 (Description)
實作 React 專案的全域佈局 (Layout)，包含響應式導航欄 (Navbar) 與頁尾 (Footer)。並實作首頁 (Home) 的視覺呈現，包含 Hero Section 與快速入口卡片。

### 3.1 難點說明
*   Navbar 在手機版需支援漢堡選單 (Hamburger Menu) 開闔。
*   需引入 Tailwind 設定檔中的自定義顏色 (Primary Blue, etc.)。

---

## 4. 開發待辦清單 (Development Checklist)
- [ ] 設定 `tailwind.config.js` 引入設計系統定義的顏色。
- [ ] 建立 `src/components/layout/Navbar.tsx` (含 RWD 邏輯)。
- [ ] 建立 `src/components/layout/Footer.tsx`。
- [ ] 設定 React Router (`src/App.tsx`) 定義路由結構。
- [ ] 建立 `src/pages/public/Home.tsx` 實作首頁 Hero Section 與卡片區塊。
- [ ] 整合 Lucide Icons 顯示圖示。

---

## 5. 來源使用者故事
> 身為民眾，我進入網站時希望能清楚看到通報入口，並能透過選單導航至其他頁面。

---

## 6. 驗收標準 (Acceptance Criteria)
- [ ] 網頁上方顯示導航欄，在大螢幕顯示完整連結，小螢幕顯示漢堡選單。
- [ ] 點擊「案件通報」可展開下拉或導航。
- [ ] 首頁顯示「我要通報」、「進度查詢」等明顯快截按鈕。
- [ ] UI 配色符合 `design_system.md`。

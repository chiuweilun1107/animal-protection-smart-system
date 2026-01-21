# Task-FE-003: 地圖模組整合 (OSM Map)

---

## 1. 任務元數據 (Metadata)
*   **優先級 (Priority):** 中
*   **難易度 (Difficulty):** 高
*   **依賴項 (Dependencies):** `Task-FE-002`

---

## 2. 參考規範 (Reference Specifications)
*   **線框圖:** [案件地圖網](../wireframes/03_Map_View.md)
*   **設計系統:** [設計系統 (Map Style)](../design_system.md)

---

## 3. 任務描述 (Description)
整合 `react-leaflet` 與 OpenStreetMap，實作兩個核心地圖元件：
1.  **MapPicker**: 用於通報頁，讓使用者拖曳釘選位置。
2.  **CaseMap**: 用於前台展示與後台分派，顯示多個案件 Pin 點。

### 3.1 難點說明
*   Leaflet 在 React 的整合需注意 CSS 引入與 SSR (若有) 問題。
*   需處理 Pin 點的點擊事件 (Popup)。

---

## 4. 開發待辦清單 (Development Checklist)
- [ ] 安裝 `leaflet`, `react-leaflet`。
- [ ] 建立 `src/components/features/map/MapPicker.tsx` (單點選擇)。
- [ ] 建立 `src/components/features/map/CaseMap.tsx` (多點展示)。
- [ ] 將 `MapPicker` 整合回 `Report.tsx` (更新 Task-FE-002 的 Placeholder)。
- [ ] 建立 `src/pages/public/MapView.tsx` 實作前台案件地圖查詢頁。
- [ ] 設定 Mock Data 中的經緯度座標。

---

## 5. 來源使用者故事
> 身為民眾，我想要在地圖上精確標示案發地點。
> 身為民眾，我想要查看附近的動物救援案件。

---

## 6. 驗收標準 (Acceptance Criteria)
- [ ] 通報頁出現地圖，拖曳地圖可更新座標欄位。
- [ ] 案件地圖頁顯示多個範例案件的 Pin 點。
- [ ] 點擊 Pin 點可顯示案件簡易資訊 (Popup)。

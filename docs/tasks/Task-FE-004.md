# Task-FE-004: 後台管理介面 UI (Admin)

---

## 1. 任務元數據 (Metadata)
*   **優先級 (Priority):** 中
*   **難易度 (Difficulty):** 中
*   **依賴項 (Dependencies):** `Task-FE-001`, `Task-BE-002`

---

## 2. 參考規範 (Reference Specifications)
*   **線框圖:** [後台案件分派](../wireframes/04_Admin_Dispatch.md)
*   **設計系統:** [設計系統](../design_system.md)

---

## 3. 任務描述 (Description)
實作後台管理介面。包含登入頁 (Mock Login)、後台 Layout (Sidebar)、儀表板、以及案件分派管理頁面 (整合地圖)。

### 3.1 難點說明
*   需實作簡易的 Client-side Auth Guard (若未登入導回登入頁)。
*   分派頁面需同時顯示列表與地圖，並能互動 (點列表跳地圖)。

---

## 4. 開發待辦清單 (Development Checklist)
- [ ] 建立 `src/pages/admin/Login.tsx`。
- [ ] 建立 `src/components/layout/AdminLayout.tsx` (Sidebar)。
- [ ] 建立 `src/pages/admin/Dashboard.tsx`。
- [ ] 建立 `src/pages/admin/Dispatch.tsx` (整合 `CaseMap` 元件)。
- [ ] 實作案件分派 Modal UI。
- [ ] 串接後端 API 顯示真實 Mock Data。

---

## 5. 來源使用者故事
> 身為管理員，我需要登入後台查看待辦案件，並進行分派。

---

## 6. 驗收標準 (Acceptance Criteria)
- [ ] 進入 `/admin` 需先登入。
- [ ] 後台可看到案件列表與地圖分布。
- [ ] 點擊分派可彈出視窗操作。

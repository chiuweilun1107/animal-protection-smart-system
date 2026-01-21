# Task-FE-002: 案件通報中心 UI (Reporting)

---

## 1. 任務元數據 (Metadata)
*   **優先級 (Priority):** 高
*   **難易度 (Difficulty):** 高
*   **依賴項 (Dependencies):** `Task-FE-001`

---

## 2. 參考規範 (Reference Specifications)
*   **線框圖:** [案件通報頁](../wireframes/02_Reporting.md)
*   **設計系統:** [設計系統](../design_system.md)
*   **安全規範:** [基礎資安規範](../security/BASIC_SECURITY.md)

---

## 3. 任務描述 (Description)
實作案件通報表單頁面。需支援「一般案件」與「蜂案」兩種模式（透過 URL 參數或路由區分）。表單需包含驗證 (Zod + React Hook Form)、照片上傳 UI (模擬)、以及 CAPTCHA 驗證元件。**注意：地圖選點功能將在此任務先以 Placeholder 實作，待 FE-003 整合。**

### 3.1 難點說明
*   表單邏輯複雜，需處理多步驟或長表單驗證。
*   需實作一個前端模擬的 CAPTCHA 元件（隨機產生數字圖片）。

---

## 4. 開發待辦清單 (Development Checklist)
- [ ] 安裝 `react-hook-form` 和 `zod`。
- [ ] 建立 `src/components/common/Captcha.tsx` (Canvas 繪製隨機數字)。
- [ ] 建立 `src/pages/public/Report.tsx`。
- [ ] 實作表單欄位：案件描述、聯絡資訊。
- [ ] 實作「蜂案」專用欄位（蜂巢大小、位置），僅在蜂案模式顯示。
- [ ] 實作照片上傳 UI (僅前端預覽，不需實際上傳 Server，使用 Object URL)。
- [ ] 整合 API 呼叫 (Mock POST `/api/cases`)。

---

## 5. 來源使用者故事
> 身為民眾，我想要填寫通報表單，並上傳照片證明，最後通過驗證碼送出案件。

---

## 6. 驗收標準 (Acceptance Criteria)
- [ ] 進入 `/report/general` 顯示一般表單；`/report/bee` 顯示含蜂巢欄位的表單。
- [ ] 未填寫必填欄位無法送出。
- [ ] CAPTCHA 輸入錯誤無法送出。
- [ ] 送出成功後，跳轉至結果頁並顯示案件編號。

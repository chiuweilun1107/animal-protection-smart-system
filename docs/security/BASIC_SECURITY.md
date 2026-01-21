# 基礎資安規範 (Basic Security Standards)

鑑於本專案為 **展示雛型 (Demo Only)**，資安措施著重於「模擬」真實情境，而非實際的高強度防護。

## 1. 前台資安 (Frontend)
*   **圖形驗證碼 (CAPTCHA)**: 
    *   在所有公開表單 (通報、查詢) 實作模擬的圖形驗證碼元件。
    *   實作方式：前端生成隨機 4 碼數字圖片，使用者輸入正確才可送出。
*   **輸入驗證**:
    *   所有欄位需進行基本格式檢查 (Email, 手機號, 身分證字號)。
    *   防止 XSS：React 預設已轉義輸出，這點需保持。

## 2. 後台資安 (Backend Mock)
*   **API 授權模擬**:
    *   後台 API 需檢查 Request Header 是否包含 Token。
    *   若無 Token，回傳 `401 Unauthorized`。
*   **資料隱私**:
    *   Mock Data 中的民眾個資 (姓名、電話) 應使用去識別化資料 (如：李O明、0912-***-456)。

## 3. 外部介接模擬
*   不得將真實的 API Key (如 Google Map Key, 簡訊平台 Key) 硬編碼於前端程式碼中。
*   OSM 地圖無需 Key，但應注意 Usage Policy。

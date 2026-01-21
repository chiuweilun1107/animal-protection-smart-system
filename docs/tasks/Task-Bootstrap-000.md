# Task-Bootstrap-000: 專案初始化 (Project Initialization)

---

## 1. 任務元數據 (Metadata)
*   **優先級 (Priority):** 最高 (Highest)
*   **難易度 (Difficulty):** 低
*   **依賴項 (Dependencies):** 無

---

## 2. 參考規範 (Reference Specifications)
*   **目錄架構:** [目錄結構規範](../architecture/DIRECTORY_STRUCTURE.md)
*   **專案配置:** [專案配置檔](../../project.config.yaml)
*   **建置指南:** [開發環境建置指南](../SETUP_GUIDE.md)

---

## 3. 任務描述 (Description)
初始化整個專案的儲存庫結構，分別建立 `frontend` (React+Vite) 與 `backend` (Express+Node) 的基礎樣板。安裝核心依賴套件，並確保兩端服務皆可順利啟動。

### 3.1 難點說明
*   需確保 Tailwind CSS 設定正確。
*   需配置 Concurrently 或分別的 script 以便開發。

---

## 4. 開發待辦清單 (Development Checklist)
- [/] 建立 `frontend` 目錄，使用 Vite (React + TypeScript) 初始化。
    - [x] 指令: `npm create vite@latest frontend -- --template react-ts`
- [x] 在 `frontend` 安裝 Tailwind CSS、Lucide React、React Router DOM。
    - `npm install -D tailwindcss postcss autoprefixer`
    - `npx tailwindcss init -p`
    - `npm install lucide-react react-router-dom`
- [x] 建立 `backend` 目錄，初始化 `package.json`。
    - [x] `npm init -y`
- [x] 在 `backend` 安裝 Express, TypeScript, Nodemon 等開發依賴。
    - `npm install express cors dotenv`
    - `npm install -D typescript @types/node @types/express @types/cors ts-node nodemon`
    - 初始化 `tsconfig.json`。
- [/] 根據 `DIRECTORY_STRUCTURE.md` 調整或確認目錄結構。
- [/] 驗證：分別啟動前後端服務，確認無錯誤。

---

## 5. 來源使用者故事
> 作為開發者，我需要一個設定好的基礎開發環境，以便開始撰寫程式碼。

---

## 6. 驗收標準 (Acceptance Criteria)
- [ ] `frontend/package.json` 包含 `react`, `tailwindcss`, `vite`。
- [ ] `backend/package.json` 包含 `express`, `typescript`。
- [ ] 執行 `npm run dev` (前端) 可看到 Vite 預設畫面或 Hello World。
- [ ] 執行 `npm run dev` (後端) 可在 console 看到 Server started 訊息。

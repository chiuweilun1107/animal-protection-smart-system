# 開發環境建置指南 (Setup Guide)

本指南協助開發者快速建立 React + Node.js (Mock) 的開發環境。

## 1. 系統需求
*   Node.js >= 18.0.0
*   npm >= 9.0.0

## 2. 專案初始化
請在專案根目錄下執行以下指令，一次安裝前後端依賴：

```bash
# 安裝前端依賴
cd frontend
npm install

# 安裝後端依賴
cd ../backend
npm install
```

## 3. 啟動開發伺服器

### 前端 (Frontend)
前台與後台介面 (React App)。
```bash
cd frontend
npm run dev
# 預設運作於: http://localhost:5173
```

### 後端 (Backend)
Mock API 伺服器。
```bash
cd backend
npm run dev
# 預設運作於: http://localhost:3000
```

## 4. 環境變數 (.env)

### Frontend (`frontend/.env`)
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_MAP_PROVIDER=osm
```

### Backend (`backend/.env`)
```env
PORT=3000
Start_Mode=mock
```

## 5. 常見問題
*   **Port 衝突**: 若 3000 被佔用，請修改 `.env` 中的 PORT。
*   **跨域問題 (CORS)**: 後端已設定 `cors` middleware 允許 `localhost:5173`。

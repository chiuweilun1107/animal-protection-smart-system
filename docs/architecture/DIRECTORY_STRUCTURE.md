# 目錄結構規範 (Directory Structure)

本專案採用 **React (Vite) + Node.js (Express)** 的前後端分離架構，並針對展示需求簡化了資料庫層。

## 根目錄 (Root)
```
/
├── frontend/               # 前端專案 (React + Vite)
├── backend/                # 後端專案 (Node.js + Express Mock)
├── docs/                   # 專案文檔與規範
├── specs/                  # AI 核心 Schema (唯讀)
├── PROJECT_REQUIREMENTS.md # 需求規格書
├── PROJECT_BLUEPRINT.md    # 技術藍圖
├── project.config.yaml     # 專案配置
└── README.md               # 專案說明
```

## 前端目錄 (frontend/)
```
frontend/
├── src/
│   ├── assets/            # 靜態資源 (圖片, 字型)
│   ├── components/        # 共用 UI 元件 (按功能分類)
│   │   ├── common/        # 通用元件 (Button, Input)
│   │   ├── layout/        # 佈局元件 (Header, Sidebar)
│   │   └── features/      # 功能性元件 (Map, Form)
│   ├── pages/             # 頁面元件 (對應路由)
│   │   ├── public/        # 前台頁面
│   │   └── admin/         # 後台頁面
│   ├── hooks/             # 自定義 Hooks
│   ├── services/          # API 服務 (呼叫後端)
│   ├── types/             # TypeScript 類型定義
│   ├── utils/             # 工具函式
│   ├── App.tsx            # 根元件
│   └── main.tsx           # 入口點
├── public/                # 公開靜態檔
└── package.json
```

## 後端目錄 (backend/)
```
backend/
├── src/
│   ├── controllers/       # 控制器 (處理請求)
│   ├── routes/            # 路由定義
│   ├── models/            # 資料模型 (TypeScript Interface)
│   ├── services/          # 業務邏輯
│   ├── data/              # Mock Data (JSON 檔案)
│   ├── app.ts             # App 設定
│   └── server.ts          # 伺服器入口
├── package.json
└── tsconfig.json
```

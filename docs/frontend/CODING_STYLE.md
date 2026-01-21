# 前端開發規範 (Frontend Coding Style)

## 技術棧
*   **Framework**: React 18+
*   **Build Tool**: Vite
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS
*   **State Management**: React Context / Hooks

## 1. 命名規範
*   **元件檔案**: `PascalCase.tsx` (e.g., `CaseReportForm.tsx`)
*   **一般檔案**: `kebab-case.ts` (e.g., `api-client.ts`)
*   **元件名稱**: `PascalCase` (e.g., `function CaseReportForm() {}`)
*   **變數/函式**: `camelCase`

## 2. 元件結構
```tsx
import React, { useState } from 'react';
import { Button } from '@/components/common/Button';

// 1. Props Interface
interface Props {
  title: string;
}

// 2. Component Definition
export const ExampleComponent: React.FC<Props> = ({ title }) => {
  // 3. Hooks
  const [count, setCount] = useState(0);

  // 4. Handlers
  const handleClick = () => setCount(prev => prev + 1);

  // 5. Render
  return (
    <div className="p-4 bg-white rounded shadow">
      <h1 className="text-xl font-bold">{title}</h1>
      <Button onClick={handleClick}>Count: {count}</Button>
    </div>
  );
};
```

## 3. 地圖元件規範 (OpenStreetMap)
*   使用 `react-leaflet` 作為地圖函式庫。
*   所有地圖元件應封裝在 `src/components/features/map/` 下。
*   **禁止** 直接在頁面邏輯中操作原生的 Leaflet 實例，應透過 Refs 或 Context。

## 4. 表單處理
*   使用 `react-hook-form` 處理複雜表單。
*   表單驗證規則應定義在獨立的 schema 檔案中 (若有使用 Zod)。

## 5. 無障礙與 RWD
*   所有 `img` 標籤必須包含 `alt` 屬性。
*   所有互動元素 (Button, Input) 必須有清楚的 Focus 狀態。
*   使用 Tailwind 的 `md:`, `lg:` 前綴確保響應式佈局。

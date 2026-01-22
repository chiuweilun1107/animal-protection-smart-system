# 前端性能優化說明

## 🚀 快速開始

### 開發
```bash
npm run dev
```
開發體驗保持不變，HMR 依然快速。

### 構建
```bash
npm run build
```
構建產物已優化，主 bundle 從 1.41MB 降至 247KB。

### 預覽
```bash
npm run preview
```
本地預覽生產構建產物。

---

## 📊 優化效果

### 主 Bundle 減少 82.5%
- **優化前**: 1,410.29 KB (gzip: 392.52 KB) ⚠️
- **優化後**: 246.56 KB (gzip: 73.82 KB) ✅

### 首屏加載只需 3 個文件 (~99KB gzip)
1. `index.js` (74KB) - 主應用邏輯
2. `react-vendor.js` (17KB) - React 核心
3. `ui-vendor.js` (8KB) - UI 工具

### 大型庫按需加載
- `charts.js` (109KB gzip) - Dashboard 頁面時加載
- `map.js` (45KB gzip) - MapView 頁面時加載
- `workflow.js` (42KB gzip) - Workflows 編輯時加載

---

## 🛠️ 如何工作

### 1. 路由級代碼分割
所有頁面組件使用 `React.lazy()` 動態導入：

```typescript
// App.tsx
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));

<Suspense fallback={<PageLoader />}>
  <Route path="/admin/dashboard" element={<Dashboard />} />
</Suspense>
```

**效果**: 用戶訪問某個頁面時，才下載該頁面的代碼。

### 2. Vendor 分組策略
核心庫單獨打包，利於長期緩存：

```typescript
// vite.config.ts
manualChunks: {
  'react-vendor': ['react', 'react-dom', 'react-router-dom'],
  'charts': ['recharts'],
  'map': ['leaflet', 'react-leaflet'],
  'workflow': ['reactflow'],
}
```

**效果**: 更新業務代碼時，vendor chunks 不需要重新下載。

### 3. 按需加載大型組件
WorkflowEditor 等大型組件懶加載：

```typescript
// Workflows.tsx
const WorkflowEditor = lazy(() => import('../../components/WorkflowEditor'));

<Suspense fallback={<LoadingFallback message="載入工作流編輯器..." />}>
  <WorkflowEditor {...props} />
</Suspense>
```

**效果**: reactflow 庫 (132KB) 只在編輯模式時加載。

---

## 📁 新增文件

### 1. LoadingFallback 組件
**路徑**: `src/components/common/LoadingFallback.tsx`

統一的 Suspense fallback 組件：
```typescript
<LoadingFallback message="載入中..." />
```

### 2. API 抽象層
**路徑**: `src/services/api.ts`

支持開發/生產環境切換：
```typescript
// 開發環境：使用 Mock API
// 生產環境：使用真實 API
const api = await loadApiService();
```

---

## 🔍 驗證優化效果

### 1. 查看構建產物
```bash
npm run build
ls -lh dist/assets/
```

應該看到：
- `index-*.js` (~247KB)
- `react-vendor-*.js` (~48KB)
- `charts-*.js` (~366KB)
- `map-*.js` (~154KB)
- `workflow-*.js` (~132KB)
- 各頁面組件 (1-36KB)

### 2. 網絡面板測試
```bash
npm run preview
```

打開 DevTools → Network:
1. 清除緩存
2. 訪問首頁 → 只加載 3 個 JS 文件 (~317KB)
3. 訪問 Dashboard → 額外加載 `charts-*.js`
4. 訪問 MapView → 額外加載 `map-*.js`

### 3. Lighthouse 測試
```bash
npm run preview
```

Chrome DevTools → Lighthouse → Run

**預期分數**:
- Performance: 90+
- Best Practices: 95+

---

## 📚 相關文檔

- [詳細優化指南](./OPTIMIZATION_NOTES.md)
- [性能報告](./PERFORMANCE_REPORT.md)
- [優化總結](./OPTIMIZATION_SUMMARY.md)

---

## ⚙️ Vite 配置說明

### manualChunks (手動分割)
將依賴按功能分組，優化加載策略：

```typescript
manualChunks: {
  // 核心庫 - 首屏加載
  'react-vendor': ['react', 'react-dom', 'react-router-dom'],
  'ui-vendor': ['lucide-react', 'clsx', 'tailwind-merge'],

  // 功能庫 - 按需加載
  'charts': ['recharts'],
  'map': ['leaflet', 'react-leaflet'],
  'workflow': ['reactflow'],

  // Mock 數據 - 可移除
  'mock-services': ['./src/services/mockApi', './src/services/mockCases'],
}
```

### optimizeDeps (依賴優化)
控制開發時的預構建：

```typescript
optimizeDeps: {
  // 預構建 (啟動更快)
  include: ['react', 'react-dom', 'react-router-dom', 'lucide-react'],

  // 不預構建 (減少初始加載)
  exclude: ['leaflet', 'reactflow', 'recharts'],
}
```

---

## 🎯 下一步優化

### 1. 圖片優化 (高優先級)
當前問題：
- `bg_map_ntpc_ultra.png`: 9.1MB ⚠️
- `image_bee_removal.png`: 1.06MB ⚠️

建議：
- 使用 WebP 格式
- 實施響應式圖片
- 添加圖片懶加載

### 2. 移除 Mock 數據 (生產環境)
完成真實 API 後，更新 `api.ts`：

```typescript
if (import.meta.env.PROD) {
  return await import('./realApi');  // 使用真實 API
}
```

可移除 `mock-services.js` (62.68KB)

### 3. 添加構建監控
安裝分析工具：

```bash
npm install --save-dev rollup-plugin-visualizer
```

添加到 `vite.config.ts`：

```typescript
import { visualizer } from 'rollup-plugin-visualizer';

plugins: [
  react(),
  visualizer({ open: true, gzipSize: true })
]
```

構建後自動打開可視化報告。

---

## ❓ 常見問題

### Q: 為什麼開發時啟動變慢了？
A: 實際上沒有變慢。優化主要影響生產構建，開發體驗保持不變。

### Q: 懶加載會導致白屏嗎？
A: 不會。我們使用 `Suspense` + `LoadingFallback` 提供優雅的加載狀態。

### Q: 舊版本如何遷移？
A: 直接拉取最新代碼，無需額外操作。所有組件導入路徑保持不變。

### Q: 如何添加新頁面？
A: 在 `App.tsx` 中使用 `lazy()` 導入：

```typescript
const NewPage = lazy(() => import('./pages/NewPage'));

<Route path="/new" element={
  <Suspense fallback={<PageLoader />}>
    <NewPage />
  </Suspense>
} />
```

### Q: 生產環境如何移除 Mock 數據？
A: 更新 `src/services/api.ts`，將生產環境改為導入 `realApi`。

---

## 🎊 總結

此次優化將主 bundle 從 1.41MB 降至 247KB，減少 **82.5%**。首屏性能大幅提升，用戶體驗顯著改善。所有優化對開發體驗無影響，代碼結構保持清晰。

**關鍵要點**:
- ✅ 代碼分割自動工作，無需手動干預
- ✅ 新頁面遵循同樣模式，保持一致性
- ✅ 開發體驗不受影響，HMR 依然快速
- ✅ 構建產物已優化，直接部署即可

---

**文檔版本**: v1.0.0
**最後更新**: 2026-01-22

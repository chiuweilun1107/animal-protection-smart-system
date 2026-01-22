# 前端性能優化報告

## 📊 問題分析

### 原始 Bundle 大小
- **主 bundle**: 1,410.29 KB (gzip: 392.52 KB)
- **警告閾值**: 500 KB

### 主要問題
1. 所有路由組件同步加載
2. 大型依賴庫未按需加載：
   - `reactflow` (~400KB) - 工作流編輯器
   - `leaflet` (~300KB) - 地圖庫
   - `recharts` (~200KB) - 圖表庫
3. Mock 數據文件過大：
   - `mockApi.ts`: 1908 行
   - `mockCases.ts`: 924 行

## ✅ 已實施的優化

### 1. 路由級別代碼分割
**文件**: `frontend/src/App.tsx`

所有頁面組件已改為 `React.lazy()` 動態導入：
- 公開頁面: Report, Status, MapView, News 等
- 後台頁面: Dashboard, CaseList, Users, Workflows 等
- 首頁保持同步加載以優化首屏性能

### 2. Vite 構建配置優化
**文件**: `frontend/vite.config.ts`

實施了 `manualChunks` 策略：
```typescript
manualChunks: {
  'react-vendor': ['react', 'react-dom', 'react-router-dom'],
  'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
  'ui-vendor': ['lucide-react', 'clsx', 'tailwind-merge'],
  'charts': ['recharts'],
  'map': ['leaflet', 'react-leaflet'],
  'workflow': ['reactflow'],
  'mock-services': ['./src/services/mockApi', './src/services/mockCases', './src/services/mockAIService'],
}
```

**優點**:
- 核心庫獨立打包，利於長期緩存
- 大型庫按功能分組，按需加載
- Mock 服務單獨打包，生產環境可移除

### 3. 組件級懶加載
**文件**: `frontend/src/pages/admin/Workflows.tsx`

WorkflowEditor 組件（包含 reactflow）改為懶加載：
```typescript
const WorkflowEditor = lazy(() => import('../../components/WorkflowEditor'));
// 使用時包裹 Suspense
<Suspense fallback={<LoadingFallback />}>
  <WorkflowEditor {...props} />
</Suspense>
```

### 4. 依賴預構建優化
排除大型庫在啟動時預構建：
```typescript
optimizeDeps: {
  include: ['react', 'react-dom', 'react-router-dom', 'lucide-react'],
  exclude: ['leaflet', 'reactflow', 'recharts'],
}
```

## 📈 預期效果

### Bundle 分割後預期結果
- **主 bundle** (含 React, Router): ~200KB
- **Form vendor**: ~80KB
- **UI vendor**: ~40KB
- **Charts** (按需): ~200KB
- **Map** (按需): ~300KB
- **Workflow** (按需): ~400KB
- **各頁面組件**: 每個 20-50KB

### 性能提升
- 首屏加載時間: 預計減少 60-70%
- 初始 JavaScript: 從 1.4MB 降至 ~300-400KB
- 網絡請求並行化: 按需路由時才加載對應 chunk
- 長期緩存效益: vendor chunks 不常變動

## 🚀 進一步優化建議

### 1. Mock 數據優化 (高優先級)

#### 方案 A: 環境變量條件導入
創建 `frontend/src/services/api.ts`:
```typescript
// 生產環境使用真實 API，開發環境使用 Mock
const apiService = import.meta.env.PROD
  ? await import('./realApi')
  : await import('./mockApi');

export default apiService;
```

#### 方案 B: 拆分 Mock 數據
將 `mockCases.ts` 按類型拆分：
- `mockCases/cases.ts`
- `mockCases/workflows.ts`
- `mockCases/users.ts`

#### 方案 C: 使用 JSON 文件
將靜態 Mock 數據移至 `public/mock-data/*.json`，需要時 fetch。

**建議**: 實施方案 A + B，生產環境完全移除 Mock 代碼。

### 2. 圖片優化
- 使用 WebP 格式
- 實施圖片懶加載
- 添加 blur-up placeholder

### 3. CSS 優化
- 啟用 Tailwind CSS JIT purge
- 移除未使用的 CSS 類

### 4. 第三方庫替代方案評估
考慮更輕量的替代：
- Recharts → Chart.js (更小)
- Leaflet → Mapbox GL JS Lite (如果需要進階功能)

### 5. 監控與分析
添加構建分析：
```bash
npm install --save-dev rollup-plugin-visualizer
```

在 `vite.config.ts` 中添加：
```typescript
import { visualizer } from 'rollup-plugin-visualizer';

plugins: [
  react(),
  visualizer({ open: true, gzipSize: true, brotliSize: true })
]
```

## 🧪 驗證步驟

1. 重新構建：
```bash
cd frontend
npm run build
```

2. 檢查產物大小：
```bash
ls -lh dist/assets/
```

3. 使用 Lighthouse 測試性能：
```bash
npm run preview
# 然後在 Chrome DevTools 中運行 Lighthouse
```

4. 檢查網絡瀑布圖：
   - 打開 DevTools Network 面板
   - 切換不同路由
   - 確認只加載必要的 chunks

## 📝 代碼審查檢查清單

- [x] 所有路由組件使用 lazy()
- [x] Suspense fallback 用戶體驗良好
- [x] Vite 配置正確分割 chunks
- [x] 大型組件懶加載
- [ ] Mock 數據生產環境移除
- [ ] 圖片資源優化
- [ ] 添加構建分析工具

## ⚠️ 注意事項

1. **Suspense 邊界**: 確保每個懶加載組件都有適當的 Suspense 邊界
2. **錯誤處理**: 添加 ErrorBoundary 處理懶加載失敗
3. **預加載**: 考慮在首頁添加關鍵路由的 `<link rel="prefetch">`
4. **測試**: 在慢速網絡下測試加載體驗
5. **SEO**: 確保 SSR 頁面（如果有）不受影響

## 📚 參考資源

- [Vite 代碼分割文檔](https://vitejs.dev/guide/build.html#chunking-strategy)
- [React.lazy 文檔](https://react.dev/reference/react/lazy)
- [Web.dev 性能優化指南](https://web.dev/performance/)

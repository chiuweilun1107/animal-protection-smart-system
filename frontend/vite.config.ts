import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // 提升 chunk 大小警告限制到 800KB (從 500KB)
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        // 手動控制代碼分割策略
        manualChunks: {
          // React 核心庫單獨打包
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],

          // 表單處理庫
          'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],

          // UI 組件庫
          'ui-vendor': ['lucide-react', 'clsx', 'tailwind-merge'],

          // 圖表庫 - 按需加載
          'charts': ['recharts'],

          // 地圖庫 - 按需加載
          'map': ['leaflet', 'react-leaflet'],

          // 工作流編輯器 - 按需加載
          'workflow': ['reactflow'],

          // Mock 服務 - 開發環境專用，生產環境可移除
          'mock-services': [
            './src/services/mockApi',
            './src/services/mockCases',
            './src/services/mockAIService',
          ],
        },
        // 為每個 chunk 生成更具描述性的名稱
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    // 啟用源碼映射用於生產環境除錯（可選）
    sourcemap: false,
    // 最小化代碼
    minify: 'esbuild',
    // 目標環境
    target: 'es2020',
  },
  // 優化依賴預構建
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'lucide-react',
    ],
    exclude: [
      // 大型庫延遲加載，不在啟動時預構建
      'leaflet',
      'reactflow',
      'recharts',
    ],
  },
})

# 介接日誌功能說明

## 功能概述

為 Integration.tsx 頁面添加了完整的介接日誌功能，提供詳細的介接執行歷史記錄與分析。

## 核心功能

### 1. 日誌取得與狀態管理
- **API 整合**: 使用 `mockApi.getIntegrationLogs()` 取得特定介接的日誌
- **自動加載**: 當用戶選擇不同介接時自動加載相應日誌
- **同步更新**: 執行「強制基線」同步後自動重新加載日誌
- **載入狀態**: 提供視覺化載入指示器（脈動圓點 + "載入中" 文字）

### 2. 日誌表格展示

#### 表格欄位
| 欄位 | 說明 | 格式 |
|-----|------|------|
| 時間 | 日誌記錄執行時間 | 本地化日期時間 (zh-TW) |
| 操作 | 執行的操作類型 | import/sync/query/export/... |
| 狀態 | 執行結果狀態 | 彩色標籤 |
| 記錄數 | 處理的記錄數量 | 數字 |
| 執行時間 | 操作耗時 | ms/s 格式 |
| 說明 | 詳細說明或錯誤訊息 | 錯誤圖標 + 訊息或元資料 |

### 3. 狀態標籤系統

#### 成功狀態 (Success)
- **背景**: 翠綠色 (emerald-100)
- **文字**: 翠綠色 (emerald-700)
- **顯示文字**: "成功"

#### 失敗狀態 (Failed)
- **背景**: 紅色 (red-100)
- **文字**: 紅色 (red-700)
- **顯示文字**: "失敗"
- **特殊**: 顯示錯誤訊息 + AlertTriangle 圖標

#### 部分成功狀態 (Partial)
- **背景**: 琥珀色 (amber-100)
- **文字**: 琥珀色 (amber-700)
- **顯示文字**: "部分成功"

### 4. 統計信息卡 (Footer Stats)

當存在日誌記錄時，頁面下方顯示四個統計卡：
- **成功**: 成功執行的日誌數 (綠色數字)
- **失敗**: 失敗執行的日誌數 (紅色數字)
- **部分成功**: 部分成功的日誌數 (琥珀色數字)
- **總記錄數**: 所有日誌中處理的總記錄數 (靛藍色數字)

### 5. 空狀態處理

當日誌為空時顯示：
- Activity 圖標 (置中)
- "暫無紀錄" 文字

### 6. 設計一致性

- **圓角**: rounded-[3rem] (主容器) 與 rounded-xl (標籤)
- **陰影**: shadow-2xl shadow-slate-200/50
- **色彩系統**: 完全遵循設計系統
  - 主色調: indigo-600
  - 成功: emerald
  - 失敗: red
  - 警告: amber
  - 中立: slate
- **排版**: font-black 用於強調，font-mono 用於時間戳與數據

## 技術實現細節

### State 管理
```typescript
const [integrationLogs, setIntegrationLogs] = useState<any[]>([]);
const [logsLoading, setLogsLoading] = useState(false);
```

### Effects 鉤子
1. 選擇介接時自動加載日誌
2. 同步後重新加載日誌

### 輔助函數

#### getStatusColor(status)
返回表格行的背景色根據狀態

#### getStatusBadgeColor(status)
返回狀態標籤的色彩類名

#### getStatusText(status)
將狀態代碼轉換為中文文字

#### formatDuration(ms)
將毫秒轉換為易讀格式 (ms 或 s)

## 使用流程

1. **進入介接頁面** → 頁面載入介接列表
2. **選擇介接** → 自動載入該介接的日誌
3. **查看日誌** → 表格顯示所有執行記錄
4. **執行同步** → 按「強制基線」按鈕 → 日誌自動更新
5. **分析統計** → 檢查底部統計卡了解整體執行狀況

## 數據結構

### 日誌對象格式
```typescript
interface IntegrationLog {
  id: string;
  integrationId: string;
  integrationType: string;  // '1999' | 'agriculture' | 'finance' | 'document'
  action: string;           // 'import' | 'sync' | 'query' | 'export'
  status: 'success' | 'failed' | 'partial';
  recordCount: number;      // 處理的記錄數
  executedAt: string;       // ISO 8601 時間戳
  duration: number;         // 毫秒
  errorMessage?: string;    // 失敗時的錯誤訊息
  metadata?: any;           // 額外資訊
}
```

## 圖標使用

- **Clock**: 日誌區塊標題
- **Activity**: 空狀態提示
- **AlertTriangle**: 錯誤訊息提示

## 響應式設計

### 統計卡網格
- **移動設備**: 2 列 (grid-cols-2)
- **桌面設備**: 4 列 (md:grid-cols-4)

### 表格
- **自動滾動**: 內容區使用 overflow-x-auto
- **固定欄位寬度**: 使用 px-8 py-5 統一間距

## 性能考慮

1. **條件渲染**: 統計卡僅在有日誌時呈現
2. **虛擬滾動準備**: 當日誌數量超過 100+ 時考慮使用虛擬滾動
3. **懶加載**: 日誌僅在介接選擇時加載

## 未來增強方向

1. 新增時間範圍篩選器
2. 新增狀態篩選功能
3. 新增搜尋功能 (按操作類型或錯誤訊息)
4. 導出日誌功能
5. 實時日誌流 (WebSocket)
6. 日誌詳情對話框 (點擊行展開)

## 兼容性

- ✅ React 18+ (使用 hooks)
- ✅ TypeScript (type-safe)
- ✅ Tailwind CSS v3+
- ✅ Lucide React (圖標庫)

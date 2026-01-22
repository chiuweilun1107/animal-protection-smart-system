# Users.tsx 進階功能 - 代碼示例

## 1. 狀態管理代碼

### 確認對話框狀態
```tsx
const [confirmDialog, setConfirmDialog] = useState<{
  show: boolean;
  type: 'freeze' | 'activate' | 'reset' | null;
  userId: string | null;
  userName: string | null;
}>({
  show: false,
  type: null,
  userId: null,
  userName: null
});
```

### 提示訊息狀態
```tsx
const [notification, setNotification] = useState<{
  show: boolean;
  type: 'success' | 'error';
  message: string;
}>({
  show: false,
  type: 'success',
  message: ''
});
```

---

## 2. 提示訊息自動隱藏 (useEffect)

```tsx
// 提示訊息自動隱藏
useEffect(() => {
  if (notification.show) {
    const timer = setTimeout(() => {
      setNotification({ ...notification, show: false });
    }, 3000);
    return () => clearTimeout(timer);
  }
}, [notification.show]);
```

**功能**:
- 監聽 `notification.show` 變化
- 3 秒後自動隱藏
- 組件卸載時清理計時器 (避免記憶洩漏)

---

## 3. 事件處理函數

### 凍結帳戶
```tsx
const handleFreezeAccount = async (userId: string, userName: string) => {
  setConfirmDialog({
    show: true,
    type: 'freeze',
    userId,
    userName
  });
};
```

### 啟用帳戶
```tsx
const handleActivateAccount = async (userId: string, userName: string) => {
  setConfirmDialog({
    show: true,
    type: 'activate',
    userId,
    userName
  });
};
```

### 密碼重設
```tsx
const handleResetPassword = async (userId: string, userName: string) => {
  setConfirmDialog({
    show: true,
    type: 'reset',
    userId,
    userName
  });
};
```

### 確認操作 (核心邏輯)
```tsx
const confirmAction = async () => {
  const { type, userId } = confirmDialog;
  if (!type || !userId) return;

  try {
    let success = false;
    let message = '';

    if (type === 'freeze') {
      success = await mockApi.freezeAccount(userId, '由管理員凍結');
      message = '帳戶已凍結';
    } else if (type === 'activate') {
      success = await mockApi.activateAccount(userId);
      message = '帳戶已啟用';
    } else if (type === 'reset') {
      const tempPassword = await mockApi.resetPassword(userId);
      success = !!tempPassword;
      message = `密碼已重設，臨時密碼已發送至郵箱：${tempPassword}`;
    }

    if (success) {
      showNotification('success', message);
      await loadUsers();  // 重新載入列表
    } else {
      showNotification('error', '操作失敗，請稍後重試');
    }
  } catch (error) {
    console.error('Action failed:', error);
    showNotification('error', '操作過程中發生錯誤');
  } finally {
    // 關閉確認對話框
    setConfirmDialog({ show: false, type: null, userId: null, userName: null });
  }
};
```

**流程分析**:
1. 驗證參數 (type 和 userId 必須存在)
2. 根據操作類型呼叫對應 API
3. 成功時：顯示成功訊息 → 重新載入列表
4. 失敗時：顯示錯誤訊息
5. 最後關閉確認對話框

---

## 4. 表格行 - 操作按鈕 (Hover 顯示)

```tsx
<td className="px-6 md:px-8 py-6 md:py-8 text-right">
  <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity flex-wrap">

    {/* 編輯按鈕 */}
    <button
      onClick={() => handleEdit(user)}
      className="p-3 bg-white border border-slate-200 text-slate-900 rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-sm"
      title="編輯用戶"
    >
      <Edit2 size={16} />
    </button>

    {/* 條件渲染: 凍結或啟用按鈕 */}
    {user.status === 'active' ? (
      <button
        onClick={() => handleFreezeAccount(user.id, user.name)}
        className="p-3 bg-white border border-amber-200 text-amber-600 rounded-xl hover:bg-amber-600 hover:text-white hover:border-amber-600 transition-all shadow-sm"
        title="凍結帳戶"
      >
        <Lock size={16} />
      </button>
    ) : (
      <button
        onClick={() => handleActivateAccount(user.id, user.name)}
        className="p-3 bg-white border border-emerald-200 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all shadow-sm"
        title="啟用帳戶"
      >
        <Unlock size={16} />
      </button>
    )}

    {/* 密碼重設按鈕 */}
    <button
      onClick={() => handleResetPassword(user.id, user.name)}
      className="p-3 bg-white border border-indigo-200 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-sm"
      title="重設密碼"
    >
      <KeyRound size={16} />
    </button>

    {/* 刪除按鈕 */}
    <button
      className="p-3 text-slate-400 hover:text-red-600 transition-colors"
      title="刪除用戶"
    >
      <Trash2 size={16} />
    </button>

  </div>
</td>
```

**CSS 特色**:
- `opacity-100 md:opacity-0 group-hover:opacity-100` - MD+ 屏幕 hover 顯示
- `flex-wrap` - 按鈕自動換行
- 每個按鈕有 `title` 屬性 (無障礙)

---

## 5. 確認對話框 (條件渲染)

```tsx
{confirmDialog.show && (
  <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">

      {/* 標題欄 */}
      <div className="px-6 md:px-8 py-6 md:py-8 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
        <AlertCircle className="text-amber-600 flex-shrink-0" size={24} />
        <h3 className="text-lg font-black text-slate-900 uppercase">確認操作</h3>
      </div>

      {/* 內容區 */}
      <div className="p-6 md:p-8 space-y-4">
        <p className="text-base font-bold text-slate-700">
          {confirmDialog.type === 'freeze' && `確定要凍結 "${confirmDialog.userName}" 的帳戶嗎？`}
          {confirmDialog.type === 'activate' && `確定要啟用 "${confirmDialog.userName}" 的帳戶嗎？`}
          {confirmDialog.type === 'reset' && `確定要重設 "${confirmDialog.userName}" 的密碼嗎？`}
        </p>
        <p className="text-sm text-slate-500">
          {confirmDialog.type === 'freeze' && '凍結後該用戶將無法登入系統。'}
          {confirmDialog.type === 'activate' && '啟用後該用戶可以正常登入系統。'}
          {confirmDialog.type === 'reset' && '臨時密碼將通過郵件發送給用戶。'}
        </p>
      </div>

      {/* 操作按鈕欄 */}
      <div className="px-6 md:px-8 py-6 md:py-8 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
        <button
          onClick={() => setConfirmDialog({ show: false, type: null, userId: null, userName: null })}
          className="px-6 py-3 bg-slate-100 text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-colors"
        >
          取消
        </button>
        <button
          onClick={confirmAction}
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/30"
        >
          確認
        </button>
      </div>

    </div>
  </div>
)}
```

**設計特色**:
- 完全居中的固定位置對話框
- 毛玻璃背景 + 半透明黑色遮罩
- AlertCircle 圖標 (琥珀色)
- Zoom-in 動畫
- 三個清晰的內容區: 標題、訊息、按鈕

---

## 6. 提示訊息 (Toast Notification)

```tsx
{notification.show && (
  <div className={`fixed top-4 right-4 px-6 py-4 rounded-2xl shadow-lg animate-in slide-in-from-top duration-300 flex items-center gap-3 max-w-sm ${
    notification.type === 'success'
      ? 'bg-emerald-50 border border-emerald-200'
      : 'bg-red-50 border border-red-200'
  }`}>
    {notification.type === 'success' ? (
      <CheckCircle className="text-emerald-600 flex-shrink-0" size={20} />
    ) : (
      <XCircle className="text-red-600 flex-shrink-0" size={20} />
    )}
    <p className={`font-bold text-sm ${
      notification.type === 'success' ? 'text-emerald-900' : 'text-red-900'
    }`}>
      {notification.message}
    </p>
  </div>
)}
```

**功能特色**:
- 動態背景色 (成功: 綠色 | 錯誤: 紅色)
- 對應的圖標和文字顏色
- 固定位置在右上角
- Slide-in 動畫從頂部滑入
- 3 秒後自動隱藏 (由 useEffect 控制)

---

## 7. 使用示例 - 完整流程

### 場景: 凍結用戶 "李承辦人"

**步驟 1**: 用戶表格中 hover 李承辦人的行
```
操作按鈕出現 (Fade in 效果)
```

**步驟 2**: 點擊 Lock 圖標
```tsx
handleFreezeAccount('u2', '李承辦人')
// 狀態更新:
confirmDialog = {
  show: true,
  type: 'freeze',
  userId: 'u2',
  userName: '李承辦人'
}
```

**步驟 3**: 對話框彈出
```
┌─────────────────────────────────────┐
│ ⚠ 確認操作                           │
├─────────────────────────────────────┤
│ 確定要凍結 "李承辦人" 的帳戶嗎？    │
│ 凍結後該用戶將無法登入系統。        │
├─────────────────────────────────────┤
│              [取消] [確認]            │
└─────────────────────────────────────┘
```

**步驟 4**: 點擊 [確認]
```tsx
confirmAction()
// 執行:
success = await mockApi.freezeAccount('u2', '由管理員凍結')
// 結果: true
showNotification('success', '帳戶已凍結')
await loadUsers() // 重新載入列表
// 對話框關閉
confirmDialog.show = false
```

**步驟 5**: 成功提示
```
右上角出現綠色提示:
✓ 帳戶已凍結
(3 秒後自動消失)
```

**步驟 6**: 表格自動更新
```
李承辦人的行:
- 狀態改為 "frozen"
- Lock 按鈕變成 Unlock 按鈕 (翠綠色)
```

---

## 8. 導入的新依賴

```tsx
import { useEffect, useState } from 'react';
import {
  Plus, Edit2, Trash2, Search, Filter,
  ShieldCheck, UserCheck, ShieldAlert,
  Mail, Phone, X,
  Lock,         // 凍結按鈕
  Unlock,       // 啟用按鈕
  KeyRound,     // 密碼重設按鈕
  AlertCircle,  // 確認對話框標題圖標
  CheckCircle,  // 成功提示圖標
  XCircle       // 錯誤提示圖標
} from 'lucide-react';
```

---

## 9. 相關 API 簽名

### mockApi.freezeAccount()
```typescript
async freezeAccount(userId: string, reason: string): Promise<boolean>

Example:
const success = await mockApi.freezeAccount('u2', '由管理員凍結');
// 返回 true / false
// 副作用: 更新用戶狀態為 'frozen'，記錄審計日誌
```

### mockApi.activateAccount()
```typescript
async activateAccount(userId: string): Promise<boolean>

Example:
const success = await mockApi.activateAccount('u2');
// 返回 true / false
// 副作用: 更新用戶狀態為 'active'，記錄審計日誌
```

### mockApi.resetPassword()
```typescript
async resetPassword(userId: string): Promise<string>

Example:
const tempPassword = await mockApi.resetPassword('u2');
// 返回臨時密碼字符串 (e.g. "a1b2c3d4")
// 副作用: 生成臨時密碼，記錄審計日誌
```

---

## 10. TypeScript 類型定義

```typescript
// User 狀態類型 (來自 /types/schema.ts)
type UserStatus = 'active' | 'inactive' | 'frozen';

// 確認對話框狀態類型
type ConfirmDialogType = {
  show: boolean;
  type: 'freeze' | 'activate' | 'reset' | null;
  userId: string | null;
  userName: string | null;
};

// 提示訊息狀態類型
type NotificationType = {
  show: boolean;
  type: 'success' | 'error';
  message: string;
};
```

---

## 11. CSS 工具類參考

### Flexbox
- `flex items-center justify-end` - 垂直居中，右對齐
- `flex-wrap` - 按鈕自動換行

### 尺寸
- `gap-2` / `gap-3` - 元素間距
- `p-4` / `p-6` / `p-8` - 內邊距
- `w-full` / `max-w-md` - 寬度

### 圓角
- `rounded-xl` - 中等圓角 (8px)
- `rounded-2xl` - 大圓角 (16px)
- `rounded-[2rem]` - 自定義大圓角 (32px)

### 陰影
- `shadow-sm` - 輕微陰影
- `shadow-2xl` - 重陰影
- `shadow-lg shadow-indigo-600/30` - 彩色陰影

### 背景
- `bg-slate-50` / `bg-slate-100` - 淺灰色背景
- `bg-emerald-50` / `bg-red-50` - 彩色背景
- `bg-slate-900/40` - 半透明黑色

### 邊框
- `border border-slate-200` - 灰色邊框
- `border-emerald-200` / `border-red-200` - 彩色邊框

### 過渡
- `transition-all` - 所有屬性過渡
- `transition-colors` - 顏色過渡
- `transition-opacity` - 透明度過渡

### 動畫
- `animate-in fade-in` - 淡入
- `animate-in zoom-in-95` - 縮放進入
- `animate-in slide-in-from-top` - 從頂部滑入

### 响應式
- `md:opacity-0 group-hover:opacity-100` - MD+ hover 顯示
- `md:px-8 md:py-8` - 桌面版內邊距

---

**完整文件**: `/frontend/src/pages/admin/Users.tsx` (487 行)

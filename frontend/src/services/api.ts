/**
 * API 服務統一入口
 *
 * 開發環境使用 Mock API，生產環境使用真實 API
 * 這樣可以在生產構建時完全移除 Mock 數據代碼，減少 bundle 大小
 */

// 動態導入 API 服務 (使用寬鬆類型以兼容 mockApi 的完整接口)
const loadApiService = async (): Promise<any> => {
  if (import.meta.env.PROD) {
    // 生產環境：使用真實 API（未實現則返回空實現）
    console.warn('生產環境 API 尚未實現，使用 Mock 數據');
    // TODO: 替換為真實 API
    // return await import('./realApi').then(m => m.default);
    return await import('./mockApi').then(m => m.mockApi);
  } else {
    // 開發環境：使用 Mock API
    return await import('./mockApi').then(m => m.mockApi);
  }
};

// 創建單例 API 服務
let apiInstance: any = null;

export const getApiService = async (): Promise<any> => {
  if (!apiInstance) {
    apiInstance = await loadApiService();
  }
  return apiInstance;
};

// 導出默認實例（保持向後兼容，直接重新導出 mockApi）
// 注意：實際使用時建議直接導入 mockApi，此文件僅用於未來切換到真實 API
export { mockApi } from './mockApi';
export { mockAIService } from './mockAIService';

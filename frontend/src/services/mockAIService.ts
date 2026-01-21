import type { AIResponse } from '../components/ai-assistant/types';

export const mockAIService = {
  async sendMessage(message: string): Promise<AIResponse> {
    // 模擬網絡延遲
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));

    const responses: Record<string, string> = {
      案件:
        '我可以幫您查詢案件狀態、統計數據或進行案件分析。請告訴我您想了解什麼具體的案件資訊？',
      統計:
        '讓我為您統計相關數據。請問您想查看哪個時間段或類型的統計資訊？例如：今日、本週或本月的案件統計。',
      緊急:
        '根據系統數據，本週共發生 12 起緊急事件，其中已解決 8 起，還有 4 起正在處理中。需要我查看具體的緊急案件詳情嗎？',
      事件:
        '本週共發生 47 起事件，包括 12 起緊急事件、18 起普通事件和 17 起低優先級事件。您想了解哪一類的具體情況？',
      幫助:
        '我可以協助您以下方面：\n1. 查詢案件資訊和狀態\n2. 統計數據分析\n3. 工作流程說明\n4. 系統操作指引\n\n請告訴我您需要幫助的具體項目。',
      hello: '您好！我是 AI 助手，很高興為您服務。有什麼可以幫您的嗎？',
      你好: '您好！我是 AI 助手，很高興為您服務。有什麼可以幫您的嗎？'
    };

    // 簡單的關鍵字匹配
    let responseText = '我理解您的問題了。讓我來幫您處理。';
    for (const [key, response] of Object.entries(responses)) {
      if (message.includes(key)) {
        responseText = response;
        break;
      }
    }

    return {
      message: responseText,
      timestamp: new Date(),
      suggestions: ['查看今日案件統計', '查詢待處理案件', '系統操作說明', '返回首頁']
    };
  }
};

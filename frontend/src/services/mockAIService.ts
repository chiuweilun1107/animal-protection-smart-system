import type { AIResponse, Link } from '../components/ai-assistant/types';

export const mockAIService = {
  async sendMessage(message: string): Promise<AIResponse> {
    // 模擬網絡延遲
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));

    const responses: Record<string, { text: string; links?: Link[] }> = {
      案件: {
        text: '我可以幫您查詢案件狀態、統計數據或進行案件分析。請告訴我您想了解什麼具體的案件資訊？',
        links: [
          { text: '查看所有案件', url: '/admin/cases', label: '案件管理' }
        ]
      },
      統計: {
        text: '讓我為您統計相關數據。請問您想查看哪個時間段或類型的統計資訊？例如：今日、本週或本月的案件統計。',
        links: [
          { text: '前往報表中心', url: '/admin/reports', label: '數據分析' }
        ]
      },
      緊急: {
        text: '根據系統數據，本週共發生 12 起緊急事件，其中已解決 8 起，還有 4 起正在處理中。需要我查看具體的緊急案件詳情嗎？',
        links: [
          { text: '查看緊急案件列表', url: '/admin/cases?priority=critical', label: '緊急案件' },
          { text: '查看詳細報告', url: '/admin/reports?priority=critical', label: '報表' }
        ]
      },
      事件: {
        text: '本週共發生 47 起事件，包括 12 起緊急事件、18 起普通事件和 17 起低優先級事件。您想了解哪一類的具體情況？',
        links: [
          { text: '查看事件統計', url: '/admin/analytics', label: '分析' },
          { text: '詳細報表', url: '/admin/reports', label: '報告' }
        ]
      },
      報告: {
        text: '我已為您準備了相關的統計報告和分析圖表。以下是相關資源連結：',
        links: [
          { text: '本週案件統計報告', url: '/admin/reports', label: '週報告' },
          { text: '緊急事件分析圖表', url: '/admin/analytics', label: '分析圖表' },
          { text: '案件管理詳情', url: '/admin/cases', label: '案件詳情' },
          { text: '系統審計日誌', url: '/admin/audit-logs', label: '審計' }
        ]
      },
      幫助: {
        text: '我可以協助您以下方面：\n1. 查詢案件資訊和狀態\n2. 統計數據分析\n3. 工作流程說明\n4. 系統操作指引\n\n請告訴我您需要幫助的具體項目。',
        links: [
          { text: '用戶管理指南', url: '/admin/users', label: '用戶' },
          { text: '工作流程設置', url: '/admin/workflows', label: '工作流' }
        ]
      },
      hello: {
        text: '您好！我是 AI 助手，很高興為您服務。有什麼可以幫您的嗎？',
        links: [
          { text: '前往儀表板', url: '/admin/dashboard', label: '儀表板' }
        ]
      },
      你好: {
        text: '您好！我是 AI 助手，很高興為您服務。有什麼可以幫您的嗎？',
        links: [
          { text: '前往儀表板', url: '/admin/dashboard', label: '儀表板' }
        ]
      }
    };

    // 簡單的關鍵字匹配
    let responseData: { text: string; links?: Link[] } = { text: '我理解您的問題了。讓我來幫您處理。', links: undefined };
    for (const [key, data] of Object.entries(responses)) {
      if (message.includes(key)) {
        responseData = data;
        break;
      }
    }

    return {
      message: responseData.text,
      timestamp: new Date(),
      links: responseData.links,
      suggestions: ['查看今日案件統計', '查詢待處理案件', '系統操作說明', '返回首頁']
    };
  }
};

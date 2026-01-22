import { AlertTriangle, ExternalLink, CheckCircle2, XCircle } from 'lucide-react';
import type { Case } from '../types/schema';

interface DuplicateAlertProps {
    matchType: 'external_id' | 'chip_id' | 'location' | 'manual' | null;
    matchedCase: Case | null;
    confidence: number;
    message: string;
    onViewCase?: () => void;
    onProceedAnyway?: () => void;
    onCancel?: () => void;
}

export default function DuplicateAlert({
    matchType,
    matchedCase,
    confidence,
    message,
    onViewCase,
    onProceedAnyway,
    onCancel
}: DuplicateAlertProps) {
    if (!matchedCase) return null;

    // 根據相似度決定警示級別
    const getAlertLevel = () => {
        if (confidence >= 0.9) return 'critical';
        if (confidence >= 0.75) return 'high';
        return 'medium';
    };

    const alertLevel = getAlertLevel();

    const styles = {
        critical: {
            bg: 'bg-white',
            border: 'border-red-500 border-2',
            icon: 'bg-red-500 text-white',
            title: 'text-red-600',
            glow: 'shadow-[0_8px_30px_rgb(239,68,68,0.2)]'
        },
        high: {
            bg: 'bg-white',
            border: 'border-orange-500 border-2',
            icon: 'bg-orange-500 text-white',
            title: 'text-orange-600',
            glow: 'shadow-[0_8px_30px_rgb(249,115,22,0.2)]'
        },
        medium: {
            bg: 'bg-white',
            border: 'border-yellow-400 border-2',
            icon: 'bg-yellow-400 text-black',
            title: 'text-yellow-600',
            glow: 'shadow-[0_8px_30px_rgb(250,204,21,0.2)]'
        }
    };

    const style = styles[alertLevel];

    const getMatchTypeLabel = () => {
        const labels = {
            external_id: '外部編號完全相同',
            chip_id: '寵物晶片號碼相同',
            location: '時間地點高度相似',
            manual: '手動關聯'
        };
        return matchType ? labels[matchType] : '';
    };

    return (
        <div className={`rounded-xl border ${style.border} ${style.bg} backdrop-blur-sm p-6 shadow-xl ${style.glow}`}>
            <div className="flex items-start gap-4">
                {/* 圖示 */}
                <div className={`p-3 rounded-lg bg-slate-900/50 ${style.icon}`}>
                    <AlertTriangle className="w-6 h-6" />
                </div>

                {/* 內容 */}
                <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                        <div>
                            <h3 className={`text-lg font-bold ${style.title} mb-1`}>
                                偵測到疑似重複案件
                            </h3>
                            <p className="text-sm text-slate-400">
                                {message}
                            </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${style.bg} ${style.title} border ${style.border}`}>
                            相似度 {(confidence * 100).toFixed(0)}%
                        </span>
                    </div>

                    {/* 比對資訊 */}
                    <div className="bg-slate-900/50 rounded-lg p-4 mb-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-slate-500">比對方式</span>
                                <p className={`font-bold mt-1 ${style.title}`}>
                                    {getMatchTypeLabel()}
                                </p>
                            </div>
                            <div>
                                <span className="text-slate-500">現有案件編號</span>
                                <p className="text-white font-mono mt-1">
                                    {matchedCase.id}
                                </p>
                            </div>
                            <div>
                                <span className="text-slate-500">案件標題</span>
                                <p className="text-white mt-1">
                                    {matchedCase.title}
                                </p>
                            </div>
                            <div>
                                <span className="text-slate-500">案件狀態</span>
                                <p className="text-white mt-1">
                                    <StatusBadge status={matchedCase.status} />
                                </p>
                            </div>
                        </div>

                        {matchedCase.location && (
                            <div className="mt-3 pt-3 border-t border-slate-800/50">
                                <span className="text-slate-500 text-sm">地點</span>
                                <p className="text-white mt-1">{matchedCase.location}</p>
                            </div>
                        )}
                    </div>

                    {/* 操作按鈕 */}
                    <div className="flex items-center gap-3">
                        {onViewCase && (
                            <button
                                onClick={onViewCase}
                                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold rounded-lg transition-all duration-200 shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2"
                            >
                                <ExternalLink className="w-4 h-4" />
                                查看現有案件
                            </button>
                        )}

                        {onProceedAnyway && (
                            <button
                                onClick={onProceedAnyway}
                                className="flex-1 px-4 py-2.5 bg-slate-700/50 hover:bg-slate-600/50 text-white font-bold rounded-lg transition-all duration-200 border border-slate-600/50 flex items-center justify-center gap-2"
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                仍要建立新案件
                            </button>
                        )}

                        {onCancel && (
                            <button
                                onClick={onCancel}
                                className="px-4 py-2.5 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 font-bold rounded-lg transition-all duration-200 border border-slate-700/50 flex items-center justify-center gap-2"
                            >
                                <XCircle className="w-4 h-4" />
                                取消
                            </button>
                        )}
                    </div>

                    {/* 提示文字 */}
                    {alertLevel === 'critical' && (
                        <p className="mt-3 text-xs text-slate-500 flex items-center gap-2">
                            <AlertTriangle className="w-3 h-3" />
                            建議：相似度極高，強烈建議先確認現有案件以避免重複處理
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

// 狀態標籤組件
function StatusBadge({ status }: { status: string }) {
    const statusConfig: Record<string, { label: string; className: string }> = {
        pending: { label: '待處理', className: 'bg-yellow-500/20 text-yellow-400' },
        authorized: { label: '已授理', className: 'bg-blue-500/20 text-blue-400' },
        assigned: { label: '已分派', className: 'bg-purple-500/20 text-purple-400' },
        processing: { label: '處理中', className: 'bg-cyan-500/20 text-cyan-400' },
        transferred: { label: '轉移中', className: 'bg-indigo-500/20 text-indigo-400' },
        completed: { label: '已完成', className: 'bg-green-500/20 text-green-400' },
        resolved: { label: '已結案', className: 'bg-green-600/20 text-green-500' },
        rejected: { label: '責撤', className: 'bg-red-500/20 text-red-400' },
        overdue: { label: '超期', className: 'bg-red-600/20 text-red-500' }
    };

    const config = statusConfig[status] || { label: status, className: 'bg-slate-500/20 text-slate-400' };

    return (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${config.className}`}>
            {config.label}
        </span>
    );
}

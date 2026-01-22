/**
 * 統一的加載中組件
 * 用於 Suspense fallback
 */
export const LoadingFallback = ({ message = '載入中...' }: { message?: string }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
      <p className="text-slate-600 font-medium">{message}</p>
    </div>
  );
};

/**
 * 小型內聯加載組件
 */
export const InlineLoader = () => (
  <div className="flex items-center justify-center p-4">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

import { useCallback, useState, useEffect } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
  Handle,
  Position,
  type Node,
  type Edge,
  type NodeTypes,
  type OnConnect,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Plus, Save, Trash2 } from 'lucide-react';

// 自定義節點樣式（n8n 風格：左右連接）
const CustomNode = ({ data }: any) => {
  return (
    <div className="relative group">
      {/* 左側輸入連接點 - 接收來自其他節點的連接 */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-5 h-5 !bg-blue-600 !border-4 !border-white !rounded-full hover:!scale-150 transition-all shadow-lg"
        style={{ left: -10 }}
      />

      <div className="px-6 py-4 bg-white border-2 border-slate-950 shadow-lg min-w-[220px] hover:shadow-2xl transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-black text-slate-400 uppercase tracking-widest">
            步驟 {data.order}
          </div>
          {data.status === 'completed' && (
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
          )}
        </div>
        <div className="text-lg font-black text-slate-950 uppercase mb-2">
          {data.label}
        </div>
        <div className="text-sm text-slate-500 font-medium">
          {data.description}
        </div>
        {data.requiredFields && data.requiredFields.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {data.requiredFields.map((field: string, idx: number) => (
              <span
                key={idx}
                className="text-xs font-black uppercase tracking-wider text-slate-400 border border-slate-200 px-1 py-0.5"
              >
                {field}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 右側輸出連接點 - 拖動此點連接到其他節點 */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-5 h-5 !bg-emerald-600 !border-4 !border-white !rounded-full hover:!scale-150 transition-all shadow-lg"
        style={{ right: -10 }}
      />

      {/* Hover 時顯示提示 */}
      <div className="absolute -right-24 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="bg-slate-950 text-white px-3 py-1 text-xs font-black uppercase tracking-wider whitespace-nowrap">
          拖動 →
        </div>
      </div>
    </div>
  );
};

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

interface WorkflowEditorProps {
  workflowId: string;
  workflowName: string;
  initialSteps: any[];
  onSave?: (nodes: Node[], edges: Edge[]) => void;
}

export function WorkflowEditor({ workflowId, workflowName, initialSteps, onSave }: WorkflowEditorProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [showNodeForm, setShowNodeForm] = useState(false);
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [selectedEdges, setSelectedEdges] = useState<string[]>([]);
  const [newNodeData, setNewNodeData] = useState({
    label: '',
    description: '',
    requiredFields: '',
  });

  // 初始化節點和連接線（橫向排列，n8n 風格）
  const initializeFlow = useCallback(() => {
    const initialNodes: Node[] = initialSteps.map((step, idx) => ({
      id: step.id,
      type: 'custom',
      position: { x: idx * 320 + 50, y: 200 }, // 橫向排列
      data: {
        label: step.name,
        description: step.description,
        order: step.order,
        status: step.status,
        requiredFields: step.requiredFields || [],
      },
    }));

    const initialEdges: Edge[] = [];
    for (let i = 0; i < initialSteps.length - 1; i++) {
      initialEdges.push({
        id: `e${initialSteps[i].id}-${initialSteps[i + 1].id}`,
        source: initialSteps[i].id,
        target: initialSteps[i + 1].id,
        type: 'default', // 使用貝塞爾曲線，更像 n8n
        animated: true,
        style: {
          stroke: '#10b981',
          strokeWidth: 3,
        },
        markerEnd: {
          type: 'arrowclosed' as any,
          color: '#10b981',
        },
      });
    }

    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialSteps, setNodes, setEdges]);

  // 組件載入時初始化
  useEffect(() => {
    if (initialSteps.length > 0) {
      initializeFlow();
    }
  }, [initialSteps, initializeFlow]);

  const onConnect: OnConnect = useCallback(
    (params) => {
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: 'default', // 貝塞爾曲線
            animated: true,
            style: {
              stroke: '#10b981',
              strokeWidth: 3,
            },
            markerEnd: {
              type: 'arrowclosed' as any,
              color: '#10b981',
            },
          },
          eds
        )
      );
    },
    [setEdges]
  );

  const handleAddNode = () => {
    const newId = `s${nodes.length + 1}`;
    const newNode: Node = {
      id: newId,
      type: 'custom',
      position: { x: nodes.length * 320 + 50, y: 200 }, // 橫向排列
      data: {
        label: newNodeData.label,
        description: newNodeData.description,
        order: nodes.length + 1,
        status: 'pending',
        requiredFields: newNodeData.requiredFields
          ? newNodeData.requiredFields.split(',').map((f) => f.trim())
          : [],
      },
    };

    setNodes((nds) => [...nds, newNode]);
    setShowNodeForm(false);
    setNewNodeData({ label: '', description: '', requiredFields: '' });
  };

  const handleSave = () => {
    if (onSave) {
      onSave(nodes, edges);
    }
    alert('工作流程已儲存！（Demo 模式：僅前端更新）');
  };

  const handleReset = () => {
    if (confirm('確定要重設為原始流程嗎？')) {
      initializeFlow();
    }
  };

  const handleDeleteSelected = useCallback(() => {
    // 刪除選中的節點
    if (selectedNodes.length > 0) {
      setNodes((nds) => nds.filter((node) => !selectedNodes.includes(node.id)));
      setSelectedNodes([]);
    }
    // 刪除選中的連接線
    if (selectedEdges.length > 0) {
      setEdges((eds) => eds.filter((edge) => !selectedEdges.includes(edge.id)));
      setSelectedEdges([]);
    }
  }, [selectedNodes, selectedEdges, setNodes, setEdges]);

  // 監聽選中狀態變化
  const onSelectionChange = useCallback(({ nodes, edges }: { nodes: Node[]; edges: Edge[] }) => {
    setSelectedNodes(nodes.map((n) => n.id));
    setSelectedEdges(edges.map((e) => e.id));
  }, []);

  // 鍵盤快捷鍵 - Delete/Backspace
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Delete' || event.key === 'Backspace') {
        // 防止在輸入框中觸發刪除
        const target = event.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
          return;
        }
        event.preventDefault();
        handleDeleteSelected();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleDeleteSelected]);

  return (
    <div className="h-full flex flex-col">
      {/* 工具列 */}
      <div className="flex items-center justify-between p-4 border-b-2 border-slate-100 bg-white">
        <div>
          <h3 className="text-2xl font-black text-slate-950 uppercase tracking-tight">
            {workflowName}
          </h3>
          <div className="space-y-1">
            <div className="flex items-center gap-4 text-sm font-black uppercase tracking-widest">
              <span className="text-slate-400">
                🟢 從右側<span className="text-emerald-600">綠點</span>拖到左側<span className="text-blue-600">藍點</span>建立連接
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-400">
                🖱️ 點擊選中
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-400">
                ⌨️ Delete 刪除
              </span>
            </div>
            {(selectedNodes.length > 0 || selectedEdges.length > 0) && (
              <p className="text-sm font-black text-blue-600 uppercase tracking-widest">
                ✓ 已選中 {selectedNodes.length} 個節點、{selectedEdges.length} 條連接線
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowNodeForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-slate-950 text-white hover:bg-blue-600 transition-colors font-black text-sm uppercase tracking-widest"
          >
            <Plus size={16} /> 新增步驟
          </button>
          {(selectedNodes.length > 0 || selectedEdges.length > 0) && (
            <button
              onClick={handleDeleteSelected}
              className="flex items-center gap-2 px-6 py-3 bg-rose-600 text-white hover:bg-rose-700 transition-colors font-black text-sm uppercase tracking-widest"
            >
              <Trash2 size={16} /> 刪除選中 ({selectedNodes.length + selectedEdges.length})
            </button>
          )}
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-6 py-3 border-2 border-slate-200 text-slate-400 hover:text-slate-950 hover:border-slate-950 transition-colors font-black text-sm uppercase tracking-widest"
          >
            <Trash2 size={16} /> 重設
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white hover:bg-emerald-700 transition-colors font-black text-sm uppercase tracking-widest"
          >
            <Save size={16} /> 儲存
          </button>
        </div>
      </div>

      {/* React Flow 畫布 */}
      <div className="flex-1 bg-slate-50">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onSelectionChange={onSelectionChange}
          nodeTypes={nodeTypes}
          fitView
          className="bg-slate-50"
          deleteKeyCode={null}
          connectionLineStyle={{ stroke: '#10b981', strokeWidth: 3 }}
          defaultEdgeOptions={{
            animated: true,
            style: { stroke: '#10b981', strokeWidth: 3 },
          }}
        >
          <Controls className="bg-white border-2 border-slate-950 shadow-lg" />
          <MiniMap
            className="bg-white border-2 border-slate-950 shadow-lg"
            nodeColor={(node) => {
              if (node.selected) return '#3b82f6';
              return '#0f172a';
            }}
            maskColor="rgba(0, 0, 0, 0.1)"
          />
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#cbd5e1" />
        </ReactFlow>
      </div>

      {/* 新增節點表單 */}
      {showNodeForm && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl border-2 border-slate-950 p-8">
            <h3 className="text-3xl font-black text-slate-950 uppercase mb-6">新增流程步驟</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-2">
                  步驟名稱
                </label>
                <input
                  type="text"
                  value={newNodeData.label}
                  onChange={(e) => setNewNodeData({ ...newNodeData, label: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-slate-200 focus:border-slate-950 outline-none font-bold text-lg"
                  placeholder="例如：初步審查"
                />
              </div>
              <div>
                <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-2">
                  步驟描述
                </label>
                <textarea
                  value={newNodeData.description}
                  onChange={(e) => setNewNodeData({ ...newNodeData, description: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-slate-200 focus:border-slate-950 outline-none font-medium text-base"
                  rows={3}
                  placeholder="描述此步驟的具體內容"
                />
              </div>
              <div>
                <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-2">
                  必填欄位（以逗號分隔）
                </label>
                <input
                  type="text"
                  value={newNodeData.requiredFields}
                  onChange={(e) => setNewNodeData({ ...newNodeData, requiredFields: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-slate-200 focus:border-slate-950 outline-none font-medium text-base"
                  placeholder="例如：地址,照片,聯絡人"
                />
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button
                onClick={() => {
                  setShowNodeForm(false);
                  setNewNodeData({ label: '', description: '', requiredFields: '' });
                }}
                className="flex-1 py-4 border-2 border-slate-200 text-slate-400 hover:text-slate-950 hover:border-slate-950 font-black text-base uppercase tracking-widest transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleAddNode}
                disabled={!newNodeData.label}
                className="flex-1 py-4 bg-slate-950 text-white font-black text-base uppercase tracking-widest hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                新增步驟
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

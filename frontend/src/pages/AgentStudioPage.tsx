import { useState, useCallback } from 'react';
import ReactFlow, {
  addEdge, Background, Controls, MiniMap,
  useNodesState, useEdgesState, Connection, Node,
  MarkerType, ReactFlowProvider
} from 'reactflow';
import 'reactflow/dist/style.css';

const initialNodes: Node[] = [
  { id: '1', type: 'input', position: { x: 250, y: 0 }, data: { label: '📥 User Input' } },
  { id: '2', position: { x: 250, y: 120 }, data: { label: '🧠 LLM Think' } },
  { id: '3', position: { x: 100, y: 250 }, data: { label: '🔧 Tool Call' } },
  { id: '4', position: { x: 400, y: 250 }, data: { label: '🤔 Analyze' } },
  { id: '5', type: 'output', position: { x: 250, y: 380 }, data: { label: '💬 Response' } },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e2-3', source: '2', target: '3', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e2-4', source: '2', target: '4', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e3-5', source: '3', target: '5', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e4-5', source: '4', target: '5', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
];

function StudioContent() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const onConnect = useCallback((params: Connection) => {
    setEdges(eds => addEdge({ ...params, animated: true, markerEnd: { type: MarkerType.ArrowClosed } }, eds));
  }, [setEdges]);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const addNode = (type: string, label: string) => {
    const id = String(Date.now());
    const newNode: Node = {
      id,
      type: type as any,
      position: { x: 100 + Math.random() * 400, y: 100 + Math.random() * 300 },
      data: { label }
    };
    setNodes(nds => [...nds, newNode]);
  };

  const deleteSelected = () => {
    if (!selectedNode) return;
    setNodes(nds => nds.filter(n => n.id !== selectedNode.id));
    setEdges(eds => eds.filter(e => e.source !== selectedNode.id && e.target !== selectedNode.id));
    setSelectedNode(null);
  };

  const clearAll = () => {
    setNodes([]);
    setEdges([]);
    setSelectedNode(null);
  };

  const resetGraph = () => {
    setNodes(initialNodes);
    setEdges(initialEdges);
    setSelectedNode(null);
  };

  const nodeTypes = [
    { type: 'input', label: '📥 Input Node', color: 'bg-blue-600' },
    { type: 'default', label: '🧠 LLM Node', color: 'bg-amber-600' },
    { type: 'default', label: '🔧 Tool Node', color: 'bg-orange-600' },
    { type: 'default', label: '🤔 Analysis Node', color: 'bg-purple-600' },
    { type: 'output', label: '📤 Output Node', color: 'bg-emerald-600' },
  ];

  return (
    <div className="h-[calc(100vh-100px)]">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-white">🧬 Agent Studio</h1>
        <div className="flex gap-2">
          <span className="text-xs text-gray-500 self-center">Click a node → press Delete or Backspace</span>
          <button onClick={resetGraph}
            className="bg-white/10 text-gray-300 px-4 py-2 rounded-lg hover:bg-white/20 text-sm">↺ Reset</button>
          <button onClick={clearAll}
            className="bg-white/10 text-gray-300 px-4 py-2 rounded-lg hover:bg-white/20 text-sm">Clear</button>
          <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-5 py-2 rounded-lg hover:from-purple-500 hover:to-pink-500 font-medium shadow-lg shadow-purple-500/25">
            ▶ Run Graph
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4" style={{ height: 'calc(100% - 60px)' }}>
        {/* ReactFlow Canvas */}
        <div className="lg:col-span-4 bg-gray-900 rounded-xl border border-white/10 overflow-hidden" style={{ height: '100%' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            fitView
            deleteKeyCode={['Delete', 'Backspace']}
            multiSelectionKeyCode="Shift"
            snapToGrid
            snapGrid={[20, 20]}
          >
            <Background color="#ffffff08" gap={20} />
            <Controls className="[&>button]:bg-gray-800 [&>button]:border-white/10 [&>button]:text-white" />
            <MiniMap className="bg-gray-800 border border-white/10"
              nodeColor={(n) => n.type === 'input' ? '#3b82f6' : n.type === 'output' ? '#10b981' : '#f59e0b'}
              maskColor="rgba(0,0,0,0.7)" />
          </ReactFlow>
        </div>

        {/* Right Panel */}
        <div className="bg-gray-900 rounded-xl border border-white/10 p-4 overflow-y-auto">
          {/* Add Nodes */}
          <div className="mb-6">
            <h3 className="font-semibold text-white text-sm mb-3">📦 Add Nodes</h3>
            <div className="space-y-2">
              {nodeTypes.map(n => (
                <button key={n.label} onClick={() => addNode(n.type, n.label)}
                  className="w-full p-3 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-left text-gray-300 transition border border-white/5 hover:border-purple-500/50">
                  {n.label}
                </button>
              ))}
            </div>
          </div>

          {/* Selected Node Info */}
          <div className="mb-6">
            <h3 className="font-semibold text-white text-sm mb-3">🔍 Selected Node</h3>
            {selectedNode ? (
              <div className="p-3 bg-white/5 rounded-lg">
                <p className="text-sm text-white font-medium">{selectedNode.data.label as string}</p>
                <p className="text-xs text-gray-400 mt-1">ID: {selectedNode.id}</p>
                <p className="text-xs text-gray-400">Type: {selectedNode.type || 'default'}</p>
                <p className="text-xs text-gray-400">Position: ({Math.round(selectedNode.position.x)}, {Math.round(selectedNode.position.y)})</p>
                <div className="flex gap-2 mt-3">
                  <button onClick={deleteSelected}
                    className="text-xs bg-red-500/20 text-red-400 px-3 py-1.5 rounded hover:bg-red-500/30 transition">
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-600">Click any node to inspect it</p>
            )}
          </div>

          {/* Instructions */}
          <div>
            <h3 className="font-semibold text-white text-sm mb-3">💡 Tips</h3>
            <div className="space-y-1 text-xs text-gray-500">
              <p>• Click & drag to move nodes</p>
              <p>• Drag between dots (handles) to connect</p>
              <p>• Click node → press Delete key to remove</p>
              <p>• Hold Shift to select multiple</p>
              <p>• Scroll to zoom, drag canvas to pan</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AgentStudioPage() {
  return <ReactFlowProvider><StudioContent /></ReactFlowProvider>;
}

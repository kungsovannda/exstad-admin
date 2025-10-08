import React, { useCallback, useState, useMemo } from "react";
import { applyNodeChanges, applyEdgeChanges, NodeChange, EdgeChange, NodeProps } from "reactflow";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  Node,
  Edge,
  Connection,
} from "reactflow";
import "reactflow/dist/style.css";
import { Button } from "./ui/button";

// Node data type with title and list
type NodeData = {
  title: string;
  list: string[];
};

type RoadmapNode = {
  id: string;
  type?: string;
  data: NodeData;
  position: { x: number; y: number };
};

type RoadmapEdge = {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
};

type RoadmapType = {
  nodes: RoadmapNode[];
  edges: RoadmapEdge[];
};

// --- Move CustomNode OUTSIDE the main component ---
type CustomNodeProps = NodeProps<NodeData> & {
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};
const CustomNode = ({ id, data, onEdit, onDelete }: CustomNodeProps) => (
  <div className="rounded shadow p-2 min-w-[180px] bg-white">
    <div className="font-bold">{data.title}</div>
    <ul className="text-xs list-disc ml-4 mb-2">
      {data.list.map((item, idx) => (
        <li key={idx}>{item}</li>
      ))}
    </ul>
    <div className="flex gap-1">
      <Button size="sm" onClick={() => onEdit(id)}>Edit</Button>
      <Button size="sm" variant="destructive" onClick={() => onDelete(id)}>Delete</Button>
    </div>
  </div>
);

const initialNodes: Node<NodeData>[] = [
  {
    id: "1",
    type: "custom",
    data: { title: "Start Node", list: ["First step"] },
    position: { x: 250, y: 5 },
  },
];
const initialEdges: Edge[] = [];

export default function RoadmapEditor({
  onSave,
}: {
  onSave?: (roadmap: RoadmapType) => void;
}) {
  const [nodes, setNodes] = useState<Node<NodeData>[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [editingNode, setEditingNode] = useState<Node<NodeData> | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editList, setEditList] = useState<string[]>([]);
  const [newListItem, setNewListItem] = useState("");

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );
  const onConnect = useCallback(
    (params: Edge | Connection) =>
      setEdges((eds) =>
        addEdge({ ...params, id: `e${params.source}-${params.target}` }, eds)
      ),
    []
  );

  // Add a node
  const addNode = useCallback(() => {
    const id = (nodes.length + 1).toString();
    setNodes((nds) => [
      ...nds,
      {
        id,
        type: "custom",
        data: { title: `Node ${id}`, list: [] },
        position: { x: 100 + nds.length * 50, y: 100 + nds.length * 50 },
      },
    ]);
  }, [nodes.length]);

  // Delete a node
  const deleteNode = useCallback((id: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
  }, []);

  // Open edit modal
  const openEdit = useCallback((id: string) => {
    setEditingNode((prev) => {
      const node = nodes.find((n) => n.id === id);
      if (!node) return prev;
      setEditTitle(node.data.title);
      setEditList([...node.data.list]);
      setNewListItem("");
      return node;
    });
  }, [nodes]);

  // Save node changes
  const saveEdit = () => {
    if (!editingNode) return;
    setNodes((nds) =>
      nds.map((n) =>
        n.id === editingNode.id
          ? { ...n, data: { title: editTitle, list: editList } }
          : n
      )
    );
    setEditingNode(null);
  };

  // Save as JSON (calls onSave prop)
  const handleSave = () => {
    const roadmap: RoadmapType = {
      nodes: nodes.map((n) => ({
        id: n.id,
        type: n.type,
        data: n.data,
        position: n.position,
      })),
      edges: edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        animated: e.animated,
      })),
    };
    if (onSave) onSave(roadmap);
    alert("Roadmap JSON:\n" + JSON.stringify(roadmap, null, 2));
  };

  // Memoize nodeTypes so handlers are always up-to-date
  const nodeTypes = useMemo(
    () => ({
      custom: (props: NodeProps<NodeData>) => (
        <CustomNode {...props} onEdit={openEdit} onDelete={deleteNode} />
      ),
    }),
    [openEdit, deleteNode]
  );

  // Render edit modal
  const renderEditModal = () =>
    editingNode && (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded shadow-lg min-w-[300px]">
          <h2 className="font-bold mb-2">Edit Node</h2>
          <label className="block mb-2">
            Title:
            <input
              className="border p-1 w-full"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
          </label>
          <label className="block mb-2">
            List:
            <ul>
              {editList.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  {item}
                  <button
                    className="text-red-500"
                    onClick={() =>
                      setEditList((list) => list.filter((_, i) => i !== idx))
                    }
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex gap-2 mt-2">
              <input
                className="border p-1 flex-1"
                value={newListItem}
                onChange={(e) => setNewListItem(e.target.value)}
                placeholder="Add item"
              />
              <Button
                size="sm"
                onClick={() => {
                  if (newListItem.trim()) {
                    setEditList((list) => [...list, newListItem.trim()]);
                    setNewListItem("");
                  }
                }}
              >
                Add
              </Button>
            </div>
          </label>
          <div className="flex gap-2 mt-4">
            <Button onClick={saveEdit}>Save</Button>
            <Button variant="secondary" onClick={() => setEditingNode(null)}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );

  return (
    <div className="relative" style={{ width: "100%", height: "80vh" }}>
      {renderEditModal()}
      <div className="absolute top-0 z-10 flex">
        <Button onClick={addNode} style={{ margin: 8 }}>
          Add Node
        </Button>
        <Button onClick={handleSave} style={{ margin: 8 }}>
          Save Roadmap (JSON)
        </Button>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        nodeTypes={nodeTypes}
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}
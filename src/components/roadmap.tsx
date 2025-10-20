"use client"

import type React from "react"

import { useCallback, useState } from "react"
import {
  ReactFlow,
  type Node,
  type Edge,
  addEdge,
  Background,
  Controls,
  type Connection,
  useNodesState,
  useEdgesState,
  type NodeProps,
  Handle,
  Position,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { Pencil, Trash2, Plus } from "lucide-react"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"



type HandleType = "source" | "target"

type HandleConfig = {
  top: HandleType
  right: HandleType
  bottom: HandleType
  left: HandleType
}

type WorkNodeData = Node<{
  title: string
  tasks: string[]
  handles: HandleConfig
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}>

function CustomWorkNode({
  data,
  id,
}: NodeProps<
  Node<{
    title: string
    tasks: string[]
    handles: HandleConfig
    onEdit: (id: string) => void
    onDelete: (id: string) => void
  }>
>) {
  const [isHovered, setIsHovered] = useState(false)

  const renderHandle = (position: Position, positionKey: keyof HandleConfig) => {
    const handleType = data.handles[positionKey]
    const baseClassName = `!w-5 !h-5 !border-2 !border-white !rounded-full transition-all duration-200`
    const hoverClassName = isHovered ? "!opacity-100 scale-110" : "!opacity-70"

    const positionOffsets = {
      [Position.Top]: "!-top-2.5",
      [Position.Right]: "!-right-2.5",
      [Position.Bottom]: "!-bottom-2.5",
      [Position.Left]: "!-left-2.5",
    }

    const colorClass = (type: "source" | "target") => (type === "source" ? "!bg-green-500" : "!bg-blue-500")

    return (
      <>
        <Handle
          type="source"
          position={position}
          id={`${positionKey}-source`}
          className={`${baseClassName} ${colorClass("source")} ${hoverClassName} ${positionOffsets[position]}`}
          style={{ zIndex: handleType === "source" ? 10 : 1 }}
        />
        <Handle
          type="target"
          position={position}
          id={`${positionKey}-target`}
          className={`${baseClassName} ${colorClass("target")} ${hoverClassName} ${positionOffsets[position]}`}
          style={{ zIndex: handleType === "target" ? 10 : 1 }}
        />
      </>
    )
  }

  return (
    <Card
      className="min-w-[280px] max-w-[320px] shadow-lg border-2 hover:shadow-xl transition-shadow"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {renderHandle(Position.Top, "top")}
      {renderHandle(Position.Right, "right")}
      {renderHandle(Position.Bottom, "bottom")}
      {renderHandle(Position.Left, "left")}

      <div className="p-4">
        {/* Header with title and action buttons */}
        <div className="flex items-start justify-between gap-3 mb-3 pb-3 border-b">
          <h3 className="font-semibold text-lg flex-1 text-balance">{data.title}</h3>
          <div className="flex gap-1 shrink-0">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 hover:bg-blue-100 hover:text-blue-600"
              onClick={(e) => {
                e.stopPropagation()
                data.onEdit(id)
              }}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 hover:bg-red-100 hover:text-red-600"
              onClick={(e) => {
                e.stopPropagation()
                data.onDelete(id)
              }}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Task list */}
        <div className="space-y-2">
          {data.tasks.map((task: string, index: number) => (
            <div key={index} className="flex items-start gap-2 text-sm p-2 rounded bg-muted/50">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
              <span className="flex-1">{task}</span>
            </div>
          ))}
          {data.tasks.length === 0 && <p className="text-sm text-muted-foreground italic">No tasks yet</p>}
        </div>
      </div>
    </Card>
  )
}

const nodeTypes = {
  workNode: CustomWorkNode,
}

const initialNodes: Node<{
  title: string
  tasks: string[]
  handles: HandleConfig
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}>[] = [
  {
    id: "1",
    type: "workNode",
    position: { x: 250, y: 100 },
    data: {
      title: "Planning Phase",
      tasks: ["Define requirements", "Create timeline", "Assign resources"],
      handles: {
        top: "target",
        right: "target",
        bottom: "target",
        left: "target",
      },
      onEdit: () => {},
      onDelete: () => {},
    },
  },
]

const initialEdges: Edge[] = []

export default function WorkNodeEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingNode, setEditingNode] = useState<string | null>(null)
  const [isAddingNode, setIsAddingNode] = useState(false)
  const [editTitle, setEditTitle] = useState("")
  const [editTasks, setEditTasks] = useState("")
  const [editHandles, setEditHandles] = useState<HandleConfig>({
    top: "target",
    right: "target",
    bottom: "target",
    left: "target",
  })
  const [isEditEdgeModalOpen, setIsEditEdgeModalOpen] = useState(false)
  const [editingEdge, setEditingEdge] = useState<string | null>(null)
  const [editEdgeLabel, setEditEdgeLabel] = useState("")
  const [savedData, setSavedData] = useState<Array<{
    nodes: Array<{ type: string; data: { label: string; description: string }; position: { x: number; y: number } }>
    edges: Array<{ id: string; source: string; target: string; animated: boolean }>
  }> | null>(null)
  const [showJson, setShowJson] = useState(false)

  const onConnect = useCallback(
    (params: Connection) => {
      console.log("[v0] Connection created:", params)
      setEdges((eds) => addEdge(params, eds))
    },
    [setEdges],
  )

  const handleEdit = useCallback(
    (nodeId: string) => {
      const node = nodes.find((n) => n.id === nodeId)
      if (node && node.data) {
        setEditingNode(nodeId)
        setEditTitle(node.data.title)
        setEditTasks(node.data.tasks.join("\n"))
        setEditHandles(node.data.handles)
        setIsEditModalOpen(true)
      }
    },
    [nodes],
  )

  const handleDelete = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((n) => n.id !== nodeId))
      setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId))
    },
    [setNodes, setEdges],
  )

  const updateNodeCallbacks = useCallback(
    (
      nodes: Node<{
        title: string
        tasks: string[]
        handles: HandleConfig
        onEdit: (id: string) => void
        onDelete: (id: string) => void
      }>[],
    ) => {
      return nodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          onEdit: handleEdit,
          onDelete: handleDelete,
        },
      }))
    },
    [handleEdit, handleDelete],
  )

  const addNewNode = () => {
    setIsAddingNode(true)
    setEditingNode(null)
    setEditTitle("New Work Node")
    setEditTasks("")
    setEditHandles({
      top: "target",
      right: "target",
      bottom: "target",
      left: "target",
    })
    setIsEditModalOpen(true)
  }

  const saveEditedNode = () => {
    if (isAddingNode) {
      const newNode: Node<{
        title: string
        tasks: string[]
        handles: HandleConfig
        onEdit: (id: string) => void
        onDelete: (id: string) => void
      }> = {
        id: `${Date.now()}`,
        type: "workNode",
        position: { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 },
        data: {
          title: editTitle,
          tasks: editTasks.split("\n").filter((t) => t.trim() !== ""),
          handles: editHandles,
          onEdit: handleEdit,
          onDelete: handleDelete,
        },
      }
      setNodes((nds) => [...nds, newNode])
      setIsAddingNode(false)
    } else if (editingNode) {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === editingNode
            ? {
                ...node,
                data: {
                  ...node.data,
                  title: editTitle,
                  tasks: editTasks.split("\n").filter((t) => t.trim() !== ""),
                  handles: editHandles,
                },
              }
            : node,
        ),
      )
    }
    setIsEditModalOpen(false)
    setEditingNode(null)
    setEditTitle("")
    setEditTasks("")
  }

  const saveAsJson = () => {
    const dataToSave = [
      {
        nodes: nodes.map((node) => ({
          type: "course",
          data: {
            label: node.data.title,
            description: node.data.tasks.join(", "),
          },
          position: {
            x: node.position.x,
            y: node.position.y,
          },
        })),
        edges: edges.map((edge) => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          animated: true,
        })),
      },
    ]
    setSavedData(dataToSave)
    setShowJson(true)
  }

  const onEdgeClick = useCallback((_event: React.MouseEvent, edge: Edge) => {
    setEditingEdge(edge.id)
    setEditEdgeLabel((edge.label as string) || "")
    setIsEditEdgeModalOpen(true)
  }, [])

  const saveEditedEdge = () => {
    if (editingEdge) {
      setEdges((eds) =>
        eds.map((edge) =>
          edge.id === editingEdge
            ? {
                ...edge,
                label: editEdgeLabel,
                labelStyle: { fill: "#666", fontWeight: 500 },
                labelBgStyle: { fill: "white", fillOpacity: 0.9 },
              }
            : edge,
        ),
      )
    }
    setIsEditEdgeModalOpen(false)
    setEditingEdge(null)
    setEditEdgeLabel("")
  }

  const deleteEditingEdge = () => {
    if (editingEdge) {
      setEdges((eds) => eds.filter((e) => e.id !== editingEdge))
    }
    setIsEditEdgeModalOpen(false)
    setEditingEdge(null)
    setEditEdgeLabel("")
  }

  return (
    <div className="h-screen w-full flex flex-col">
      {/* Toolbar */}
      <div className="bg-background border-b p-4 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Work Node Editor</h1>
        <div className="flex gap-2">
          <Button onClick={addNewNode} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Node
          </Button>
          <Button onClick={saveAsJson} variant="outline">
            Save as JSON
          </Button>
          {savedData && (
            <Button onClick={() => setShowJson(!showJson)} variant="secondary">
              {showJson ? "Hide" : "Show"} JSON Data
            </Button>
          )}
        </div>
      </div>

      {/* JSON Display */}
      {showJson && savedData && (
        <div className="bg-muted p-4 border-b max-h-[200px] overflow-auto">
          <pre className="text-xs font-mono">{JSON.stringify(savedData, null, 2)}</pre>
        </div>
      )}

      {/* ReactFlow Canvas */}
      <div className="flex-1">
        <ReactFlow
          nodes={updateNodeCallbacks(nodes)}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          defaultEdgeOptions={{
            type: "smoothstep",
            animated: true,
            style: { strokeWidth: 2, stroke: "#9333ea" },
          }}
          fitView
          onEdgeClick={onEdgeClick}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>

      {/* Edit Node Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isAddingNode ? "Add Work Node" : "Edit Work Node"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-[1.2fr_1fr] gap-8">
              {/* Left Column - Form */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Title</label>
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Enter node title"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tasks (one per line)</label>
                    <Textarea
                      value={editTasks}
                      onChange={(e) => setEditTasks(e.target.value)}
                      placeholder="Enter tasks, one per line"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Connection Handles Configuration */}
                <div className="space-y-3 border-t pt-4">
                  <h3 className="text-sm font-semibold">Connection Handles</h3>
                  <p className="text-xs text-muted-foreground">
                    Configure which sides can send (green) or receive (blue) connections
                  </p>

                  <div className="grid grid-cols-4 gap-3">
                    {(["top", "right", "bottom", "left"] as const).map((position) => (
                      <div key={position} className="space-y-2 p-3 border rounded-lg">
                        <Label className="text-sm font-medium capitalize">{position}</Label>
                        <RadioGroup
                          value={editHandles[position]}
                          onValueChange={(value) =>
                            setEditHandles((prev) => ({ ...prev, [position]: value as HandleType }))
                          }
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="source" id={`${position}-source`} />
                            <Label htmlFor={`${position}-source`} className="text-xs font-normal cursor-pointer">
                              Source
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="target" id={`${position}-target`} />
                            <Label htmlFor={`${position}-target`} className="text-xs font-normal cursor-pointer">
                              Target
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Preview */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Preview</label>
                <div className="border rounded-lg p-6 bg-muted/30 flex items-center justify-center min-h-[300px]">
                  <div className="relative">
                    <Card className="min-w-[280px] max-w-[320px] shadow-lg border-2">
                      {/* Preview Handles */}
                      {(["top", "right", "bottom", "left"] as const).map((position) => {
                        const handleType = editHandles[position]
                        const positions = {
                          top: { top: "-10px", left: "50%", transform: "translateX(-50%)" },
                          right: { right: "-10px", top: "50%", transform: "translateY(-50%)" },
                          bottom: { bottom: "-10px", left: "50%", transform: "translateX(-50%)" },
                          left: { left: "-10px", top: "50%", transform: "translateY(-50%)" },
                        }

                        return (
                          <div key={position} className="absolute" style={positions[position]}>
                            {handleType === "source" && (
                              <div className="w-5 h-5 rounded-full bg-green-500 border-2 border-white" />
                            )}
                            {handleType === "target" && (
                              <div className="w-5 h-5 rounded-full bg-blue-500 border-2 border-white" />
                            )}
                          </div>
                        )
                      })}

                      <div className="p-4">
                        {/* Header with title */}
                        <div className="flex items-start justify-between gap-3 mb-3 pb-3 border-b">
                          <h3 className="font-semibold text-lg flex-1 text-balance">{editTitle || "Untitled Node"}</h3>
                          <div className="flex gap-1 shrink-0">
                            <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center">
                              <Pencil className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center">
                              <Trash2 className="h-4 w-4 text-muted-foreground" />
                            </div>
                          </div>
                        </div>

                        {/* Task list preview */}
                        <div className="space-y-2">
                          {editTasks
                            .split("\n")
                            .filter((t) => t.trim() !== "")
                            .map((task, index) => (
                              <div key={index} className="flex items-start gap-2 text-sm p-2 rounded bg-muted/50">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                <span className="flex-1">{task}</span>
                              </div>
                            ))}
                          {editTasks.trim() === "" && (
                            <p className="text-sm text-muted-foreground italic">No tasks yet</p>
                          )}
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveEditedNode}>{isAddingNode ? "Create Node" : "Save Changes"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Edge Modal */}
      <Dialog open={isEditEdgeModalOpen} onOpenChange={setIsEditEdgeModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Connection</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Connection Label</label>
              <Input
                value={editEdgeLabel}
                onChange={(e) => setEditEdgeLabel(e.target.value)}
                placeholder="Enter connection label (optional)"
              />
              <p className="text-xs text-muted-foreground">Add a label to describe the relationship between nodes</p>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="destructive" onClick={deleteEditingEdge}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Connection
            </Button>
            <Button onClick={saveEditedEdge}>Save Changes</Button>
             <Button variant="outline" onClick={() => setIsEditEdgeModalOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

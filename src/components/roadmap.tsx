"use client";

import type React from "react";
import { useCallback, useState, useEffect } from "react";
import CustomWorkNode from "@/components/CustomWorkNode";
import {
  ReactFlow,
  type Node,
  type Edge,
  addEdge,
  Background,
  type Connection,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Pencil, Trash2, Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  useGetAllRoadmapsQuery,
  useUpdateRoadmapsMutation,
} from "@/features/master-program/components/roadmap/save-roadmap-api";
import type {
  RoadmapPayload,
  HandleConfig,
  HandleType,
  WorkNodeData,
} from "@/types/roadmap/roadmap";
import { toast } from "sonner";

const nodeTypes = {
  workNode: CustomWorkNode,
};

let initialNodes: Node<WorkNodeData>[] = [];

const initialEdges: Edge[] = [];

export default function WorkNodeEditor({
  masterProgramUuid, // optional master UUID for auto-copy
  programUuid,
  programType,
}: {
  masterProgramUuid?: string;
  programUuid: string;
  programType: "programs" | "opening-programs";
}) {
  // ----------------- API -----------------
  const { data: targetRoadmap } = useGetAllRoadmapsQuery(
    { programUuid, programType },
    { skip: !programUuid }
  );

  const { data: masterRoadmap } = useGetAllRoadmapsQuery(
    { programUuid: masterProgramUuid || "", programType: "programs" },
    { skip: !masterProgramUuid || programType !== "opening-programs" }
  );

  const [updateRoadmaps] = useUpdateRoadmapsMutation();
  const [copied, setCopied] = useState(false);

  // ----------------- React Flow state -----------------
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // ----------------- Modal & editing state -----------------
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingNode, setEditingNode] = useState<string | null>(null);
  const [isAddingNode, setIsAddingNode] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editTasks, setEditTasks] = useState("");
  const [editColor, setEditColor] = useState("");
  const [editHandles, setEditHandles] = useState<HandleConfig>({
    top: "target",
    right: "target",
    bottom: "target",
    left: "target",
  });

  const [isEditEdgeModalOpen, setIsEditEdgeModalOpen] = useState(false);
  const [editingEdge, setEditingEdge] = useState<string | null>(null);
  const [editEdgeLabel, setEditEdgeLabel] = useState("");

  const [savedData, setSavedData] = useState<RoadmapPayload | null>(null);

  const positionOrder: (keyof HandleConfig)[] = [
    "top",
    "right",
    "bottom",
    "left",
  ];

  const colorPresets = [
    { name: "defaultColor", value: "" },
    { name: "Sky Blue", value: "#3b87ba" },
    { name: "Rose", value: "#e71352" },
    { name: "Emerald", value: "#0f910d" },
    { name: "Amber", value: "#ecb336" },
    { name: "Purple", value: "#d736ec" },
    { name: "Cyan", value: "#36ecd7" },
    { name: "Pink", value: "#ec36c5" },
    { name: "Lime", value: "#085e0a" },
  ];
  const exampleNode: Node<WorkNodeData>[] = [
    {
      id: "1",
      type: "workNode",
      position: { x: 250, y: 100 },
      data: {
        title: "Title of New Node",
        tasks: ["Subject 1", "Subject 2", "Subject 3"],
        color: "",
        handles: {
          top: "target",
          right: "target",
          bottom: "target",
          left: "target",
        },
        onEdit: () => handleEdit,
        onDelete: () => handleDelete,
      },
    },
  ];
  initialNodes = exampleNode;

  // ----------------- Node callbacks -----------------
  const handleEdit = useCallback(
    (nodeId: string) => {
      setNodes((nds) => {
        const node = nds.find((n) => n.id === nodeId);
        if (node && node.data) {
          setEditingNode(nodeId);
          setEditTitle(node.data.title);
          setEditTasks(node.data.tasks.join("\n"));
          setEditColor(node.data.color || "");
          setEditHandles(node.data.handles);
          setIsEditModalOpen(true);
        }
        return nds;
      });
    },
    [setNodes]
  );

  const handleDelete = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((n) => n.id !== nodeId));
      setEdges((eds) =>
        eds.filter((e) => e.source !== nodeId && e.target !== nodeId)
      );
    },
    [setNodes, setEdges]
  );

  const addNewNode = () => {
    setIsAddingNode(true);
    setEditingNode(null);
    setEditTitle("New Work Node");
    setEditTasks("");
    setEditColor("");
    setEditHandles({
      top: "target",
      right: "target",
      bottom: "target",
      left: "target",
    });
    setIsEditModalOpen(true);
  };

  const saveEditedNode = () => {
    const tasksArray = editTasks.split("\n").filter((t) => t.trim() !== "");

    if (isAddingNode) {
      const newNode: Node<WorkNodeData> = {
        id: `${nodes.length + 1}`,
        type: "workNode",
        position: {
          x: Math.random() * 400 + 100,
          y: Math.random() * 400 + 100,
        },
        data: {
          title: editTitle,
          tasks: tasksArray,
          color: editColor,
          handles: editHandles,
          onEdit: handleEdit,
          onDelete: handleDelete,
        },
      };
      setNodes((nds) => [...nds, newNode]);
      setIsAddingNode(false);
    } else if (editingNode) {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === editingNode
            ? {
                ...node,
                data: {
                  ...node.data,
                  title: editTitle,
                  tasks: tasksArray,
                  color: editColor,
                  handles: editHandles,
                },
              }
            : node
        )
      );
    }

    setIsEditModalOpen(false);
    setEditingNode(null);
    setEditTitle("");
    setEditTasks("");
  };

  // ----------------- Edge callbacks -----------------
  const onEdgeClick = useCallback((_event: React.MouseEvent, edge: Edge) => {
    setEditingEdge(edge.id);
    setEditEdgeLabel((edge.label as string) || "");
    setIsEditEdgeModalOpen(true);
  }, []);

  const saveEditedEdge = () => {
    if (editingEdge) {
      setEdges((eds) =>
        eds.map((edge) =>
          edge.id === editingEdge ? { ...edge, label: editEdgeLabel } : edge
        )
      );
    }
    setIsEditEdgeModalOpen(false);
    setEditingEdge(null);
    setEditEdgeLabel("");
  };

  const deleteEditingEdge = () => {
    if (editingEdge) {
      setEdges((eds) => eds.filter((e) => e.id !== editingEdge));
    }
    setIsEditEdgeModalOpen(false);
    setEditingEdge(null);
    setEditEdgeLabel("");
  };

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) =>
        addEdge(
          {
            id: `e${params.source}-${params.target}-${Date.now()}`,
            source: params.source,
            sourceHandle: params.sourceHandle,
            target: params.target,
            targetHandle: params.targetHandle,
            type: "smoothstep",
            animated: true,
          },
          eds
        )
      );
    },
    [setEdges]
  );

  // ----------------- Load API data -----------------
  useEffect(() => {
    let roadmapData = targetRoadmap?.[0];

    // Auto-copy from master only for opening-programs
    if (
      programType === "opening-programs" &&
      (!roadmapData || !roadmapData.nodes.length) &&
      masterRoadmap?.[0] &&
      !copied
    ) {
      const copiedData = JSON.parse(JSON.stringify(masterRoadmap[0])); // deep copy
      updateRoadmaps({ programUuid, programType, roadmaps: [copiedData] })
        .unwrap()
        .then(() => {
          setCopied(true);
          roadmapData = copiedData;
        })
        .catch((err) => console.error("Failed to copy master roadmap:", err));
    }

    if (!roadmapData) return;

    // Load nodes
    const loadedNodes: Node<WorkNodeData>[] = roadmapData.nodes.map(
      (node, index) => {
        const parts = node.data.label.split(",").map((p) => p.trim());
        const title = parts[0];
        const handles: HandleConfig = {
          top: (parts[1] as HandleType) || "target",
          right: (parts[2] as HandleType) || "target",
          bottom: (parts[3] as HandleType) || "target",
          left: (parts[4] as HandleType) || "target",
        };
        const color = parts[5] || "";

        return {
          id: `${index + 1}`,
          type: "workNode",
          position: node.position,
          data: {
            title,
            tasks:
              node.data.description
                ?.split(", ")
                .filter((t) => t.trim() !== "") || [],
            handles,
            color,
            onEdit: handleEdit,
            onDelete: handleDelete,
          },
        };
      }
    );

    // Load edges
    const loadedEdges: Edge[] = roadmapData.edges.map((edge) => {
      const [sourceId, sourceHandle] = edge.source
        .split(",")
        .map((s) => s.trim());
      const [targetId, targetHandle] = edge.target
        .split(",")
        .map((s) => s.trim());

      return {
        id: edge.id,
        source: sourceId,
        sourceHandle: sourceHandle,
        target: targetId,
        targetHandle: targetHandle,
        type: "smoothstep",
        animated: edge.animated ?? true,
        style: { strokeWidth: 2, stroke: "#9333ea" },
      };
    });

    setNodes(loadedNodes);
    setEdges(loadedEdges);
  }, [
    targetRoadmap,
    masterRoadmap,
    programType,
    programUuid,
    copied,
    updateRoadmaps,
    handleEdit,
    handleDelete,
    setEdges,
    setNodes,
  ]);

  // ----------------- Save to API -----------------
  const saveAsJson = () => {
    const dataToSave: RoadmapPayload = [
      {
        nodes: nodes.map((node) => {
          const handlesString = positionOrder
            .map((pos) => node.data.handles[pos])
            .join(", ");
          return {
            type: "course",
            data: {
              label: `${node.data.title}, ${handlesString}, ${
                node.data.color || ""
              }`,
              description: node.data.tasks.join(", "),
            },
            position: node.position,
          };
        }),
        edges: edges.map((edge) => ({
          id: edge.id,
          source: `${edge.source},${edge.sourceHandle ?? ""}`,
          target: `${edge.target},${edge.targetHandle ?? ""}`,
          animated: edge.animated ?? true,
        })),
      },
    ];

    setSavedData(dataToSave);

    toast.promise(
      updateRoadmaps({
        programUuid,
        programType,
        roadmaps: dataToSave,
      }).unwrap(),
      {
        loading: "Saving...",
        success: "Roadmap has been saved successfully",
        error: "Fail to save roadmap",
      }
    );
  };

  // ----------------- Render -----------------
  return (
    <div className="h-screen w-full flex flex-col">
      {/* Toolbar */}
      <div className="bg-background border-b p-4 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Road Map Editor</h1>
        <div className="flex gap-2">
          <Button onClick={addNewNode}>
            <Plus className="h-4 w-4" />
            Add Node
          </Button>
          <Button onClick={saveAsJson} variant="outline">
            Save
          </Button>
        </div>
      </div>

      {/* ReactFlow Canvas */}
      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          defaultEdgeOptions={{ type: "smoothstep", animated: true }}
          fitView
          onEdgeClick={onEdgeClick}
        >
          <Background />
        </ReactFlow>
      </div>

      {/* Edit Node Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isAddingNode ? "Add Work Node" : "Edit Work Node"}
            </DialogTitle>
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
                    <label className="text-sm font-medium">
                      Tasks (one per line)
                    </label>
                    <Textarea
                      value={editTasks}
                      onChange={(e) => setEditTasks(e.target.value)}
                      placeholder="Enter tasks, one per line"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Color Picker */}
                <div className="space-y-3 border-t pt-4">
                  <h3 className="text-sm font-semibold">Node Color</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {colorPresets.map((preset) => (
                      <button
                        key={preset.value}
                        type="button"
                        onClick={() => setEditColor(preset.value)}
                        className={`h-12 rounded-lg border-2 transition-all ${
                          editColor === preset.value
                            ? "border-primary ring-2 ring-primary/20"
                            : "border-border"
                        }`}
                        style={{ backgroundColor: preset.value }}
                        title={preset.name}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-muted-foreground">
                      Custom:
                    </label>
                    <input
                      type="color"
                      value={editColor}
                      onChange={(e) => setEditColor(e.target.value)}
                      className="h-8 w-16 rounded border cursor-pointer"
                    />
                    <span className="text-xs text-muted-foreground">
                      {editColor}
                    </span>
                  </div>
                </div>

                {/* Handles Configuration */}
                <div className="space-y-3 border-t pt-4">
                  <h3 className="text-sm font-semibold">Connection Handles</h3>
                  <p className="text-xs text-muted-foreground">
                    Configure which sides can send (green) or receive (blue)
                    connections
                  </p>
                  <div className="grid grid-cols-4 gap-3">
                    {(["top", "right", "bottom", "left"] as const).map(
                      (position) => (
                        <div
                          key={position}
                          className="space-y-2 p-3 border rounded-lg"
                        >
                          <Label className="text-sm font-medium capitalize">
                            {position}
                          </Label>
                          <RadioGroup
                            value={editHandles[position]}
                            onValueChange={(value) =>
                              setEditHandles((prev) => ({
                                ...prev,
                                [position]: value as HandleType,
                              }))
                            }
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="source"
                                id={`${position}-source`}
                              />
                              <Label
                                htmlFor={`${position}-source`}
                                className="text-xs font-normal cursor-pointer"
                              >
                                Source
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="target"
                                id={`${position}-target`}
                              />
                              <Label
                                htmlFor={`${position}-target`}
                                className="text-xs font-normal cursor-pointer"
                              >
                                Target
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Preview */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Preview</label>
                <div className="border rounded-lg p-6 bg-muted/30 flex items-center justify-center min-h-[300px]">
                  <div className="relative">
                    <Card
                      className="min-w-[280px] max-w-[320px] shadow-lg border-2"
                      style={{ backgroundColor: editColor }}
                    >
                      {(["top", "right", "bottom", "left"] as const).map(
                        (position) => {
                          const handleType = editHandles[position];
                          const positions = {
                            top: {
                              top: "-10px",
                              left: "50%",
                              transform: "translateX(-50%)",
                            },
                            right: {
                              right: "-10px",
                              top: "50%",
                              transform: "translateY(-50%)",
                            },
                            bottom: {
                              bottom: "-10px",
                              left: "50%",
                              transform: "translateX(-50%)",
                            },
                            left: {
                              left: "-10px",
                              top: "50%",
                              transform: "translateY(-50%)",
                            },
                          };
                          return (
                            <div
                              key={position}
                              className="absolute"
                              style={positions[position]}
                            >
                              {handleType === "source" && (
                                <div className="w-5 h-5 rounded-full bg-green-500 border-2 border-white" />
                              )}
                              {handleType === "target" && (
                                <div className="w-5 h-5 rounded-full bg-blue-500 border-2 border-white" />
                              )}
                            </div>
                          );
                        }
                      )}
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-3 mb-3 pb-3 border-b">
                          <h3 className="font-semibold text-lg flex-1 text-balance">
                            {editTitle || "Untitled Node"}
                          </h3>
                          <div className="flex gap-1 shrink-0">
                            <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center">
                              <Pencil className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center">
                              <Trash2 className="h-4 w-4 text-muted-foreground" />
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {editTasks
                            .split("\n")
                            .filter((t) => t.trim() !== "")
                            .map((task, index) => (
                              <div
                                key={index}
                                className="flex items-start gap-2 text-sm p-2 rounded bg-muted/50"
                              >
                                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                <span className="flex-1">{task}</span>
                              </div>
                            ))}
                          {editTasks.trim() === "" && (
                            <p className="text-sm text-muted-foreground italic">
                              No tasks yet
                            </p>
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
            <Button onClick={saveEditedNode}>
              {isAddingNode ? "Create Node" : "Save Changes"}
            </Button>
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
              <p className="text-xs text-muted-foreground">
                Add a label to describe the relationship between nodes
              </p>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="destructive" onClick={deleteEditingEdge}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Connection
            </Button>
            <Button onClick={saveEditedEdge}>Save Changes</Button>
            <Button
              variant="outline"
              onClick={() => setIsEditEdgeModalOpen(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

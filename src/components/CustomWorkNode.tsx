"use client"

import type React from "react"
import {  useState } from "react"
import {
  type Node,
  type NodeProps,
  Handle,
  Position,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Pencil, Trash2 } from "lucide-react"
import type { HandleConfig ,WorkNodeData } from "@/types/roadmap/roadmap"

export default function CustomWorkNode({
  data,
  id,
}: NodeProps<
  Node<WorkNodeData>
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
      style={{ backgroundColor: data.color || "" }}
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
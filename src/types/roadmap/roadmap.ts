/**
 * Represents a single node in the roadmap
 */
export type RoadmapNode = {
  type: string
  data: {
    label: string
    description: string
  }
  position: {
    x: number
    y: number
  }
}

/**
 * Represents a single edge/connection in the roadmap
 */
export type RoadmapEdge = {
  id: string
  source: string
  target: string
  animated: boolean
}

/**
 * Represents a complete roadmap with nodes and edges
 */
export type RoadmapData = {
  nodes: RoadmapNode[]
  edges: RoadmapEdge[]
}

/**
 * The payload format for saving/updating roadmaps
 * Backend expects an array containing roadmap data
 */
export type RoadmapPayload = RoadmapData[]

/**
 * The response type from the backend when fetching roadmaps
 */
export type RoadmapResponse = RoadmapData[]

export type HandleType = "source" | "target"

export type HandleConfig = {
  top: HandleType
  right: HandleType
  bottom: HandleType
  left: HandleType
}

export type WorkNodeData ={
  title: string
  tasks: string[]
  handles: HandleConfig
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

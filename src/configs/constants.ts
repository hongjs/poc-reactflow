import { NodeIC, NodeLeader, NodeRoot } from "@/components";
import { Edge, NodeTypes } from "reactflow";

export const elkOptions = {
    'elk.algorithm': 'mrtree',
    'elk.layered.spacing.nodeNodeBetweenLayers': '100',
    'elk.spacing.nodeNode': '80'
};

export const initialEdges: Edge[] = [];
export const initialNodes: Node[] = [];
export const nodeTypes: NodeTypes = {
    input: NodeRoot,
    default: NodeLeader,
    output: NodeIC
};




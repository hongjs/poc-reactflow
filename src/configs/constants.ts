import { EndNode, MiddleNode, RootNode } from "@/components";
import DefaultEdge from "@/components/edge/DefaultEdge";
import NumberEdge from "@/components/edge/NumberEdge";
import { Edge, EdgeTypes, NodeTypes } from "reactflow";

export const elkOptions = {
    'elk.algorithm': 'mrtree',
    'elk.layered.spacing.nodeNodeBetweenLayers': '100',
    'elk.spacing.nodeNode': '80'
};

export const initialEdges: Edge[] = [];
export const initialNodes: Node[] = [];
export const nodeTypes: NodeTypes = {
    input: RootNode,
    default: MiddleNode,
    output: EndNode
};


export const edgeTypes: EdgeTypes = {
    default: DefaultEdge,
    number: NumberEdge
};


export const colors = {
    mint: '#0783a9'
}

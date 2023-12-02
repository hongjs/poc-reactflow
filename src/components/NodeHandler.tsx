import { useMemo } from 'react'
import { Handle, Position, getConnectedEdges, useNodeId, useStore, } from 'reactflow'

type NodeHandlerProps = {
    type: 'target' | 'source'
    position: Position
    maxConnection?: number

}

const selector = (s: any) => ({
    nodeInternals: s.nodeInternals,
    edges: s.edges,
});


const NodeHandler = ({ type, position, maxConnection }: NodeHandlerProps) => {
    const { nodeInternals, edges } = useStore(selector);
    const nodeId = useNodeId();

    const isConnectable = useMemo(() => {
        if (!maxConnection) return true;

        const node = nodeInternals.get(nodeId);
        const connectedEdges = getConnectedEdges([node], edges);
        const targetCount = connectedEdges.filter(i => i.target === nodeId).length
        return targetCount < maxConnection;
    }, [maxConnection, nodeInternals, nodeId, edges]);

    return (
        <Handle
            type={type}
            position={position}
            style={{ [position.toString()]: '-6px', background: '#21CE99', width: '10px', height: '10px' }}
            onConnect={(params) => console.log('handle onConnect', params)}
            isConnectable={isConnectable}
        />
    )
}


export default NodeHandler
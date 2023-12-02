import { useMemo } from 'react'
import { Handle, Position, getConnectedEdges, useNodeId, useStore } from 'reactflow'

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
        console.log(connectedEdges.length < maxConnection, connectedEdges.length, maxConnection)
        return connectedEdges.length < maxConnection;
    }, [nodeInternals, edges, nodeId, maxConnection]);

    return (
        <Handle
            type={type}
            position={position}
            style={{ [position.toString()]: '-16px', background: '#21CE99', width: '10px', height: '10px' }}
            onConnect={(params) => console.log('handle onConnect', params)}
            isConnectable={isConnectable}
        />
    )
}


export default NodeHandler
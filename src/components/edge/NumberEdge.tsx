import { colors } from '@/configs/constants';
import { Box } from '@mui/material';
import { BaseEdge, EdgeLabelRenderer, EdgeProps, getBezierPath, useReactFlow } from 'reactflow';


const onEdgeClick = (evt: any, id: any) => {
    evt.stopPropagation();
    alert(`remove ${id}`);
};

const NumberEdge = ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    source,
    target,
    style = {},
    markerEnd,
}: EdgeProps) => {
    const { getNode } = useReactFlow();
    const targetNode = getNode(target)
    const { percentage } = targetNode?.data ?? {};
    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });



    return (
        <>
            {percentage && <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />}
            {percentage && <EdgeLabelRenderer>
                <Box
                    style={{
                        position: 'absolute',
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                        fontSize: '0.5rem',
                        color: colors.mint,
                        padding: '4px 8px',
                        backgroundColor: 'white',
                        borderRadius: '15px',
                        // everything inside EdgeLabelRenderer has no pointer events by default, if you have an interactive element, set pointer-events: all
                        pointerEvents: 'all',
                    }}
                    className="nodrag nopan"
                >
                    {`${percentage}%`}
                </Box>
            </EdgeLabelRenderer>}
        </>
    );
}


export default NumberEdge
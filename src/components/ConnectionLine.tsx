import { ConnectionLineComponent } from 'reactflow';

const ConnectionLine: ConnectionLineComponent = ({ fromX, fromY, toX, toY }) => {
    const middleY = fromY + (toY - fromY) / 2;
    return (
        <g>
            <path
                fill="none"
                stroke='#aaa'
                strokeWidth={1.5}
                className="animated"
                d={`M${fromX},${fromY} C${fromX},${middleY} ${toX},${middleY} ${toX},${toY}`}
            />
            <circle
                fill="#fff"
                stroke='#aaa'
                strokeWidth={1.5}
                cx={toX}
                cy={toY}
                r={3}
            />
        </g>
    );
};

export default ConnectionLine
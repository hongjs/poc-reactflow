import { ComponentType } from 'react';
import { NodeProps, Position } from 'reactflow';
import NodeHandler from './NodeHandler';
import NodeItem from './NodeItem';

const MiddleNode: ComponentType<NodeProps> = ({ id, data }) => {
  return (
    <>
      <NodeHandler type="target" position={Position.Top} maxConnection={1} />
      <NodeItem id={id} data={data} borderColor='#0783a9' />
      <NodeHandler type="source" position={Position.Bottom} />
    </>
  );
};

export default MiddleNode;

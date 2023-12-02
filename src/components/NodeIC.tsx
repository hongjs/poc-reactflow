import { ComponentType } from 'react';
import { NodeProps, Position } from 'reactflow';
import NodeHandler from './NodeHandler';
import NodeItem from './NodeItem';

const NodeIC: ComponentType<NodeProps> = ({ id, data }) => {
  return (
    <>
      <NodeHandler type="target" position={Position.Top} maxConnection={1} />
      <NodeItem id={id} data={data} borderColor='#FF8767' disabledExpand />
    </>
  );
};

export default NodeIC;

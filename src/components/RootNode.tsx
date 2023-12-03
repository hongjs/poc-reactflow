import { ComponentType } from 'react';
import { NodeProps, Position } from 'reactflow';
import NodeHandler from './NodeHandler';
import NodeItem from './NodeItem';

const RootNode: ComponentType<NodeProps> = ({ id, data }) => {

  return (
    <>
      <NodeItem id={id} data={data} borderColor='#6f9940' />
      <NodeHandler type="source" position={Position.Bottom} />
    </>
  );
};

export default RootNode;

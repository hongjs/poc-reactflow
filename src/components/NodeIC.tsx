import { faker } from '@faker-js/faker';
import React, { ComponentType } from 'react';
import { NodeProps, Position } from 'reactflow';
import NodeHandler from './NodeHandler';
import NodeItem from './NodeItem';

const NodeIC: ComponentType<NodeProps> = ({ data }) => {
  const [name, setName] = React.useState<string | undefined>(undefined);
  const [title, setTitle] = React.useState<string | undefined>(undefined);

  const handleEditClick = () => {
    setName(faker.person.fullName());
    setTitle(faker.person.jobArea());
  };

  return (
    <>
      <NodeHandler type="target" position={Position.Top} maxConnection={1} />
      <NodeItem name={name} title={title} data={data} borderColor='#FF8767' handleEditClick={handleEditClick} />
    </>
  );
};

export default NodeIC;

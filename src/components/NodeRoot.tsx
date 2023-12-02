import { faker } from '@faker-js/faker';
import React, { ComponentType } from 'react';
import { NodeProps, Position } from 'reactflow';
import NodeHandler from './NodeHandler';
import NodeItem from './NodeItem';

const RootNode: ComponentType<NodeProps> = ({ data }) => {
  const [name, setName] = React.useState<string | undefined>(undefined);
  const [title, setTitle] = React.useState<string | undefined>(undefined);

  const handleEditClick = () => {
    setName(faker.person.fullName());
    setTitle(faker.person.jobArea());
  };

  return (
    <>
      <NodeItem name={name} title={title} data={data} borderColor='#6f9940' handleEditClick={handleEditClick} />
      <NodeHandler type="source" position={Position.Bottom} />
    </>
  );
};

export default RootNode;

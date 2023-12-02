import { faker } from '@faker-js/faker';
import EditIcon from '@mui/icons-material/Edit';
import { Avatar, Grid, IconButton, Typography } from '@mui/material';
import React, { ComponentType } from 'react';
import { Handle, NodeProps, Position } from 'reactflow';

const CustomNode: ComponentType<NodeProps> = ({ data, isConnectable }) => {
  const [name, setName] = React.useState<string | undefined>(undefined);
  const [title, setTitle] = React.useState<string | undefined>(undefined);
  const handleEditClick = () => {
    setName(faker.person.fullName());
    setTitle(faker.person.jobArea());
  };

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        style={{ top: '-16px', background: '#21CE99', width: '10px', height: '10px' }}
        onConnect={(params) => console.log('handle onConnect', params)}
        isConnectable={isConnectable}
      />
      <div>
        <Grid container justifyContent="center" alignItems="center" sx={{ position: 'relative' }}>
          <Grid item xs={4}>
            <Avatar src={data?.photo} sx={{ width: 48, height: 48 }} />
          </Grid>
          <Grid item xs={8}>
            <Typography variant="body1">{name ?? data?.name}</Typography>
            <Typography variant="caption">{title ?? data?.title}</Typography>
          </Grid>
          <IconButton
            aria-label="edit"
            size="small"
            style={{
              position: 'absolute',
              top: -16,
              right: -16,
              width: '1rem',
              height: '1rem',
              backgroundColor: '#fff',
              borderWidth: '1px',
              borderColor: '#000',
              borderStyle: 'solid'
            }}
            onClick={handleEditClick}
          >
            <EditIcon style={{ width: '0.6rem', height: '0.6rem' }} />
          </IconButton>
        </Grid>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="a"
        style={{ bottom: '-16px', background: '#21CE99', width: '10px', height: '10px' }}
        isConnectable={isConnectable}
      />
    </>
  );
};

export default CustomNode;

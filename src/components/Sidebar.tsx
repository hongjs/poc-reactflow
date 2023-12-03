import { Box, Button } from '@mui/material';
import { memo, useCallback } from 'react';

type NodeType = 'input' | 'default' | 'output';

const SideBar = () => {

  const onDragStart = useCallback((event: React.DragEvent<HTMLButtonElement>, nodeType: NodeType) => {
    if (event.dataTransfer) {
      const img = document?.createElement("img");
      img.src = "/images/cardLoading.svg";
      event.dataTransfer.setDragImage(img, -200, -200);
      event.dataTransfer.setData('application/reactflow', nodeType);
      // event.dataTransfer?.effectAllowed = 'move';
    }
  }, []);

  return (
    <aside>
      <Box className="description">Drag these nodes to the pane on the left.</Box>
      <Button className="dndnode input" variant='contained' color="secondary" fullWidth draggable onDragStart={(event) => onDragStart(event, 'input')} sx={{ padding: '16px !important', borderRadius: '15px !important' }}>
        Root Node
      </Button>
      <Button className="dndnode" variant='contained' color="secondary" fullWidth draggable onDragStart={(event) => onDragStart(event, 'default')} sx={{ padding: '16px !important', borderRadius: '15px !important' }}>
        Middle Node
      </Button>
      <Button className="dndnode output" variant='contained' color="secondary" fullWidth draggable onDragStart={(event) => onDragStart(event, 'output')} sx={{ padding: '16px !important', borderRadius: '15px !important' }}>
        End Node
      </Button>
    </aside >
  );
};

export default memo(SideBar);

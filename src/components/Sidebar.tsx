import { Box } from '@mui/material';

type NodeType = 'input' | 'default' | 'output';
const SideBar = () => {
  const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: NodeType) => {
    if (event) {
      event.dataTransfer?.setData('application/reactflow', nodeType);
      // event.dataTransfer?.effectAllowed = 'move';
    }
  };

  return (
    <aside>
      <Box className="description">You can drag these nodes to the pane on the right.</Box>
      <Box className="dndnode input" onDragStart={(event) => onDragStart(event, 'input')} draggable>
        Root
      </Box>
      <div className="dndnode" onDragStart={(event) => onDragStart(event, 'default')} draggable>
        Leader
      </div>
      <div className="dndnode output" onDragStart={(event) => onDragStart(event, 'output')} draggable>
        IC
      </div>
    </aside>
  );
};

export default SideBar;

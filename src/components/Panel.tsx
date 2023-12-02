
import { Button, Stack } from '@mui/material';
import { Panel } from 'reactflow';
type ToolbarPanelProps = {
    onSave: () => void
    onLayout: (direction: string, useInitialNodes: boolean) => void
}

const ToolbarPanel = ({ onSave, onLayout }: ToolbarPanelProps) => {

    const handleLayoutClick = () => {
        if (onLayout) {
            onLayout('DOWN', false)
        }
    }

    return (
        <Panel position="top-left">
            <Stack direction="row" gap={1}>
                <Button variant='contained' onClick={onSave}>Save</Button>
                <Button variant='contained' onClick={handleLayoutClick}>Auto Layout</Button>
            </Stack>
        </Panel >
    )
}

export default ToolbarPanel
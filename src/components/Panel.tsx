
import { Button, Stack } from '@mui/material';
import { memo, useCallback } from 'react';
import { Panel } from 'reactflow';
type ToolbarPanelProps = {
    onSave: () => void
    onLayout: (direction: string, useInitialNodes: boolean) => void
}

const ToolbarPanel = ({ onSave, onLayout }: ToolbarPanelProps) => {

    const handleLayoutClick = useCallback(() => {
        if (onLayout) {
            onLayout('DOWN', false)
        }
    }, [onLayout]);

    return (
        <Panel position="top-left">
            <Stack direction="row" gap={1}>
                <Button variant='contained' onClick={onSave}>Save</Button>
                <Button variant='contained' onClick={handleLayoutClick}>Auto Layout</Button>
            </Stack>
        </Panel >
    )
}

export default memo(ToolbarPanel)
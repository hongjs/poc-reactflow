import { Avatar, Grid, IconButton, Typography } from '@mui/material';

import { NodeData } from '@/pages/ExampleReactFlow';
import { faker } from '@faker-js/faker';
import { Edit as EditIcon, ExpandLess as ExpandLessIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { useCallback } from 'react';

interface NodeItemProps {
    id: string;
    data: NodeData
    borderColor?: string,
    disabledExpand?: boolean,
    percentage?: number
}

const NodeItem = ({ id, data, borderColor, disabledExpand }: NodeItemProps) => {

    const handleEditClick = useCallback(() => {
        if (data.onDataChanged) {
            const name = faker.person.fullName();
            const title = faker.person.jobArea();
            data.onDataChanged(id, { ...data, name, title })
        }
    }, [data, id]);

    const handleExpandClick = useCallback(() => {
        if (data.onDataChanged) {
            data.onDataChanged(id, { ...data, expanded: !data.expanded })
        }
    }, [data, id]);

    return (
        <Grid container justifyContent="center" alignItems="center" sx={{ position: 'relative' }}>
            <Grid item xs={4}>
                <Avatar src={data?.photo} sx={{ width: 48, height: 48, borderColor, borderWidth: borderColor ? '0.2rem' : undefined, borderStyle: borderColor ? 'solid' : undefined }} />
            </Grid>
            <Grid item xs={8}>
                <Typography variant="body1">{data.name}</Typography>
                <Typography variant="caption">{data.title}</Typography>
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
            {!disabledExpand && <IconButton
                aria-label="edit"
                size="small"
                style={{
                    position: 'absolute',
                    top: -16,
                    right: 4,
                    width: '1rem',
                    height: '1rem',
                    backgroundColor: '#fff',
                    borderWidth: '1px',
                    borderColor: '#000',
                    borderStyle: 'solid'
                }}
                onClick={handleExpandClick}
            >
                {!data.expanded && <ExpandMoreIcon style={{ width: '0.6rem', height: '0.6rem' }} />}
                {data.expanded && <ExpandLessIcon style={{ width: '0.6rem', height: '0.6rem' }} />}
            </IconButton>}
        </Grid>
    )
}

export default NodeItem
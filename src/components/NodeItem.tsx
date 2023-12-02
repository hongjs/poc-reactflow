import { Avatar, Grid, IconButton, Typography } from '@mui/material';

import { Edit as EditIcon } from '@mui/icons-material';


interface NodeItemProps {
    name?: string
    title?: string
    data?: any
    borderColor?: string
    handleEditClick: () => void
}

const NodeItem = ({ name, title, data, borderColor, handleEditClick }: NodeItemProps) => {
    return (
        <Grid container justifyContent="center" alignItems="center" sx={{ position: 'relative' }}>
            <Grid item xs={4}>
                <Avatar src={data?.photo} sx={{ width: 48, height: 48, borderColor, borderWidth: borderColor ? '0.2rem' : undefined, borderStyle: borderColor ? 'solid' : undefined }} />
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
    )
}

export default NodeItem
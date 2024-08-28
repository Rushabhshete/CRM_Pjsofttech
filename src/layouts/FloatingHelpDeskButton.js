import React, { useState } from 'react';
import { Fab } from '@mui/material';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import HelpDeskForm from './HelpDeskForm';

const FloatingHelpDeskButton = () => {
    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Fab
                color="primary"
                aria-label="help desk"
                onClick={handleClick}
                sx={{
                    position: 'fixed',
                    bottom: 16,
                    right: 16,
                    zIndex: 1000,
                    backgroundImage: 'linear-gradient(to right, #FAD126, #FF564E)',
                    color: 'white',
                }}
            >
                <AnnouncementIcon />
            </Fab>
            <HelpDeskForm open={open} onClose={handleClose} />
        </>
    );
};

export default FloatingHelpDeskButton;

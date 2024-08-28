// ListInfoButton.jsx
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

const ListInfoButton = ({ open, handleClose, infodata }) => (
  <Dialog open={open} onClose={handleClose}>
    <DialogTitle>Details</DialogTitle>
    <DialogContent>
      <pre>{JSON.stringify(infodata, null, 2)}</pre>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose} color="primary">Close</Button>
    </DialogActions>
  </Dialog>
);

export default ListInfoButton;

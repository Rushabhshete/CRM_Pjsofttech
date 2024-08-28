import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Box
} from "@mui/material";
import { styled } from "@mui/system";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const StyledTableHeader = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
}));

const AddmissionSource = () => {
  const [sourceName, setSourceName] = useState("");
  const [sources, setSources] = useState([]);
  const [filteredSources, setFilteredSources] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedSourceId, setSelectedSourceId] = useState(null);
  const [updateSourceName, setUpdateSourceName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchSources();
  }, []);

  useEffect(() => {
    filterSources();
  }, [sources, searchTerm]);

  const fetchSources = async () => {
    try {
      const institutecode = localStorage.getItem("institutecode");
      if (!institutecode) {
        throw new Error("No institutecode found in local storage");
      }
      const response = await axios.get(
        `http://localhost:8085/api/sourceBy/getAll?institutecode=${institutecode}`
      );
      setSources(response.data);
    } catch (error) {
      console.error("Error fetching sources:", error);
    }
  };

  const filterSources = () => {
    const filtered = sources.filter((source) =>
      source.sourceBy.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSources(filtered);
  };

  const handleAddSource = async () => {
    try {
      const institutecode = localStorage.getItem("institutecode");
      if (!institutecode) {
        throw new Error("No institutecode found in local storage");
      }
      await axios.post(
        `http://localhost:8085/api/sourceBy/saveSourceBy?institutecode=${institutecode}`,
        { sourceBy: sourceName }
      );
      setSourceName("");
      fetchSources(); // Refresh the source list
      handleCloseAddDialog(); // Close the dialog
    } catch (error) {
      console.error("Error adding source:", error.response || error.message);
    }
  };

  const handleUpdateSource = async () => {
    try {
      const institutecode = localStorage.getItem("institutecode");
      if (!institutecode) {
        throw new Error("No institutecode found in local storage");
      }
      await axios.put(
        `http://localhost:8085/api/sourceBy/updateSourceBy/${selectedSourceId}`,
        {
          sourceBy: updateSourceName,
          institutecode: institutecode // Include institutecode if required
        }
      );
      fetchSources(); // Refresh the source list
      handleCloseUpdateDialog(); // Close the dialog
    } catch (error) {
      console.error("Error updating source:", error.response || error.message);
    }
  };

  const handleDeleteSource = async () => {
    try {
      await axios.delete(
        `http://localhost:8085/api/sourceBy/deleteSourceBy/${selectedSourceId}`
      );
      fetchSources(); // Refresh the source list
      handleCloseDeleteDialog(); // Close the dialog
    } catch (error) {
      console.error("Error deleting source:", error.response || error.message);
    }
  };

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setSourceName("");
  };

  const handleOpenUpdateDialog = (source) => {
    setUpdateSourceName(source.sourceBy);
    setSelectedSourceId(source.id);
    setOpenUpdateDialog(true);
  };

  const handleCloseUpdateDialog = () => {
    setOpenUpdateDialog(false);
    setUpdateSourceName("");
    setSelectedSourceId(null);
  };

  const handleOpenDeleteDialog = (id) => {
    setSelectedSourceId(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedSourceId(null);
  };

  return (
    <Container maxWidth="false" sx={{ padding: 2, width: "100%" }}>
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          fontWeight: "bold",
          color: "#fff",
          textAlign: "center",
          backgroundColor: "#24A0ED",
          borderRadius: "150px",
          padding: "10px",
          marginBottom: "-2px",
    
        }}
      >
        Add Source 
      </Typography>
      <Grid Grid container spacing={1} alignItems="center" justifyContent="flex-start">
        <Grid item xs={12} sm={2}>
          <Box mt={2} padding={"1%"}> 
          <Typography
        variant="h6"
        gutterBottom
        sx={{  whiteSpace: "nowrap" }}>
          Total Sources: {filteredSources.length}
          </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={1.6} mt={2} className="textfield-root">
          <TextField
            label="Search Source"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenAddDialog}
            sx={{ mt: 2 }}
          >
            Add Source
          </Button>
        </Grid>
      </Grid>

      <Box mt={2}>
      <TableContainer sx={{ width: "100%" }}>
        <Table size="small" aria-label="source table" sx={{ width: "100%" }}>
          <TableHead sx={{ backgroundColor: "#f2f2f2" }}>
            <TableRow>
              <StyledTableHeader>ID</StyledTableHeader>
              <StyledTableHeader>Source Name</StyledTableHeader>
              <StyledTableHeader>Action Required</StyledTableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSources.map((source) => (
              <TableRow key={source.id}>
                <TableCell>{source.id}</TableCell>
                <TableCell>{source.sourceBy}</TableCell>
                <TableCell>
                  <Button
                    edge="end"
                    aria-label="edit"
                    onClick={() => handleOpenUpdateDialog(source)}
                    color="primary"
                    sx={{ mr: 1 }}
                    variant="contained"
                  >
                    Update
                  </Button>
                  <Button
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleOpenDeleteDialog(source.id)}
                    color="error"
                    variant="contained"
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </Box>

      {/* Add Source Dialog */}
      <Dialog
        open={openAddDialog}
        onClose={handleCloseAddDialog}
        aria-labelledby="add-source-dialog-title"
        aria-describedby="add-source-dialog-description"
      >
        <DialogTitle id="add-source-dialog-title">Add New Source</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="source-name"
            label="Source Name"
            type="text"
            fullWidth
            variant="outlined"
            value={sourceName}
            onChange={(e) => setSourceName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddSource} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Source Dialog */}
      <Dialog
        open={openUpdateDialog}
        onClose={handleCloseUpdateDialog}
        aria-labelledby="update-source-dialog-title"
        aria-describedby="update-source-dialog-description"
      >
        <DialogTitle id="update-source-dialog-title">Update Source</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="update-source-name"
            label="Source Name"
            type="text"
            fullWidth
            variant="outlined"
            value={updateSourceName}
            onChange={(e) => setUpdateSourceName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpdateDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleUpdateSource} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Source Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-source-dialog-title"
        aria-describedby="delete-source-dialog-description"
      >
        <DialogTitle id="delete-source-dialog-title">Delete Source</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-source-dialog-description">
            Are you sure you want to delete this source? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDeleteSource} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AddmissionSource;

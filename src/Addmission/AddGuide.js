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
  Grid, Box
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { styled } from "@mui/material/styles";



const AddGuide = () => {
  const [guideName, setGuideName] = useState("");
  const [guides, setGuides] = useState([]);
  const [filteredGuides, setFilteredGuides] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedGuideId, setSelectedGuideId] = useState(null);
  const [updateGuideName, setUpdateGuideName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchGuides();
  }, []);

  useEffect(() => {
    filterGuides();
  }, [guides, searchTerm]);

  const fetchGuides = async () => {
    try {
      const institutecode = localStorage.getItem("institutecode");
      if (!institutecode) {
        throw new Error("No institutecode found in local storage");
      }
      const response = await axios.get(
        `http://localhost:8085/api/conductBy/getAllConductBy?institutecode=${institutecode}`
      );
      setGuides(response.data);
    } catch (error) {
      console.error("Error fetching guides:", error);
    }
  };

  const filterGuides = () => {
    const filtered = guides.filter((guide) =>
      guide.guideName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredGuides(filtered);
  };

  const handleAddGuide = async () => {
    try {
      const institutecode = localStorage.getItem("institutecode");
      if (!institutecode) {
        throw new Error("No institutecode found in local storage");
      }
      await axios.post(
        `http://localhost:8085/api/conductBy/saveConductBy?institutecode=${institutecode}`,
        { guideName }
      );
      setGuideName("");
      fetchGuides(); // Refresh the guide list
      handleCloseAddDialog(); // Close the dialog
    } catch (error) {
      console.error("Error adding guide:", error);
    }
  };

  const handleUpdateGuide = async () => {
    try {
      const institutecode = localStorage.getItem("institutecode");
      if (!institutecode) {
        throw new Error("No institutecode found in local storage");
      }
      await axios.put(
        `http://localhost:8085/api/conductBy/updateConductBy/${selectedGuideId}?institutecode=${institutecode}`,
        { guideName: updateGuideName }
      );
      fetchGuides(); // Refresh the guide list
      handleCloseUpdateDialog(); // Close the dialog
    } catch (error) {
      console.error("Error updating guide:", error);
    }
  };

  const handleDeleteGuide = async () => {
    try {
      await axios.delete(
        `http://localhost:8085/api/conductBy/deleteConductBy/${selectedGuideId}`
      );
      fetchGuides(); // Refresh the guide list
      handleCloseDeleteDialog(); // Close the dialog
    } catch (error) {
      console.error("Error deleting guide:", error);
    }
  };

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setGuideName("");
  };

  const handleOpenUpdateDialog = (guide) => {
    setUpdateGuideName(guide.guideName);
    setSelectedGuideId(guide.id);
    setOpenUpdateDialog(true);
  };

  const handleCloseUpdateDialog = () => {
    setOpenUpdateDialog(false);
    setUpdateGuideName("");
    setSelectedGuideId(null);
  };

  const handleOpenDeleteDialog = (id) => {
    setSelectedGuideId(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedGuideId(null);
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
        Guide List 
      </Typography>
      <Grid container spacing={1} alignItems="center" justifyContent="flex-start">
        <Grid item xs={12} sm={2}>
          <Box mt={2} padding={"1%"}>
            <Typography
        variant="h6"
        gutterBottom
        sx={{  whiteSpace: "nowrap" }}>
            Total Guides: {filteredGuides.length}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={1.6} mt={2} className="textfield-root">
          <TextField
            label="Search Guide"
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
            Add New Guide
          </Button>
        </Grid>
        
      </Grid>

      <Box mt={2}>
      <TableContainer sx={{ width: "100%" }}>
        <Table size="small" aria-label="source table" sx={{ width: "100%" }}>
          <TableHead sx={{ backgroundColor: "#f2f2f2" }}>
            <TableRow>
              <TableCell style={{ fontWeight: "bold" }}>ID</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Guide Name</TableCell>
              <TableCell style={{ fontWeight: "bold" }} >
                Action Required
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredGuides.map((guide) => (
              <TableRow key={guide.id}>
                <TableCell>{guide.id}</TableCell>
                <TableCell>{guide.guideName}</TableCell>
                <TableCell >
                  <Button
                    edge="end"
                    aria-label="edit"
                    onClick={() => handleOpenUpdateDialog(guide)}
                    color="primary"
                    sx={{ mr: 1 }}
                    variant="contained"
                  >
                    Update
                  </Button>
                  <Button
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleOpenDeleteDialog(guide.id)}
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

      {/* Add Guide Dialog */}
      <Dialog
        open={openAddDialog}
        onClose={handleCloseAddDialog}
        aria-labelledby="add-guide-dialog-title"
      >
        <DialogTitle id="add-guide-dialog-title">Add New Guide</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Guide Name"
            type="text"
            fullWidth
            value={guideName}
            onChange={(e) => setGuideName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddGuide} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Guide Dialog */}
      <Dialog
        open={openUpdateDialog}
        onClose={handleCloseUpdateDialog}
        aria-labelledby="update-guide-dialog-title"
      >
        <DialogTitle id="update-guide-dialog-title">Update Guide</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Guide Name"
            type="text"
            fullWidth
            value={updateGuideName}
            onChange={(e) => setUpdateGuideName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpdateDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdateGuide} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Guide Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-guide-dialog-title"
      >
        <DialogTitle id="delete-guide-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this guide? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteGuide} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AddGuide;

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Grid,
  Box,
  Container,
  Snackbar,
} from "@mui/material";
import { styled } from "@mui/system";
import DeleteIcon from "@mui/icons-material/Delete";



// Confirm Delete Dialog
const ConfirmDialog = ({ open, onClose, onConfirm, sourceName }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Confirm Delete</DialogTitle>
    <DialogContent>
      <Typography>
        Are you sure you want to delete the source "{sourceName}"?
      </Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary">
        Cancel
      </Button>
      <Button onClick={onConfirm} color="error">
        Confirm
      </Button>
    </DialogActions>
  </Dialog>
);

// Add/Update Source Dialog
const SourceDialog = ({ open, onClose, source, onSave, isUpdate }) => {
  const [name, setName] = useState(source ? source.name : "");

  useEffect(() => {
    if (source) setName(source.name);
  }, [source]);

  const handleSave = () => {
    onSave({ ...source, name });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{isUpdate ? "Update Source" : "Add New Source"}</DialogTitle>
      <DialogContent>
        <TextField
          label="Source Name"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const Source = () => {
  const [sources, setSources] = useState([]);
  const [filteredSources, setFilteredSources] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [sourceToDelete, setSourceToDelete] = useState(null);
  const [sourceDialogOpen, setSourceDialogOpen] = useState(false);
  const [currentSource, setCurrentSource] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const institutecode = localStorage.getItem("institutecode") || "";

  useEffect(() => {
    loadSources();
  }, [institutecode]);

  useEffect(() => {
    filterSources();
  }, [searchTerm, sources]);

  const loadSources = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8086/getAllSource?institutecode=${institutecode}`
      );
      setSources(response.data);
      setFilteredSources(response.data); // Initially set filtered sources to all sources
    } catch (error) {
      console.error("Error fetching sources:", error);
    }
  };

  const filterSources = () => {
    const filtered = sources.filter((source) =>
      source.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSources(filtered);
  };

  const handleOpenConfirmDialog = (source) => {
    setSourceToDelete(source);
    setConfirmDialogOpen(true);
  };

  const handleCloseConfirmDialog = () => {
    setConfirmDialogOpen(false);
    setSourceToDelete(null);
  };

  const confirmDeleteSource = async () => {
    try {
      await axios.delete(
        `http://localhost:8086/delete/source/${sourceToDelete.id}`
      );
      loadSources();
      handleCloseConfirmDialog();
    } catch (error) {
      console.error("Error deleting source:", error);
    }
  };

  const handleOpenSourceDialog = (source = null, isUpdate = false) => {
    setCurrentSource(source);
    setIsUpdate(isUpdate);
    setSourceDialogOpen(true);
  };

  const handleCloseSourceDialog = () => {
    setSourceDialogOpen(false);
    setCurrentSource(null);
  };

  const handleSaveSource = async (source) => {
    try {
      if (isUpdate) {
        await axios.put(
          `http://localhost:8086/update/source/${source.id}`,
          source
        );
        setSnackbarMessage("Source updated successfully");
      } else {
        await axios.post(
          `http://localhost:8086/save/source?institutecode=${institutecode}`,
          source
        );
        setSnackbarMessage("Source added successfully");
      }
      setSnackbarOpen(true);
      loadSources();
    } catch (error) {
      console.error("Error saving source:", error);
      setSnackbarMessage("Error saving source");
      setSnackbarOpen(true);
    }
  };

  return (
    <Container maxWidth="false" sx={{ padding: 2, width: "100%" }}>
      <Box textAlign="center" sx={{ width: "100%" }}>
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
          Source List
        </Typography>

        <Grid container spacing={1} alignItems="center" justifyContent="flex-start">
          <Grid item xs={12} sm={2}>
            <Box mt={2} padding={"1%"}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ whiteSpace: "nowrap" }}
              >
                Total Sources: {filteredSources.length}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={2}>
            <TextField
              label="Search Source"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
              sx={{ mt: 2 }}
            />
          </Grid>

          <Grid item xs={12} sm={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleOpenSourceDialog(null, false)}
              sx={{ mt: 2 }}
              fullWidth
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
                  <TableCell>
                    <strong>Id</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Source Name</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Action Required</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSources.map((source, index) => (
                  <TableRow key={source.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{source.name}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleOpenSourceDialog(source, true)}
                        size="small"
                        sx={{ marginRight: "10px" }}
                      >
                        Update
                      </Button>
                      <Button
                        color="error"
                        onClick={() => handleOpenConfirmDialog(source)}
                        size="small"
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

        <ConfirmDialog
          open={confirmDialogOpen}
          onClose={handleCloseConfirmDialog}
          onConfirm={confirmDeleteSource}
          sourceName={sourceToDelete?.name}
        />

        <SourceDialog
          open={sourceDialogOpen}
          onClose={handleCloseSourceDialog}
          source={currentSource}
          onSave={handleSaveSource}
          isUpdate={isUpdate}
        />

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={2000}
          onClose={() => setSnackbarOpen(false)}
          message={snackbarMessage}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          ContentProps={{
            sx: { backgroundColor: snackbarMessage === "Error saving source" ? "red" : "green" },
          }}
        />
      </Box>
    </Container>
  );
};

export default Source;

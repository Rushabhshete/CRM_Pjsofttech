import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Grid,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import DeleteIcon from "@mui/icons-material/Delete";

const ConfirmDialog = ({ open, onClose, onConfirm, conductName }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Confirm Delete</DialogTitle>
    <DialogContent>
      <DialogContentText>
        Are you sure you want to delete the conduct "{conductName}"?
      </DialogContentText>
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

const ConductDialog = ({ open, onClose, onSave, conduct }) => {
  const [name, setName] = useState(conduct ? conduct.name : "");

  useEffect(() => {
    if (conduct) {
      setName(conduct.name);
    }
  }, [conduct]);

  const handleSave = () => {
    const newConduct = { name };
    onSave(newConduct);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{conduct ? "Update Conduct" : "Add New Conduct"}</DialogTitle>
      <DialogContent>
        <TextField
          label="Conduct Name"
          variant="outlined"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          {conduct ? "Update" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const Conduct = () => {
  const { id } = useParams();
  const [conducts, setConducts] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openConductDialog, setOpenConductDialog] = useState(false);
  const [conductToDelete, setConductToDelete] = useState(null);
  const [conductToEdit, setConductToEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const institutecode = localStorage.getItem("institutecode") || "";

  useEffect(() => {
    loadConducts();
  }, [institutecode]);

  const loadConducts = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8086/get/getAllConductModels?institutecode=${institutecode}`
      );
      setConducts(response.data);
    } catch (error) {
      console.error("Error fetching conducts:", error);
    }
  };

  const handleOpenDeleteDialog = (conduct) => {
    setConductToDelete(conduct);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setConductToDelete(null);
  };

  const confirmDeleteConduct = async () => {
    try {
      await axios.delete(
        `http://localhost:8086/deleteConduct/${conductToDelete.id}`
      );
      loadConducts();
      handleCloseDeleteDialog();
    } catch (error) {
      console.error("Error deleting conduct:", error);
    }
  };

  const handleOpenConductDialog = (conduct) => {
    setConductToEdit(conduct);
    setOpenConductDialog(true);
  };

  const handleCloseConductDialog = () => {
    setOpenConductDialog(false);
    setConductToEdit(null);
  };

  const saveConduct = async (newConduct) => {
    try {
      if (conductToEdit) {
        await axios.put(
          `http://localhost:8086/updateConduct/${conductToEdit.id}`,
          newConduct
        );
      } else {
        await axios.post(
          `http://localhost:8086/save/conduct_by?institutecode=${institutecode}`,
          newConduct
        );
      }
      loadConducts();
      handleCloseConductDialog();
    } catch (error) {
      console.error("Error saving conduct:", error);
    }
  };

  const filteredConducts = conducts.filter((conduct) =>
    conduct.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          Conduct List
        </Typography>

        <Grid container spacing={1} alignItems="center" justifyContent="flex-start">
          <Grid item xs={12} sm={2}>
            <Box mt={2} padding={"1%"}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ whiteSpace: "nowrap" }}
              >
                Total Conducts: {filteredConducts.length}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={1.6} mt={2}>
            <TextField
              label="Search Conduct"
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
              sx={{ mt: 2 }}
              onClick={() => handleOpenConductDialog(null)}
              fullWidth
            >
              Add New Conduct
            </Button>
          </Grid>
        </Grid>

        <Box mt={2}>
          <TableContainer sx={{ width: "100%" }}>
            <Table size="small" aria-label="conduct table" sx={{ width: "100%" }}>
              <TableHead sx={{ backgroundColor: "#f2f2f2" }}>
                <TableRow>
                  <TableCell>
                    <strong>Id</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Conduct Name</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Action Required</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredConducts.length > 0 ? (
                  filteredConducts.map((conduct, index) => (
                    <TableRow key={conduct.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{conduct.name}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          sx={{ marginRight: "10px" }}
                          onClick={() => handleOpenConductDialog(conduct)}
                        >
                          Update
                        </Button>
                        <Button
                          color="error"
                          onClick={() => handleOpenDeleteDialog(conduct)}
                          size="small"
                          variant="contained"
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      No conduct found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <ConfirmDialog
          open={openDeleteDialog}
          onClose={handleCloseDeleteDialog}
          onConfirm={confirmDeleteConduct}
          conductName={conductToDelete?.name}
        />

        <ConductDialog
          open={openConductDialog}
          onClose={handleCloseConductDialog}
          onSave={saveConduct}
          conduct={conductToEdit}
        />
      </Box>
    </Container>
  );
};

export default Conduct;

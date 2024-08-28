import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Dialog,
  Button,
  DialogActions,
  DialogContent,
  TextField,
  Box,
  IconButton,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { styled } from "@mui/system";

const ManageMemo = () => {
  const [memos, setMemos] = useState([]);
  const [selectedMemo, setSelectedMemo] = useState(null);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false); // Updated state variable name
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // New state variable for delete confirmation dialog
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    fetchMemos();
  }, []);

  const fetchMemos = async () => {
    try {
      const response = await fetch("http://localhost:8082/memos/all");
      const data = await response.json();
      setMemos(data);
    } catch (error) {
      console.error("Error fetching memos:", error);
    }
  };

  const handleResolve = (memo) => {
    setSelectedMemo(memo);
    setEmail(memo.email); // Ensure email is set
    setSubject(memo.memoName); // Ensure subject is set
    setDescription(memo.memoDescription); // Ensure description is set
    setDate(memo.createdAt); // Ensure date is set
    setOpenUpdateDialog(true); // Open update dialog
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:8082/memos/deletememo/${selectedMemo.mid}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        fetchMemos(); // Refresh the list of memos
        toast.success("Memo deleted successfully!");
      } else {
        console.error("Error deleting memo:", response.statusText);
        toast.error("Failed to delete memo");
      }
    } catch (error) {
      console.error("Error deleting memo:", error);
      toast.error("Failed to delete memo");
    } finally {
      setOpenDeleteDialog(false); // Close delete confirmation dialog
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(
        `http://localhost:8082/memos/updatememo/${selectedMemo.mid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            memoName: subject,
            memoDescription: description,
            createdAt: date,
          }),
        }
      );

      if (response.ok) {
        setOpenUpdateDialog(false); // Close update dialog
        fetchMemos(); // Refresh the list of memos
        toast.success("Memo updated successfully!");
      } else {
        console.error("Error updating memo:", response.statusText);
        toast.error("Failed to update memo");
      }
    } catch (error) {
      console.error("Error updating memo:", error);
      toast.error("Failed to update memo");
    }
  };

  const handleCloseUpdateDialog = () => {
    setOpenUpdateDialog(false); // Close update dialog
  };

  const handleOpenDeleteDialog = (memo) => {
    setSelectedMemo(memo); // Set selected memo for deletion
    setOpenDeleteDialog(true); // Open delete confirmation dialog
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false); // Close delete confirmation dialog
  };

  const PopTypography = styled(Typography)`
    @keyframes pop {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.1);
      }
      100% {
        transform: scale(1);
      }
    }

 
  `;

  return (
    <>
      <PopTypography
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
        Manage Memo
      </PopTypography>
      <Box sx={{ mt: 2, p: 2 }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ background: "#f2f2f2" }}>
              <TableRow>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="bold">
                    ID
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Email
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Subject
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Description
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Date
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Status
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {memos.map((memo) => (
                <TableRow key={memo.mid}>
                  <TableCell>{memo.mid}</TableCell>
                  <TableCell>{memo.email}</TableCell>
                  <TableCell>{memo.memoName}</TableCell>
                  <TableCell>{memo.memoDescription}</TableCell>
                  <TableCell>{memo.createdAt}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleResolve(memo)}
                    >
                      <CheckCircleIcon />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      onClick={() => handleOpenDeleteDialog(memo)}
                    >
                      {" "}
                      {/* Update to handleOpenDeleteDialog */}
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog
          open={openUpdateDialog}
          className="textField-root"
          onClose={handleCloseUpdateDialog}
        >
          {" "}
          {/* Update dialog open */}
          <PopTypography
            variant="h6"
            gutterBottom
            sx={{
              fontWeight: "bold",
              color: "#fff",
              textAlign: "center",
              backgroundColor: "#24A0ED",
              borderRadius: "150px",
              padding: "10px",
              marginRight: "150px",
              marginLeft: "150px",
              marginBottom: "-2px",
              marginTop: "10px",
            }}
          >
            Update Memo
          </PopTypography>
          <DialogContent>
            <TextField
              margin="dense"
              label="Email"
              type="text"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Subject"
              type="text"
              fullWidth
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Description"
              type="text"
              fullWidth
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Date"
              type="date"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseUpdateDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleUpdate} color="primary">
              Update
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog // Delete confirmation dialog
          open={openDeleteDialog}
          onClose={handleCloseDeleteDialog}
        >
          <DialogContent>
            <Typography>Are you sure you want to delete this memo?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDelete} color="secondary">
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        <ToastContainer />
      </Box>
    </>
  );
};

export default ManageMemo;

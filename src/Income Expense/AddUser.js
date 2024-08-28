import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Snackbar,
  Grid,
} from "@mui/material";
import { styled } from "@mui/system";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const AlertDialog = ({ open, onClose, onConfirm }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle color="blue" textAlign={"center"}>
      Confirm Deletion
    </DialogTitle>
    <DialogContent>
      <Typography>Are you sure you want to delete this User?</Typography>
      <Typography color="red" fontWeight={200} variant="body2">
        *On clicking Confirm, this User cannot be recovered
      </Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary">
        Cancel
      </Button>
      <Button
        onClick={() => {
          onConfirm();
          onClose();
        }}
        color="primary"
      >
        Confirm
      </Button>
    </DialogActions>
  </Dialog>
);

const AddUser = () => {
  const [open, setOpen] = useState(false);
  const [userName, setNewUser] = useState("");
  const [Users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [editUser, setEditUser] = useState({ id: null, userName: "" });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  // Retrieve email from localStorage
  const getInstituteCode = () => localStorage.getItem("institutecode");

  // Fetch Users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `http://localhost:8087/users/getAllUserByinstitutecode?institutecode=${getInstituteCode()}`
        );
        const result = await response.json();
        setUsers(result);
      } catch (error) {
        console.error("Error fetching Users: ", error);
      }
    };

    fetchUsers();
  }, [getInstituteCode()]);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredUsers(Users);
    } else {
      setFilteredUsers(
        Users.filter((user) =>
          user.userName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, Users]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setError(""); // Clear any error when closing
  };

  const handleChange = (event) => {
    setNewUser(event.target.value);
  };

  const handleSubmit = async () => {
    const getInstituteCode = () => localStorage.getItem("institutecode");
    if (userName.trim() === "") {
      setError("User name cannot be empty");
    } else if (Users.map((u) => u.userName).includes(userName.trim())) {
      setError("User already exists");
    } else {
      try {
        const response = await fetch(
          `http://localhost:8087/users/save?institutecode=${getInstituteCode()}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userName: userName.trim() }),
          }
        );
        if (response.ok) {
          // Refresh Users list after adding new userName
          const updatedResponse = await fetch(
            `http://localhost:8087/users/getAllUserByinstitutecode?institutecode=${getInstituteCode()}`
          );
          const updatedUser = await updatedResponse.json();
          setUsers(updatedUser);
          setNewUser("");
          setError("");
          handleClose();
        } else {
          setError("Failed to add userName");
        }
      } catch (error) {
        console.error("Error adding userName: ", error);
        setError("Failed to add userName");
      }
    }
  };

  const handleEditClickOpen = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8087/users/getById/${id}`
      );
      const result = await response.json();
      setEditUser(result);
      setEditOpen(true);
    } catch (error) {
      console.error("Error fetching user details: ", error);
    }
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setEditUser({ id: null, userName: "" });
    setError("");
  };

  const handleEditChange = (event) => {
    setEditUser({ ...editUser, userName: event.target.value });
  };

  const handleUpdate = async () => {
    if (editUser.userName.trim() === "") {
      setError("User name cannot be empty");
    } else {
      try {
        const response = await fetch(
          `http://localhost:8087/users/update/${editUser.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userName: editUser.userName.trim(),
              institutecode: getInstituteCode(), // Ensure email is included
            }),
          }
        );
        if (response.ok) {
          const updatedResponse = await fetch(
            `http://localhost:8087/users/getAllUserByinstitutecode?institutecode=${getInstituteCode()}`
          );
          const updatedUser = await updatedResponse.json();
          setUsers(updatedUser);
          setSnackbarMessage("User updated successfully");
          setSnackbarOpen(true);
          handleEditClose();
        } else {
          setError("Failed to update user");
        }
      } catch (error) {
        console.error("Error updating user: ", error);
        setError("Failed to update user");
      }
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:8087/users/delete/${userIdToDelete}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        // Refresh Users list after deleting user
        const updatedResponse = await fetch(
          `http://localhost:8087/users/getAllUserByinstitutecode?institutecode=${getInstituteCode()}`
        );
        const updatedUser = await updatedResponse.json();
        setUsers(updatedUser);
        setSnackbarMessage("User deleted successfully");
        setSnackbarOpen(true);
        setUserIdToDelete(null);
      } else {
        console.error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user: ", error);
    }
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
    <div>
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
          marginBottom: "20px",
        }}
      >
        Add User
      </PopTypography>
      <Grid container spacing={2} className="textField-root">
      <Typography
        variant="h6"
        gutterBottom
        sx={{ marginTop: 3, whiteSpace: "nowrap" }}
      >
        Total Users : {Users.length}
      </Typography>
        {/* Dropdown Fields */}
        <Grid item xs={12} sm={1.6}>
          <TextField
            label="Search Category"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </Grid>
        <Grid item xs={12} sm={1.6}>
          <Button variant="contained" color="primary" onClick={handleClickOpen}  sx={{marginTop:1}}>
            Add User
          </Button>
        </Grid>
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="User Name"
            type="text"
            fullWidth
            variant="outlined"
            value={userName}
            onChange={handleChange}
            error={!!error}
            helperText={error}
            className="textField-root"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editOpen} onClose={handleEditClose}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="User Name"
            type="text"
            fullWidth
            variant="outlined"
            value={editUser.userName}
            onChange={handleEditChange}
            error={!!error}
            helperText={error}
            className="textField-root"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdate} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <AlertDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
      />
      <TableContainer>
        <Table sx={{ minWidth: 250,justifyContent:"center",marginTop:3   }}>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  padding: "4px",
                  fontWeight: "bold",
                  backgroundColor: "#f5f5f5",
                }}
              >
                User ID
              </TableCell>
              <TableCell
                sx={{
                  padding: "4px",
                  fontWeight: "bold",
                  backgroundColor: "#f5f5f5",
                }}
              >
                User Name
              </TableCell>
              <TableCell
                sx={{
                  padding: "4px",
                  fontWeight: "bold",
                  backgroundColor: "#f5f5f5",
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell sx={{ padding: "4px" }}>{user.id}</TableCell>
                <TableCell sx={{ padding: "4px" }}>{user.userName}</TableCell>
                <TableCell sx={{ padding: "4px" }}>
                  <Button
                    onClick={() => handleEditClickOpen(user.id)}
                    color="primary"
                    variant="contained"
                    style={{marginRight:"10px"}}
                  >
                    Update
                  </Button>
                  <Button
                    onClick={() => {
                      setUserIdToDelete(user.id);
                      setConfirmOpen(true);
                    }}
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
    </div>
  );
};

export default AddUser;

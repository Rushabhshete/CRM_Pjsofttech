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
  IconButton,
  Snackbar,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { styled } from "@mui/system";
import MuiAlert from "@mui/material/Alert";
import "./Design.css";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const AlertDialog = ({ open, onClose, onConfirm }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Confirm Deletion</DialogTitle>
    <DialogContent>
      <Typography>Are you sure you want to delete this category?</Typography>
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

const AddCategory = () => {
  const [open, setOpen] = useState(false);
  const [categoryName, setNewCategoryName] = useState("");
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [editCategory, setEditCategory] = useState({
    id: null,
    categoryName: "",
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [categoryIdToDelete, setCategoryIdToDelete] = useState(null);

  const getEmail = () => localStorage.getItem("APIemail");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const email = getEmail();
        const response = await fetch(
          `http://localhost:8087/categories/getAllCategoriesByEmail?email=${encodeURIComponent(
            email
          )}`
        );
        const result = await response.json();
        setCategories(result);
      } catch (error) {
        console.error("Error fetching categories: ", error);
      }
    };

    fetchCategories();
  }, []);

  const handleClickOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setError(""); // Clear any error when closing
  };

  const handleChange = (event) => setNewCategoryName(event.target.value);

  const handleSubmit = async () => {
    if (categoryName.trim() === "") {
      setError("Category name cannot be empty");
    } else if (
      categories.map((c) => c.categoryName).includes(categoryName.trim())
    ) {
      setError("Category already exists");
    } else {
      try {
        const email = getEmail();
        const response = await fetch(
          `http://localhost:8087/categories/save?adminemail=${encodeURIComponent(
            email
          )}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ categoryName: categoryName.trim() }),
          }
        );
        if (response.ok) {
          const updatedResponse = await fetch(
            `http://localhost:8087/categories/getAllCategoriesByEmail?email=${encodeURIComponent(
              email
            )}`
          );
          const updatedCategory = await updatedResponse.json();
          setCategories(updatedCategory);
          setNewCategoryName("");
          setError("");
          handleClose();
        } else {
          setError("Failed to add category");
        }
      } catch (error) {
        console.error("Error adding category: ", error);
        setError("Failed to add category");
      }
    }
  };

  const handleEditClickOpen = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8087/categories/getById/${id}`
      );
      const result = await response.json();
      setEditCategory(result);
      setEditOpen(true);
    } catch (error) {
      console.error("Error fetching category details: ", error);
    }
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setEditCategory({ id: null, categoryName: "" });
    setError("");
  };

  const handleEditChange = (event) => {
    setEditCategory({ ...editCategory, categoryName: event.target.value });
  };

  const handleUpdate = async () => {
    if (editCategory.categoryName.trim() === "") {
      setError("Category name cannot be empty");
    } else {
      try {
        const response = await fetch(
          `http://localhost:8087/categories/update/${editCategory.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              categoryName: editCategory.categoryName.trim(),
            }),
          }
        );
        if (response.ok) {
          const email = getEmail();
          const updatedResponse = await fetch(
            `http://localhost:8087/categories/getAllCategoriesByEmail?email=${encodeURIComponent(
              email
            )}`
          );
          const updatedCategory = await updatedResponse.json();
          setCategories(updatedCategory);
          setSnackbarMessage("Category updated successfully");
          setSnackbarOpen(true);
          handleEditClose();
        } else {
          setError("Failed to update category");
        }
      } catch (error) {
        console.error("Error updating category: ", error);
        setError("Failed to update category");
      }
    }
  };

  const handleDeleteClick = (id) => {
    setCategoryIdToDelete(id);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:8087/categories/delete/${categoryIdToDelete}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        const email = getEmail();
        const updatedResponse = await fetch(
          `http://localhost:8087/categories/getAllCategoriesByEmail?email=${encodeURIComponent(
            email
          )}`
        );
        const updatedCategory = await updatedResponse.json();
        setCategories(updatedCategory);
        setSnackbarMessage("Category deleted successfully");
        setSnackbarOpen(true);
      } else {
        console.error("Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category: ", error);
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
        Add Category
      </PopTypography>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        Add Category
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Category</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Category Name"
            type="text"
            fullWidth
            variant="outlined"
            value={categoryName}
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
        <DialogTitle>Edit Category</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Category Name"
            type="text"
            fullWidth
            variant="outlined"
            value={editCategory.categoryName}
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

      <AlertDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>

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
          marginTop: "10px",
        }}
      >
        Categories List
      </PopTypography>
      <TableContainer style={{ justifyContent: "space-around" }}>
        <Table>
          <TableHead style={{ backgroundColor: "#f2f2f2" }}>
            <TableRow>
              <TableCell style={{ fontWeight: "bold" }}>ID</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>
                Category Name
              </TableCell>
              <TableCell style={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.id}</TableCell>
                <TableCell>{category.categoryName}</TableCell>
                <TableCell style={{ whiteSpace: "nowrap" }}>
                  <IconButton
                    color="primary"
                    onClick={() => handleEditClickOpen(category.id)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteClick(category.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AddCategory;

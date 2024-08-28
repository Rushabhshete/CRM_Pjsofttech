import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  studentManagementErrors,
  systems,
} from "../Income Expense/DropdownData";

const HelpDeskForm = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    adminemail: "",
    error: "",
    description: "",
    status: "Pending",
  });
  const institutecode = () => localStorage.getItem("institutecode");
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8081/createTicket?institutecode=${institutecode()}`,
        formData
      );
      console.log("Ticket created:", response.data);
      toast.success("Ticket is raised");
      onClose();
    } catch (error) {
      console.error("There was an error creating the ticket!", error);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="lg" >
        <DialogTitle>Help Desk Form</DialogTitle>
        <DialogContent>
          {/* <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Name"
            type="text"
            fullWidth
            value={formData.name}
            onChange={handleChange}
            required
          />
          <TextField
            autoFocus
            margin="dense"
            name="adminemail"
            label="Email"
            type="text"
            fullWidth
            value={formData.adminemail}
            onChange={handleChange}
            required
          /> */}
          <FormControl fullWidth margin="dense">
            <TextField
              label="Select System"
              name="system"
              value={formData.system}
              onChange={handleChange}
              required
              select
            >
              {systems.map((system) => (
                <MenuItem key={system.value} value={system.value}>
                  {system.label}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <TextField
              select
              label="Select Issues"
              name="error"
              value={formData.error}
              onChange={handleChange}
              required
            >
              {Object.keys(studentManagementErrors).map((errorKey) => (
                <MenuItem key={errorKey} value={errorKey}>
                  {studentManagementErrors[errorKey]}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={formData.description}
            onChange={handleChange}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </>
  );
};

export default HelpDeskForm;

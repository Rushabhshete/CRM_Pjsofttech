import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import axios from "axios";
import {
  typeOptions,
  billTypeOptions,
  paidByOptions,
  paymentMethodOption,
} from "./DropdownData";
import { toast, ToastContainer } from "react-toastify";
import "./Design.css";

const UpdateIncomeExpense = ({
  open,
  data,
  handleClose,
  handleUpdatedData,
}) => {
  const [formData, setFormData] = useState({
    type: "",
    user: "",
    date: "",
    category: "",
    particular: "",
    amount: 0, // Initialize as a number
    gst: 0, // Initialize as a number
    total: 0, // Initialize as a number
    paymentMethod: "",
    payingAmount: 0, // Initialize as a number
    pendingAmount: 0, // Initialize as a number
    billType: "",
    paidBy: "",
    transactionId: "",
    gstNumber: "",
    duedate: "",
    remark: "",
  });
  const [showGst, setShowGst] = useState(false);
  const [categories, setCategories] = useState([]);

  const getInstituteCode = () => localStorage.getItem("APIInstituteCode");

  useEffect(() => {
    if (data) {
      setFormData({
        ...data,
        amount: Number(data.amount) || 0,
        gst: Number(data.gst) || 0,
        total: Number(data.total) || 0,
        payingAmount: Number(data.payingAmount) || 0,
        pendingAmount: Number(data.pendingAmount) || 0,
      });
    }
  }, [data]);

  useEffect(() => {
    if (formData.amount) {
      const amount = parseFloat(formData.amount);
      let total = amount;

      if (showGst && formData.gst) {
        const gst = parseFloat(formData.gst);
        total += (amount * gst) / 100;
      }

      setFormData((prevState) => ({
        ...prevState,
        total: parseFloat(total.toFixed(2)), // Ensure total is a number
      }));
    }
  }, [formData.amount, formData.gst, showGst]);

  useEffect(() => {
    if (formData.total && formData.payingAmount) {
      const totalAmount = parseFloat(formData.total);
      const payingAmount = parseFloat(formData.payingAmount);
      const pendingAmount = totalAmount - payingAmount;
      setFormData((prevState) => ({
        ...prevState,
        pendingAmount: pendingAmount >= 0 ? pendingAmount : 0,
      }));
    }
  }, [formData.total, formData.payingAmount]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setShowGst(checked);
    } else {
      setFormData((prevState) => {
        const newState = {
          ...prevState,
          [name]: type === "number" ? parseFloat(value) : value,
        };

        if (name === "paymentMethod") {
          if (value === "Complete") {
            newState.payingAmount = newState.total;
            newState.pendingAmount = 0;
          } else {
            newState.payingAmount = "";
            newState.pendingAmount =
              newState.total - (parseFloat(newState.payingAmount) || 0);
          }
        }

        return newState;
      });
    }
  };

  const fetchUpdatedData = async () => {
    const url =
      formData.type === "Income"
        ? `http://localhost:8087/incomes/getAllIncomesByinstitutecode?institutecode=${getInstituteCode()}`
        : `http://localhost:8087/expenses/getAllExpensesByinstitutecode?institutecode=${getInstituteCode()}`;

    try {
      const response = await axios.get(url);
      handleUpdatedData(response.data);
    } catch (error) {
      console.error("Error fetching updated data: ", error);
    }
  };

  const handleSubmit = async () => {
    if (!formData.id) {
      console.error("No ID provided for update");
      return;
    }

    const url =
      formData.type === "Income"
        ? `http://localhost:8087/incomes/updateIncomeBy/${formData.id}`
        : `http://localhost:8087/expenses/updateExpenseBy/${formData.id}`;

    try {
      console.log("Sending request to:", url);
      console.log("Request payload:", formData);

      await axios.put(url, formData);
      handleClose(true); // Notify parent of success
      toast.success("Data Updated Successfully");
      fetchUpdatedData(); // Fetch updated data
    } catch (error) {
      console.error("Error updating data: ", error);
      handleClose(false); // Notify parent of failure
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8087/categories/getAllCategoriesByInstitutecode?institutecode=${getInstituteCode()}`
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories: ", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <Dialog open={open} onClose={() => handleClose(false)} maxWidth="md">
      <ToastContainer />
      <DialogTitle style={{ marginBottom: "10px" }} align="center">
        Update {formData.type}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3} className="textField-root">
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Type</InputLabel>
              <Select
                label="Type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                InputLabelProps={{ className: "required-asterisk" }}
              >
                {typeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="User"
              name="user"
              value={formData.user}
              onChange={handleChange}
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true, className: "required-asterisk" }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Category</InputLabel>
              <Select
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                InputLabelProps={{ className: "required-asterisk" }}
              >
                {categories.map((option) => (
                  <MenuItem key={option.id} value={option.categoryName}>
                    {option.categoryName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Particular"
              name="particular"
              value={formData.particular}
              onChange={handleChange}
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Amount"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              required
              InputLabelProps={{ className: "required-asterisk" }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={showGst}
                  onChange={handleChange}
                  name="showGst"
                />
              }
              label="Include GST"
            />
          </Grid>
          {showGst && (
            <Grid item xs={12} sm={6}>
              <TextField
                type="number"
                label="GST (%)"
                name="gst"
                value={formData.gst}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
          )}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Total"
              name="total"
              type="number"
              value={formData.total}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Paying Amount"
              name="payingAmount"
              type="number"
              value={formData.payingAmount}
              onChange={handleChange}
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Pending Amount"
              name="pendingAmount"
              type="number"
              value={formData.pendingAmount}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Payment Method</InputLabel>
              <Select
                label="Payment Method"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                required
                InputLabelProps={{ className: "required-asterisk" }}
              >
                {paymentMethodOption.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Bill Type</InputLabel>
              <Select
                label="Bill Type"
                name="billType"
                value={formData.billType}
                onChange={handleChange}
                required
                InputLabelProps={{ className: "required-asterisk" }}
              >
                {billTypeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Paid By</InputLabel>
              <Select
                label="Paid By"
                name="paidBy"
                value={formData.paidBy}
                onChange={handleChange}
                required
                InputLabelProps={{ className: "required-asterisk" }}
              >
                {paidByOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Transaction ID"
              name="transactionId"
              value={formData.transactionId}
              onChange={handleChange}
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="GST Number"
              name="gstNumber"
              value={formData.gstNumber}
              onChange={handleChange}
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Due Date"
              name="duedate"
              type="date"
              value={formData.duedate}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Remark"
              name="remark"
              value={formData.remark}
              onChange={handleChange}
              fullWidth
              variant="outlined"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose(false)} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateIncomeExpense;

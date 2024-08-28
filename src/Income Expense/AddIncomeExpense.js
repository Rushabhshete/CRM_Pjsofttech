import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Grid,
  TextField,
  Button,
  Typography,
  FormControl,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Checkbox,
  FormControlLabel,
  Menu,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import {
  typeOptions,
  billTypeOptions,
  paidByOptions,
  paymentMethodOption,
} from "./DropdownData";
import CloseIcon from "@mui/icons-material/Close";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { styled } from "@mui/system";
import axios from "axios";
import { debounce } from "lodash"; // Import debounce function from lodash
import jsPDF from "jspdf"; // Import jsPDF from jspdf

// Custom styles for Dialog
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  "& .MuiIconButton-root": {
    color: theme.palette.grey,
  },
}));

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

const AddIncomeExpense = () => {
  const [formData, setFormData] = useState({
    type: "",
    user: "",
    date: "",
    category: "",
    particular: "",
    amount: "",
    gst: "0",
    total: "",
    paymentMethod: "",
    payingAmount: "",
    pendingAmount: "",
    billType: "",
    paidBy: "",
    transactionId: "",
    duedate: "",
    remark: "",
  });

  const [showGst, setShowGst] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // New state for search term
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const inputRef = useRef(null);
  const [submittedData, setSubmittedData] = useState({});

  const getInstituteCode = () => localStorage.getItem("institutecode");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8087/users/getAllUserByinstitutecode?institutecode=${getInstituteCode()}`
        );
        setUsers(response.data);
        setFilteredUsers(response.data); // Initialize with all users
        setLoading(false);
      } catch (error) {
        setError("Error fetching users. Please try again.");
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8087/categories/getAllCategoriesByInstitutecode?institutecode=${getInstituteCode()}`
        );
        setCategories(response.data);
      } catch (error) {
        setError("Error fetching categories. Please try again.");
      }
    };

    fetchCategories();
  }, []);

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
        total: total.toFixed(2),
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
        const newState = { ...prevState, [name]: value };

        // Check if paymentMethod is "Complete"
        if (name === "paymentMethod") {
          if (value === "Complete") {
            newState.payingAmount = newState.total;
            newState.pendingAmount = 0;
          } else {
            // Reset payingAmount and pendingAmount if paymentMethod is not "Complete"
            newState.payingAmount = "";
            newState.pendingAmount =
              newState.total - (parseFloat(newState.payingAmount) || 0);
          }
        }

        // Handle search term update for user
        if (name === "user") {
          setSearchTerm(value);
          if (value.length >= 3) {
            setAnchorEl(inputRef.current);
          } else {
            setAnchorEl(null);
          }
        }

        return newState;
      });
    }
  };

  // Debounce the search function to improve performance
  // Memoize the debounce function
  const debouncedSearch = useCallback(
    debounce((term, users) => {
      const filtered = term
        ? users.filter((user) =>
            user.userName.toLowerCase().includes(term.toLowerCase())
          )
        : users;
      setFilteredUsers(filtered);
    }, 500),
    []
  );

  // Function to handle the search term change
  const handleSearch = (term) => {
    setSearchTerm(term);
    debouncedSearch(term, users);
  };

  useEffect(() => {
    debouncedSearch(searchTerm, users);
    // Cleanup the debounce on unmount
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm, users, debouncedSearch]);
  // const validateFormData = (data) => {
  //   return {
  //     ...data,
  //     amount: parseFloat(data.amount).toFixed(0),
  //     gst: parseFloat(data.gst).toFixed(0),
  //     total: parseFloat(data.total).toFixed(0),
  //     payingAmount: parseFloat(data.payingAmount).toFixed(0),
  //     pendingAmount: parseFloat(data.pendingAmount).toFixed(0),
  //   };
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const integerFormData = {
      ...formData,
      amount: Math.floor(parseFloat(formData.amount)),
      gst: Math.floor(parseFloat(formData.gst)),
      total: Math.floor(parseFloat(formData.total)),
      payingAmount: Math.floor(parseFloat(formData.payingAmount)),
      pendingAmount: Math.floor(parseFloat(formData.pendingAmount)),
    };
    const apiUrl =
      formData.type === "Income"
        ? `http://localhost:8087/incomes/save?institutecode=${getInstituteCode()}`
        : `http://localhost:8087/expenses/save?institutecode=${getInstituteCode()}`;

    try {
      await axios.post(apiUrl, integerFormData);
      setSubmittedData(integerFormData);
      setOpenDialog(true);
      toast.success("Form submitted successfully!");

      setFormData({
        type: "",
        user: "",
        date: "",
        category: "",
        particular: "",
        amount: "",
        gst: "0",
        total: "",
        paymentMethod: "",
        payingAmount: "",
        pendingAmount: "",
        billType: "",
        paidBy: "",
        transactionId: "",
        gstNumber: "",
        duedate: "",
        remark: "",
      });
      setSearchTerm("");
      setShowGst(false);
    } catch (error) {
      toast.error("Error submitting form. Please try again.");
    }
  };

  const handleCancel = () => {
    setFormData({
      type: "",
      user: "",
      date: "",
      category: "",
      particular: "",
      amount: "",
      gst: "0",
      total: "",
      paymentMethod: "",
      payingAmount: "",
      pendingAmount: "",
      billType: "",
      paidBy: "",
      transactionId: "",
      gstNumber: "",
      duedate: "",
      remark: "",
    });
    setSearchTerm("");
    setShowGst(false);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (userName) => {
    setFormData((prevState) => ({
      ...prevState,
      user: userName,
    }));
    setSearchTerm(""); // Clear search term
    setAnchorEl(null); // Close dropdown
  };

  const handlePrint = () => {
    const doc = new jsPDF();

    // Set up title
    const title = `${submittedData.user} ${submittedData.type} Recipt`;
    const pageWidth = doc.internal.pageSize.getWidth();
    const titleWidth = doc.getTextWidth(title);
    const titleX = (pageWidth - titleWidth) / 2;
    doc.setFontSize(18);
    doc.text(title, titleX, 15);

    // Prepare table data with capitalized and bold field names
    const tableData = [];
    const entries = Object.entries(submittedData);

    // Create rows with two field-value pairs per row
    for (let i = 0; i < entries.length; i += 2) {
      const row = [];
      const [key1, value1] = entries[i];
      row.push(
        { content: capitalizeFirstLetter(key1), styles: { fontStyle: "bold" } },
        value1
      );

      if (i + 1 < entries.length) {
        const [key2, value2] = entries[i + 1];
        row.push(
          {
            content: capitalizeFirstLetter(key2),
            styles: { fontStyle: "bold" },
          },
          value2
        );
      } else {
        row.push("", ""); // Add empty cells if there's no second pair
      }

      tableData.push(row);
    }

    // Adjust marginTop as needed
    const marginTop = 25; // Space between title and table
    doc.autoTable({
      // head: [["Field", "Value", "Field", "Value"]],
      body: tableData,
      theme: "grid",
      startY: 15 + marginTop, // Start below the title
      columnStyles: {
        0: { fontStyle: "bold" }, // Make the first column (Field) bold
        2: { fontStyle: "bold" }, // Make the third column (Field) bold
      },
      margin: { top: 20 }, // Adjust the margin if needed
    });

    doc.save(`${submittedData.user}_data.pdf`);
  };

  // Utility function to capitalize the first letter of a string
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div>
      <ToastContainer />
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
        Add {formData.type || "Income/Expense"}
      </PopTypography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3} className="textField-root">
          {/* Dropdown Fields */}
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth variant="outlined">
              <TextField
                label="Type"
                name="type"
                required
                InputLabelProps={{ className: "required-asterisk" }}
                value={formData.type}
                onChange={handleChange}
                select
              >
                {typeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth variant="outlined">
              <TextField
                labelId="user-input-label"
                label="User"
                name="user"
                value={formData.user}
                onChange={handleChange}
                onClick={handleClick}
                fullWidth
                variant="outlined"
                inputRef={inputRef}
              />
            </FormControl>
            {filteredUsers.length > 0 && anchorEl && (
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                {filteredUsers.map((user) => (
                  <MenuItem
                    key={user.id}
                    onClick={() => handleSelect(user.userName)}
                  >
                    {user.userName}
                  </MenuItem>
                ))}
              </Menu>
            )}
          </Grid>
          {/* Other Fields */}
          <Grid item xs={12} sm={3}>
            <TextField
              label="Date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              required
              InputLabelProps={{ shrink: true, className: "required-asterisk" }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth variant="outlined">
              <TextField
                label="Category"
                name="category"
                value={formData.category}
                required
                InputLabelProps={{ className: "required-asterisk" }}
                onChange={handleChange}
                select
              >
                {categories.map((option) => (
                  <MenuItem key={option.id} value={option.categoryName}>
                    {option.categoryName}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Particular"
              name="particular"
              value={formData.particular}
              onChange={handleChange}
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Amount"
              name="amount"
              type="number"
              value={formData.amount}
              required
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ className: "required-asterisk" }}
              variant="outlined"
            />
          </Grid>

          {/* GST Checkbox */}
          <Grid item xs={12} sm={3}>
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
            <>
              <Grid item xs={12} sm={3}>
                <TextField
                  type="number"
                  label="GST (%)"
                  name="gst"
                  value={formData.gst}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  type="number"
                  label="GST Number"
                  name="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
            </>
          )}

          <Grid item xs={12} sm={3}>
            <TextField
              label="Total"
              name="total"
              type="number"
              value={formData.total}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth variant="outlined">
              <TextField
                label="Payment Method"
                name="paymentMethod"
                value={formData.paymentMethod}
                required
                InputLabelProps={{ className: "required-asterisk" }}
                onChange={handleChange}
                select
              >
                {paymentMethodOption.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={3}>
            <TextField
              label="Amount Paying"
              name="payingAmount"
              value={formData.payingAmount}
              onChange={handleChange}
              fullWidth
              required
              InputLabelProps={{ className: "required-asterisk" }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Amount Pending"
              name="pendingAmount"
              value={formData.pendingAmount}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              InputProps={{ readOnly: true }}
            />
          </Grid>
          {formData.paymentMethod === "Partial" ||
          formData.paymentMethod === "Pending" ? (
            <>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Due Date"
                  name="duedate"
                  type="date"
                  value={formData.duedate}
                  onChange={handleChange}
                  fullWidth
                  required
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                    className: "required-asterisk",
                  }}
                />
              </Grid>
            </>
          ) : null}

          <Grid item xs={12} sm={3}>
            <FormControl fullWidth variant="outlined">
              <TextField
                label="Bill Type"
                name="billType"
                value={formData.billType}
                required
                onChange={handleChange}
                select
                InputLabelProps={{ className: "required-asterisk" }}
              >
                {billTypeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth variant="outlined">
              <TextField
                label="Paid Using"
                name="paidBy"
                value={formData.paidBy}
                required
                onChange={handleChange}
                select
                InputLabelProps={{ className: "required-asterisk" }}
              >
                {paidByOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
          </Grid>
          {formData.paidBy !== "Cash" && (
            <Grid item xs={12} sm={3}>
              <TextField
                label="Transaction ID"
                name="transactionId"
                value={formData.transactionId}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
          )}

          <Grid item xs={12} sm={12}>
            <FormControl fullWidth variant="outlined">
              <TextField
                label="Remark"
                name="remark"
                value={formData.remark}
                onChange={handleChange}
              />
            </FormControl>
          </Grid>

          <Grid
            container
            justifyContent="center"
            alignItems="center"
            spacing={2}
            marginTop="10px"
          >
            <Grid item xs={12} sm={3}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ height: "56px" }}
              >
                Submit
              </Button>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleCancel}
                fullWidth
                sx={{ height: "56px" }}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </form>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <StyledDialogTitle>
          {submittedData.user} {submittedData.type} Data
          <IconButton aria-label="close" onClick={handleCloseDialog}>
            <CloseIcon />
          </IconButton>
        </StyledDialogTitle>
        <DialogContent dividers>
          <TableContainer component={Paper}>
            <Table>
              <TableHead></TableHead>
              <TableBody>
                {Object.entries(submittedData)
                  .reduce((rows, [key, value], index) => {
                    const rowIndex = Math.floor(index / 2);
                    if (!rows[rowIndex]) {
                      rows[rowIndex] = [];
                    }
                    rows[rowIndex].push({
                      key: capitalizeFirstLetter(key),
                      value,
                    });

                    return rows;
                  }, [])
                  .map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      <StyledTableCell>
                        {row[0] ? `${row[0].key}:` : ""}
                      </StyledTableCell>
                      <TableCell>{row[0] ? row[0].value : ""}</TableCell>
                      <StyledTableCell>
                        {row[1] ? `${row[1].key}:` : ""}
                      </StyledTableCell>
                      <TableCell>{row[1] ? row[1].value : ""}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePrint}>Download PDF</Button>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddIncomeExpense;

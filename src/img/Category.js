import React, { useState, useEffect, useCallback } from "react";
import {
  MenuItem,
  FormControl,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  TablePagination,
  IconButton,
  Box,
  DialogTitle,
  DialogContent,
  Dialog,
  DialogActions,
  Menu,
} from "@mui/material";
import axios from "axios";
import { styled } from "@mui/system";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { ToastContainer, toast } from "react-toastify";
import { Button } from "@mui/material";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

import {
  paymentMethodOption,
  paidByOptions,
  billTypeOptions,
} from "./DropdownData";
import "./Design.css";
import MuiAlert from "@mui/material/Alert";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import UpdateIncomeExpense from "./UpdateIncomeExpense";
import EmailIcon from "@mui/icons-material/Email";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
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
const Category = () => {
  const [category, setCategory] = useState("Income");
  const [dateRange, setDateRange] = useState("All");
  const [amount, setAmount] = useState("");
  const [searchUser, setSearchUser] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [billType, setBillType] = useState("");
  const [paidBy, setPaidUsing] = useState("");
  const [categoryType, setCategoryType] = useState("");
  // const [paymentMethod, setPaymentMethod] = useState("");
  const [customDateStart, setCustomDateStart] = useState("");
  const [customDateEnd, setCustomDateEnd] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [popupOpen, setPopupOpen] = useState(false);
  const [currentData, setCurrentData] = useState(null);
  const [paymentMethod, setSelectedPaymentMethod] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [categoryIdToDelete, setCategoryIdToDelete] = useState(null);
  const [menuPosition, setMenuPosition] = useState(null);
  const getEmail = () => localStorage.getItem("APIemail");

  const exportToCSV = () => {
    const headers = [
      "Type",
      "User",
      "Amount",
      "GST(%)",
      "Total(+GST)",
      "Paid",
      "Pending",
      "Due Date",
      "Bill Type",
      "Category Type",
      "Paid Using",
      "Perticuler",
      "Transaction ID",
      "Status",
    ];
    const csvRows = [headers.join(",")];

    filteredData.forEach((row) => {
      const values = [
        row.type,
        row.user,
        row.amount,
        row.gst,
        row.total,
        row.payingAmount,
        row.pendingAmount,
        row.duedate,
        row.billType,
        row.category,
        row.paidBy,
        row.particular,
        row.transactionId,
        row.paymentMethod,
      ];
      csvRows.push(values.join(","));
    });

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${category}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    // Specify the landscape orientation
    const doc = new jsPDF("landscape");

    const headers = [
      [
        "Type",
        "User",
        "Amount",
        "GST(%)",
        "Total(+GST)",
        "Paid",
        "Pending",
        "Due Date",
        "Bill Type",
        "Category Type",
        "Paid Using",
        "Perticuler",
        "Transaction ID",
        "Status",
      ],
    ];
    const rows = filteredData.map((row) => [
      row.type,
      row.user,
      row.amount,
      row.gst,
      row.total,
      row.payingAmount,
      row.pendingAmount,
      row.duedate,
      row.billType,
      row.category,
      row.paidBy,
      row.particular,
      row.transactionId,
      row.paymentMethod,
    ]);

    doc.autoTable({
      head: headers,
      body: rows,
      startY: 10, // Optional: to give some top margin
      theme: "grid", // Optional: to give a grid theme
      margin: { top: 10 }, // Optional: margin setting
      styles: { fontSize: 10 }, // Optional: font size setting
      columnStyles: {
        // Optional: column styles
        0: { cellWidth: "auto" },
        1: { cellWidth: "auto" },
        2: { cellWidth: "auto" },
        3: { cellWidth: "auto" },
        4: { cellWidth: "auto" },
        5: { cellWidth: "auto" },
        6: { cellWidth: "auto" },
        7: { cellWidth: "auto" },
        8: { cellWidth: "auto" },
        9: { cellWidth: "auto" },
        10: { cellWidth: "auto" },
      },
    });

    doc.save(`${category}.pdf`);
  };

  // const fetchPaidByData = async (paidBy, type) => {
  //   try {
  //     const response = await axios.get(
  //       `http://localhost:8087/${
  //         type === "Income" ? "income" : "expense"
  //       }/byPaidBy?paidBy=${paidBy}&email=${getEmail()}`
  //     );
  //     return response.data;
  //   } catch (error) {
  //     console.error("Error fetching paid by data: ", error);
  //     return [];
  //   }
  // };

  // const fetchCategoryData = async (categoryName, type) => {
  //   try {
  //     const response = await axios.get(
  //       `http://localhost:8087/${
  //         type === "Income" ? "income" : "expense"
  //       }/byCategory?category=${categoryName}&email=${getEmail()}`
  //     );
  //     return response.data;
  //   } catch (error) {
  //     console.error("Error fetching category data: ", error);
  //     return [];
  //   }
  // };

  // const fetchBillTypeData = async (billType, type) => {
  //   try {
  //     const response = await axios.get(
  //       `http://localhost:8087/${
  //         type === "Income" ? "income" : "expense"
  //       }/byBillType?billType=${billType}&email=${getEmail()}`
  //     );
  //     return response.data;
  //   } catch (error) {
  //     console.error("Error fetching bill type data: ", error);
  //     return [];
  //   }
  // };

  // const fetchPaymentMethodData = async (paymentMethod, type) => {
  //   try {
  //     const response = await axios.get(
  //       `http://localhost:8087/dashboard/byPaymentMethod?paymentMethod=${paymentMethod}&email=${getEmail()}&type=${type}`
  //     );
  //     return response.data;
  //   } catch (error) {
  //     console.error("Error fetching payment method data: ", error);
  //     return [];
  //   }
  // };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8087/categories/getAllCategoriesByEmail?email=${getEmail()}`
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories: ", error);
      }
    };

    fetchCategories();
  }, []);

  const fetchIncomeData = async (timeframe, startDate, endDate) => {
    try {
      const response = await axios.get(
        `http://localhost:8087/income/${
          timeframe === "customdaterange"
            ? `customdaterange?email=${getEmail()}&startDate=${startDate}&endDate=${endDate}`
            : `getIncomeBy?email=${getEmail()}&timeframe=${timeframe}`
        }`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching income data: ", error);
      return [];
    }
  };

  const fetchExpenseData = async (timeframe, startDate, endDate) => {
    try {
      const response = await axios.get(
        `http://localhost:8087/expense/${
          timeframe === "customdaterange"
            ? `customdaterange?email=${getEmail()}&startDate=${startDate}&endDate=${endDate}`
            : `getByTimeframe?email=${getEmail()}&timeframe=${timeframe}`
        }`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching expense data: ", error);
      return [];
    }
  };

  const fetchData = async () => {
    let result = [];
    let timeframe = dateRange.toLowerCase();

    // Check if filters are set to "All" and fetch all data
    if (
      billType === "All" &&
      categoryType === "All" &&
      paymentMethod === "All" &&
      paidBy === "All"
    ) {
      const url =
        category === "Income"
          ? `http://localhost:8087/incomes/getAllIncomesByEmail?email=${getEmail()}`
          : `http://localhost:8087/expenses/getAllExpensesByEmail?email=${getEmail()}`;

      try {
        const response = await axios.get(url);
        result = response.data;
      } catch (error) {
        console.error("Error fetching all data: ", error);
      }
    } else {
      switch (dateRange) {
        case "Today":
        case "7days":
        case "30days":
        case "365days":
          result =
            category === "Income"
              ? await fetchIncomeData(timeframe)
              : await fetchExpenseData(timeframe);
          break;
        case "Custom":
          if (customDateStart && customDateEnd) {
            result =
              category === "Income"
                ? await fetchIncomeData(
                    "customdaterange",
                    customDateStart,
                    customDateEnd
                  )
                : await fetchExpenseData(
                    "customdaterange",
                    customDateStart,
                    customDateEnd
                  );
          }
          break;
        default:
          const url =
            category === "Income"
              ? `http://localhost:8087/incomes/getAllIncomesByEmail?email=${getEmail()}`
              : `http://localhost:8087/expenses/getAllExpensesByEmail?email=${getEmail()}`;

          try {
            const response = await axios.get(url);
            result = response.data;
          } catch (error) {
            console.error("Error fetching data: ", error);
          }
          break;
      }
      // Apply additional filters
      if (billType && billType !== "All") {
        result = result.filter((item) => item.billType === billType);
      }

      if (categoryType && categoryType !== "All") {
        result = result.filter((item) => item.category === categoryType);
      }

      if (paymentMethod && paymentMethod !== "All") {
        result = result.filter((item) => item.paymentMethod === paymentMethod);
      }

      if (paidBy && paidBy !== "All") {
        result = result.filter((item) => item.paidBy === paidBy);
      }

      setData(result);
      handleFilter(result);
    }
    setData(result);
  };

  useEffect(() => {
    fetchData();
  }, [
    category,
    dateRange,
    customDateStart,
    customDateEnd,
    billType,
    paymentMethod,
    categoryType,
    paidBy,
  ]);

  useEffect(() => {
    handleFilter();
  }, [amount, searchUser, searchStatus, data]);

  // Handle filter changes
  const handleBillTypeChange = (event) => {
    setBillType(event.target.value);
  };

  const handlePaymentMethodChange = (event) => {
    setSelectedPaymentMethod(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleDateRangeChange = (event) => {
    setDateRange(event.target.value);
  };

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const handleSearchUserChange = (event) => {
    setSearchUser(event.target.value);
  };

  const handleStatusChange = (event) => {
    setSearchStatus(event.target.value);
  };

  const handleCategoryTypeChange = (event) => {
    setCategoryType(event.target.value);
  };

  const handlePaidUsingChange = (event) => {
    setPaidUsing(event.target.value);
  };

  const handleCustomDateStartChange = (event) => {
    setCustomDateStart(event.target.value);
  };

  const handleCustomDateEndChange = (event) => {
    setCustomDateEnd(event.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleFilter = () => {
    const filtered = data.filter((item) => {
      const amountMatch = amount
        ? item.amount.toString().startsWith(amount)
        : true;
      const userMatch = searchUser
        ? item.user.toLowerCase().includes(searchUser.toLowerCase())
        : true;
      const statusMatch = searchStatus
        ? item.paymentMethod.toLowerCase().includes(searchStatus.toLowerCase())
        : true;
      return amountMatch && userMatch && statusMatch;
    });
    setFilteredData(filtered);
  };

  const handleEdit = (row) => {
    setCurrentData(row);
    setPopupOpen(true);
  };
  const handleDeleteClick = (id) => {
    setCategoryIdToDelete(id);
    setConfirmOpen(true);
  };

  const handleDelete = async (id) => {
    const url =
      category === "Income"
        ? `http://localhost:8087/incomes/deleteIncome/${categoryIdToDelete}`
        : `http://localhost:8087/expenses/deleteExpense/${categoryIdToDelete}`;
    try {
      await axios.delete(url);
      fetchData();
      toast.success("Deleted Successfully");
    } catch (error) {
      console.error("Error deleting item: ", error);
    }
  };

  const StyledTableCell = styled(TableCell)(({ paymentMethod }) => ({
    fontSize: "0.9rem",
    color:
      paymentMethod === "Complete"
        ? "green"
        : paymentMethod === "Partial"
        ? "brown"
        : paymentMethod === "Pending"
        ? "red"
        : "inherit",
  }));

  // Existing styled PopTypography component
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
  const handleMenuOpen = (event) => {
    const buttonRect = event.currentTarget.getBoundingClientRect();
    setMenuPosition({
      top: buttonRect.bottom,
      left: buttonRect.left,
    });
  };
  const handleMenuClose = () => {
    setMenuPosition(null);
  };
  const totalAmount = filteredData.reduce((acc, item) => acc + item.total, 0);
  const paidAmount = filteredData.reduce(
    (acc, item) => acc + item.payingAmount,
    0
  );
  const pendingAmount = filteredData.reduce(
    (acc, item) => acc + item.pendingAmount,
    0
  );

  return (
    <div>
      <ToastContainer />
      <Grid container spacing={2} className="textField-root">
        <Grid item xs={12}>
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
            Income/Expense List
          </PopTypography>
        </Grid>
        <Grid item xs={6} md={2}>
          <FormControl fullWidth>
            <TextField
              select
              label="Type"
              value={category}
              onChange={handleCategoryChange}
            >
              <MenuItem value="Income">Income</MenuItem>
              <MenuItem value="Expense">Expense</MenuItem>
            </TextField>
          </FormControl>
        </Grid>
        <Grid item xs={6} md={2}>
          <FormControl fullWidth>
            <TextField
              select
              label="Date Range"
              value={dateRange}
              onChange={handleDateRangeChange}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Today">Today</MenuItem>
              <MenuItem value="7days">Last 7 Days</MenuItem>
              <MenuItem value="30days">Last 30 Days</MenuItem>
              <MenuItem value="365days">Last 365 Days</MenuItem>
              <MenuItem value="Custom">Custom Date Range</MenuItem>
            </TextField>
          </FormControl>
        </Grid>
        {dateRange === "Custom" && (
          <>
            <Grid item xs={6} md={2}>
              <FormControl fullWidth>
                <TextField
                  type="date"
                  label="Start Date"
                  value={customDateStart}
                  onChange={handleCustomDateStartChange}
                  InputLabelProps={{ shrink: true }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6} md={2}>
              <FormControl fullWidth>
                <TextField
                  type="date"
                  label="End Date"
                  value={customDateEnd}
                  onChange={handleCustomDateEndChange}
                  InputLabelProps={{ shrink: true }}
                />
              </FormControl>
            </Grid>
          </>
        )}
        <Grid item xs={6} md={2}>
          <FormControl fullWidth>
            <TextField
              select
              label="Bill Type"
              value={billType}
              onChange={handleBillTypeChange}
            >
              <MenuItem value="All">All</MenuItem>
              {billTypeOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
        </Grid>
        <Grid item xs={6} md={2}>
          <FormControl fullWidth>
            <TextField
              select
              label="Category"
              value={categoryType}
              onChange={handleCategoryTypeChange}
            >
              <MenuItem value="All">All</MenuItem>
              {categories.map((option) => (
                <MenuItem key={option.id} value={option.categoryName}>
                  {option.categoryName}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
        </Grid>
        <Grid item xs={6} md={2}>
          <FormControl fullWidth>
            <TextField
              select
              label="Payment Method"
              value={paymentMethod}
              onChange={handlePaymentMethodChange}
            >
              <MenuItem value="All">All</MenuItem>
              {paymentMethodOption.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
        </Grid>
        <Grid item xs={6} md={2}>
          <FormControl fullWidth>
            <TextField
              select
              label="Paid Using"
              value={paidBy}
              onChange={handlePaidUsingChange}
            >
              <MenuItem value="All">All</MenuItem>
              {paidByOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
        </Grid>
        <Grid item xs={6} md={2}>
          <FormControl fullWidth>
            <TextField
              label="Search By Amount"
              value={amount}
              onChange={handleAmountChange}
            />
          </FormControl>
        </Grid>
        <Grid item xs={6} md={2}>
          <FormControl fullWidth>
            <TextField
              label="Search By User Name"
              value={searchUser}
              onChange={handleSearchUserChange}
            />
          </FormControl>
        </Grid>
        <Grid item xs={6} md={2}>
          <FormControl fullWidth>
            <TextField
              label="Search By Status"
              value={searchStatus}
              onChange={handleStatusChange}
            />
          </FormControl>
        </Grid>
        <Grid item xs={6} md={2}>
          <Button variant="contained" color="primary" onClick={exportToPDF}>
            Download PDF
          </Button>
        </Grid>
        <Grid item xs={6} md={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={exportToCSV}
            // style={{ marginLeft: "-20px" }}
          >
            Download CSV
          </Button>
        </Grid>

        <Box display="flex" marginTop="20px">
          <Typography
            variant="h6"
            gutterBottom
            sx={{ marginRight: 25, whiteSpace: "nowrap", marginLeft: 10 }}
          >
            Total Amount(+GST): ₹ {totalAmount}
          </Typography>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ marginRight: 25, whiteSpace: "nowrap" }}
          >
            Paid Amount: ₹ {paidAmount}
          </Typography>
          <Typography variant="h6" gutterBottom>
            Pending Amount: ₹ {pendingAmount}
          </Typography>
        </Box>
      </Grid>
      <TablePagination
        rowsPerPageOptions={[50, 100, 150]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <AlertDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
      />
      <Table>
        <TableHead
          style={{
            backgroundColor: "#f2f2f2",
          }}
        >
          <TableRow>
            <StyledTableCell style={{ fontWeight: "bold" }}>
              Type
            </StyledTableCell>
            <StyledTableCell style={{ fontWeight: "bold" }}>
              User
            </StyledTableCell>

            <StyledTableCell style={{ fontWeight: "bold" }}>
              Amount
            </StyledTableCell>
            <StyledTableCell
              style={{ fontWeight: "bold", whiteSpace: "nowrap" }}
            >
              GST Amount
            </StyledTableCell>
            <StyledTableCell style={{ fontWeight: "bold" }}>
              Total(+GST)
            </StyledTableCell>
            <StyledTableCell style={{ fontWeight: "bold" }}>
              Paid
            </StyledTableCell>
            <StyledTableCell style={{ fontWeight: "bold" }}>
              Pending
            </StyledTableCell>
            <StyledTableCell
              style={{ fontWeight: "bold", whiteSpace: "nowrap" }}
            >
              Due Date
            </StyledTableCell>
            <StyledTableCell style={{ fontWeight: "bold" }}>
              Bill Type
            </StyledTableCell>
            <StyledTableCell
              style={{ fontWeight: "bold", whiteSpace: "nowrap" }}
            >
              Category Type
            </StyledTableCell>
            <StyledTableCell
              style={{ fontWeight: "bold", whiteSpace: "nowrap" }}
            >
              Paid Using
            </StyledTableCell>
            <StyledTableCell style={{ fontWeight: "bold" }}>
              Perticuler
            </StyledTableCell>
            <StyledTableCell style={{ fontWeight: "bold" }}>
              Status
            </StyledTableCell>

            <StyledTableCell style={{ fontWeight: "bold" }}>
              Actions
            </StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredData
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row) => (
              <TableRow key={row.id}>
                <StyledTableCell>{row.type}</StyledTableCell>

                <StyledTableCell style={{ whiteSpace: "nowrap" }}>
                  {row.user}
                </StyledTableCell>
                <StyledTableCell>{row.amount}</StyledTableCell>
                <StyledTableCell>{row.total - row.amount}</StyledTableCell>
                <StyledTableCell>{row.total}</StyledTableCell>
                <StyledTableCell>{row.payingAmount}</StyledTableCell>
                <StyledTableCell>{row.pendingAmount}</StyledTableCell>
                <StyledTableCell style={{ whiteSpace: "nowrap" }}>
                  {row.duedate}
                </StyledTableCell>

                <StyledTableCell>{row.billType}</StyledTableCell>
                <StyledTableCell>{row.category}</StyledTableCell>
                <StyledTableCell>{row.paidBy}</StyledTableCell>
                <StyledTableCell>{row.particular}</StyledTableCell>
                <StyledTableCell
                  paymentMethod={row.paymentMethod}
                  style={{ fontWeight: "bold" }}
                >
                  {row.paymentMethod}
                </StyledTableCell>
                <StyledTableCell style={{ whiteSpace: "nowrap" }}>
                  <IconButton onClick={() => handleEdit(row)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteClick(row.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                  <IconButton
                    aria-label="more"
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    onClick={handleMenuOpen}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    anchorReference="anchorPosition"
                    anchorPosition={
                      menuPosition
                        ? { top: menuPosition.top, left: menuPosition.left }
                        : undefined
                    }
                    open={Boolean(menuPosition)}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={handleMenuClose}>
                      <EmailIcon color="warning" />
                    </MenuItem>
                    <MenuItem onClick={handleMenuClose}>
                      <WhatsAppIcon color="success" />
                    </MenuItem>
                  </Menu>
                </StyledTableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      {popupOpen && (
        <UpdateIncomeExpense
          open={popupOpen}
          handleClose={() => setPopupOpen(false)}
          data={currentData}
        />
      )}
    </div>
  );
};

export default Category;

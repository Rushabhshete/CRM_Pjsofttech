import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import numberToWords from "number-to-words";
import axios from "axios";
import { styled } from "@mui/system";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { ToastContainer, toast } from "react-toastify";
import { Button } from "@mui/material";
import "jspdf-autotable";
import jsPDF from "jspdf";
import "jspdf-autotable"; // Import autoTable plugin
import {
  paymentMethodOption,
  paidByOptions,
  billTypeOptions,
} from "./DropdownData";
import "./Design.css";
import UpdateIncomeExpense from "./UpdateIncomeExpense";
import EmailIcon from "@mui/icons-material/Email";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import PrintIcon from "@mui/icons-material/Print";
const AlertDialog = ({ open, onClose, onConfirm }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle color="blue" textAlign={"center"}>
      Confirm Deletion
    </DialogTitle>
    <DialogContent>
      <Typography>Are you sure you want to delete this entry?</Typography>
      <Typography color="red" fontWeight={200} variant="body2">
        *On clicking Confirm, this entry cannot be recovered
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
        color="error"
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
  const handleUpdatedData = (updatedData) => {
    setData(updatedData);
  };
  const getInstituteCode = () => localStorage.getItem("institutecode");

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
    const pageWidth = doc.internal.pageSize.getWidth();

    // Heading
    doc.setFontSize(16);
    const heading = "Pjsofttech Pvt. Ltd.";
    const headingWidth = doc.getTextWidth(heading);
    doc.text(heading, (pageWidth - headingWidth) / 2, 5);

    // Date on the top right
    const date = new Date().toLocaleDateString();
    doc.setFontSize(10);
    const dateText = `Date Generated on: ${date}`;
    const dateTextWidth = doc.getTextWidth(dateText);
    doc.text(dateText, pageWidth - dateTextWidth - 10, 5); // Adjust the `- 10` for right margin

    // Subheading
    doc.setFontSize(12);
    const subheading = `${category} Report`;
    const subheadingWidth = doc.getTextWidth(subheading);
    doc.text(subheading, (pageWidth - subheadingWidth) / 2, 20);

    // Define table headers and rows
    const headers = [
      [
        //  "Type",
        "User",
        "Date",
        "Amount",
        "GST(%)",
        "Total(+GST)",
        "Paid",
        "Pending",
        "Due Date",
        "Bill Type",
        "Category Type",
        "Paid Using",
        "Particular",
        "Transaction ID",
        "Status",
      ],
    ];

    const rows = filteredData.map((row) => [
      //row.type,
      row.user,
      row.date,
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

    // Add the table to the PDF
    doc.autoTable({
      head: headers,
      body: rows,
      startY: 30, // Top margin
      theme: "grid", // Grid theme
      margin: { top: 10 }, // Margin setting
      styles: { fontSize: 8 }, // Font size setting
      columnStyles: {
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
      didParseCell: function (data) {
        // Check if the current column is the "Status" column
        if (data.column.index === 13) {
          const status = data.cell.raw.toLowerCase();
          if (status === "pending" || status === "partial") {
            data.cell.styles.fillColor = [255, 223, 186]; // Light orange color for "Pending" or "Partial"
          } else if (status === "complete") {
            data.cell.styles.fillColor = [144, 238, 144]; // Light green color for all other statuses
          }
        }
      },
    });

    // Calculate total values
    const totalAmount = filteredData.reduce((sum, row) => sum + row.amount, 0);
    const total = filteredData.reduce((sum, row) => sum + row.total, 0);
    const totalPaid = filteredData.reduce(
      (sum, row) => sum + row.payingAmount,
      0
    );
    const totalPending = filteredData.reduce(
      (sum, row) => sum + row.pendingAmount,
      0
    );

    // Convert total value to words
    const totalInWords = toTitleCase(numberToWords.toWords(total));

    // Additional fields and values
    const additionalFields = [
      { label: "Total Amount", value: `${totalAmount.toFixed(2)}` },
      { label: "Total (+GST)", value: `${total.toFixed(2)}` },
      { label: "Total (+GST) in Words", value: `${totalInWords} Rupees Only` },
      { label: "Total Paid", value: `${totalPaid.toFixed(2)}` },
      { label: "Total Pending", value: `${totalPending.toFixed(2)}` },
    ];

    // Prepare the summary table data
    const summaryHeaders = [["Summary", ""]];
    const summaryRows = additionalFields.map((field) => [
      field.label,
      field.value,
    ]);

    // Add the summary table to the PDF
    doc.autoTable({
      head: summaryHeaders,
      body: summaryRows,
      startY: doc.lastAutoTable.finalY + 10, // Position below the previous table
      theme: "grid",
      margin: { top: 10 },
      styles: { fontSize: 10 },
    });
    const signatureY = doc.lastAutoTable.finalY + 40; // Position below the summary table
    const signatureX = pageWidth - 60; // Position on the right side

    doc.setFontSize(12);
    doc.text("Authorized Signature", signatureX, signatureY);
    doc.setLineWidth(0.5);
    doc.line(signatureX, signatureY + 2, signatureX + 50, signatureY + 2); // Draw a line for the signature
    doc.save(`Complete_${category}_List.pdf`);
  };

  // Function to convert string to title case
  const toTitleCase = (str) => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
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

  const fetchIncomeData = async (timeframe, startDate, endDate) => {
    try {
      const response = await axios.get(
        `http://localhost:8087/income/${
          timeframe === "customdaterange"
            ? `customdaterange?institutecode=${getInstituteCode()}&startDate=${startDate}&endDate=${endDate}`
            : `getIncomeBy?institutecode=${getInstituteCode()}&timeframe=${timeframe}`
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
            ? `customdaterange?institutecode=${getInstituteCode()}&startDate=${startDate}&endDate=${endDate}`
            : `getByTimeframe?institutecode=${getInstituteCode()}&timeframe=${timeframe}`
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
          ? `http://localhost:8087/incomes/getAllIncomesByinstitutecode?institutecode=${getInstituteCode()}`
          : `http://localhost:8087/expenses/getAllExpensesByinstitutecode?institutecode=${getInstituteCode()}`;

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
              ? `http://localhost:8087/incomes/getAllIncomesByinstitutecode?institutecode=${getInstituteCode()}`
              : `http://localhost:8087/expenses/getAllExpensesByinstitutecode?institutecode=${getInstituteCode()}`;

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
    fontSize: "0.8rem",
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

  const totalAmount = filteredData.reduce((acc, item) => acc + item.total, 0);
  const paidAmount = filteredData.reduce(
    (acc, item) => acc + item.payingAmount,
    0
  );
  const pendingAmount = filteredData.reduce(
    (acc, item) => acc + item.pendingAmount,
    0
  );
  const totalGST = filteredData.reduce(
    (sum, row) => sum + (row.total - row.amount || 0), // Calculate GST per entry
    0
  );
  const formatValue = (value) => Math.abs(value).toLocaleString();
  const handlePrint = (row) => {
    const doc = new jsPDF("portrait", "mm", "a4");

    // Page width
    const pageWidth = doc.internal.pageSize.getWidth();

    // Function to convert string to title case
    const toTitleCase = (str) => {
      return str
        .split(" ")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ");
    };

    // Heading and Subheading
    doc.setFontSize(16);
    const heading = "Pjsofttech Pvt. Ltd.";
    const headingWidth = doc.getTextWidth(heading);
    doc.text(heading, (pageWidth - headingWidth) / 2, 10);

    // Date on the top right
    const date = new Date().toLocaleDateString();
    doc.setFontSize(10);
    const dateText = `Date Generated on: ${date}`;
    const dateTextWidth = doc.getTextWidth(dateText);
    doc.text(dateText, pageWidth - dateTextWidth - 10, 5); // Adjust the `- 10` for right margin

    doc.setFontSize(12);
    const subheading = `${row.user} ${row.type} Receipt`;
    const subheadingWidth = doc.getTextWidth(subheading);
    doc.text(subheading, (pageWidth - subheadingWidth) / 2, 20);

    // Convert total value to words
    const totalInWords = toTitleCase(numberToWords.toWords(row.total));

    // Define table columns and data
    const columns = [
      { header: " ", dataKey: "field" },
      { header: " ", dataKey: "value" },
    ];

    const data = [
      { field: "Type", value: row.type },
      { field: "User", value: row.user },
      { field: "Bill Type", value: row.billType },
      { field: "Category Type", value: row.category },
      { field: "Amount", value: row.amount },
      { field: "GST(%)", value: `${row.gst}%` },
      { field: "Total(+GST)", value: row.total },
      { field: "Total Amount in Words", value: `${totalInWords} Rupees Only` },
      { field: "Paid", value: row.payingAmount },
      { field: "Pending", value: row.pendingAmount },
      { field: "Paid Using", value: row.paidBy },
      { field: "Transaction ID", value: row.transactionId || "-" },
      { field: "Due Date", value: row.duedate || "N/A" },
      { field: "Particular", value: row.particular || "-" },
    ];

    // Add the table to the PDF
    doc.autoTable({
      columns: columns,
      body: data,
      startY: 30, // Start position for the table
      theme: "grid", // Add grid lines
      margin: { top: 20 }, // Margin from the top
      styles: {
        cellPadding: 5,
        fontSize: 10,
      },
    });
    const signatureY = doc.lastAutoTable.finalY + 40; // Position below the summary table
    const signatureX = pageWidth - 60; // Position on the right side

    doc.setFontSize(12);
    doc.text("Authorized Signature", signatureX, signatureY);
    doc.setLineWidth(0.5);
    doc.line(signatureX, signatureY + 2, signatureX + 50, signatureY + 2); // Draw a line for the signature
    // Save the PDF
    doc.save(`${row.user} ${row.type} Receipt.pdf`);
  };

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
            {category} List
          </PopTypography>
        </Grid>
        <Grid item xs={6} md={1.8}>
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
        <Grid item xs={6} md={1.8}>
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
            <Grid item xs={6} md={1.8}>
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
            <Grid item xs={6} md={1.8}>
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
        <Grid item xs={6} md={1.8}>
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
        <Grid item xs={6} md={1.8}>
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
        <Grid item xs={6} md={1.8}>
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
        <Grid item xs={6} md={1.8}>
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
        <Grid item xs={6} md={1.8}>
          <FormControl fullWidth>
            <TextField
              label="Search By User Name"
              value={searchUser}
              onChange={handleSearchUserChange}
            />
          </FormControl>
        </Grid>
        <Grid item xs={6} md={1.8}>
          <FormControl fullWidth>
            <TextField
              label="Search By Amount"
              value={amount}
              onChange={handleAmountChange}
            />
          </FormControl>
        </Grid>

        <Grid item xs={6} md={1.8}>
          <FormControl fullWidth>
            <TextField
              label="Search By Status"
              value={searchStatus}
              onChange={handleStatusChange}
            />
          </FormControl>
        </Grid>
        <Grid item xs={6} md={1.8}>
          <Button variant="contained" color="primary" onClick={exportToPDF}>
            Download PDF
          </Button>
        </Grid>
        <Grid item xs={6} md={1.8}>
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
            sx={{ marginRight: 10, whiteSpace: "nowrap", marginLeft: 5 }}
          >
            Total Amount(+GST) : ₹ {formatValue(totalAmount)}
          </Typography>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ marginRight: 10, whiteSpace: "nowrap", marginLeft: 5 }}
          >
            Total GST Amount(+GST) : ₹ {formatValue(totalGST)}
          </Typography>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ marginRight: 10, whiteSpace: "nowrap" }}
          >
            Paid Amount : ₹ {formatValue(paidAmount)}
          </Typography>
          <Typography variant="h6" gutterBottom sx={{ whiteSpace: "nowrap" }}>
            Pending Amount : ₹ {formatValue(pendingAmount)}
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
            justifyContent: "center",
          }}
        >
          <TableRow>
            {/* <StyledTableCell style={{ fontWeight: "bold" }}>
              Type
            </StyledTableCell> */}
            <StyledTableCell style={{ fontWeight: "bold" }}>
              User
            </StyledTableCell>
            <StyledTableCell style={{ fontWeight: "bold" }}>
              Date
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
            <StyledTableCell
              style={{ fontWeight: "bold", whiteSpace: "nowrap" }}
            >
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
                {/* <StyledTableCell>{row.type}</StyledTableCell> */}

                <StyledTableCell style={{ whiteSpace: "nowrap" }}>
                  {row.user}
                </StyledTableCell>
                <StyledTableCell style={{ whiteSpace: "nowrap" }}>
                  {" "}
                  {row.date}
                </StyledTableCell>

                <StyledTableCell> ₹{row.amount}</StyledTableCell>
                <StyledTableCell>₹{row.total - row.amount}</StyledTableCell>
                <StyledTableCell>₹{row.total}</StyledTableCell>
                <StyledTableCell>₹{row.payingAmount}</StyledTableCell>
                <StyledTableCell>₹{row.pendingAmount}</StyledTableCell>
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

                  <IconButton>
                    <EmailIcon color="warning" />
                  </IconButton>

                  <IconButton>
                    <WhatsAppIcon color="success" />
                  </IconButton>
                  <IconButton onClick={() => handlePrint(row)} color="inherit">
                    <PrintIcon />
                  </IconButton>
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
          handleUpdatedData={handleUpdatedData}
        />
      )}
    </div>
  );
};

export default Category;

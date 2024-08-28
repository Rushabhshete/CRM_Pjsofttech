import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import {
  Button,
  Table,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Grid,
  Box,
  Typography,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import SmsIcon from "@mui/icons-material/Sms";
import { styled } from "@mui/system";
import EditIcon from "@mui/icons-material/Edit";

import { Container } from "react-bootstrap";

export default function Report() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [inquiries, setInquiries] = useState([]);
  const [examOptions, setExamOptions] = useState([]);
  const [selectedExam, setSelectedExam] = useState("");
  const [sourceOptions, setSourceOptions] = useState([]);
  const [selectedSource, setSelectedSource] = useState("");
  const [conductedBy, setConductedBy] = useState([]);
  const [selectConduct, setSelectedConduct] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const [smsDialogOpen, setSmsDialogOpen] = useState(false);
  const [smsData, setSmsData] = useState({ mobile: "", content: "" });
  // const [adminemail, setAdminemail]=useState(localStorage.getItem('loggedInUserEmail') || '');
  // const [institutecode, setInstituteCode] = useState(
  //   localStorage.getItem("institutecode") || ""
  // );
  const getInstituteCode = () => localStorage.getItem("institutecode");
  useEffect(() => {
    loadUsers();
    loadExams();
    loadSources();
    loadConducts();
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  useEffect(() => {
    if (startDate && endDate) {
      loadUsers(startDate, endDate);
    }
  }, [startDate, endDate]);

  const loadUsers = async (start = "", end = "") => {
    let url = `http://localhost:8086/get/getALLEnquiryByInstitutecode?institutecode=${getInstituteCode()}`;
    if (start && end) {
      url = `http://localhost:8086/enquiryBetweenDates?startDate=${start}&endDate=${end}&institutecode=${getInstituteCode()}`;
    }
    const result = await axios.get(url);
    setInquiries(result.data);
  };

  const loadExams = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8086/getAllExam?institutecode=${getInstituteCode()}`
      );
      setExamOptions(response.data);
    } catch (error) {
      console.error("Error fetching exam options:", error);
    }
  };

  const loadSources = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8086/getAllSource?institutecode=${getInstituteCode()}`
      );
      setSourceOptions(response.data);
    } catch (error) {
      console.error("Error fetching sources:", error);
    }
  };

  const loadConducts = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8086/get/getAllConductModels?institutecode=${getInstituteCode()}`
      );
      setConductedBy(response.data);
    } catch (error) {
      console.error("Error fetching conducts:", error);
    }
  };

  const handleExamChange = async (event) => {
    const selectedValue = event.target.value;
    setSelectedExam(selectedValue);
    if (selectedValue === "") {
      await loadUsers(startDate, endDate);
    } else {
      try {
        const response = await axios.get(
          `http://localhost:8086/findByExam/${selectedValue}?institutecode=${getInstituteCode()}`
        );
        setInquiries(response.data);
      } catch (error) {
        console.error("Error fetching inquiries by exam:", error);
      }
    }
  };

  const handleConductChange = async (e) => {
    const selectedConductValue = e.target.value;
    setSelectedConduct(selectedConductValue);
    if (selectedConductValue === "") {
      await loadUsers(startDate, endDate);
    } else {
      try {
        const response = await axios.get(
          `http://localhost:8086/findConductBy/${selectedConductValue}?institutecode=${getInstituteCode()}`
        );
        setInquiries(response.data);
      } catch (error) {
        console.error("Error fetching inquiries by conduct:", error);
      }
    }
  };

  const handleSourceChange = async (e) => {
    const selectedSourceValue = e.target.value;
    setSelectedSource(selectedSourceValue);
    if (selectedSourceValue === "") {
      await loadUsers(startDate, endDate);
    } else {
      try {
        const response = await axios.get(
          `http://localhost:8086/findBySourceByByInstitutecode/${selectedSourceValue}?institutecode=${getInstituteCode()}`
        );
        setInquiries(response.data);
      } catch (error) {
        console.error("Error fetching inquiries by source:", error);
      }
    }
  };

  const handleStatusChange = async (e) => {
    const selectedStatusValue = e.target.value;
    setSelectedStatus(selectedStatusValue);
    if (selectedStatusValue === "") {
      await loadUsers(startDate, endDate);
    } else {
      await loadStatus(selectedStatusValue);
    }
  };

  const loadStatus = async (status) => {
    try {
      const result = await axios.get(
        `http://localhost:8086/get/getALLEnquiryByInstitutecode?institutecode=${getInstituteCode()}`
      );
      if (status) {
        const filteredData = result.data.filter(
          (Enquiry) => Enquiry.status1 === status
        );
        setInquiries(filteredData);
      } else {
        setInquiries(result.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF("landscape"); // Set orientation to landscape
    doc.text("Inquiries Report", 10, 10);

    const tableColumn = [
      "ID",
      "Date of Enquiry",
      "Name",
      "Phone",
      "Email",
      "Exam",
      "Source",
      "Conducted By",
      "Status",
      "Remark",
    ];
    const tableRows = [];

    inquiries.forEach((Enquiry) => {
      const EnquiryData = [
        Enquiry.id,
        Enquiry.enquiryDate,
        Enquiry.name,
        Enquiry.mobile,
        Enquiry.email,
        Enquiry.exam,
        Enquiry.source_by,
        Enquiry.conduct_by,
        Enquiry.status1 === "Call"
          ? `${Enquiry.status1} - ${Enquiry.callBackDate} ${Enquiry.callBackTime}`
          : Enquiry.status1,
        Enquiry.remark,
      ];
      tableRows.push(EnquiryData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      theme: "striped",
      headStyles: { fillColor: [22, 160, 133] },
      styles: { fontSize: 8 },
    });

    doc.save("report.pdf");
  };

  const handleDownloadCSV = () => {
    const csvContent = inquiries
      .map((Enquiry) => {
        return `${Enquiry.id},${Enquiry.enquiryDate},${Enquiry.name},${Enquiry.mobile},${Enquiry.email},${Enquiry.exam},${Enquiry.source_by},${Enquiry.conduct_by},${Enquiry.status1},${Enquiry.remark}`;
      })
      .join("\n");

    const csvBlob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(csvBlob, "report.csv");
  };

  const handleMonthChange = async (e) => {
    const month = e.target.value;
    setSelectedMonth(month);

    if (month) {
      try {
        const response = await axios.get(
          `http://localhost:8086/getInquiriesByMonth/${month}?institutecode=${getInstituteCode()}`
        );
        setInquiries(response.data);
      } catch (error) {
        console.error("Error fetching inquiries by month:", error);
      }
    } else if (selectedYear) {
      // If no month is selected but a year is
      await loadUsers(startDate, selectedYear);
    } else {
      await loadUsers(startDate, endDate);
    }
  };

  const handleYearChange = async (e) => {
    const year = e.target.value;
    setSelectedYear(year);

    if (year) {
      try {
        const response = await axios.get(
          `http://localhost:8086/getInquiriesByYearByInstitutecode/${year}?institutecode=${getInstituteCode()}`
        );
        setInquiries(response.data);
      } catch (error) {
        console.error("Error fetching inquiries by year:", error);
      }
    } else if (selectedMonth) {
      // If no year is selected but a month is
      await loadUsers(selectedMonth, endDate);
    } else {
      await loadUsers(startDate, endDate);
    }
  };

  const handleInfoClick = (Enquiry) => {
    const popupWindow = window.open("", "_blank", "width=600,height=400");

    if (popupWindow) {
      let htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Enquiry Details</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                margin: 20px;
              }
              h2 {
                color: black;
              }
              .info-item {
                margin-bottom: 10px;
              }
            </style>
          </head>
          <body>
            <h2>Enquiry Details of Id : ${Enquiry.id}</h2>
            <div class="info-item"><strong>Name:</strong> ${Enquiry.name}</div>
            <div class="info-item"><strong>Phone:</strong> ${Enquiry.mobile}</div>
            <div class="info-item"><strong>Email:</strong> ${Enquiry.email}</div>
            <div class="info-item"><strong>Exam:</strong> ${Enquiry.exam}</div>
            <div class="info-item"><strong>Source:</strong> ${Enquiry.source_by}</div>
            <div class="info-item"><strong>Conducted By:</strong> ${Enquiry.conduct_by}</div>
            <div class="info-item"><strong>Status:</strong> ${Enquiry.status1}</div>
            <div class="info-item"><strong>Remark:</strong> ${Enquiry.remark}</div>
          </body>
        </html>
      `;
      popupWindow.document.write(htmlContent);
      popupWindow.document.close();
    }
  };

  const handleOpenSmsDialog = (Enquiry) => {
    setSmsData({ mobile: Enquiry.mobile, content: "" });
    setSmsDialogOpen(true);
  };

  const handleCloseSmsDialog = () => {
    setSmsDialogOpen(false);
  };

  const handleSendSms = async () => {
    try {
      // Assuming the endpoint for sending SMS is as follows:
      await axios.post("http://localhost:8086/sendSms", {
        mobile: smsData.mobile,
        content: smsData.content,
      });
      alert("SMS sent successfully");
      handleCloseSmsDialog();
    } catch (error) {
      console.error("Error sending SMS:", error);
      alert("SMS Sent");
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
    <div sx={{ padding: 2, width: "100%" }}>
      <Box textAlign="center" sx={{ width: "100%" }}>
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
          Enquiry Report
        </PopTypography>

        <div >
          <Grid container spacing={2} className="textField-root" mt={2}>
            <Grid item xs={12} md={3}>
              <TextField
                select
                value={selectedExam}
                onChange={handleExamChange}
                label="Select Exam"
                fullWidth
                size="small"
                variant="outlined"
              >
                <MenuItem value="">
                  <em>
                    <strong>All</strong>
                  </em>
                </MenuItem>
                {examOptions.map((exam) => (
                  <MenuItem key={exam.name} value={exam.name}>
                    {exam.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                select
                label="Select Conducts"
                value={selectConduct}
                onChange={handleConductChange}
                fullWidth
                size="small"
                variant="outlined"
              >
                <MenuItem value="">
                  <em>
                    <strong>All</strong>
                  </em>
                </MenuItem>
                {conductedBy.map((conduct) => (
                  <MenuItem key={conduct.name} value={conduct.name}>
                    {conduct.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                select
                value={selectedSource}
                onChange={handleSourceChange}
                label="Select Source"
                fullWidth
                size="small"
                variant="outlined"
              >
                <MenuItem value="">
                  <em>
                    <strong>All</strong>
                  </em>
                </MenuItem>
                {sourceOptions.map((source) => (
                  <MenuItem key={source.name} value={source.name}>
                    {source.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                select
                label="Select Status"
                value={selectedStatus}
                onChange={handleStatusChange}
                fullWidth
                size="small"
                variant="outlined"
              >
                <MenuItem value="">
                  <strong>All</strong>
                </MenuItem>
                <MenuItem value="Call">Call Back</MenuItem>
                <MenuItem value="Interested">Interested</MenuItem>
                <MenuItem value="Not Interested">Not Interested</MenuItem>
                <MenuItem value="DND">DND</MenuItem>
                <MenuItem value="Ringing">Ringing</MenuItem>
                <MenuItem value="Switch Off">Switch Off</MenuItem>
                <MenuItem value="Waiting">Waiting</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                select
                label="Select Month"
                value={selectedMonth}
                onChange={handleMonthChange}
                fullWidth
                size="small"
                variant="outlined"
              >
                <MenuItem value="">
                  <em>
                    <strong>All</strong>
                  </em>
                </MenuItem>
                {[...Array(12)].map((_, index) => (
                  <MenuItem
                    key={index + 1}
                    value={String(index + 1).padStart(2, "0")}
                  >
                    {new Date(0, index).toLocaleString("default", {
                      month: "long",
                    })}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                select
                label="Select Year"
                value={selectedYear}
                onChange={handleYearChange}
                fullWidth
                size="small"
                variant="outlined"
              >
                <MenuItem value="">
                  <em>
                    <strong>All</strong>
                  </em>
                </MenuItem>
                {[
                  2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030,
                ].map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                label="Start Date"
                type="date"
                fullWidth
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                size="small"
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                label="End Date"
                type="date"
                fullWidth
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                size="small"
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
        </div>

        <Box mt={4} maxWidth={"false"}>
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: "#f2f2f2", align: "center" }}>
                <TableRow sx={{ align: "center" }}>
                  <TableCell sx={{ width: "50px", align: "center" }}>
                    <strong>ID</strong>
                  </TableCell>
                  <TableCell sx={{ width: "100px", align: "center" }}>
                    <strong>Date</strong>
                  </TableCell>
                  <TableCell sx={{ width: "150px", align: "center" }}>
                    <strong>Name</strong>
                  </TableCell>
                  <TableCell sx={{ width: "100px", align: "center" }}>
                    <strong>Phone</strong>
                  </TableCell>
                  <TableCell sx={{ width: "150px", align: "center" }}>
                    <strong>Email</strong>
                  </TableCell>
                  <TableCell sx={{ width: "100px", align: "center" }}>
                    <strong>Exam</strong>
                  </TableCell>
                  <TableCell sx={{ width: "100px", align: "center" }}>
                    <strong>Source</strong>
                  </TableCell>
                  <TableCell sx={{ width: "150px", align: "center" ,whiteSpace:"nowrap"}}>
                    <strong>Conduct By</strong>
                  </TableCell>
                  <TableCell sx={{ width: "100px", align: "center" }}>
                    <strong>Status</strong>
                  </TableCell>
                  <TableCell sx={{ width: "150px", align: "center" ,whiteSpace:"nowrap"}}>
                    <strong>Date & Time</strong>
                  </TableCell>
                  <TableCell sx={{ width: "200px", align: "center" }}>
                    <strong>Remark</strong>
                  </TableCell>
                  <TableCell sx={{ width: "100px", align: "center" }}>
                    <strong>Actions</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody sx={{ align: "center" }} size="small">
                {inquiries.map((Enquiry) => (
                  <TableRow
                    sx={{ align: "center" }}
                    width={"fit-Content"}
                    size="small"
                    key={Enquiry.id}
                  >
                    <TableCell sx={{ align: "center" }}>{Enquiry.id}</TableCell>
                    <TableCell sx={{ align: "center" }}>
                      {Enquiry.enquiryDate}
                    </TableCell>
                    <TableCell sx={{ align: "center" }}>
                      {Enquiry.name}
                    </TableCell>
                    <TableCell sx={{ align: "center" }}>
                      {Enquiry.mobile}
                    </TableCell>
                    <TableCell sx={{ align: "center" }}>
                      {Enquiry.email}
                    </TableCell>
                    <TableCell sx={{ align: "center" }}>
                      {Enquiry.exam}
                    </TableCell>
                    <TableCell sx={{ align: "center" }}>
                      {Enquiry.source_by}
                    </TableCell>
                    <TableCell sx={{ align: "center" }}>
                      {Enquiry.conduct_by}
                    </TableCell>
                    <TableCell
                      sx={{ align: "center" }}
                      style={{
                        color:
                          Enquiry.status1 === "Call"
                            ? "orange"
                            : Enquiry.status1 === "Interested"
                            ? "purple"
                            : Enquiry.status1 === "Not Interested"
                            ? "red"
                            : Enquiry.status1 === "DND"
                            ? "blue"
                            : Enquiry.status1 === "Ringing"
                            ? "brown"
                            : Enquiry.status1 === "Switch Off"
                            ? "green"
                            : Enquiry.status1 === "Waiting"
                            ? "magenta"
                            : "magenta",
                      }}
                    >
                      <b>
                        <strong>{Enquiry.status1}</strong>
                      </b>
                    </TableCell>
                    <TableCell
                      sx={{ align: "center" }}
                      style={{ alignItems: "center", flexDirection: "row" }}
                    >
                      <b>
                        {Enquiry.status1 === "Call"
                          ? `${Enquiry.callBackDate} ${Enquiry.callBackTime}`
                          : "-----"}
                      </b>
                    </TableCell>
                    <TableCell sx={{ align: "center" }}>
                      {Enquiry.remark}
                    </TableCell>
                    <TableCell sx={{ align: "center" }}>
                      <Box display="flex" alignItems="center">
                        {/* <IconButton
    size="small"
      onClick={() => handleInfoClick(Enquiry)}
      color="danger"
    >
      <InfoIcon />
    </IconButton> */}
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => {
                            window.open(
                              `https://wa.me/91${Enquiry.mobile}`,
                              "_blank"
                            );
                          }}
                        >
                          <WhatsAppIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="warning"
                          onClick={() => handleOpenSmsDialog(Enquiry)}
                        >
                          <SmsIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          variant="contained"
                          color="primary"
                          component={Link}
                          to={`/layout/manage/${Enquiry.id}`}
                        >
                          <EditIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Grid container spacing={2} justifyContent="flex-end" mt={2}>
          <Box
            mt={2}
            textAlign="right"
            border={"1px solid lightgray"}
            padding={"1%"}
          >
            <Typography variant="h7" component="div">
              <strong>Total Enquiries: {inquiries.length}</strong>
            </Typography>
          </Box>

          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={handleDownloadPDF}
            >
              Download PDF
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={handleDownloadCSV}
            >
              Download CSV
            </Button>
          </Grid>
        </Grid>

        <Dialog open={smsDialogOpen} onClose={handleCloseSmsDialog}>
          <DialogTitle>Send SMS</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="content"
              label="SMS Content"
              type="text"
              fullWidth
              variant="standard"
              value={smsData.content}
              onChange={(e) =>
                setSmsData({ ...smsData, content: e.target.value })
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseSmsDialog}>Cancel</Button>
            <Button onClick={handleSendSms}>Send</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </div>
  );
}

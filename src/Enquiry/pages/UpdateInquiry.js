import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  DialogTitle,
  Snackbar,
} from "@mui/material";
import { styled } from "@mui/system";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import DownloadIcon from "@mui/icons-material/Download";
import CancelIcon from "@mui/icons-material/Cancel";
import jsPDF from "jspdf";
import "jspdf-autotable";

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

export default function UpdateEnquiry() {
  const [examOptions, setExamOptions] = useState([]);
  const [sourceOptions, setSourceOptions] = useState([]);
  const [conductedBy, setConductedBy] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  const [Enquiry, setEnquiry] = useState({
    name: "",
    mobile: "",
    // adminemail:'',
    institutecode: "",
    email: "",
    source_by: "",
    exam: "",
    conduct_by: "",
    status1: "",
    callBackDate: "",
    callBackTime: "",
    remark: "",
    enquiryDate: "",
  });
  // const [adminemail, setAdminemail]=useState(localStorage.getItem('loggedInUserEmail') || '');
  const [institutecode, setInstituteCode] = useState(
    localStorage.getItem("institutecode") || ""
  );
  const {
    name,
    mobile,
    email,
    source_by,
    status1,
    exam,
    conduct_by,
    remark,
    enquiryDate,
    callBackDate,
    callBackTime,
  } = Enquiry;
  const [openSnackbar, setOpenSnackbar] = useState(false); // Snackbar state
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Snackbar message
  const onInputChange = (e) => {
    setEnquiry({ ...Enquiry, [e.target.name]: e.target.value });
  };

  const loadExams = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8086/getAllExam?institutecode=${institutecode}`
      );
      setExamOptions(response.data);
    } catch (error) {
      console.error("Error fetching exam options:", error);
    }
  };

  const loadSources = async () => {
    try {
      const sources = await axios.get(
        `http://localhost:8086/getAllSource?institutecode=${institutecode}`
      );
      setSourceOptions(sources.data);
    } catch (error) {
      console.error("Error fetching sources:", error);
    }
  };

  const loadConducts = async () => {
    try {
      const conducted = await axios.get(
        `http://localhost:8086/get/getAllConductModels?institutecode=${institutecode}`
      );
      setConductedBy(conducted.data);
    } catch (error) {
      console.error("Error fetching conducts:", error);
    }
  };

  useEffect(() => {
    loadExams();
    loadSources();
    loadConducts();
  }, []);

  useEffect(
    () => {
      const loadUser = async () => {
        try {
          const result = await axios.get(
            `http://localhost:8086/get/enquiry/${id}`
          );
          setEnquiry(result.data);
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      };
      loadUser();
    },
    [id],
    [institutecode]
  );

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8086/updateenquiry/${id}`, Enquiry);
      setSnackbarMessage("Enquiry updated successfully"); // Set success message
      setOpenSnackbar(true); // Show Snackbar
      setTimeout(() => {
        navigate("/layout/report"); // Navigate after a delay
      }, 2000); // Adjust time as needed
    } catch (error) {
      console.error("Error updating enquiry:", error);
    }
  };

  const enquiryDateRef = useRef();
  const handleEnquiryDateClick = () => {
    enquiryDateRef.current.focus();
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8086/deleteenquiry/${id}`);
      navigate("/layout/report");
    } catch (error) {
      console.error("Error deleting enquiry:", error);
    }
  };

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const handleDeleteDialogOpen = () => {
    setOpenDeleteDialog(true);
  };

  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Enquiry Details", 10, 10);

    // Line break
    doc.line(10, 12, 200, 12); // Add a line under the title
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");

    // Content
    const content = [
      { label: "Name:", value: name },
      { label: "Phone No.:", value: mobile },
      { label: "Email:", value: email },
      { label: "Exam:", value: exam },
      { label: "Source By:", value: source_by },
      { label: "Conducted By:", value: conduct_by },
      { label: "Status:", value: status1 },
      ...(status1 === "Call"
        ? [
            { label: "Call Back Date:", value: callBackDate },
            { label: "Call Back Time:", value: callBackTime },
          ]
        : []),
      { label: "Enquiry Date:", value: enquiryDate },
      { label: "Remark:", value: remark },
    ];

    // Add content to PDF
    let yPosition = 20; // Starting Y position for content
    content.forEach((item) => {
      doc.setFont("helvetica", "bold");
      doc.text(item.label, 10, yPosition);
      doc.setFont("helvetica", "normal");
      doc.text(item.value || "N/A", 60, yPosition); // Set a default value if empty
      yPosition += 10; // Increase Y position for next line
    });

    // Save the PDF
    doc.save("Enquiry_Details.pdf");
  };

  const handleDownload = (e) => {
    e.preventDefault();
    generatePDF(); // Call PDF generation
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false); // Close the Snackbar
  };

  return (
    <Container maxWidth="false" sx={{ padding: 2, width: "100%" }}>
      <Box textAlign="center" sx={{ width: "100%" }}>
        <PopTypography
          variant="h5"
          gutterBottom
          sx={{
            fontWeight: "bold",
            color: "#fff",
            backgroundColor: "#24A0ED",
            borderRadius: "150px",
            padding: "10px",
            marginBottom: "20px",
          }}
        >
          Update Enquiry
        </PopTypography>
        <Box component="form" onSubmit={onSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Name"
                variant="outlined"
                name="name"
                value={name}
                onChange={onInputChange}
                fullWidth
                size="small"
                InputProps={{
                  style: { textAlign: "left" },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone No."
                variant="outlined"
                name="mobile"
                value={mobile}
                onChange={onInputChange}
                fullWidth
                size="small"
                InputProps={{
                  style: { textAlign: "left" },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                variant="outlined"
                name="email"
                value={email}
                onChange={onInputChange}
                fullWidth
                size="small"
                InputProps={{
                  style: { textAlign: "left" },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel id="exam-label">Exam</InputLabel>
                <Select
                  labelId="exam-label"
                  name="exam"
                  value={exam}
                  onChange={onInputChange}
                  label="Exam"
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 200,
                        width: 250,
                      },
                    },
                  }}
                  sx={{ textAlign: "left" }}
                >
                  <MenuItem value="">
                    <em>Select Exam</em>
                  </MenuItem>
                  {examOptions.map((option, index) => (
                    <MenuItem
                      key={index}
                      value={option.name}
                      style={{ textAlign: "left" }}
                    >
                      {option.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel id="source-label">Source By</InputLabel>
                <Select
                  labelId="source-label"
                  name="source_by"
                  value={source_by}
                  onChange={onInputChange}
                  label="Source By"
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 200,
                        width: 250,
                      },
                    },
                  }}
                  sx={{ textAlign: "left" }}
                >
                  <MenuItem value="">
                    <em>Select Source</em>
                  </MenuItem>
                  {sourceOptions.map((option, index) => (
                    <MenuItem
                      key={index}
                      value={option.name}
                      style={{ textAlign: "left" }}
                    >
                      {option.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel id="conduct-label">Conducted By</InputLabel>
                <Select
                  labelId="conduct-label"
                  name="conduct_by"
                  value={conduct_by}
                  onChange={onInputChange}
                  label="Conducted By"
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 200,
                        width: 250,
                      },
                    },
                  }}
                  sx={{ textAlign: "left" }}
                >
                  <MenuItem value="">
                    <em>Select Conduct</em>
                  </MenuItem>
                  {conductedBy.map((option, index) => (
                    <MenuItem
                      key={index}
                      value={option.name}
                      style={{ textAlign: "left" }}
                    >
                      {option.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  name="status1"
                  value={status1}
                  onChange={onInputChange}
                  label="Status"
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 200,
                        width: 250,
                      },
                    },
                  }}
                  sx={{ textAlign: "left" }}
                >
                  <MenuItem value="Call">Call</MenuItem>
                  <MenuItem value="Interested">Interested</MenuItem>
                  <MenuItem value="Not Interested">Not Interested</MenuItem>
                  <MenuItem value="DND">DND</MenuItem>
                  <MenuItem value="Ringing">Ringing</MenuItem>
                  <MenuItem value="Switch Off">Switch Off</MenuItem>
                  <MenuItem value="Waiting">Waiting</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {status1 === "Call" && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Select Date"
                    type="date"
                    variant="outlined"
                    name="callBackDate"
                    value={callBackDate}
                    onChange={onInputChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    size="small"
                    InputProps={{
                      style: { textAlign: "left" },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Select Time"
                    type="time"
                    variant="outlined"
                    name="callBackTime"
                    value={callBackTime}
                    onChange={onInputChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    size="small"
                    InputProps={{
                      style: { textAlign: "left" },
                    }}
                  />
                </Grid>
              </>
            )}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Enquiry Date"
                type="date"
                variant="outlined"
                name="enquiryDate"
                value={enquiryDate}
                onChange={onInputChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
                size="small"
                inputRef={enquiryDateRef}
                onClick={handleEnquiryDateClick}
                InputProps={{
                  style: { textAlign: "left" },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Remark"
                variant="outlined"
                name="remark"
                value={remark}
                onChange={onInputChange}
                fullWidth
                size="small"
                multiline
                rows={4}
                InputProps={{
                  style: { textAlign: "left" },
                }}
              />
            </Grid>
          </Grid>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Button
              variant="contained"
              color="warning"
              component={Link}
              to="/layout/report"
              startIcon={<CancelIcon />}
            >
              Cancel
            </Button>
            <Box display="flex" gap={2}>
              <Button
                sx={{ mt: 2, mr: 2 }}
                variant="contained"
                color="error"
                onClick={handleDeleteDialogOpen}
                startIcon={<DeleteIcon />}
              >
                Delete
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                sx={{ mt: 2, mr: 2 }}
              >
                Save
              </Button>
              <Button
                onClick={handleDownload} // Download button
                variant="contained"
                color="success"
                startIcon={<DownloadIcon />}
                sx={{ mt: 2 }}
              >
                Download PDF
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Snackbar for success messages */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleDeleteDialogClose}>
        <DialogTitle align="center" sx={{ backgroundColor: "#f5f5f5" }}>
          <strong style={{ color: "#d32f2f" }}>Delete Enquiry</strong>
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            <strong>Are you sure you want to delete this enquiry?</strong>
          </DialogContentText>
          <Box sx={{ padding: 2, backgroundColor: "#fafafa", borderRadius: 1 }}>
            <Typography variant="subtitle1">
              <strong>Name:</strong> {name}
            </Typography>
            <Typography variant="subtitle1">
              <strong>Phone No.:</strong> {mobile}
            </Typography>
            <Typography variant="subtitle1">
              <strong>Email:</strong> {email}
            </Typography>
            <Typography variant="subtitle1">
              <strong>Exam:</strong> {exam}
            </Typography>
            <Typography variant="subtitle1">
              <strong>Source:</strong> {source_by}
            </Typography>
            <Typography variant="subtitle1">
              <strong>Conducted By:</strong> {conduct_by}
            </Typography>
            <Typography variant="subtitle1">
              <strong>Status:</strong> {status1}
            </Typography>
            <Typography variant="subtitle1">
              <strong>Remark:</strong> {remark}
            </Typography>
            <Typography variant="subtitle1">
              <strong>Enquiry Date:</strong> {enquiryDate}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ padding: "16px 24px" }}>
          <Button onClick={handleDeleteDialogClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

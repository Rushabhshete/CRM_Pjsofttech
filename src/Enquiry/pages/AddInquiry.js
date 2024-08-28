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
  Snackbar,
  Alert,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/system";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";

export default function AddEnquiry() {
  const [examOptions, setExamOptions] = useState([]);
  const [sourceOptions, setSourceOptions] = useState([]);
  const [conductedBy, setConductedBy] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [Enquiry, setInquiries] = useState({
    name: "",
    mobile: "",
    // adminemail: localStorage.getItem('loggedInUserEmail') || '',
    institutecode: localStorage.getItem("institutecode") || "",
    email: "",
    source_by: "",
    status1: "",
    exam: "",
    conduct_by: "",
    remark: "",
    enquiryDate: "",
    callBackDate: "",
    callBackTime: "",
  });
  const [error, setError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const theme = useTheme();

  const onInputChange = (e) => {
    setInquiries({ ...Enquiry, [e.target.name]: e.target.value });
    const inputValue = e.target.value;
    if (e.target.name === "mobile") {
      if (inputValue.length === 10) {
        setError("");
      } else {
        setError("Phone number should not exceed 10 digits");
      }
    }
  };

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [examsResponse, sourcesResponse, conductsResponse] =
          await Promise.all([
            axios.get(
              `http://localhost:8086/getAllExam?institutecode=${Enquiry.institutecode}`
            ),
            axios.get(
              `http://localhost:8086/getAllSource?institutecode=${Enquiry.institutecode}`
            ),
            axios.get(
              `http://localhost:8086/get/getAllConductModels?institutecode=${Enquiry.institutecode}`
            ),
          ]);

        setExamOptions(examsResponse.data);
        setSourceOptions(sourcesResponse.data);
        setConductedBy(conductsResponse.data);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    fetchOptions();
  }, []);

  const validateFields = () => {
    if (
      !Enquiry.name ||
      !Enquiry.mobile ||
      !Enquiry.email ||
      !Enquiry.exam ||
      !Enquiry.source_by ||
      !Enquiry.conduct_by ||
      !Enquiry.status1 ||
      !Enquiry.remark ||
      !Enquiry.enquiryDate
    ) {
      setErrorMessage("Fill all the necessary fields");
      return false;
    }
    if (Enquiry.status1 === "Call") {
      if (!Enquiry.callBackDate || !Enquiry.callBackTime) {
        setErrorMessage("Please fill in the call back date and time");
        return false;
      }
    }

    return true;
  };

  const onSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Validate fields before submitting
    if (!validateFields()) {
      setOpenSnackbar(true);
      return;
    }

    try {
      // Send the form data to the API endpoint
      await axios.post(
        `http://localhost:8086/save/enquiry?institutecode=${Enquiry.institutecode}`,
        Enquiry
      );
      setOpen(true); // Show the success message
      // Navigate to /report after successful submission
      setTimeout(() => {
        navigate("/layout/report");
      }, 3000); // Delay navigation to allow Snackbar to show
    } catch (error) {
      console.error(
        "There was an error adding the Enquiry!",
        error.response ? error.response.data : error.message
      );
      // Optionally, handle the error and show an error message to the user
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
    navigate("/layout/report");
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
    <div maxWidth="false" sx={{ padding: 2, width: "100%" }}>
      <Box mt={1} textAlign="center" sx={{ width: "100%" }}>
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
          Add Enquiry
        </PopTypography>

        <Grid container spacing={2} className="textField-root">
          <Grid item xs={12} sm={6}>
            <TextField
              label="Name"
              variant="outlined"
              name="name"
              value={Enquiry.name}
              onChange={onInputChange}
              fullWidth
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Phone No."
              variant="outlined"
              name="mobile"
              value={Enquiry.mobile}
              onChange={onInputChange}
              fullWidth
              size="small"
              inputProps={{ maxLength: 10 }}
              error={!!error}
              helperText={error}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Email"
              variant="outlined"
              name="email"
              value={Enquiry.email}
              onChange={onInputChange}
              fullWidth
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined" size="small">
              <TextField
                select
                size="small"
                name="exam"
                value={Enquiry.exam}
                onChange={onInputChange}
                label="Exam"
                sx={{ textAlign: "left" }} // Aligns text to the left in the Select component
              >
                {examOptions.map((option, index) => (
                  <MenuItem key={index} value={option.name}>
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined" size="small">
              <TextField
                select
                size="small"
                name="source_by"
                value={Enquiry.source_by}
                onChange={onInputChange}
                label="Source By"
                sx={{ textAlign: "left" }} // Aligns text to the left in the Select component
              >
                {sourceOptions.map((option, index) => (
                  <MenuItem key={index} value={option.name}>
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined" size="small">
              <TextField
                select
                size="small"
                name="conduct_by"
                value={Enquiry.conduct_by}
                onChange={onInputChange}
                label={"Conducts"}
                sx={{ textAlign: "left" }} // Aligns text to the left in the Select component
              >
                {conductedBy.map((option, index) => (
                  <MenuItem key={index} value={option.name}>
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined" size="small">
              <TextField
                select
                size="small"
                label={"Status"}
                name="status1"
                value={Enquiry.status1}
                onChange={onInputChange}
                sx={{ textAlign: "left" }} // Aligns text to the left in the Select component
              >
                <MenuItem value="Call">Call</MenuItem>
                <MenuItem value="Interested">Interested</MenuItem>
                <MenuItem value="Not Interested">Not Interested</MenuItem>
                <MenuItem value="DND">DND</MenuItem>
                <MenuItem value="Ringing">Ringing</MenuItem>
                <MenuItem value="Switch Off">Switch Off</MenuItem>
                <MenuItem value="Waiting">Waiting</MenuItem>
              </TextField>
            </FormControl>
          </Grid>

          {Enquiry.status1 === "Call" && (
            <>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Select Date"
                  type="date"
                  variant="outlined"
                  name="callBackDate"
                  value={Enquiry.callBackDate}
                  onChange={onInputChange}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Select Time"
                  type="time"
                  variant="outlined"
                  name="callBackTime"
                  value={Enquiry.callBackTime}
                  onChange={onInputChange}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  size="small"
                  inputProps={{ step: 60 }} // Ignore seconds by setting step to 60
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
              value={Enquiry.enquiryDate}
              onChange={onInputChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
              size="small"
            />
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6} align={"center"} mt={2}>
          <textarea
            minRows={4}
            placeholder="Remark"
            name="remark"
            value={Enquiry.remark}
            onChange={onInputChange}
            style={{ width: "100%", padding: "8px" }}
          />
        </Grid>
        <Grid
          mt={1}
          gap={2}
          item
          xs={12}
          display="flex"
          justifyContent="center"
        >
          {/* <Button
              variant="contained"
              color="error"
              component={Link}
              to="/layout/report"
              startIcon={<CancelIcon />}
            >
              Cancel
            </Button> */}
          <Button
            variant="contained"
            color="primary"
            type="submit"
            startIcon={<SaveIcon />}
            onClick={onSubmit}
          >
            Save
          </Button>
        </Grid>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message={errorMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        ContentProps={{
          sx: { backgroundColor: "red" }, // Red background color for the error message
        }}
      >
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          Fill the necessary fields!
        </Alert>
      </Snackbar>

      <Snackbar
        open={open}
        autoHideDuration={1000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Enquiry added successfully!
        </Alert>
      </Snackbar>
    </div>
  );
}

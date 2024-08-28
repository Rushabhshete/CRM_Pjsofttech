import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Grid,
  TextField,
  Button,
  MenuItem,
  Typography,
} from "@mui/material";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { styled } from "@mui/system";
import { useNavigate } from 'react-router-dom';

const AdmissionForm = () => {
  const institutecode = localStorage.getItem("institutecode");
  const [formData, setFormData] = useState({
    name: "",
    mobile2: "",
    date: "",
    courses: "",
    duration: "",
    institutecode: institutecode || "",
    transactionid: "",
    totalFees: "",
    remark: "",
    dueDate: "",
    medium: "",
    paymentMode: "",
    paidFees: "",
    guideName: "",
    sourceBy: "",
    mobile1: "",
    feesReceipt: null,
    studentPhoto: null,
    paymentMethod: "",
    balanceAmount: "pending",
  });
  const [courses, setCourses] = useState([]);
  const [source, setSources] = useState([]);
  const [guide, setGuide] = useState([]);
  const [touched, setTouched] = useState({});
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isFormSaved, setIsFormSaved] = useState(false);
  let navigate = useNavigate();

  useEffect(() => {
    const fetchGuide = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8085/api/conductBy/getAllConductBy?institutecode=${institutecode}`
        );
        setGuide(response.data);
      } catch (error) {
        console.error("Error fetching guides:", error);
      }
    };

    if (institutecode) {
      fetchGuide();
    }
  }, [institutecode]);

  useEffect(() => {
    const fetchSources = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8085/api/sourceBy/getAll?institutecode=${institutecode}`
        );
        setSources(response.data);
      } catch (error) {
        console.error("Error fetching sources:", error);
      }
    };

    if (institutecode) {
      fetchSources();
    }
  }, [institutecode]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8085/getAllCourse?institutecode=${institutecode}`
        );
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    if (institutecode) {
      fetchCourses();
    }
  }, [institutecode]);

  useEffect(() => {
    const calculateBalanceAmount = () => {
      const total = parseFloat(formData.totalFees) || 0;
      const paid = parseFloat(formData.paidFees) || 0;
      const balanceAmount = total - paid;
      setFormData((prevFormData) => ({
        ...prevFormData,
        balanceAmount: balanceAmount > 0 ? balanceAmount.toString() : "",
      }));
    };

    calculateBalanceAmount();
  }, [formData.totalFees, formData.paidFees]);

  useEffect(() => {
    if (formData.paymentMethod === "Paid") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        paidFees: prevFormData.totalFees
      }));
    } else if (formData.paymentMethod === "Partial") {
      // Handle Partial Payment if needed
    }
  }, [formData.paymentMethod]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (event, fieldName) => {
    setFormData({ ...formData, [fieldName]: event.target.files[0] });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const { feesReceipt, studentPhoto, ...dataToSubmit } = formData; // exclude files from the initial submission
      await axios.post(
        `http://localhost:8085/saveAdmission?institutecode=${institutecode}`,
        dataToSubmit
      );
      toast.success("Admission form submitted successfully");
      setIsFormSubmitted(true); // mark form as submitted
      setIsFormSaved(true); // mark form as saved
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error submitting form");
    }
  };

  const handleFinalSubmit = () => {
    navigate('/layout/students');
  };

  const handleFileUpload = async (fieldName, endpoint) => {
    const file = formData[fieldName];

    if (!file) {
      toast.error("No file selected");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append(fieldName, file);

    try {
      await axios.post(endpoint, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success(`${fieldName} uploaded successfully`);
    } catch (error) {
      console.error(`Error uploading ${fieldName}:`, error);
      toast.error(`Only JPG and JPEG files are allowed for ${fieldName}`);
    }
  };

  const calculateBalance = () => {
    if (
      formData.paymentMethod === "Partial" ||
      formData.paymentMethod === "Pending"
    ) {
      return formData.totalFees - formData.paidFees;
    }
    
    return 0; // No balance for other payment methods
  };

  const handleBlur = (field) => (event) => {
    setTouched({ ...touched, [field]: true });
  };

  const validateMobileNumber = (value) => {
    return /^\d{10}$/.test(value);
  };

  const validateEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
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
    <>
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
          marginBottom: "40px",
          marginTop: "10px",
          marginLeft: "40px",
          marginRight: "40px",
        }}
      >
        Student Application Form
      </PopTypography>
      <div maxWidth="lg">
        <form onSubmit={handleFormSubmit}>
          <Grid container spacing={3} className="textField-root">
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                id="name"
                name="name"
                label="Full Name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleBlur("email")}
                required
                error={touched.email && !validateEmail(formData.email)}
                helperText={
                  touched.email && !validateEmail(formData.email)
                    ? "Enter a valid email address"
                    : ""
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                id="mobile1"
                name="mobile1"
                label="Mobile 1"
                value={formData.mobile1}
                onChange={handleInputChange}
                onBlur={handleBlur("mobile1")}
                required
                error={
                  touched.mobile1 && !validateMobileNumber(formData.mobile1)
                }
                helperText={
                  touched.mobile1 && !validateMobileNumber(formData.mobile1)
                    ? "Mobile number must be 10 digits"
                    : ""
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                id="mobile2"
                name="mobile2"
                label="Mobile 2"
                value={formData.mobile2}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                id="courses"
                name="courses"
                label="Courses"
                value={formData.courses}
                onChange={handleInputChange}
                select
              >
                {courses.map((course) => (
                  <MenuItem key={course.id} value={course.cname}>
                    {course.cname}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                id="medium"
                name="medium"
                label="Medium"
                value={formData.medium}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                id="duration"
                name="duration"
                label="Duration"
                value={formData.duration}
                onChange={handleInputChange}
                select
              >
                <MenuItem value="3 Months">3 Months</MenuItem>
                <MenuItem value="6 Months">6 Months</MenuItem>
                <MenuItem value="12 Months">12 Months</MenuItem>
                <MenuItem value="24 Months">24 Months</MenuItem>
                <MenuItem value="36 Months">36 Months</MenuItem>
                <MenuItem value="48 Months">48 Months</MenuItem>
              </TextField>
            </Grid>
          
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                id="totalFees"
                name="totalFees"
                label="Total Fees"
                value={formData.totalFees}
                onChange={handleInputChange}
              />
            </Grid>  <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                id="paymentMethod"
                name="paymentMethod"
                label="Payment Method"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                select
                required
              >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Partial">Partial</MenuItem>
                <MenuItem value="Paid">Full</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                id="paidFees"
                name="paidFees"
                label="Paid Fees"
                value={formData.paidFees}
                onChange={handleInputChange}
              />
            </Grid>
            {formData.paymentMethod === "Pending" ||
            formData.paymentMethod === "Partial" ? (
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  id="balanceAmount"
                  name="balanceAmount"
                  label="Balance Amount"
                  value={calculateBalance()}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
            ) : null}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                id="transactionid"
                name="transactionid"
                label="Transaction ID"
                value={formData.transactionid}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                id="paymentMode"
                name="paymentMode"
                label="Payment Mode"
                value={formData.paymentMode}
                onChange={handleInputChange}
                select
              >
                <MenuItem value="Gpay">Gpay</MenuItem>
                <MenuItem value="Phonepay">Phonepay</MenuItem>
                <MenuItem value="Cash">Cash</MenuItem>
                <MenuItem value="Card">Credit Card</MenuItem>
                <MenuItem value="Card">Debit Card</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                id="sourceBy"
                name="sourceBy"
                label="Source By"
                value={formData.sourceBy}
                onChange={handleInputChange}
                select
              >
                {source.map((src) => (
                  <MenuItem key={src.id} value={src.sourceBy}>
                    {src.sourceBy}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                id="guideName"
                name="guideName"
                label="Conduct By"
                value={formData.guideName}
                onChange={handleInputChange}
                select
              >
                {guide.map((g) => (
                  <MenuItem key={g.id} value={g.guideName}>
                    {g.guideName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                id="date"
                name="date"
                label="Date"
                value={formData.date}
                onChange={handleInputChange}
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                id="dueDate"
                name="dueDate"
                label="Due Date"
                value={formData.dueDate}
                onChange={handleInputChange}
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                id="remark"
                name="remark"
                label="Remark"
                value={formData.remark}
                onChange={handleInputChange}
                rows={4}
              />
            </Grid>
            <Grid container spacing={3} style={{ marginTop: "10px",justifyContent:"center" }} >
              <Grid item>
                <Button type="submit" variant="contained" color="primary" >
                  Save Data
                </Button>
              </Grid>
            </Grid>
           
            <Grid container spacing={1} justifyContent="space-evenly" display="flex">
              <Grid item xs={12} sm={6} md={4}>
                <Button variant="contained" component="label">
                  Upload Fees Receipt Photo
                  <input
                    type="file"
                    hidden
                    onChange={(event) => handleFileChange(event, "feesReceipt")}
                  />
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() =>
                    handleFileUpload(
                      "feesReceipt",
                      `http://localhost:8085/saveFeesRecipt/${formData.email}`
                    )
                  }
                  disabled={!isFormSubmitted}
                >
                  Upload
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Button variant="contained" component="label">
                  Upload Student Photo
                  <input
                    type="file"
                    hidden
                    onChange={(event) =>
                      handleFileChange(event, "studentPhoto")
                    }
                  />
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() =>
                    handleFileUpload(
                      "studentPhoto",
                      `http://localhost:8085/saveStudentPhoto/${formData.email}`
                    )
                  }
                  disabled={!isFormSubmitted}
                >
                  Upload
                </Button>
              </Grid>
            </Grid>
            {isFormSaved && (
              <Grid container justifyContent="center" spacing={3} style={{ marginTop: "10px" }}>
                <Grid item>
                  <Button variant="contained" onClick={handleFinalSubmit} color="primary">
                    Submit
                  </Button>
                </Grid>
              </Grid>
            )}
          </Grid>
        </form>
      
      </div>
      <ToastContainer />
    </>
  );
};

export default AdmissionForm;

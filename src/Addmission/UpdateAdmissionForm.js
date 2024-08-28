import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpdateAdmissionForm = ({ admission, onUpdate }) => {
  const [formValues, setFormValues] = useState(admission);
  const [courses, setCourses] = useState([]);
  const [guides, setGuides] = useState([]);
  const [sources, setSources] = useState([]);

  const institutecode = localStorage.getItem("institutecode");

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

    fetchSources();
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

    fetchCourses();
  }, [institutecode]);

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8085/api/conductBy/getAllConductBy?institutecode=${institutecode}`
        );
        setGuides(response.data);
      } catch (error) {
        console.error("Error fetching guides:", error);
      }
    };

    fetchGuides();
  }, [institutecode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleUpdateAdmission = async (event) => {
    event.preventDefault();
    try {
      await axios.put(
        `http://localhost:8085/updateAdmission/${formValues.id}`,
        formValues
      );
      toast.success("Admission updated successfully!");
      if (onUpdate) {
        onUpdate(formValues); // Call the onUpdate function if provided
      }
    } catch (error) {
      toast.error("Error updating admission.");
      console.error("Error updating admission:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleUpdateAdmission}>
        {/* Form Fields */}
        <Grid container spacing={1} className="textField-root">
          {" "}
          <Grid item xs={12} sm={4}>
            <TextField
              name="name"
              label="Name"
              value={formValues.name || ""}
              onChange={handleChange}
              fullWidth
              
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              name="email"
              label="Email"
              value={formValues.email || ""}
              onChange={handleChange}
              fullWidth
             
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              name="mobile1"
              label="Mobile"
              value={formValues.mobile1 || ""}
              onChange={handleChange}
              fullWidth
              
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              name="courses"
              value={formValues.courses || ""}
              onChange={handleChange}
              select
              fullWidth
              label="Course"
            >
              {courses.map((course) => (
                <MenuItem key={course.id} value={course.cname}>
                  {course.cname}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              name="duration"
              label="Duration"
              value={formValues.duration || ""}
              onChange={handleChange}
              fullWidth
              
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              name="date"
              label="Joining Date"
              type="date"
              value={formValues.date || ""}
              onChange={handleChange}
              fullWidth
              
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              name="dueDate"
              label="Expiry Date"
              type="date"
              value={formValues.dueDate || ""}
              onChange={handleChange}
              fullWidth
              
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              name="totalFees"
              label="Total Fees"
              value={formValues.totalFees || ""}
              onChange={handleChange}
              fullWidth
              
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              name="paidFees"
              label="Paid Fees"
              value={formValues.paidFees || ""}
              onChange={handleChange}
              fullWidth
              
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              name="pendingFees"
              label="Pending Fees"
              value={formValues.pendingFees || ""}
              onChange={handleChange}
              fullWidth
              
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              name="paymentMode"
              value={formValues.paymentMode || ""}
              onChange={handleChange}
              select
              label="Payment Mode"
              fullWidth
            >
              <MenuItem value="Gpay">Gpay</MenuItem>
              <MenuItem value="Phonepay">Phonepay</MenuItem>
              <MenuItem value="Cash">Cash</MenuItem>
              <MenuItem value="Card">Credit Card</MenuItem>
              <MenuItem value="Card">Debit Card</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              name="transactionid"
              label="Transaction ID"
              value={formValues.transactionid || ""}
              onChange={handleChange}
              fullWidth
              
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              name="guideName"
              value={formValues.guideName || ""}
              onChange={handleChange}
              selectlabel="Guide Name"
            >
              {guides.map((guide) => (
                <MenuItem key={guide.id} value={guide.guideName}>
                  {guide.guideName}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              name="sourceBy"
              value={formValues.sourceBy || ""}
              onChange={handleChange}
              select
              label="Source By"
              fullWidth
            >
              {sources.map((source) => (
                <MenuItem key={source.id} value={source.sourceBy}>
                  {source.sourceBy}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              name="remark"
              label="Remark"
              value={formValues.remark || ""}
              onChange={handleChange}
              fullWidth
              
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              name="status"
              label="Status"
              value={formValues.status || ""}
              onChange={handleChange}
              fullWidth
              
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              //style={{ marginTop: "25px" }}
            >
              Update Admission
            </Button>
          </Grid>
        </Grid>
      </form>
      <ToastContainer />
    </div>
  );
};

export default UpdateAdmissionForm;

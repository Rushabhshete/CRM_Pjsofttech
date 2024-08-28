import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Snackbar,
} from "@mui/material";
import { styled } from "@mui/system";

export default function AddConduct() {
  const navigate = useNavigate();

  const [conduct, setConduct] = useState({
    // adminemail: localStorage.getItem('loggedInUserEmail') || '',
    institutecode: localStorage.getItem("institutecode") || "",
    name: "",
  });

  const { institutecode, name } = conduct;
  const [errorMessage, setErrorMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarColor, setSnackbarColor] = useState(""); // State for Snackbar color

  const validateFields = () => {
    if (!conduct.name) {
      setErrorMessage("Fill all the necessary fields");
      setSnackbarColor("red"); // Set color to red for error messages
      return false;
    }

    return true;
  };

  const handleInputChange = (e) => {
    setConduct({ ...conduct, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFields()) {
      setOpenSnackbar(true);
      return;
    }

    try {
      await axios.post(
        `http://localhost:8086/save/conduct_by?institutecode=${institutecode}`,
        conduct
      );

      // Set success message and color
      setErrorMessage("Conduct added successfully!");
      setSnackbarColor("green"); // Set color for success
      setOpenSnackbar(true);

      // Redirect after a delay
      setTimeout(() => {
        navigate("/layout/conduct");
      }, 2000); // Adjust the delay as needed
    } catch (error) {
      console.error(
        "There was an error adding the Conduct!",
        error.response ? error.response.data : error.message
      );
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
    <Container maxWidth="false" sx={{ padding: 2, width: "100%" }}>
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
          mt={4}
        >
          Add Conduct
        </PopTypography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            flexGrow: 1,
          }}
          mt={2}
        >
          <TextField
            label="Conduct Name"
            variant="outlined"
            name="name"
            value={name}
            onChange={handleInputChange}
            fullWidth
          />
          <Grid container spacing={2} sx={{ marginTop: 2 }}>
            <Grid item xs={4}>
              <Button
                variant="contained"
                color="error"
                component={Link}
                to="/layout/conduct"
                fullWidth
              >
                Cancel
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Button
                variant="contained"
                color="success"
                type="submit"
                fullWidth
              >
                Submit
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Button
                variant="outlined"
                color="primary"
                component={Link}
                to="/layout/conduct"
                fullWidth
              >
                View All Conducts
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message={errorMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        ContentProps={{
          sx: { backgroundColor: snackbarColor }, // Set Snackbar background color based on state
        }}
      />
    </Container>
  );
}

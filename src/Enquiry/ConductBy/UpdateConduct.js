import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Snackbar,
} from "@mui/material";
import { styled } from "@mui/system";

export default function UpdateConduct() {
  const { id } = useParams();
  let navigate = useNavigate();

  const [conduct, setConducts] = useState({
    name: "",
  });

  const { name } = conduct;
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const onInputChange = (e) => {
    setConducts({ ...conduct, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:8086/updateConduct/${id}`,
        conduct,
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*", // Add this header
          },
        }
      );

      // Set snackbar message and open snackbar
      setSnackbarMessage("Conduct updated successfully");
      setOpenSnackbar(true);

      // Redirect after a delay
      setTimeout(() => {
        navigate("/layout/conduct");
      }, 2000); // Redirect after 2 seconds
    } catch (error) {
      console.error("There was an error updating the conduct!", error);
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

  useEffect(() => {
    const loadUser = async () => {
      try {
        const result = await axios.get(
          `http://localhost:8086/getConduct/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*", // Add this header
            },
          }
        );
        console.log("Fetched Data: ", result.data);
        setConducts(result.data);
      } catch (error) {
        console.error("There was an error fetching the conduct!", error);
      }
    };
    loadUser();
  }, [id]);

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
        >
          Update Conduct
        </PopTypography>
        <Box
          component="form"
          onSubmit={(e) => onSubmit(e)}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            mt: 5,
          }}
        >
          <TextField
            label="Conduct Name"
            variant="outlined"
            name="name"
            value={name}
            onChange={(e) => onInputChange(e)}
            fullWidth
          />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              variant="contained"
              color="warning"
              component={Link}
              to="/layout/conduct"
            >
              Cancel
            </Button>
            <Button variant="contained" color="success" type="submit">
              Save
            </Button>
          </Box>
        </Box>
      </Box>
      {/* Snackbar for success message */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000} // Duration for Snackbar visibility
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        ContentProps={{
          sx: { backgroundColor: "green" }, // Green background for success message
        }}
      />
    </Container>
  );
}

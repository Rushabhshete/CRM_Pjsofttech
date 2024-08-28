import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  CircularProgress,
  Typography,
  Grid,
  Container,
  Divider,
  Button,
  Box,
  Card,
  CardContent,
} from "@mui/material";

import StarIcon from "@mui/icons-material/Star";

const Settings = () => {
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const email = localStorage.getItem("email");

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        if (!email) {
          console.error("No email found in localStorage");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://localhost:8081/findInstitutesby/email?emailaddress=${email}`
        );
        setEmployeeDetails(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching employee details:", error);
        setLoading(false);
      }
    };

    fetchEmployeeDetails();
  }, [email]);

  if (loading) {
    return (
      <Container
        maxWidth="md"
        style={{ textAlign: "center", marginTop: "20%" }}
      >
        <CircularProgress />
      </Container>
    );
  }

  if (!employeeDetails) {
    return (
      <Container
        maxWidth="md"
        style={{ textAlign: "center", marginTop: "20%" }}
      >
        <Typography variant="h6">No employee details found</Typography>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="lg"
      style={{
        padding: "20px", // Padding around the container
      }}
    >
      {/* Basic Information Section */}
      <Typography
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
        Basic Info.
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} sm={6} md={4}>
          <Typography
            variant="body1"
           
            align="center"
            style={{ padding: "8px" }}
          >
           <strong>Institute Name: </strong> {employeeDetails.institutename}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="body1" align="center" style={{ padding: "8px" }}>
          <strong>Institute Code: </strong>  {employeeDetails.institutecode}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="body1" align="center" style={{ padding: "8px" }}>
          <strong>Registration Number: </strong>  {employeeDetails.registrationnumber}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="body1" align="center" style={{ padding: "8px" }}>
          <strong>Webside Name: </strong> {employeeDetails.websidename}
          </Typography>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Typography
          variant="h5"
          color="#0D47A1"
          align="center"
          style={{ padding: "8px" }}
        >
          <strong>Our Best Plans</strong>
        </Typography>
      </Grid>

      <Box sx={{ flexGrow: 1, padding: 3 }}>
        <Grid container spacing={3} justifyContent="center">
          {/* Basic Plan */}
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                position: "relative",
                padding: 3,
                textAlign: "center",
                height: 320, // Set a fixed height
                background: "linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                borderRadius: 4,
                transition: "transform 0.3s ease",
                transform: "scale(1.1)", // Initially make this card bigger
                "&:hover": {
                  transform: "scale(1.2)", // Increase size on hover
                },
              }}
            >
              {/* Bookmark with Best Seller Star */}
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: 70,
                  height: 70,
                  backgroundColor: "#424242",
                  clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 85%, 0 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "gold",
                  fontWeight: "bold",
                  fontSize: "0.75rem",
                }}
              >
                <StarIcon sx={{ color: "gold", marginRight: 0.5 }} />
                Best Seller
              </Box>

              <CardContent>
                <Typography
                  variant="h5"
                  sx={{
                    marginBottom: 2,
                    background:
                      "linear-gradient(90deg, #6A82FB 0%, #1E3A8A 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontWeight: "bold",
                  }}
                >
                  Basic
                </Typography>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: "bold",
                    color: "#0D47A1",
                  }}
                >
                  $49
                </Typography>
                <Typography
                  variant="body1"
                  color="red"
                  sx={{
                    textDecoration: "line-through",
                    fontSize: "1rem",
                    marginBottom: 2,
                  }}
                >
                  $99
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    marginTop: 2,
                    color: "#1E88E5",
                  }}
                >
                  Validity: 6 Months
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "#1976D2",
                    marginBottom: 2,
                  }}
                >
                  Systems: Enquiry, Admission, Income & Expense
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Gold Plan */}
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                position: "relative",
                padding: 3,
                textAlign: "center",
                height: 300, // Set a fixed height
                background: "linear-gradient(135deg, #FFFDE7 0%, #FFF176 100%)",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                borderRadius: 4,
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "scale(1.2)", // Increase size on hover
                },
              }}
            >
              <CardContent>
                <Typography
                  variant="h5"
                  sx={{
                    marginBottom: 2,
                    background:
                      "linear-gradient(90deg, #FFEB3B 0%, #FFC107 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontWeight: "bold",
                  }}
                >
                  Gold
                </Typography>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: "bold",
                    color: "#FBC02D",
                  }}
                >
                  $99
                </Typography>
                <Typography
                  variant="body1"
                  color="red"
                  sx={{
                    textDecoration: "line-through",
                    fontSize: "1rem",
                    marginBottom: 2,
                  }}
                >
                  $199
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    marginTop: 2,
                    color: "#FDD835",
                  }}
                >
                  Validity: 12 Months
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "#FBC02D",
                    marginBottom: 2,
                  }}
                >
                  Systems: Enquiry, Admission, Income & Expense
                </Typography>
                <Box sx={{ marginTop: 3 }}>
                  <Button
                    variant="contained"
                    sx={{
                      background:
                        "linear-gradient(90deg, #FBC02D 0%, #FFA726 100%)",
                      color: "#fff",
                      fontWeight: "bold",
                      "&:hover": {
                        background:
                          "linear-gradient(90deg, #F57C00 0%, #FF9800 100%)",
                      },
                    }}
                  >
                    Add
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Platinum Plan */}
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                position: "relative",
                padding: 3,
                textAlign: "center",
                height: 300, // Set a fixed height
                background: "linear-gradient(135deg, #E8F5E9 0%, #A5D6A7 100%)",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                borderRadius: 4,
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "scale(1.2)", // Increase size on hover
                },
              }}
            >
              <CardContent>
                <Typography
                  variant="h5"
                  sx={{
                    marginBottom: 2,
                    background:
                      "linear-gradient(90deg, #66BB6A 0%, #388E3C 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontWeight: "bold",
                  }}
                >
                  Platinum
                </Typography>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: "bold",
                    color: "#388E3C",
                  }}
                >
                  $149
                </Typography>
                <Typography
                  variant="body1"
             color="red"
                  sx={{
                    textDecoration: "line-through",
                    fontSize: "1rem",
                    marginBottom: 2,
                  }}
                >
                  $299
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    marginTop: 2,
                    color: "#43A047",
                  }}
                >
                  Validity: 18 Months
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "#2E7D32",
                    marginBottom: 2,
                  }}
                >
                  Systems: Enquiry, Admission, Income & Expense
                </Typography>
                <Box sx={{ marginTop: 3 }}>
                  <Button
                    variant="contained"
                    sx={{
                      background:
                        "linear-gradient(90deg, #43A047 0%, #66BB6A 100%)",
                      color: "#fff",
                      fontWeight: "bold",
                      "&:hover": {
                        background:
                          "linear-gradient(90deg, #388E3C 0%, #2E7D32 100%)",
                      },
                    }}
                  >
                    Add
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Premium Plan */}
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                position: "relative",
                padding: 3,
                textAlign: "center",
                height: 300, // Set a fixed height
                background: "linear-gradient(135deg, #FFEBEE 0%, #EF9A9A 100%)",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                borderRadius: 4,
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "scale(1.2)", // Increase size on hover
                },
              }}
            >
              <CardContent>
                <Typography
                  variant="h5"
                  sx={{
                    marginBottom: 2,
                    background:
                      "linear-gradient(90deg, #F44336 0%, #E57373 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontWeight: "bold",
                  }}
                >
                  Premium
                </Typography>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: "bold",
                    color: "#F44336",
                  }}
                >
                  $199
                </Typography>
                <Typography
                  variant="body1"
               color="red"
                  sx={{
                    textDecoration: "line-through",
                    fontSize: "1rem",
                    marginBottom: 2,
                  }}
                >
                  $399
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    marginTop: 2,
                    color: "#E57373",
                  }}
                >
                  Validity: 24 Months
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "#D32F2F",
                    marginBottom: 2,
                  }}
                >
                  Systems: Enquiry, Admission, Income & Expense
                </Typography>
                <Box sx={{ marginTop: 3 }}>
                  <Button
                    variant="contained"
                    sx={{
                      background:
                        "linear-gradient(90deg, #F44336 0%, #E57373 100%)",
                      color: "#fff",
                      fontWeight: "bold",
                      "&:hover": {
                        background:
                          "linear-gradient(90deg, #D32F2F 0%, #C62828 100%)",
                      },
                    }}
                  >
                    Add
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Divider */}
      <Divider style={{ margin: "24px 0" }} />

      {/* Legal Information Section */}
      <Typography
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
        Legal Details
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="body1" align="center" style={{ padding: "8px" }}>
            <strong>Created At:</strong>{" "}
            {new Date(employeeDetails.createdAt).toLocaleDateString()}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="body1" align="center" style={{ padding: "8px" }}>
            <strong>PAN No: </strong>
            {employeeDetails.pancard}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="body1" align="center" style={{ padding: "8px" }}>
            <strong>GST No:</strong> {employeeDetails.gstNo}
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Settings;

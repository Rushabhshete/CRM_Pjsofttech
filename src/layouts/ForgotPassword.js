import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CircularProgress,
  styled,
} from "@mui/material";
import axios from "axios";
import logo from "../img/logo.jpg";
import { useNavigate } from "react-router-dom";

const StyledCard = styled(Card)({
  padding: "40px 30px",
  borderRadius: "12px",
  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  textAlign: "center",
  maxWidth: "400px",
  width: "100%",
});

const StyledTextField = styled(TextField)({
  borderRadius: "8px",
  marginBottom: "16px",
});

const SubmitButton = styled(Button)({
  marginTop: "20px",
  padding: "12px 20px",
  backgroundColor: "#007BFF",
  border: "none",
  color: "#fff",
  borderRadius: "8px",
  "&:hover": {
    backgroundColor: "#0056B3",
  },
});

const Logo = styled("img")({
  maxWidth: "120px",
  marginBottom: "20px",
});

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOTP = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      // Send OTP request
      await axios.post(
        `http://localhost:8081/forgotPassword?email=${encodeURIComponent(
          email
        )}`
      );
      setStep(2);
      setMessage("OTP sent to your email.");
    } catch (error) {
      setError("Error sending OTP. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      // Retrieve the email from localStorage
      const storedEmail = localStorage.getItem("email");
      const response = await axios.post(
        `http://localhost:8081/verifyOTP?email=${encodeURIComponent(
          storedEmail
        )}&otp=${encodeURIComponent(otp)}`
      );

      if (response.data === "OTP verified successfully") {
        setStep(3);
        setMessage("OTP verified successfully. Please set a new password.");
      }
    } catch (error) {
      setError("Error verifying OTP. Please try again.");
      console.error(error);
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError("");
    setMessage("");
    try {
      // Retrieve the email from localStorage
      const storedEmail = localStorage.getItem("email");
      // Create the URL with query parameters
      const url = `http://localhost:8081/reset-password/Admin?email=${encodeURIComponent(
        storedEmail
      )}&password=${encodeURIComponent(
        newPassword
      )}&confirmPassword=${encodeURIComponent(confirmPassword)}`;

      // Send the PUT request
      await axios.put(url);

      // Delay to show success message
    } catch (error) {
      setError("Error resetting password. Please try again.");
      console.error(error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <StyledCard>
        <Logo src={logo} alt="Logo" />
        <Typography variant="h5" component="h1" gutterBottom>
          Forgot Password
        </Typography>
        {step === 1 && (
          <Box component="form" onSubmit={handleSendOTP}>
            <StyledTextField
              label="Email Address"
              type="email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
            />
            {error && <Typography color="error">{error}</Typography>}
            {message && <Typography color="success">{message}</Typography>}
            <SubmitButton variant="contained" type="submit" fullWidth>
              {loading ? <CircularProgress size={24} /> : "Send OTP"}
            </SubmitButton>
          </Box>
        )}
        {step === 2 && (
          <Box component="form" onSubmit={handleVerifyOTP}>
            <StyledTextField
              label="Email Address"
              type="email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              disabled // This makes the field non-editable
            />
            <StyledTextField
              label="OTP"
              type="text"
              variant="outlined"
              fullWidth
              margin="normal"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
            />
            {error && <Typography color="error">{error}</Typography>}
            {message && <Typography color="success">{message}</Typography>}
            <SubmitButton variant="contained" type="submit" fullWidth>
              {loading ? <CircularProgress size={24} /> : "Verify OTP"}
            </SubmitButton>
          </Box>
        )}
        {step === 3 && (
          <Box component="form" onSubmit={handleResetPassword}>
            <StyledTextField
              label="Email Address"
              type="email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              disabled // This makes the field non-editable
            />
            <StyledTextField
              label="New Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
            <StyledTextField
              label="Confirm Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
            {error && <Typography color="error">{error}</Typography>}
            {message && <Typography color="success">{message}</Typography>}
            <SubmitButton variant="contained" type="submit" fullWidth>
              {loading ? <CircularProgress size={24} /> : "Reset Password"}
            </SubmitButton>
          </Box>
        )}
      </StyledCard>
    </Container>
  );
}

export default ForgotPassword;

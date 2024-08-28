import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
  Paper,
  TableContainer,
} from "@mui/material";
import { styled } from "@mui/system";

const HelpDesk = () => {
  const [email, setEmail] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [accountData, setAccountData] = useState([]);
  const [loading, setLoading] = useState(false);
  const storedEmail = localStorage.getItem("email");
  const institutecode = () => localStorage.getItem("institutecode");

  useEffect(() => {
    const storedCollegeName = localStorage.getItem("collegeName");
    if (storedEmail) {
      setEmail(storedEmail);
    }
    if (storedCollegeName) {
      setCollegeName(storedCollegeName);
    }
  }, [storedEmail]);

  const handleAccountClick = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8081/getAllTickets?institutecode=${institutecode()}`
      );
      if (response.ok) {
        const data = await response.json();
        setAccountData(data); // Update state with array of ticket data
      } else {
        console.error("Failed to fetch account data");
      }
    } catch (error) {
      console.error("Error fetching account data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleAccountClick();
  }, []);

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
    <Box sx={{ padding: 3 }} >
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
        Issue/Ticket
      </PopTypography>

      {loading ? (
        <Box style={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      ) : accountData.length > 0 ? (
        <TableContainer component={Paper}>
          <Table >
            <TableHead  style={{
            backgroundColor: "#f2f2f2",
            justifyContent: "center",
          }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Ticket ID</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Issue Raised Date & Time
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>System Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Issue</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {accountData.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell>{ticket.id}</TableCell>
                  <TableCell>
                    {new Date(ticket.dateAndTime).toLocaleString()}
                  </TableCell>
                  <TableCell>{ticket.systemName || "N/A"}</TableCell>
                  <TableCell>{ticket.error}</TableCell>
                  <TableCell>{ticket.status}</TableCell>
                  <TableCell>{ticket.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="body1" align="center">
          No data available
        </Typography>
      )}
    </Box>
  );
};

export default HelpDesk;

import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Grid,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [email, setEmail] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [accountData, setAccountData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const getEmail = () => localStorage.getItem("APIemail");
  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    const storedCollegeName = localStorage.getItem("collegeName");
    if (storedEmail) {
      setEmail(storedEmail);
    }
    if (storedCollegeName) {
      setCollegeName(storedCollegeName);
    }
  }, []);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    sessionStorage.removeItem("isLoggedIn");
    navigate("/");
    console.log("Logged out");
  };

  const handleAccountClick = async () => {
    setOpenDialog(true);
    setAnchorEl(null);
    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:8081/adminemail?adminemail=${getEmail()}`
      );
      if (response.ok) {
        const data = await response.json();
        setAccountData(data);
      } else {
        console.error("Failed to fetch account data");
      }
    } catch (error) {
      console.error("Error fetching account data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundImage: "linear-gradient(to right, #FAD126, #FF564E)",
        }}
      >
        <Toolbar>
          <Grid container alignItems="center">
            <Grid item xs={4} display="flex" alignItems="center">
              <SchoolIcon sx={{ mr: 1 }} />
              <Typography variant="h6" noWrap>
                PjSoftTech
              </Typography>
            </Grid>
            <Grid item xs={4} display="flex" justifyContent="center">
              <Typography
                variant="h6"
                noWrap
                sx={{
                  background: "#FFFFFF",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Income Expense Management System
              </Typography>
            </Grid>
            <Grid
              item
              xs={4}
              display="flex"
              justifyContent="flex-end"
              alignItems="center"
            >
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleAccountClick}>My account</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>

      {/* <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="md">
        <DialogTitle style={{ textAlign: "center" }}>My Account</DialogTitle>
        <DialogContent >
          <Box sx={{ my: 2 }}>
            <Typography variant="body1">
              <strong>Email Address:</strong> {email}
            </Typography>
          </Box>
          <Box sx={{ my: 2 }}>
            <Typography variant="body1">
              <strong>College Name:</strong> {collegeName}
            </Typography>
          </Box>
          <Typography
            variant="h6"
            align="center"
            sx={{ my: 2, fontWeight: "bold" }}
          >
            Issue/Ticket
          </Typography>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <CircularProgress />
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Error</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Date and Time
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {accountData &&
                  accountData.map((row) => (
                    <TableRow
                      key={row.id}
                      sx={{
                        backgroundColor:
                          row.status === "Pending"
                            ? "lightpink"
                            : row.status === "Resolved"
                            ? "lightgreen"
                            : "inherit",
                        "& > *": {
                          color:
                            row.status === "Pending"
                              ? "white"
                              : row.status === "Resolved"
                              ? "white"
                              : "inherit",
                        },
                      }}
                    >
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.description}</TableCell>
                      <TableCell>{row.error}</TableCell>
                      <TableCell>{row.category}</TableCell>
                      <TableCell>{row.dateAndTime}</TableCell>
                      <TableCell>{row.status}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog> */}
    </>
  );
};

export default Navbar;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Grid,
  Menu,
  MenuItem,
  IconButton,
  Badge,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import logo from "../img/logo.jpg";
import { keyframes } from "@mui/system";

const vibration = keyframes`
  0% { transform: translateX(0); }
  10% { transform: translateX(-4px); }
  20% { transform: translateX(4px); }
  30% { transform: translateX(-4px); }
  40% { transform: translateX(4px); }
  50% { transform: translateX(-4px); }
  60% { transform: translateX(4px); }
  70% { transform: translateX(-4px); }
  80% { transform: translateX(4px); }
  90% { transform: translateX(-4px); }
  100% { transform: translateX(0); }
`;

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [notificationCount, setNotificationCount] = useState(1);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [hasSeenNotifications, setHasSeenNotifications] = useState(false);
  const [notificationInterval, setNotificationInterval] = useState(null);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

  const navigate = useNavigate();
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

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoadingNotifications(true);
      try {
        // Replace with your actual API endpoint
        const response = await axios.get(
          "http://localhost:8081/getNotifications"
        );
        setNotifications(response.data);
        setNotificationCount(response.data.length);
        setLoadingNotifications(false);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setLoadingNotifications(false);
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    if (notificationCount > 0 && !hasSeenNotifications) {
      const interval = setInterval(() => {
        setNotificationCount((prevCount) => prevCount); // Trigger a re-render
      }, 30); // 30 seconds

      setNotificationInterval(interval);

      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [notificationCount, hasSeenNotifications]);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    handleClose(); // Close the menu
    navigate("/layout/Admin-Profile"); // Navigate to the AdminProfile route
  };

  const handleLogout = () => {
    setOpenLogoutDialog(true);
  };

  const handleLogoutConfirm = () => {
    // Clear the authentication token and other local storage items
    localStorage.removeItem("token");
    localStorage.removeItem("instituteCode");
    localStorage.removeItem("email");
    localStorage.removeItem("emailaddress");

    // Redirect to the login page
    navigate("/");
  };

  const handleLogoutCancel = () => {
    setOpenLogoutDialog(false);
  };

  const handleNotificationsClick = (event) => {
    setNotificationsAnchorEl(event.currentTarget);
    setHasSeenNotifications(true); // Mark notifications as seen
    if (notificationInterval) {
      clearInterval(notificationInterval); // Clear the vibration interval
    }
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null);
  };

  const handleSnackbarClose = () => {
    setShowSnackbar(false);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundImage: "radial-gradient(circle, #FAD126, #FF564E)",
      }}
    >
      <Toolbar>
        <Grid container alignItems="center">
          <Grid item xs={4} display="flex" alignItems="center">
            <Link
              to="/layout/dashboard"
              style={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <img
                src={logo}
                alt="Logo"
                style={{ marginRight: "8px", height: "30px" }}
              />
              <Typography variant="h6" noWrap color="black">
                PJSOFTTECH
              </Typography>
            </Link>
          </Grid>
          <Grid item xs={4} display="flex" justifyContent="center">
            <Typography
              variant="h6"
              noWrap
              sx={{
                background: "#333",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {loading
                ? "Loading..."
                : `Welcome ${employeeDetails?.institutename || "Guest"}`}
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
              aria-label="notifications"
              aria-controls="menu-notifications"
              aria-haspopup="true"
              onClick={handleNotificationsClick}
              sx={{
                animation:
                  !hasSeenNotifications && notificationCount > 0
                    ? `${vibration} 0.8s ease-in-out`
                    : "none",
              }}
            >
              <Badge
                badgeContent={notificationCount}
                color="error"
                sx={{
                  "& .MuiBadge-dot": { backgroundColor: "red" },
                  animation:
                    !hasSeenNotifications && notificationCount > 0
                      ? `${vibration} 0.8s ease-in-out`
                      : "none",
                }}
              >
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <Menu
              id="menu-notifications"
              anchorEl={notificationsAnchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(notificationsAnchorEl)}
              onClose={handleNotificationsClose}
            >
              {loadingNotifications ? (
                <MenuItem>Loading notifications...</MenuItem>
              ) : notifications.length > 0 ? (
                notifications.map((notification, index) => (
                  <MenuItem key={index}>{notification.message}</MenuItem>
                ))
              ) : (
                <MenuItem >New Updates Are Comming Soon </MenuItem>
              )}
            </Menu>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              //color="inherit"
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
              <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Grid>
        </Grid>
      </Toolbar>
      <Dialog
        open={openLogoutDialog}
        onClose={handleLogoutCancel}
        aria-labelledby="logout-dialog-title"
        aria-describedby="logout-dialog-description"
      >
        <DialogTitle id="logout-dialog-title" color="red">Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText id="logout-dialog-description">
            Are you sure you want to logout? This will clear your session and
            local storage data.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogoutCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleLogoutConfirm} color="error" autoFocus>
            Logout
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="info">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </AppBar>
  );
};

export default Header;

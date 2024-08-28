import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
  IconButton,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { styled } from "@mui/system";

const ManageNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch("http://localhost:8082/notices/all");
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleResolve = (notification) => {
    setSelectedNotification(notification);
    setSubject(notification.noticeName);
    setDescription(notification.noticeDescription);
    setDate(notification.createdAt);
    setOpen(true);
  };

  const handleOpenConfirmDelete = (notification) => {
    setNotificationToDelete(notification);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (notificationToDelete) {
      try {
        const response = await fetch(
          `http://localhost:8082/notices/deleteNotice/${notificationToDelete.nid}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          fetchNotifications(); // Refresh the list of notifications
          toast.success("Notification deleted successfully!");
        } else {
          console.error("Error deleting notification:", response.statusText);
          toast.error("Failed to delete notification");
        }
      } catch (error) {
        console.error("Error deleting notification:", error);
        toast.error("Failed to delete notification");
      }
      setConfirmDeleteOpen(false);
      setNotificationToDelete(null);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(
        `http://localhost:8082/notices/updateNotice/${selectedNotification.nid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            noticeName: subject,
            noticeDescription: description,
            createdAt: date,
          }),
        }
      );

      if (response.ok) {
        setOpen(false);
        fetchNotifications(); // Refresh the list of notifications
        toast.success("Notification updated successfully!");
      } else {
        console.error("Error updating notification:", response.statusText);
        toast.error("Failed to update notification");
      }
    } catch (error) {
      console.error("Error updating notification:", error);
      toast.error("Failed to update notification");
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseConfirmDelete = () => {
    setConfirmDeleteOpen(false);
    setNotificationToDelete(null);
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
          marginBottom: "-2px",
        }}
      >
        Manage Notification
      </PopTypography>
      <Box sx={{ mt: 2, p: 2 }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ background: "#f2f2f2" }}>
              <TableRow>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="bold">
                    ID
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Subject
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Description
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Date
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Status
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {notifications.map((notification) => (
                <TableRow key={notification.nid}>
                  <TableCell>{notification.nid}</TableCell>
                  <TableCell>{notification.noticeName}</TableCell>
                  <TableCell>{notification.noticeDescription}</TableCell>
                  <TableCell>{notification.createdAt}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleResolve(notification)}
                    >
                      <CheckCircleIcon />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      onClick={() => handleOpenConfirmDelete(notification)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={open} className="textField-root" onClose={handleClose}>
          <PopTypography
            variant="h6"
            gutterBottom
            sx={{
              fontWeight: "bold",
              color: "#fff",
              textAlign: "center",
              backgroundColor: "#24A0ED",
              borderRadius: "150px",
              padding: "10px",
              marginRight: "150px",
              marginLeft: "150px",
              marginBottom: "-2px",
              marginTop: "10px",
            }}
          >
            Update Notification
          </PopTypography>
          <DialogContent>
            <TextField
              margin="dense"
              label="Subject"
              type="text"
              fullWidth
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Description"
              type="text"
              fullWidth
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Date"
              type="date"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleUpdate} color="primary">
              Update
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={confirmDeleteOpen} onClose={handleCloseConfirmDelete}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this notification?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseConfirmDelete} color="primary">
              Cancel
            </Button>
            <Button onClick={handleConfirmDelete} color="secondary">
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        <ToastContainer />
      </Box>
    </>
  );
};

export default ManageNotification;

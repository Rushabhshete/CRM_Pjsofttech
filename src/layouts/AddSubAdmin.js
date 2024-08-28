import React, { useState, useEffect } from 'react';
import {
  Grid,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress
} from '@mui/material';
import axios from 'axios';
import { styled } from "@mui/system";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';


const FormComponent = () => {
  const [formData, setFormData] = useState({
    subadminname: '',
    emailaddress: '',
    password: '',
    confirmpassword: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [allSubAdmins, setAllSubAdmins] = useState([]);
  const [fetchingData, setFetchingData] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
const [currentSubadmin, setCurrentSubadmin] = useState(null);
const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
const [subadminToDelete, setSubadminToDelete] = useState(null);


  const institutecode = () => localStorage.getItem("institutecode");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDeleteClick = (id) => {
    setSubadminToDelete(id);
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteConfirm = async () => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:8081/deleteSubAdmin/${subadminToDelete}`);
      setDeleteDialogOpen(false);
      fetchAllSubAdmins();
    } catch (err) {
      setError('Failed to delete subadmin.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmpassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      // Replace with your API endpoint for form submission
      await axios.post(`http://localhost:8081/saveSubAdmin?institutecode=${institutecode()}`, formData);
      setFormData({
        subadminname: '',
        emailaddress: '',
        password: '',
        confirmpassword: '',
      });

      // Fetch all subadmins after submission
      fetchAllSubAdmins();
    } catch (err) {
      setError('Failed to submit form.');
    } finally {
      setLoading(false);
    }
  };
  const handleEditClick = (subadmin) => {
    setCurrentSubadmin(subadmin);
    setFormData({
      subadminname: subadmin.subadminname,
      emailaddress: subadmin.emailaddress,
      password: '',
      confirmpassword: '',
    });
    setEditDialogOpen(true);
  };
  
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    if (formData.password !== formData.confirmpassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }
  
    try {
      await axios.put(`http://localhost:8081/updateSubAdmin/${currentSubadmin.id}`, formData);
      setEditDialogOpen(false);
      fetchAllSubAdmins();
    } catch (err) {
      setError('Failed to update subadmin.');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchAllSubAdmins = async () => {
    setFetchingData(true);
    try {
      const response = await axios.get(`http://localhost:8081/getSubAdminsByInstitutecode?institutecode=${getInstituteCode()}`);
      setAllSubAdmins(response.data);
    } catch (err) {
      setError('Failed to fetch data.');
    } finally {
      setFetchingData(false);
    }
  };

  useEffect(() => {
    // Initial fetch when the component mounts
    fetchAllSubAdmins();
  }, []);

  const getInstituteCode = () => {
    // Replace with actual logic to get institute code
    return 'Rush@gmail.com';
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
    <Box sx={{ padding: 3 }}>
    <Grid item xs={12}>
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
       Add Sub Admin 
          </PopTypography>
        </Grid>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Subadmin Name"
              name="subadminname"
              value={formData.subadminname}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Email Address"
              name="emailaddress"
              type="email"
              value={formData.emailaddress}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Confirm Password"
              name="confirmpassword"
              type="password"
              value={formData.confirmpassword}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            {error && (
              <Typography color="error" gutterBottom>
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </Button>
          </Grid>
        </Grid>
      </form>

      {fetchingData && (
        <Box sx={{ marginTop: 2 }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ marginTop: 1 }}>
            Fetching data...
          </Typography>
        </Box>
      )}

      {!fetchingData && allSubAdmins.length > 0 && (
        <Box sx={{ marginTop: 3 }}>
  
          <TableContainer component={Paper}>
            <Table>
              <TableHead style={{
            backgroundColor: "#f2f2f2",
            justifyContent: "center",
          }}>
                <TableRow>
                  <TableCell style={{ fontWeight: "bold" }}>ID</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>Sub Admin Name</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>Email Address</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>Institute Code</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {allSubAdmins.map((subadmin) => (
                 <TableRow key={subadmin.id}>
                 <TableCell>{subadmin.id}</TableCell>
                 <TableCell>{subadmin.subadminname}</TableCell>
                 <TableCell>{subadmin.emailaddress}</TableCell>
                 <TableCell>{subadmin.institutecode}</TableCell>
                 <TableCell>
                   <Button onClick={() => handleEditClick(subadmin)} color="primary" variant='contained'>
                     Edit
                   </Button>
                   <Button onClick={() => handleDeleteClick(subadmin.id)} color="error" variant="contained">
                     Delete
                   </Button>
                 </TableCell>
               </TableRow>
               
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
  <DialogTitle>Confirm Deletion</DialogTitle>
  <DialogContent>
    <Typography>Are you sure you want to delete this subadmin?</Typography>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
      Cancel
    </Button>
    <Button onClick={handleDeleteConfirm} color="secondary">
      Delete
    </Button>
  </DialogActions>
</Dialog>



<Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
  <DialogTitle>Edit Sub Admin</DialogTitle>
  <DialogContent>
    <form onSubmit={handleEditSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Subadmin Name"
            name="subadminname"
            value={formData.subadminname}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Email Address"
            name="emailaddress"
            type="email"
            value={formData.emailaddress}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Confirm Password"
            name="confirmpassword"
            type="password"
            value={formData.confirmpassword}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12}>
          {error && (
            <Typography color="error" gutterBottom>
              {error}
            </Typography>
          )}
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? 'Updating...' : 'Update'}
          </Button>
        </Grid>
      </Grid>
    </form>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setEditDialogOpen(false)} color="primary">
      Cancel
    </Button>
  </DialogActions>
</Dialog>
        </Box>
      )}
    </Box>
  );
};

export default FormComponent;

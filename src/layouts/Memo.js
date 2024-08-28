import React, { useState } from 'react';
import { MenuItem, Select, Typography, Box, TextField, Button, Grid } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//import '../css/asterick.css';
import { styled } from '@mui/system';


const Memo = React.memo(() => {
  const [option, setOption] = useState('Memo');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [email, setEmail] = useState('');

  const handleChange = (event) => {
    setOption(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubjectChange = (event) => {
    setSubject(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      ...(option === 'Memo'
        ? {email: email, memoName: subject, memoDescription: description, createdAt: date, }
        : { noticeName: subject, noticeDescription: description, createdAt: date })
    };

    let url;

    if (option === 'Memo') {
      url = 'http://localhost:8082/memos/addmemo';
    } else if (option === 'Notification') {
      url = 'http://localhost:8082/notices/addnotice';
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log('Submitted:', result);
      toast.success('Form submitted successfully!');

      // Optionally reset form fields after submission
      setEmail('');
      setSubject('');
      setDescription('');
      setDate('');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error submitting the form');
    }
  };



  return (
    <>
     <Typography
      variant="h5"
      gutterBottom
      sx={{
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        backgroundColor: '#24A0ED',
        borderRadius: '150px',
        padding: '10px',
        // marginRight:'320px',
        // marginLeft:'320px',
        marginBottom: '-2px',
        marginTop:'10px'
      }}
    >
      {option}
      </Typography>
    <div className='textField-root' sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 10 }} align='center'>
      <TextField
      select
      label='Select'
        value={option}
        onChange={handleChange}
        sx={{ mt: 3, width: '200px', height: '50px', fontSize: '16px' }}
        align='center'
      >
        <MenuItem value="Memo">Memo</MenuItem>
        <MenuItem value="Notification">Notification</MenuItem>
      </TextField>

      {option === 'Memo' && (
        <div component="form" onSubmit={handleSubmit} sx={{ width: 500, p: 2, mb: 2 }}>
          {/* <Typography variant="h5" component="div"  sx={{ mb: 2 }} align='center'>Memo</Typography> */}
          <Grid container spacing={2} mt={1} >
  <Grid item xs={12}>
    <Grid container spacing={2}>
      <Grid item xs={4}>
        <TextField
          required
          fullWidth
          label="Recipient's Email"
          value={email}
          onChange={handleEmailChange}
          InputLabelProps={{ className: 'required-asterisk' }}
        />
      </Grid>
      <Grid item xs={4}>
        <TextField
          required
          fullWidth
          type="date"
          label="Date"
          value={date}
          onChange={handleDateChange}
          InputLabelProps={{ className: "required-asterisk", shrink: true }}
        />
      </Grid>
      <Grid item xs={4}>
        <TextField
          required
          fullWidth
          label="Subject"
          value={subject}
          onChange={handleSubjectChange}
          InputLabelProps={{ className: "required-asterisk" }}
        />
      </Grid>
    </Grid>
  </Grid>
  <Grid item xs={12}>
    <TextField
      required
      fullWidth
      multiline
      rows={4}
      label="Description"
      value={description}
      onChange={handleDescriptionChange}
      InputLabelProps={{ className: "required-asterisk" }}
    />
  </Grid>
  <Grid item xs={12} sx={{ justifyContent:'center'}} align='center'>
    <Button type="submit" variant="contained" color="primary">
      Submit Memo
    </Button>
  </Grid>
</Grid>

        </div>
      )}

      {option === 'Notification' && (
        <Box component="form" onSubmit={handleSubmit} sx={{  p: 2, mb: 2 }}>
          {/* <Typography variant="h5" component="div" sx={{ mb: 2 }} align={'center'}>Notification</Typography> */}
          <Grid container spacing={2}>
  {/* Subject and Date in one line */}
  <Grid container spacing={2} mt={1}>
    <Grid item xs={6}>
      <TextField
        required
        fullWidth
        label="Subject"
        value={subject}
        onChange={handleSubjectChange}
        InputLabelProps={{ className: "required-asterisk" }}
      />
    </Grid>
    <Grid item xs={6}>
      <TextField
        required
        fullWidth
        type="date"
        label="Date"
        value={date}
        onChange={handleDateChange}
        InputLabelProps={{
          className: "required-asterisk",
          shrink: true,
        }}
      />
    </Grid>
    <Grid item xs={12}>
    <TextField
      required
      fullWidth
      multiline
      rows={4}
      label="Description"
      value={description}
      onChange={handleDescriptionChange}
      InputLabelProps={{ className: "required-asterisk" }}
    />
  </Grid>
  </Grid>

  {/* Description field */}
  

  {/* Center the button */}
  <Grid container justifyContent="center" sx={{ marginTop: 2 }}>
    <Button type="submit" variant="contained" color="primary">
      Send Notification
    </Button>
  </Grid>
</Grid>

        </Box>
      )}
       <ToastContainer />
    </div>
    </>
  );
});

export default Memo;
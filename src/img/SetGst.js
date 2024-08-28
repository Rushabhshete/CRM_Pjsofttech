// import React, { useState } from "react";
// import { TextField, Button, Typography, Grid } from "@mui/material";
// import { styled } from "@mui/system";

// const SetGst = () => {
//   const [gst, setGst] = useState("");
//   const [error, setError] = useState("");

//   const handleChange = (event) => {
//     const value = event.target.value;
//     if (value === "" || (Number(value) >= 1 && Number(value) <= 100)) {
//       setGst(value);
//       setError("");
//     } else {
//       setError("Please enter a number between 1 and 100");
//     }
//   };

//   const handleSubmit = () => {
//     if (gst === "") {
//       setError("GST percentage cannot be empty");
//     } else if (Number(gst) < 1 || Number(gst) > 100) {
//       setError("Please enter a number between 1 and 100");
//     } else {
//       setError("");
//       alert(`GST percentage set to: ${gst}%`);
//       // Add your submit logic here
//     }
//   };
//   const PopTypography = styled(Typography)`
//     @keyframes pop {
//       0% {
//         transform: scale(1);
//       }
//       50% {
//         transform: scale(1.1);
//       }
//       100% {
//         transform: scale(1);
//       }
//     }

//  
//   `;

//   return (
//     <div>
//  <PopTypography
//         variant="h5"
//         gutterBottom
//         sx={{
//           fontWeight: "bold",
//           color: "#fff",
//           textAlign: "center",
//           backgroundColor: "#24A0ED",
//           borderRadius: "150px",
//           padding: "10px",

//           marginBottom: "20px",
//         }}
//       >
//           Set GST in Percentage
//       </PopTypography>
//       <Grid container spacing={2} justifyContent="center">
//         <Grid item xs={6}></Grid>
//         <Grid item xs={7}>
//           <TextField
//             label="GST Percentage"
//             value={gst}
//             onChange={handleChange}
//             error={!!error}
//             helperText={error}
//             variant="outlined"
//             type="number"
//             inputProps={{ min: 1, max: 100 }}
//             fullWidth
//           />
//         </Grid>
//         <Grid item xs={12} textAlign="center">
//           <Button variant="contained" onClick={handleSubmit}>
//             Submit
//           </Button>
//         </Grid>
//       </Grid>
//     </div>
//   );
// };

// export default SetGst;

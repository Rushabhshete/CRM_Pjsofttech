// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { CircularProgress, Box, Paper, Typography, useTheme } from "@mui/material";
// import { Chart } from "react-google-charts";

// const SourceByGraph = () => {
//   const theme = useTheme(); // Using useTheme hook to get the theme object
//   const [chartData, setChartData] = useState([["Source", "Count"]]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchSourceData = async () => {
//       setLoading(true);
//       try {
//         const institutecode = localStorage.getItem("institutecode");
//         if (!institutecode) {
//           throw new Error("No institute code found in local storage");
//         }

//         const res = await axios.get(
//           `http://localhost:8085/getNumberOfAdmissionsBySourceAndInstitutecode?institutecode=${institutecode}`
//         );
//         const data = res.data;
//         console.log(data); // Debugging: Log API response

//         // Convert the object data to chart-friendly format
//         const formattedData = Object.entries(data).map(([source, count]) => [
//           source,
//           count,
//         ]);

//         if (formattedData.length === 0) {
//           console.log("No data to display in the chart");
//         }

//         setChartData([["Source", "Count"], ...formattedData]);
//       } catch (error) {
//         console.error("Error fetching source data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSourceData();
//   }, []);

//   if (loading) {
//     return <CircularProgress />;
//   }

//   return (
//     <Paper
//       elevation={3}
//       sx={{
//         padding: theme.spacing(2),
//         borderRadius: theme.spacing(2),
//         boxShadow: theme.shadows[3],
//         margin: theme.spacing(2),
//       }}
//     >
//       <Typography variant="h6">Admissions by Source</Typography>
//       <Box mt={2}>
//         <Chart
//           width={"100%"}
//           height={"400px"}
//           chartType="PieChart"
//           loader={<div>Loading Chart...</div>}
//           data={chartData}
//           options={{
//             title: "Admissions by Source",
//             is3D: true,
//           }}
//         />
//       </Box>
//     </Paper>
//   );
// };

// export default SourceByGraph;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { CircularProgress, Box, Paper, Typography, Grid } from "@mui/material";
import { Chart } from "react-google-charts";
//import { makeStyles } from "@mui/styles";

// const useStyles = makeStyles((theme) => ({
//   paper: {
//     padding: theme.spacing(2),
//     borderRadius: theme.spacing(2),
//     boxShadow: theme.shadows[3],
//     margin: theme.spacing(2),
//   },
// }));

const SourceByGraph = () => {
  // const classes = useStyles();
  const [chartData, setChartData] = useState([["Source", "Count"]]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSourceData = async () => {
      setLoading(true);
      try {
        const institutecode = localStorage.getItem("institutecode");
        if (!institutecode) {
          throw new Error("No institute code found in local storage");
        }

        const res = await axios.get(
          `http://localhost:8085/getNumberOfAdmissionsBySourceAndInstitutecode?institutecode=${institutecode}`
        );
        const data = res.data;
        console.log(data); // Debugging: Log API response

        // Convert the object data to chart-friendly format
        const formattedData = Object.entries(data).map(([source, count]) => [
          source,
          count,
        ]);

        if (formattedData.length === 0) {
          console.log("No data to display in the chart");
        }

        setChartData([["Source", "Count"], ...formattedData]);
      } catch (error) {
        console.error("Error fetching source data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSourceData();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div>
      {" "}
      <Typography variant="h6" align="center">Admissions by Source</Typography>{" "}
      <Paper elevation={3}>
        <Grid>
          <Chart
            width={"100%"}
            height={"400px"}
            chartType="PieChart"
            loader={<div>Loading Chart...</div>}
            data={chartData}
            options={{
              title: "Admissions by Source",
              is3D: true,
            }}
          />
        </Grid>
      </Paper>
    </div>
  );
};

export default SourceByGraph;

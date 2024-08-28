import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  CircularProgress,
  TextField,
  MenuItem,
  Paper,
  Typography,
  Grid,
} from "@mui/material";
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

const MonthlyGraph = () => {
  //const classes = useStyles();
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [chartData, setChartData] = useState([["Month", "Admissions"]]);
  const [loading, setLoading] = useState(true);
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  useEffect(() => {
    const fetchMonthlyData = async () => {
      setLoading(true);
      try {
        const institutecode = localStorage.getItem("institutecode"); // Get institute code from local storage
        const res = await axios.get(
          `http://localhost:8085/count/monthly?institutecode=${institutecode}&year=${selectedYear}`
        );

        const data = res.data;
        const months = [
          "JANUARY",
          "FEBRUARY",
          "MARCH",
          "APRIL",
          "MAY",
          "JUNE",
          "JULY",
          "AUGUST",
          "SEPTEMBER",
          "OCTOBER",
          "NOVEMBER",
          "DECEMBER",
        ];

        const formattedData = months.map((month) => [month, data[month] || 0]);

        setChartData([["Month", "Admissions"], ...formattedData]);
      } catch (error) {
        console.error("Error fetching monthly data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMonthlyData();
  }, [selectedYear]);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div >
      {" "}
      <Grid container spacing={2} justifyContent="center" className="textField-root">
      <Grid item xs={12} md={4} justifyContent="center">
        <TextField
          select
          label="Year"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          variant="outlined"
          fullWidth
        >
          {years.map((year) => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      </Grid>
      <Typography variant="h6" align="center">Monthly Admissions</Typography>

      <Paper elevation={3}>
        <Chart
          width={"100%"}
          height={"400px"}
          chartType="ColumnChart"
          loader={<div>Loading Chart...</div>}
          data={chartData}
          options={{
            // title: "Monthly Admissions",
            hAxis: { title: "Month" },
            vAxis: { title: "Number of Admissions" },
            colors: [
              "#76A7FA",
              "#FF5733",
              "#33FF57",
              "#3357FF",
              "#FF33A6",
              "#FFD700",
              "#FF6F61",
              "#8E44AD",
              "#3498DB",
              "#2ECC71",
              "#E74C3C",
            ],
          }}
          legendToggle
        />
      </Paper>
    </div>
  );
};

export default MonthlyGraph;

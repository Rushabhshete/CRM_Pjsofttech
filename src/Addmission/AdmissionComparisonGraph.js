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

const ComparisonGraph = () => {
  const currentYear = new Date().getFullYear();
  const [year1, setYear1] = useState(currentYear - 1);
  const [year2, setYear2] = useState(currentYear);
  const [chartData, setChartData] = useState([
    ["Month", `${year1}`, `${year2}`],
  ]);
  const [loading, setLoading] = useState(true);
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  useEffect(() => {
    const fetchComparisonData = async () => {
      setLoading(true);
      try {
        const institutecode = localStorage.getItem("institutecode"); // Get institute code from local storage
        const resComparison = await axios.get(
          `http://localhost:8085/count/comparison?institutecode=${institutecode}&year1=${year1}&year2=${year2}`
        );

        const data = resComparison.data;
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

        const formattedData = months.map((month) => [
          month,
          data[`${month}_${year1}`] || 0,
          data[`${month}_${year2}`] || 0,
        ]);

        setChartData([["Month", `${year1}`, `${year2}`], ...formattedData]);
      } catch (error) {
        console.error("Error fetching comparison data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComparisonData();
  }, [year1, year2]);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div>
      {" "}
      <Grid container spacing={2} justifyContent="center" className="textField-root">
        <Grid item xs={12} sm={4}>
          <TextField
            select
            label="Year From"
            value={year1}
            onChange={(e) => setYear1(e.target.value)}
            fullWidth
            variant="outlined"
          >
            {years.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            select
            label="Year To"
            value={year2}
            onChange={(e) => setYear2(e.target.value)}
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
      <Typography variant="h6" align="center">Comparison of Admissions</Typography>
      <Paper elevation={3}>
        <Chart
          width={"100%"}
          height={"400px"}
          chartType="ColumnChart"
          loader={<div>Loading Chart...</div>}
          data={chartData}
          options={{
            title: "Comparison by Month",
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

export default ComparisonGraph;

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  CircularProgress,
  TextField,
  MenuItem,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { Chart } from "react-google-charts";

const YearlyGraph = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [chartData, setChartData] = useState([["Year", "Admissions"]]);
  const [loading, setLoading] = useState(true);
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  useEffect(() => {
    const fetchYearlyData = async () => {
      setLoading(true);
      try {
        const institutecode = localStorage.getItem("institutecode"); // Get institute code from local storage
        const res = await axios.get(
          `http://localhost:8085/count/yearly?institutecode=${institutecode}&year=${selectedYear}`
        );
        const data = res.data;
        const formattedData = [
          [selectedYear.toString(), data[selectedYear.toString()]],
        ];

        setChartData([["Year", "Admissions"], ...formattedData]);
      } catch (error) {
        console.error("Error fetching yearly data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchYearlyData();
  }, [selectedYear]);

  return (
    <div>
      {" "}
      <Grid item xs={12} sm={4} className="textField-root">
        <TextField
          select
          label="Select Year"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          variant="outlined"
          margin="dense"
          fullWidth
        >
          {years.map((year) => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </TextField>
      </Grid>{" "}
      <Typography variant="h5" align="center">Yearly Admissions</Typography>
      <Paper elevation={3}>
        {loading ? (
          <div>
            <CircularProgress />
          </div>
        ) : (
          <>
            <Chart
              width={"100%"}
              height={"400px"}
              chartType="ColumnChart"
              loader={<div>Loading Chart...</div>}
              data={chartData}
              options={{
                title: "Yearly Admissions",
                hAxis: { title: "Year" },
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
          </>
        )}
      </Paper>
    </div>
  );
};

export default YearlyGraph;

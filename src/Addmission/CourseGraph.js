import React, { useEffect, useState } from "react";
import axios from "axios";
import { CircularProgress, Grid, Paper, Typography } from "@mui/material";
import { Chart } from "react-google-charts";

const CourseByGraph = () => {
  const [chartData, setChartData] = useState([["Course Name", "Count"]]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSourceByData = async () => {
      setLoading(true);
      try {
        const institutecode = localStorage.getItem("institutecode");
        if (!institutecode) {
          throw new Error("No institute code found in local storage");
        }

        const res = await axios.get(
          `http://localhost:8085/getNumberOfAdmissionsByCoursesAndInstitutecode?institutecode=${institutecode}`
        );
        const data = res.data;
        console.log(data); // Debugging: Log API response

        const formattedData = Object.entries(data).map(
          ([courseName, count]) => [courseName, count]
        );

        if (formattedData.length === 0) {
          console.log("No data to display in the chart");
        }

        setChartData([["Course Name", "Count"], ...formattedData]);
      } catch (error) {
        console.error("Error fetching course data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSourceByData();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div>
      <Typography variant="h6" align="center">Admissions by Course</Typography>

      <Paper elevation={3}>
        <Grid>
          <Chart
            width={"100%"}
            height={"400px"}
            chartType="PieChart"
            loader={<div>Loading Chart...</div>}
            data={chartData}
            options={{
              title: "Admissions by Course",
              is3D: true,
            }}
          />
        </Grid>
      </Paper>
    </div>
  );
};

export default CourseByGraph;

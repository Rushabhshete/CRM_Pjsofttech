import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Paper,
  Select,
  MenuItem,
  FormControl,
  Box,
  TextField,
} from "@mui/material";
import { styled } from "@mui/system";
import { Chart } from "react-google-charts";
import axios from "axios";
import { BarChart } from "recharts";
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
} from "recharts";

export default function DashBoard() {
  const [totalApplications, setTotalApplications] = useState(0);
  const [selectedApi, setSelectedApi] = useState("All");
  const [numberFromApi, setNumberFromApi] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dateRangeInquiriesCount, setDateRangeInquiriesCount] = useState(0);
  // const [adminemail, setAdminemail]=useState(localStorage.getItem('loggedInUserEmail') || '');
  const [institutecode, setInstituteCode] = useState(
    localStorage.getItem("institutecode") || ""
  );

  const fetchEnquiriesByDateRange = async () => {
    if (startDate && endDate) {
      try {
        const response = await axios.get(
          `http://localhost:8086/get/getALLEnquiryByInstitutecode?institutecode=${institutecode}`
        );
        const data = response.data;
        const filteredEnquiries = data.filter((enquiry) => {
          const enquiryDate = new Date(enquiry.enquiryDate)
            .toISOString()
            .split("T")[0];
          return enquiryDate >= startDate && enquiryDate <= endDate;
        });
        const examCount = {};
        setExamData(
          Object.entries(examCount).map(([ex, count]) => [ex, count])
        );
        const sourceCount = {};
        filteredEnquiries.forEach((enquiry) => {
          const sr = enquiry.source_by;
          if (sr) {
            sourceCount[sr] = (sourceCount[sr] || 0) + 1;
          }
        });
        setSourceData(
          Object.entries(sourceCount).map(([sr, count]) => [sr, count])
        );

        setDateRangeInquiriesCount(filteredEnquiries.length);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  useEffect(() => {
    fetchEnquiriesByDateRange();
  }, [startDate, endDate, institutecode]);

  const handleDateChange = (e) => {
    if (e.target.name === "startDate") {
      setStartDate(e.target.value);
    } else if (e.target.name === "endDate") {
      setEndDate(e.target.value);
    }
  };

  const fetchTotalEnquiries = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8086/get/getALLEnquiryByInstitutecode?institutecode=${institutecode}`
      );
      setNumberFromApi(response.data.totalEnquiries);
    } catch (error) {
      console.error("Error fetching total enquiries:", error);
    }
  };

  useEffect(() => {
    if (selectedApi === "All") {
      fetchTotalEnquiries();
    } else {
      fetch(apiUrls[selectedApi])
        .then((response) => response.json())
        .then((data) => {
          console.log("Data from selected API:", data);
          setNumberFromApi(data);
        })
        .catch((error) => {
          console.error("Error fetching data from selected API:", error);
        });
    }
  }, [selectedApi]);

  const apiUrls = {
    "7Days": `http://localhost:8086/numberOfEnquiry7days?institutecode=${institutecode}`,
    "30Days": `http://localhost:8086/numberOfEnquiry30days?institutecode=${institutecode}`,
    "365Days": `http://localhost:8086/numberOfEnquiry365days?institutecode=${institutecode}`,
  };

  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  useEffect(() => {
    const apiUrl = `http://localhost:8086/getenquiryCount?institutecode=${institutecode}`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        console.log("Data from getAll:", data);
        setTotalApplications(data);

        // Assuming `data` directly gives you the total applications count
      })
      .catch((error) => {
        console.error("Error fetching data from getEnquiryCount:", error);
      });
  }, [institutecode]); // Added adminemail to the dependency array

  const [sevenDaysApplication, setSevenDaysApplication] = useState(0);
  useEffect(() => {
    const apiUrl = `http://localhost:8086/numberOfEnquiry7days?institutecode=${institutecode}`;
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        console.log("Data from get7days:", data);
        setSevenDaysApplication(data);
      })
      .catch((error) => {
        console.error("Error fetching data from getAllFees:", error);
      });
  }, [institutecode]);

  const [thirtyDaysApplication, setThirtyDaysApplication] = useState(0);

  useEffect(() => {
    const apiUrl = `http://localhost:8086/numberOfEnquiry30days?institutecode=${institutecode}`;
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        console.log("Data from get30days:", data);
        setThirtyDaysApplication(data);
      })
      .catch((error) => {
        console.error("Error fetching data from getAllFees:", error);
      });
  }, [institutecode]);

  const [threeSixtyFiveDaysApplication, setThreeSixtyFiveDaysApplication] =
    useState(0);

  useEffect(() => {
    const apiUrl = `http://localhost:8086/numberOfEnquiry365days?institutecode=${institutecode}`;
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        console.log("Data from get365days:", data);
        setThreeSixtyFiveDaysApplication(data);
      })
      .catch((error) => {
        console.error("Error fetching data from getAllFees:", error);
      });
  }, [institutecode]);

  const [examData, setExamData] = useState([]);
  const [sourceData, setSourceData] = useState([]);

  const [selectedPeriod, setSelectedPeriod] = useState("Last 7 Days");

  const handlePeriodChange = (event) => {
    setSelectedPeriod(event.target.value);
  };

  const periodData = () => {
    switch (selectedPeriod) {
      case "Today":
        return [
          {
            name: "Total Enquiries",
            total: totalApplications,
            period: todaysApplications,
          },
        ];

      case "Last 7 Days":
        return [
          {
            name: "Total Enquiries",
            total: totalApplications,
            period: sevenDaysApplication,
          },
        ];
      case "Last 30 Days":
        return [
          {
            name: "Total Enquiries",
            total: totalApplications,
            period: thirtyDaysApplication,
          },
        ];
      case "Last 365 Days":
        return [
          {
            name: "Total Enquiries",
            total: totalApplications,
            period: threeSixtyFiveDaysApplication,
          },
        ];
      default:
        return [];
    }
  };

  const [todaysApplications, setTodaysApplications] = useState(0);
  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        // Fetch today's enquiry count directly
        const todaysResponse = await axios.get(
          `http://localhost:8086/getenquiryCount/today?institutecode=${institutecode}`
        );
        setTodaysApplications(todaysResponse.data);
        console.log("Data from todays:", todaysResponse.data);
        // Fetch all enquiries to calculate exam and source counts
        const allEnquiriesResponse = await axios.get(
          `http://localhost:8086/get/getALLEnquiryByInstitutecode?institutecode=${institutecode}`
        );
        const allEnquiriesData = allEnquiriesResponse.data;
        setTotalApplications(allEnquiriesData.length); // Assuming you want the total count of all enquiries

        // Count exams
        const examCount = {};
        allEnquiriesData.forEach((enquiry) => {
          const ex = enquiry.exam;
          if (ex) {
            examCount[ex] = (examCount[ex] || 0) + 1;
          }
        });
        setExamData(
          Object.entries(examCount).map(([ex, count]) => [ex, count])
        );

        // Count sources
        const sourceCount = {};
        allEnquiriesData.forEach((enquiry) => {
          const sr = enquiry.source_by;
          if (sr) {
            sourceCount[sr] = (sourceCount[sr] || 0) + 1;
          }
        });
        setSourceData(
          Object.entries(sourceCount).map(([sr, count]) => [sr, count])
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchEnquiries();
  }, [institutecode]);

  const examChartData = [
    ["Exam", "Enquiry Count", { role: "style" }],
    ...(examData.length
      ? examData.map(([ex, count], index) => {
          const colors = [
            "#90EE90",
            "#FF6F61",

            "#33FF57",
            "#3357FF",
            "#FF33A6",
            "#FFD700",
            "#FF6F61",
            "#8E44AD",
            "#3498DB",
            "#2ECC71",
            "#E74C3C",
          ];
          return [ex, count, colors[index % colors.length]];
        })
      : [["No Data", 0, "color:#DDD"]]),
  ];

  const examChartOptions = {
    label: { title: "Enquiry Count" },
    xAxis: {
      title: "Enquiry Count",
      ticks: Array.from(
        { length: Math.max(...examData.map(([_, count]) => count)) + 1 },
        (_, i) => i
      ),
    },
    yAxis: { title: "Exam" },
    legend: "none",
    chartArea: { width: "70%", height: "70%" },
    bar: { groupWidth: "75%" },
  };

  const sourceChartData = [
    ["Source By", "Enquiry Count", { role: "style" }],
    ...(sourceData.length
      ? sourceData.map(([sr, count], index) => {
          const colors = [
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
          ];
          return [sr, count, colors[index % colors.length]];
        })
      : [["No Data", 0, "color:#DDD"]]),
  ];

  const sourceChartOptions = {
    xAxis: {
      title: "Enquiry Count",
      ticks: Array.from(
        { length: Math.max(...sourceData.map(([_, count]) => count)) + 1 },
        (_, i) => i
      ),
    },
    yAxis: { title: "Sourcen By" },
    legend: "none",
    chartArea: { width: "70%", height: "70%" },
    bar: { groupWidth: "75%" },
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
    <Container maxWidth="false" sx={{ padding: 2, width: "100%" }}>
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
        Enquiry Dashboard
      </PopTypography>
      <Box mt={1} textAlign="center" sx={{ width: "100%" }}>
        <Grid container spacing={1} justifyContent="center" className="textField-root">
          <Grid item xs={2.4}>
            <Paper
              elevation={3}
              style={{
                padding: "16px",
                backgroundColor: "#FFCCCB",
                borderRadius: "10px",
              }}
            >
              <Typography variant="h6" mt={1}>
                Today
              </Typography>
              <Typography variant="h4">{todaysApplications}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={2.4}>
            <Paper
              elevation={3}
              style={{
                padding: "16px",
                backgroundColor: "#FF6F61",
                borderRadius: "10px",
              }}
            >
              <Typography variant="h6" mt={1}>
                Last 7 Days
              </Typography>
              <Typography variant="h4">{sevenDaysApplication}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={2.4}>
            <Paper
              elevation={3}
              style={{
                padding: "16px",
                backgroundColor: "#3498DB",
                borderRadius: "10px",
              }}
            >
              <Typography variant="h6" mt={1}>
                Last 30 Days
              </Typography>
              <Typography variant="h4">{thirtyDaysApplication}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={2.4}>
            <Paper
              elevation={3}
              style={{
                padding: "16px",
                backgroundColor: "#9ACD32",
                borderRadius: "10px",
              }}
            >
              <Typography variant="h6" mt={1}>
                Last 365 Days
              </Typography>
              <Typography variant="h4">
                {threeSixtyFiveDaysApplication}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={2.4}>
            <Paper
              elevation={3}
              style={{
                padding: "16px",
                backgroundColor: "#F4C431",
                borderRadius: "10px",
              }}
            >
              <Typography variant="h6" mt={1}>
                Total Enquiries
              </Typography>
              <Typography variant="h4">{totalApplications}</Typography>
            </Paper>
          </Grid>
        </Grid>

        <Grid
          mt={4}
          align={"left"}
          display={"inline-flex"}
          padding={"2%"}
          fullWidth
          sx={{ border: "0.5px solid lightgray", borderRadius: "12px" }}
        >
          <Typography variant="h6" gutterBottom mr={3}>
            <strong>Custom Dates</strong>
          </Typography>
          <Grid item xs={12} sm={6} className="textField-root">
            <TextField
              type="date"
              name="startDate"
              label="Start Date"
              InputLabelProps={{ shrink: true }}
              value={startDate}
              onChange={handleDateChange}
              size="small"
              variant="outlined"
            />
            <TextField
              type="date"
              name="endDate"
              label="End Date"
              InputLabelProps={{ shrink: true }}
              value={endDate}
              onChange={handleDateChange}
              size="small"
              variant="outlined"
            />
          </Grid>
          <Typography variant="h6" ml={4}>
            Enquiries: <strong>{dateRangeInquiriesCount}</strong>
          </Typography>
        </Grid>

        <Grid container mt={1} spacing={3} justifyContent="center">
          <Grid item xs={12} md={6}>
            <Paper elevation={3} style={{ padding: "16px" }}>
              <Typography variant="h6">Exam Chart</Typography>
              <Chart
                chartType="ColumnChart"
                data={examChartData}
                options={examChartOptions}
                width="100%"
                height="400px"
              />
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={3} style={{ padding: "16px" }}>
              <Typography variant="h6">Source Chart</Typography>
              <Chart
                chartType="ColumnChart"
                data={sourceChartData}
                options={sourceChartOptions}
                width="100%"
                height="400px"
              />
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
  <Box
    sx={{
      border: 1,
      borderColor: "lightgray",
      borderRadius: 2,
      boxShadow: 3,
      padding: 2,
      display: "flex", // Make the Box a flex container
      flexDirection: "column", // Align items vertically
      alignItems: "center", // Center items horizontally
      justifyContent: "center", // Center items vertically
    }}
  >
    <Grid
      item
      xs={12}
      sm={6}
      sx={{
        display: "flex", // Make the Grid a flex container
        justifyContent: "center", // Center TextField horizontally
      }}
      className="textField-root"
    >
      <TextField
        select
        fullWidth
        value={selectedPeriod}
        onChange={handlePeriodChange}
        label="select"
      >
        <MenuItem value="Today">Today</MenuItem>
        <MenuItem value="Last 7 Days">Last 7 Days</MenuItem>
        <MenuItem value="Last 30 Days">Last 30 Days</MenuItem>
        <MenuItem value="Last 365 Days">Last 365 Days</MenuItem>
      </TextField>
    </Grid>
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={periodData()}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="total" fill="#90EE90" name="Total Enquiries" />
        <Bar dataKey="period" fill="#FF6F61" name={selectedPeriod} />
      </BarChart>
    </ResponsiveContainer>
  </Box>
</Grid>


          <Grid item xs={12} md={6}></Grid>
        </Grid>
      </Box>
    </Container>
  );
}

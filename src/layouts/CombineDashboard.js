import React, { useState, useEffect } from "react";
import {
  Typography,
  Grid,
  Paper,
  MenuItem,
  FormControl,
  Box,
  TextField,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { BarChart } from "recharts";
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  Bar,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { Chart } from "react-google-charts";
import ComparisonGraph from "../Addmission/AdmissionComparisonGraph"
import { styled } from "@mui/system";
import IncomeCombineDash from "./IncomeCombineDash";

export default function CombineDashboard() {
  //admission
  const [data, setData] = useState({
    todayCount: 0,
    totalCount: 0,
    todayRevenue: 0,
    totalRevenue: 0,
  });
  const currentYear = new Date().getFullYear();
  const [chartData, setChartData] = useState([["Year", "Admissions"]]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          { data: todayCount },
          { data: totalCount },
          { data: todayRevenue },
          { data: totalRevenue },
        ] = await Promise.all([
          axios.get(
            `http://localhost:8085/getAdmissionsByTodayCount?institutecode=${institutecode}`
          ),
          axios.get(
            `http://localhost:8085/TotalAdmission?institutecode=${institutecode}`
          ),
          axios.get(
            `http://localhost:8085/AdmissionInToDaysRevenue?institutecode=${institutecode}`
          ),
          axios.get(
            `http://localhost:8085/TotalAdmissionRevenue?institutecode=${institutecode}`
          ),
        ]);

        setData({
          todayCount,
          totalCount,
          todayRevenue,
          totalRevenue,
        });
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);
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

  // enquiry dashboard
  const [totalApplications, setTotalApplications] = useState(0);
  const [selectedApi, setSelectedApi] = useState("All");
  const [numberFromApi, setNumberFromApi] = useState(0);
  const [institutecode, setInstituteCode] = useState(
    localStorage.getItem("institutecode") || ""
  );

  const defaultYearlyData = [
    ["Year", "Admissions"],
    ["No Data", 0],
  ];

  // income dashboard

  // Generate the last 10 years for the year dropdown
  const years = Array.from(
    new Array(10),
    (val, index) => new Date().getFullYear() - index
  );

  // enquiry dashboard
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

        // Count sources
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchEnquiries();
  }, [institutecode]);
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
    <div >
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
        Main Dashboard
      </PopTypography>
      <IncomeCombineDash />
      <Grid container spacing={2} justifyContent="center">
        {/* Enquiry Dashboard */}
        <Grid item xs={12} md={6}>
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      width: "100%",
    }}
  >
    <Box
      sx={{
        flexGrow: 1,
        height: "1px",
        backgroundColor: "#0D47A1",
      }}
    />
    <Typography variant="h6" sx={{ margin: "0 10px" }}>
      <b>Enquiry</b>
    </Typography>
    <Box
      sx={{
        flexGrow: 1,
        height: "1px",
        backgroundColor: "#0D47A1",
      }}
    />
  </Box>
          <Box
            sx={{
              width: "100%",
              padding: 2,
              border: "1px solid lightgray",
              borderRadius: 2,
            }}
          >
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    backgroundColor: "#F4C431",
                    padding: 2,
                    borderRadius: "10px",
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h6">Today</Typography>
                  <Typography variant="h4">{todaysApplications}</Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: "#FF6F61",
                    padding: 2,
                    borderRadius: "10px",
                    mt: 2,
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h6">Last 7</Typography>
                  <Typography variant="h4">{sevenDaysApplication}</Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    backgroundColor: "#3498DB",
                    padding: 2,
                    borderRadius: "10px",
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h6">Last 30</Typography>
                  <Typography variant="h4">{thirtyDaysApplication}</Typography>
                </Box>
                <Paper
                  sx={{
                    backgroundColor: "#9ACD32",
                    padding: 2,
                    borderRadius: "10px",
                    mt: 2,
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h6">Total</Typography>
                  <Typography variant="h4">{totalApplications}</Typography>
                </Paper>
              </Grid>
            </Grid>

           <Box 
  sx={{ 
    marginTop: 2, 
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center" 
  }}
>
  <Grid container justifyContent="center">
    <Grid 
      item 
      xs={12} 
      sm={4} 
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
  </Grid>

  <Typography 
    variant="h6" 
    align="center" 
 
  >
    Comparison of Enquiries
  </Typography>

  <Box 
    sx={{ 
      border: 1, 
      borderColor: "lightgray", 
      borderRadius: 2, 
      boxShadow: 3, 
      padding: 1, 
  
      width: "100%", 
     
    }}
  >
    <ResponsiveContainer width="100%" height={385}>
      <BarChart data={periodData()}>
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
</Box>
</Box>
        </Grid>
        {/* Enquiry Dashboard end */}

        {/* Admission Dashboard */}
        <Grid item xs={12} md={6}>
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      width: "100%",
    }}
  >
    <Box
      sx={{
        flexGrow: 1,
        height: "1px",
        backgroundColor: "#0D47A1",
      }}
    />
    <Typography variant="h6" sx={{ margin: "0 10px" }}>
      <b>Admission</b>
    </Typography>
    <Box
      sx={{
        flexGrow: 1,
        height: "1px",
        backgroundColor: "#0D47A1",
      }}
    />
  </Box>
          <Box
            sx={{
              width: "100%",
              padding: 2,
              border: "1px solid lightgray",
              borderRadius: 2,
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    backgroundColor: "#F4C431",
                    padding: 2,
                    borderRadius: "10px",
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h6">Today's Admissions</Typography>
                  <Typography variant="h4">{data.todayCount}</Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: "#FF6F61",
                    padding: 2,
                    borderRadius: "10px",
                    mt: 2,
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h6">Today's Revenue</Typography>
                  <Typography variant="h4">{data.todayRevenue}</Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    backgroundColor: "#3498DB",
                    padding: 2,
                    borderRadius: "10px",
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h6">Total Admissions</Typography>
                  <Typography variant="h4">{data.totalCount}</Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: "#9ACD32",
                    padding: 2,
                    borderRadius: "10px",
                    mt: 2,
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h6">Total Revenue</Typography>
                  <Typography variant="h4">{data.totalRevenue}</Typography>
                </Box>
              </Grid>
            </Grid>

            <Box sx={{ marginTop: 2 }}>
          
              <ComparisonGraph />
            </Box>
          </Box>
        </Grid>
        {/* Admission Dashboard end */}
      </Grid>
    </div>
  );
};

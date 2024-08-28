
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Paper, Typography, Grid, CircularProgress, Container } from "@mui/material";
import ComparisonGraph from "./AdmissionComparisonGraph";
import MonthlyGraph from "./AdmissionMonthlyGraph";
import YearlyGraph from "./YearlyGraph";
import SourceGraph from "./Sourcegraph";
import CourseGraph from "./CourseGraph";
import { styled } from "@mui/system";


const Dashboard = () => {
  // Count States
  const [admissionsToday, setAdmissionsToday] = useState(null);
  const [admissions7Days, setAdmissions7Days] = useState(null);
  const [admissions30Days, setAdmissions30Days] = useState(null);
  const [admissions365Days, setAdmissions365Days] = useState(null);
  const [totalAdmissions, setTotalAdmissions] = useState(null);
  // Revenue States
  const [ToDaysRevenue, setToDaysRevenue] = useState(null);
  const [revenue7Days, setRevenue7Days] = useState(null);
  const [revenue30Days, setRevenue30Days] = useState(null);
  const [revenue365Days, setRevenue365Days] = useState(null);
  const [totalRevenue, setTotalRevenue] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const institutecode = () => localStorage.getItem("institutecode");

  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        try {
            const [
                resToday,
                res7Days,
                res30Days,
                res365Days,
                resTotal,
                resToDaysRevenue,
                resRevenue7Days,
                resRevenue30Days,
                resRevenue365Days,
                resTotalRevenue,
            ] = await Promise.all([
                axios.get(`http://localhost:8085/getAdmissionsByTodayCount?institutecode=${institutecode()}`),
                axios.get(`http://localhost:8085/getAdmissionsBy7daysCount?institutecode=${institutecode()}`),
                axios.get(`http://localhost:8085/getAdmissionsBy30DaysCount?institutecode=${institutecode()}`),
                axios.get(`http://localhost:8085/getAdmissionsBy365DaysCount?institutecode=${institutecode()}`),
                axios.get(`http://localhost:8085/TotalAdmission?institutecode=${institutecode()}`),
                axios.get(`http://localhost:8085/AdmissionInToDaysRevenue?institutecode=${institutecode()}`),
                axios.get(`http://localhost:8085/AdmissionIn7DaysRevenue?institutecode=${institutecode()}`),
                axios.get(`http://localhost:8085/AdmissionIn30DaysRevenue?institutecode=${institutecode()}`),
                axios.get(`http://localhost:8085/AdmissionIn365DaysRevenue?institutecode=${institutecode()}`),
                axios.get(`http://localhost:8085/TotalAdmissionRevenue?institutecode=${institutecode()}`),
            ]);

            // Update state with fetched data or default to 0 if null/undefined
            setAdmissionsToday(resToday.data || 0);
            setAdmissions7Days(res7Days.data || 0);
            setAdmissions30Days(res30Days.data || 0);
            setAdmissions365Days(res365Days.data || 0);
            setTotalAdmissions(resTotal.data || 0);

            setToDaysRevenue(resToDaysRevenue.data || 0);
            setRevenue7Days(resRevenue7Days.data || 0);
            setRevenue30Days(resRevenue30Days.data || 0);
            setRevenue365Days(resRevenue365Days.data || 0);
            setTotalRevenue(resTotalRevenue.data || 0);

        } catch (error) {
            console.error("Error fetching data:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    fetchData();
}, []);


  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Typography color="error">{error}</Typography>
      </div>
    );
  }

  const data = [
    // Count Data
    { label: "Todays Admission", value: admissionsToday || 0, color: "#FFCCCB" }, // Green
    { label: "7Days Admissions  ", value: admissions7Days || 0, color: "#FF6F61" }, // Amber
    { label: "30Days Admissions", value: admissions30Days || 0, color: "#3498DB" }, // Light Blue
    { label: "365Days Admissions", value: admissions365Days || 0, color: "#9ACD32" }, // Pink
    { label: "Total Admissions", value: totalAdmissions || 0, color: "#F4C431" }, // Purple
    
    // Revenue Data
    { label: "Todays Revenue ", value: ToDaysRevenue || 0, color: "#FFCCCB" }, // Deep Orange
    { label: "7 DaysRevenue", value: revenue7Days || 0, color: "#FF6F61" }, // Teal
    { label: "30 Days Revenue", value: revenue30Days || 0 , color: "#3498DB" }, // Indigo
    { label: "365 Days Revenue", value: revenue365Days || 0, color: "#9ACD32" }, // Brown
    { label: "Total Revenue", value: totalRevenue || 0, color : "#F4C431" }, // Orange
  ];
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
    <div maxWidth="xl" style={{ padding: '2px' }}>
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
        Admission Dashboard
      </PopTypography>
      <Grid container spacing={2} alignItems="flex-end" justifyContent="center">
        {data.map((item, index) => (
          <Grid key={index} item  xs={12} sm={6} md={2.4}>
            <Paper elevation={3} style={{ padding: '16px', textAlign: 'center', backgroundColor: item.color ,   borderRadius: 10,}}>
              <Typography variant="h6">{item.label}</Typography>
              <Typography variant="h4">{item.value !== null ? item.value : 0}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={1} style={{ marginTop: '16px' }}>
        <Grid item xs={12} md={6} style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
          <Paper style={{ padding: '16px', boxShadow: '0px 2px 5px rgba(0,0,0,0.2)', width: '100%' }}>
            <MonthlyGraph />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
          <Paper style={{ padding: '16px', boxShadow: '0px 2px 5px rgba(0,0,0,0.2)', width: '100%' }}>
            <ComparisonGraph />
          </Paper>
        </Grid>
        <Grid item xs={12} style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
          <Paper style={{ padding: '16px', boxShadow: '0px 2px 5px rgba(0,0,0,0.2)', width: '100%' }}>
            <YearlyGraph />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
          <Paper style={{ padding: '16px', boxShadow: '0px 2px 5px rgba(0,0,0,0.2)', width: '100%' }}>
            <SourceGraph />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
          <Paper style={{ padding: '16px', boxShadow: '0px 2px 5px rgba(0,0,0,0.2)', width: '100%' }}>
            <CourseGraph />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;

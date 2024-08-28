import React, { useState, useEffect, useCallback } from "react";
import {
  Typography,
  Grid,
  Paper,
  MenuItem,
  FormControl,
  Box,
  TextField,
} from "@mui/material";
import CountUp from "react-countup";

import { Chart } from "react-google-charts";
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
import { Line, Pie } from "react-chartjs-2";
export default function IncomeCombineDash() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [incomeData, setIncomeData] = useState({});
  const [expenseData, setExpenseData] = useState({});
  const [savingsData, setSavingsData] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState([]);
  const [monthlyExpense, setMonthlyExpense] = useState([]);
  const institutecode = localStorage.getItem("institutecode") || "";
  // const [year, setSelectedYear] = useState(new Date().getFullYear());

  const fetchIncomeData = useCallback(async () => {
    try {
      console.log("Fetching income data...");
      const response = await axios.get(
        `http://localhost:8087/dashboard/incomes/totals?institutecode=${institutecode}`
      );
      console.log("Income data response:", response);
      setIncomeData(response.data);
    } catch (error) {
      console.error("Error fetching income data:", error);
    }
  }, [institutecode]);

  const formattedCountUp = (value) => (
    <CountUp end={value} duration={2.5} formattingFn={formatValue} />
  );

  const years = Array.from(
    new Array(10),
    (val, index) => new Date().getFullYear() - index
  );
  const fetchExpenseData = useCallback(async () => {
    try {
      console.log("Fetching expense data...");
      const response = await axios.get(
        `http://localhost:8087/dashboard/expenses/totals?institutecode=${institutecode}`
      );
      console.log("Expense data response:", response);
      setExpenseData(response.data);
    } catch (error) {
      console.error("Error fetching expense data:", error);
    }
  }, [institutecode]);

  const fetchSavingsData = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:8087/dashboard/savings?institutecode=${institutecode}`
      );
      setSavingsData(response.data);
    } catch (error) {
      console.error("Error fetching savings data:", error);
    }
  }, [institutecode]);
  useEffect(() => {
    fetchIncomeData();
    fetchExpenseData();
    fetchSavingsData();
  }, [fetchIncomeData, fetchExpenseData, fetchSavingsData]);
  const fetchMonthlyData = useCallback(async () => {
    try {
      const [incomeResponse, expenseResponse] = await Promise.all([
        axios.get(
          `http://localhost:8087/income/total-monthly?year=${year}&institutecode=${institutecode}`
        ),
        axios.get(
          `http://localhost:8087/expense/total-monthly?year=${year}&institutecode=${institutecode}`
        ),
      ]);

      const incomeArray = Array(12).fill(0);
      const expenseArray = Array(12).fill(0);

      Object.keys(incomeResponse.data).forEach((month) => {
        incomeArray[month - 1] = incomeResponse.data[month];
      });

      Object.keys(expenseResponse.data).forEach((month) => {
        expenseArray[month - 1] = expenseResponse.data[month];
      });

      setMonthlyIncome(incomeArray);
      setMonthlyExpense(expenseArray);
    } catch (error) {
      console.error("Error fetching monthly data:", error);
    }
  }, [year, institutecode]);

  useEffect(() => {
    fetchMonthlyData();
  }, [fetchMonthlyData]);
  // Determine text for savings/loss card
  const savingsText = savingsData >= 0 ? "Saving" : "Loss";
  const todaytext =
    incomeData.today - expenseData.today >= 0 ? "Saving" : "Loss";

  // Format data values with commas
  const formatValue = (value) => Math.abs(value).toLocaleString();

  // Data for the overall comparison chart

  // Data for the monthly chart
  const monthlyData = {
    labels: [
      "Jan",
      "Feb",
      "March",
      "April",
      "May",
      "June",
      "July",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Income",
        data: monthlyIncome,
        borderColor: "#90EE90",
        backgroundColor: "#90EE90",
        fill: false,
        tension: 0.1,
      },
      {
        label: "Expense",
        data: monthlyExpense,
        borderColor: "#FF6F61",
        backgroundColor: "#FF6F61",
        fill: false,
        tension: 0.1,
      },
    ],
  };

  const monthlyOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return (
              tooltipItem.dataset.label +
              ": " +
              tooltipItem.raw.toLocaleString()
            );
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
  const overallData = [
    {
      category: "Today's",
      Income: incomeData.today || 0,
      Expense: expenseData.today || 0,
    },
    {
      category: "7 Day's",
      Income: incomeData.last7Days || 0,
      Expense: expenseData.last7Days || 0,
    },
    {
      category: "30 Day's",
      Income: incomeData.last30Days || 0,
      Expense: expenseData.last30Days || 0,
    },
    {
      category: "365 Day's",
      Income: incomeData.last365Days || 0,
      Expense: expenseData.last365Days || 0,
    },
    {
      category: "Total",
      Income: incomeData.total || 0,
      Expense: expenseData.total || 0,
    },
  ];

  const overallOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return (
              tooltipItem.dataset.label +
              ": " +
              tooltipItem.raw.toLocaleString()
            );
          },
        },
      },
    },
  };
  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  return (
    <div>
      {/* Income Expense Dashboard */}
      <Grid item align="center">
                <Typography variant="h6" >
                  <b>Income & Expense</b>
                </Typography>
              </Grid>
      <Grid item xs={12}>
        <Box
          sx={{
            width: "100%",
            height: "100%",
            margin: "auto",
            padding: 4,
            border: "1px solid lightgray",
            borderRadius: 2,
            marginTop: "10px",
          }}
        >
          <Grid container spacing={2} justifyContent="center" wrap="nowrap">
            <Grid item xs={12} sm={6} md={2.4}>
              <Paper
                elevation={3}
                style={{
                  padding: "16px",
                  backgroundColor: "#FF6F61",
                  borderRadius: "10px",
                }}
              >
                <Typography variant="h7">Today's Income</Typography>
                <Typography variant="h4">
                  ₹{formattedCountUp(incomeData.today || 0)}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <Paper
                elevation={3}
                style={{
                  padding: "16px",
                  backgroundColor: "#3498DB",
                  borderRadius: "10px",
                }}
              >
                <Typography variant="h7">Total Income</Typography>
                <Typography variant="h4">
                  ₹{formattedCountUp(incomeData.total || 0)}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <Paper
                elevation={3}
                style={{
                  padding: "16px",
                  backgroundColor: "#9ACD32",
                  borderRadius: "10px",
                }}
              >
                <Typography variant="h7">Today's Expense</Typography>
                <Typography variant="h4">
                  ₹{formattedCountUp(expenseData.today || 0)}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <Paper
                elevation={3}
                style={{
                  padding: "16px",
                  backgroundColor: "#F4C431",
                  borderRadius: "10px",
                }}
              >
                <Typography variant="h7">Total Expense</Typography>
                <Typography variant="h4">
                  ₹{formattedCountUp(expenseData.total || 0)}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <Paper
                elevation={3}
                style={{
                  padding: "16px",
                  backgroundColor: "#E0F2F1 ",
                  borderRadius: "10px",
                }}
              >
                <Typography variant="h7">Today's {todaytext}</Typography>
                <Typography
                  variant="h4"
                  className={incomeData.today - expenseData.today >= 0}
                >
                  ₹{formattedCountUp(incomeData.today - expenseData.today)}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <Paper
                elevation={3}
                style={{
                  padding: "16px",
                  backgroundColor: "#009688",
                  borderRadius: "10px",
                }}
              >
                <Typography variant="h7">Total {savingsText}</Typography>
                <Typography variant="h4" className={savingsData >= 0}>
                  ₹{formattedCountUp(savingsData)}
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Chart Section */}
          <Grid
            container
            spacing={2}
            sx={{ marginTop: "20px", justifyContent: "space-between" }}
          >
            <Grid item xs={6} sx={{ height: "400px" }}>
              <Typography variant="h6" align="center">
                Overall Income & Expense Comparison
              </Typography>
              <ResponsiveContainer width="100%" height="100%">
        
                <BarChart data={overallData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Income" fill="#90EE90" />
                  <Bar dataKey="Expense" fill="#FF6F61" />
                </BarChart>
          
              </ResponsiveContainer>
            </Grid>

            <Grid item xs={6} className="textField-root" >
              <TextField
                select
                label="Year"
                value={year}
                onChange={handleYearChange}
                sx={{ marginTop: "-20px" }}
              >
                {years.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </TextField>
              <Typography variant="h6" align="center" mt={-4}>
                {year} Income & Expense Comparison
              </Typography>
              <Grid item  sx={{ height: "400px" }}>
              <ResponsiveContainer width="100%" height="100%">
             
                <Line data={monthlyData} options={monthlyOptions} />
             </ResponsiveContainer>
             </Grid>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Paper,
  TextField,
  MenuItem,
} from "@mui/material";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
} from "chart.js";
import { Bar, Line, Pie } from "react-chartjs-2";
import "./Design.css";

// Register ChartJS components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement
);

const Dashboard = () => {
  const [view, setView] = useState("income");
  const [year, setYear] = useState(new Date().getFullYear());
  const [incomeData, setIncomeData] = useState({});
  const [expenseData, setExpenseData] = useState({});
  const [savingsData, setSavingsData] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState([]);
  const [monthlyExpense, setMonthlyExpense] = useState([]);
  const [incomeCategories, setIncomeCategories] = useState([]);
  const [expenseCategories, setExpenseCategories] = useState([]);
  const getEmail = () => localStorage.getItem("APIemail");
  useEffect(() => {
    const fetchIncomeData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8087/dashboard/incomes/totals?email=${getEmail()}`
        );
        const data = await response.json();
        setIncomeData(data);
      } catch (error) {
        console.error("Error fetching income data:", error);
      }
    };

    const fetchExpenseData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8087/dashboard/expenses/totals?email=${getEmail()}`
        );
        const data = await response.json();
        setExpenseData(data);
      } catch (error) {
        console.error("Error fetching expense data:", error);
      }
    };

    const fetchSavingsData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8087/dashboard/savings?email=${getEmail()}`
        );
        const data = await response.json();
        setSavingsData(data);
      } catch (error) {
        console.error("Error fetching savings data:", error);
      }
    };

    const fetchMonthlyIncome = async () => {
      try {
        const response = await fetch(
          `http://localhost:8087/income/total-monthly?year=${year}&adminemail=${getEmail()}`
        );
        const data = await response.json();
        const incomeArray = Array(12).fill(0);
        Object.keys(data).forEach((month) => {
          incomeArray[month - 1] = data[month];
        });
        setMonthlyIncome(incomeArray);
      } catch (error) {
        console.error("Error fetching monthly income data:", error);
      }
    };

    const fetchMonthlyExpense = async () => {
      try {
        const response = await fetch(
          `http://localhost:8087/expense/total-monthly?year=${year}&adminemail=${getEmail()}`
        );
        const data = await response.json();
        const expenseArray = Array(12).fill(0);
        Object.keys(data).forEach((month) => {
          expenseArray[month - 1] = data[month];
        });
        setMonthlyExpense(expenseArray);
      } catch (error) {
        console.error("Error fetching monthly expense data:", error);
      }
    };

    fetchIncomeData();
    fetchExpenseData();
    fetchSavingsData();
    fetchMonthlyIncome();
    fetchMonthlyExpense();
  }, [year]);
  // Fetch pie chart data
  useEffect(() => {
    const fetchIncomeCategories = async () => {
      try {
        const response = await fetch(
          `http://localhost:8087/dashboard/incomes?email=${getEmail()}`
        );
        const data = await response.json();
        setIncomeCategories(data);
      } catch (error) {
        console.error("Error fetching income categories data:", error);
      }
    };

    const fetchExpenseCategories = async () => {
      try {
        const response = await fetch(
          `http://localhost:8087/dashboard/expenses?email=${getEmail()}`
        );
        const data = await response.json();
        setExpenseCategories(data);
      } catch (error) {
        console.error("Error fetching expense categories data:", error);
      }
    };

    fetchIncomeCategories();
    fetchExpenseCategories();
  }, []);
  // Determine text for savings/loss card
  const savingsText = savingsData >= 0 ? "Saving" : "Loss";
  const todaytext =
    incomeData.today - expenseData.today >= 0 ? "Saving" : "Loss";
  const _7Daystext =
    incomeData.last7Days - expenseData.last7Days >= 0 ? "Saving" : "Loss";
  const _30Daystext =
    incomeData.last30Days - expenseData.last30Days >= 0 ? "Saving" : "Loss";
  const _365Daystext =
    incomeData.last365Days - expenseData.last365Days >= 0 ? "Saving" : "Loss";
  // Format data values with commas
  const formatValue = (value) => Math.abs(value).toLocaleString();

  // Data for the overall comparison chart
  const overallData = {
    labels: ["Today's", "7 Day's", "30 Day's", "365 Day's", "Total"],
    datasets: [
      {
        label: "Income",
        data: [
          incomeData.today || 0,
          incomeData.last7Days || 0,
          incomeData.last30Days || 0,
          incomeData.last365Days || 0,
          incomeData.total || 0,
        ],
        backgroundColor: "#90EE90",
      },
      {
        label: "Expense",
        data: [
          expenseData.today || 0,
          expenseData.last7Days || 0,
          expenseData.last30Days || 0,
          expenseData.last365Days || 0,
          expenseData.total || 0,
        ],
        backgroundColor: "#FF6F61",
      },
    ],
  };

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

  // Data for the monthly chart
  const monthlyData = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
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

  const handleViewChange = (event) => {
    setView(event.target.value);
  };

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  // Generate the last 10 years for the year dropdown
  const years = Array.from(
    new Array(10),
    (val, index) => new Date().getFullYear() - index
  );
  const incomeCategoryData = Object.keys(incomeCategories).map((key) => ({
    category: key,
    value: incomeCategories[key].total || 0,
  }));

  const expenseCategoryData = Object.keys(expenseCategories).map((key) => ({
    category: key,
    value: expenseCategories[key].total || 0,
  }));

  const incomePieData = {
    labels: incomeCategoryData.map((category) => category.category),
    datasets: [
      {
        data: incomeCategoryData.map((category) => category.value),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#FF6347",
          "#36A2A2",
          "#FFCD56",
        ],
      },
    ],
  };

  const expensePieData = {
    labels: expenseCategoryData.map((category) => category.category),
    datasets: [
      {
        data: expenseCategoryData.map((category) => category.value),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#FF6347",
          "#36A2A2",
          "#FFCD56",
        ],
      },
    ],
  };
  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Paper
            elevation={3}
            sx={{
              padding: 2,
              backgroundColor: "#F9E79F",
              borderRadius: 2,
              fontWeight: "bold",
              boxShadow: 3,
            }}
          >
            <Typography variant="h7">Today's Income</Typography>
            <Typography variant="h4" className="income">
              ₹{formatValue(incomeData.today || 0)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Paper
            elevation={3}
            sx={{
              padding: 2,
              backgroundColor: "#A9DFBF", // Mint Green
              borderRadius: 2,
              fontWeight: "bold",
              boxShadow: 3,
            }}
          >
            <Typography variant="h7">7 Day's Income</Typography>
            <Typography variant="h4" className="income">
              ₹{formatValue(incomeData.last7Days || 0)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Paper
            elevation={3}
            sx={{
              padding: 2,
              backgroundColor: "#F5CBA7",
              borderRadius: 2,
              fontWeight: "bold",
              boxShadow: 3,
            }}
          >
            <Typography variant="h7">30 Day's Income</Typography>
            <Typography variant="h4" className="income">
              ₹{formatValue(incomeData.last30Days || 0)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Paper
            elevation={3}
            sx={{
              padding: 2,
              backgroundColor: "#D2B4DE",
              borderRadius: 2,
              fontWeight: "bold",
              boxShadow: 3,
            }}
          >
            <Typography variant="h7">365 Day's Income</Typography>
            <Typography variant="h4" className="income">
              ₹{formatValue(incomeData.last365Days || 0)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Paper
            elevation={3}
            sx={{
              padding: 2,
              backgroundColor: "#F7DC6F",
              borderRadius: 2,
              fontWeight: "bold",
              boxShadow: 3,
            }}
          >
            <Typography variant="h7">Total Income</Typography>
            <Typography variant="h4" className="income">
              ₹{formatValue(incomeData.total || 0)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Paper
            elevation={3}
            sx={{
              padding: 2,
              backgroundColor: "#F1948A",
              borderRadius: 2,
              fontWeight: "bold",
              boxShadow: 3,
            }}
          >
            <Typography variant="h7">Today's Expense</Typography>
            <Typography variant="h4" className="expense">
              ₹{formatValue(expenseData.today || 0)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Paper
            elevation={3}
            sx={{
              padding: 2,
              backgroundColor: "#F5B7B1",
              borderRadius: 2,
              fontWeight: "bold",
              boxShadow: 3,
            }}
          >
            <Typography variant="h7">7 Day's Expense</Typography>
            <Typography variant="h4" className="expense">
              ₹{formatValue(expenseData.last7Days || 0)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Paper
            elevation={3}
            sx={{
              padding: 2,
              backgroundColor: "#D7BDE2",
              borderRadius: 2,
              fontWeight: "bold",
              boxShadow: 3,
            }}
          >
            <Typography variant="h7">30 Day's Expense</Typography>
            <Typography variant="h4" className="expense">
              ₹{formatValue(expenseData.last30Days || 0)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Paper
            elevation={3}
            sx={{
              padding: 2,
              backgroundColor: "#AED6F1",
              borderRadius: 2,
              fontWeight: "bold",
              boxShadow: 3,
            }}
          >
            <Typography variant="h7">365 Day's Expense</Typography>
            <Typography variant="h4" className="expense">
              ₹{formatValue(expenseData.last365Days || 0)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Paper
            elevation={3}
            sx={{
              padding: 2,
              backgroundColor: "#FAD7A0",
              borderRadius: 2,
              fontWeight: "bold",
              boxShadow: 3,
            }}
          >
            <Typography variant="h7">Total Expense</Typography>
            <Typography variant="h4" className="expense">
              ₹{formatValue(expenseData.total || 0)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Paper
            elevation={3}
            sx={{
              padding: 2,
              backgroundColor: "#F8C471", // Light Orange
              borderRadius: 2,
              fontWeight: "bold",
              boxShadow: 3,
            }}
          >
            <Typography variant="h7">Today's {todaytext}</Typography>
            <Typography
              variant="h4"
              className={
                incomeData.today - expenseData.today >= 0
                  ? "savings-positive"
                  : "savings-negative"
              }
            >
              ₹{formatValue(incomeData.today - expenseData.today)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Paper
            elevation={3}
            sx={{
              padding: 2,
              backgroundColor: "#F8C471", // Light Orange
              borderRadius: 2,
              fontWeight: "bold",
              boxShadow: 3,
            }}
          >
            <Typography variant="h7">7 Day's {_7Daystext}</Typography>
            <Typography
              variant="h4"
              className={
                incomeData.last7Days - expenseData.last7Days >= 0
                  ? "savings-positive"
                  : "savings-negative"
              }
            >
              ₹{formatValue(incomeData.last7Days - expenseData.last7Days)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Paper
            elevation={3}
            sx={{
              padding: 2,
              backgroundColor: "#F8C471", // Light Orange
              borderRadius: 2,
              fontWeight: "bold",
              boxShadow: 3,
            }}
          >
            <Typography variant="h7">30 Day's {_30Daystext}</Typography>
            <Typography
              variant="h4"
              className={
                incomeData.last30Days - expenseData.last30Days >= 0
                  ? "savings-positive"
                  : "savings-negative"
              }
            >
              ₹{formatValue(incomeData.last30Days - expenseData.last30Days)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Paper
            elevation={3}
            sx={{
              padding: 2,
              backgroundColor: "#F8C471", // Light Orange
              borderRadius: 2,
              fontWeight: "bold",
              boxShadow: 3,
            }}
          >
            <Typography variant="h7">365 Day's {_365Daystext}</Typography>
            <Typography
              variant="h4"
              className={
                incomeData.last365Days - expenseData.last365Days >= 0
                  ? "savings-positive"
                  : "savings-negative"
              }
            >
              ₹{formatValue(incomeData.last365Days - expenseData.last365Days)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Paper
            elevation={3}
            sx={{
              padding: 2,
              backgroundColor: "#F8C471", // Light Orange
              borderRadius: 2,
              fontWeight: "bold",
              boxShadow: 3,
            }}
          >
            <Typography variant="h7">Total {savingsText}</Typography>
            <Typography
              variant="h4"
              className={
                savingsData >= 0 ? "savings-positive" : "savings-negative"
              }
            >
              ₹{formatValue(savingsData)}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      <Grid container spacing={3} style={{ marginTop: "10px" }}>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" ml={25}>
            Overall Comparison
          </Typography>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Bar data={overallData} options={overallOptions} />
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6}>
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
          <Typography variant="h6" ml={25} mt={-4}>
            Yearly Comparison
          </Typography>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Line data={monthlyData} options={monthlyOptions} />
          </Paper>
        </Grid>
      </Grid>
      <Grid
        container
        spacing={3}
        style={{
          alignItems: "center",
          justifyContent: "center",
          marginTop: "10px",
        }}
      >
        {" "}
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" gutterBottom ml={25}>
            Income Categories(Overall)
          </Typography>
          <Paper
            elevation={3}
            sx={{
              padding: 2,
              height: 500,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Pie data={incomePieData} />
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" gutterBottom ml={25}>
            Expense Categories(Overall)
          </Typography>
          <Paper
            elevation={3}
            sx={{
              padding: 2,
              height: 500,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Pie data={expensePieData} />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;

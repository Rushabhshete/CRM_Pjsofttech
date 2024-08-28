import React, { useState, useEffect } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Toolbar,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ListIcon from "@mui/icons-material/List";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { useNavigate, useLocation } from "react-router-dom";

const drawerWidth = 245;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activePath, setActivePath] = useState(location.pathname);

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location]);

  const handleNavigation = (path) => {
    if (activePath === path) {
      window.location.reload(); // Force page reload
    } else {
      navigate(path);
    }
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
      }}
    >
      <Toolbar />
      <Divider />
      <List>
        <ListItem
          button
          selected={activePath === "/dashboard"}
          onClick={() => handleNavigation("/dashboard")}
        >
          <ListItemIcon>
            <DashboardIcon
              sx={{
                color: "#FE6B8B",
              }}
            />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem
          button
          selected={activePath === "/AddIncomeExpense"}
          onClick={() => handleNavigation("/AddIncomeExpense")}
        >
          <ListItemIcon>
            <CurrencyRupeeIcon sx={{ color: "lightgreen" }} />
          </ListItemIcon>
          <ListItemText primary="Add Income/Expese" />
        </ListItem>
        <ListItem
          button
          selected={activePath === "/incomeExpenseList"}
          onClick={() => handleNavigation("/incomeExpenseList")}
        >
          <ListItemIcon>
            <ListIcon sx={{color:"blue"}}/>
          </ListItemIcon>
          <ListItemText primary="Income/Expense List" />
        </ListItem>
        <ListItem
          button
          selected={activePath === "/AddCategory"}
          onClick={() => handleNavigation("/AddCategory")}
        >
          <ListItemIcon>
            <AddBoxIcon   sx={{
        color: '#FF8E53', // Solid color for the icon
      
      }}/>
          </ListItemIcon>
          <ListItemText primary="Add Category" />
        </ListItem>
        <ListItem
          button
          selected={activePath === "/AddUser"}
          onClick={() => handleNavigation("/AddUser")}
        >
          <ListItemIcon>
            <AddBoxIcon  sx={{
        color: '#FF8E53', // Solid color for the icon
      
      }}/>
          </ListItemIcon>
          <ListItemText primary="Add User" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;

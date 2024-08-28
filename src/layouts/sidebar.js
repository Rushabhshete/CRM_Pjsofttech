import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import { Link } from "react-router-dom";
import {
  Add,
  Remove,
  Dashboard as DashboardIcon,
  Announcement as AnnouncementIcon,
  People as PeopleIcon,
  Person,
  AddIcCallOutlined,
} from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import NotificationsIcon from "@mui/icons-material/Notifications";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import PersonSearchRoundedIcon from "@mui/icons-material/PersonSearchRounded";
import AddHomeRoundedIcon from "@mui/icons-material/AddHomeRounded";
import CurrencyRupeeRoundedIcon from "@mui/icons-material/CurrencyRupeeRounded";
import EmojiPeopleRoundedIcon from "@mui/icons-material/EmojiPeopleRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import SupervisorAccountRoundedIcon from "@mui/icons-material/SupervisorAccountRounded";
import TimeToLeaveIcon from "@mui/icons-material/TimeToLeave";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import WorkspacesIcon from "@mui/icons-material/Workspaces";
import CategoryIcon from "@mui/icons-material/Category";
import SubjectIcon from "@mui/icons-material/Subject";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import GroupIcon from "@mui/icons-material/Group";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import AssessmentIcon from "@mui/icons-material/Assessment";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import AddToPhotosIcon from "@mui/icons-material/AddToPhotos";
import AodIcon from "@mui/icons-material/Aod";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import HelpIcon from "@mui/icons-material/Help";

const drawerWidth = 240;
const collapsedWidth = 60;

const sidebarOptions = [
  {
    name: "Main Dashboard",
    icon: <DashboardIcon color="primary" />,
    route: "/layout/combineDash",
    subOptions: [],
  },
 

  {
    name: "Enquiry System",
    icon: <PersonSearchRoundedIcon sx={{ color: "orange" }} />,
    subOptions: [
      {
        name: "Dashboard",
        route: "/layout/dashboard",
        icon: <DashboardIcon sx={{ color: "blue" }} />,
      },
      {
        name: "Add Inquiry",
        route: "/layout/add",
        icon: <NoteAddIcon sx={{ color: "#4682b4" }} />,
      },
      {
        name: "Add Exam / Course",
        route: "/layout/exam",
        icon: <NoteAddIcon sx={{ color: "#4682b4" }} />,
      },
      {
        name: "Add Source",
        route: "/layout/source",
        icon: <NoteAddIcon sx={{ color: "#4682b4" }} />,
      },
      {
        name: "Add Conduct",
        route: "/layout/conduct",
        icon: <NoteAddIcon sx={{ color: "#4682b4" }} />,
      },
      {
        name: "Enquiry List",
        route: "/layout/report",
        icon: <AssessmentIcon sx={{ color: "#4682b4" }} />,
      },
    ],
  },
  {
    name: "Admission System",
    icon: <AddHomeRoundedIcon sx={{ color: "#FF1493" }} />,
    subOptions: [
      {
        name: "Dashboard",
        route: "/layout/admission-dashboard",
        icon: <DashboardIcon sx={{ color: "blue" }} />,
      },
      {
        name: "Admission Form",
        route: "/layout/admission-form",
        icon: <PeopleIcon sx={{ color: "#4682b4" }} />,
      },
      {
        name: "Admission List",
        route: "/layout/students",
        icon: <RemoveRedEyeIcon sx={{ color: "#4682b4" }} />,
      },
      {
        name: "Add Cource",
        route: "/layout/add-course",
        icon: <AddToPhotosIcon sx={{ color: "#4682b4" }} />,
      },
      {
        name: "Admission Source",
        route: "/layout/admission-source",
        icon: <AodIcon sx={{ color: "#4682b4" }} />,
      },
      {
        name: "Admission Guide",
        route: "/layout/add-guide",
        icon: <LightbulbIcon sx={{ color: "#4682b4" }} />,
      },
    ],
  },
  {
    name: "Income  & Expense",
    icon: <CurrencyRupeeRoundedIcon sx={{ color: "green" }} />,
    subOptions: [
      {
        name: "Dashboard",
        route: "/layout/Income-Expense-dashboard",
        icon: <DashboardIcon sx={{ color: "blue" }} />,
      },
      {
        name: "Add income-expense",
        route: "/layout/AddIncomeExpense",
        icon: <PlaylistAddIcon sx={{ color: "#4682b4" }} />,
      },
      {
        name: "Income-Expense List",
        route: "/layout/incomeExpenseList",
        icon: <FormatListBulletedIcon sx={{ color: "#4682b4" }} />,
      },
      {
        name: "Add Category",
        route: "/layout/AddCategory",
        icon: <CategoryIcon sx={{ color: "#4682b4" }} />,
      },
      {
        name: "Add User",
        route: "/layout/AddUser",
        icon: <PersonSearchRoundedIcon sx={{ color: "#4682b4" }} />,
      },
    ],
  },
  {
    name: "Student System",
    icon: <EmojiPeopleRoundedIcon sx={{ color: "brown" }} />,
    subOptions: [
      { name: "Dashboard",  icon: <DashboardIcon /> },
      { name: "Student Form",  icon: <WorkspacesIcon /> },
      {
        name: "Student List",
        // route: "/memo/delete",
        icon: <FormatListBulletedIcon />,
      },
      {
        name: "Student Report",
        // route: "/memo/delete",
        icon: <AssessmentIcon />,
      },
      {
        name: "Student Request",
        // route: "/memo/delete",
        icon: <DoneOutlineIcon />,
      },
      { name: "Add Fields", icon: <CategoryIcon /> },
    ],
  },
  {
    name: "Employee System",
    icon: <PeopleIcon sx={{ color: "blue" }} />,
    subOptions: [
      {
        name: "Employee",
        icon: <Person />,
        subSubOptions: [
          {
            name: "Dashboard",
            // route: "/employee/hr/add",
            icon: <GridViewRoundedIcon />,
          },
          {
            name: "Add Employee",
            // route: "/employee/hr/add",
            icon: <NotificationsIcon />,
          },
          {
            name: "Employee List",
            // route: "/employee/hr/manage",
            icon: <NotificationsIcon />,
          },
          {
            name: "Report",
            // route: "/employee/hr/delete",
            icon: <NotificationsIcon />,
          },
          {
            name: "Add Category",
            icon: <NotificationsIcon />,
            subSubOptions: [
              {
                name: "Add Category",
                // route: "/employee/hr/addcategory",
                icon: <Person sx={{ color: "green" }} />,
              },
              {
                name: "Category List",
                // route: "/employee/hr/categorylist",
                icon: <Person sx={{ color: "blue" }} />,
              },
            ],
          },
        ],
      },
      {
        name: "Attendance",
        icon: <SupervisorAccountRoundedIcon />,
        subSubOptions: [
          {
            name: "Today's Attendance",
            // route: "/employee/hr/add",
            icon: <NotificationsIcon />,
          },
          {
            name: "Attendance report",
            // route: "/employee/hr/manage",
            icon: <NotificationsIcon />,
          },
        ],
      },
      {
        name: "Leave",
        icon: <TimeToLeaveIcon />,
        subSubOptions: [
          {
            name: "Dashboard",
            // route: "/employee/hr/add",
            icon: <DashboardIcon />,
          },
          {
            name: "Manage Employee",
            // route: "/employee/hr/manage",
            icon: <NotificationsIcon />,
          },
          {
            name: "Delete Employee",
            // route: "/employee/hr/delete",
            icon: <NotificationsIcon />,
          },
        ],
      },
      {
        name: "Salary",
        icon: <AttachMoneyIcon />,
        subSubOptions: [
          {
            name: "Dashboard",
            // route: "/employee/hr/add",
            icon: <DashboardIcon />,
          },
          {
            name: "Add Salary",
            // route: "/employee/hr/manage",
            icon: <NotificationsIcon />,
          },
          {
            name: "Report",
            // route: "/employee/hr/delete",
            icon: <NotificationsIcon />,
          },
        ],
      },
    ],
  },
  {
    name: "Classroom Management",
    icon: <SchoolRoundedIcon sx={{ color: "purple" }} />,
    subOptions: [
      { name: "Classroom",  icon: <AnnouncementIcon /> },
      { name: "Subject",  icon: <SubjectIcon /> },
      { name: "Account", icon: <AccountCircleIcon /> },
      { name: "Timetable",  icon: <CalendarMonthIcon /> },
      { name: "Teachers",  icon: <GroupIcon /> },
      { name: "Students",  icon: <Person /> },
      {
        name: "Attendance",
        // route: "/memo/delete",
        icon: <NotificationsIcon />,
      },
      { name: "Homework",  icon: <NotificationsIcon /> },
      { name: "Exam", icon: <NotificationsIcon /> },
      { name: "Result",  icon: <NotificationsIcon /> },
    ],
  },
  {
    name: "Memo / Notification",
    icon: <AnnouncementIcon sx={{ color: "purple" }} />,
    subOptions: [
      {
        name: "Memo",
        route: "/layout/memo",
        icon: <AnnouncementIcon sx={{ color: "blue" }} />,
      },
      {
        name: "Manage Memo",
        route: "/layout/manage-memo",
        icon: <NotificationsIcon sx={{ color: "#4682b4" }} />,
      },
      {
        name: "Manage Notification",
        route: "/layout/manage-notifications",
        icon: <NotificationsIcon sx={{ color: "#4682b4" }} />,
      },
    ],
  },
  {
    name: "Add Sub-Admin",
    icon: <AdminPanelSettingsIcon color="primary" />,
    route: "/layout/subadmin",
    subOptions: [],
  },
  {
    name: "Help Desk",
    icon: <HelpIcon color="success" />,
    route: "/layout/helpDesk",
    subOptions: [],
  },
  {
    name: "Settings",
    icon: <SettingsRoundedIcon color="black" />,
    route: "/layout/Settings",
    subOptions: [],
  },
  // Add more options similarly
];

const Sidebar = () => {
  const [expanded, setExpanded] = useState({});
  const location = useLocation();
  const [open, setOpen] = useState(true); // true for expanded, false for collapsed

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const isActive = (route) => location.pathname === route;

  const handleToggle = (option) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [option]: !prevExpanded[option],
    }));
  };
  return (
    <Drawer
    variant="persistent"
    anchor="left"
    open
    sx={{
      width: open ? drawerWidth : collapsedWidth,
      transition: "width 0.3s",
      "& .MuiDrawer-paper": {
        width: open ? drawerWidth : collapsedWidth,
        transition: "width 0.3s",
        overflowX: 'hidden', // Prevent horizontal scroll
        
      },
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", p: 1 }}>
      <IconButton onClick={handleDrawerToggle} sx={{ marginLeft: 'auto',marginTop:"60px" }}>
        {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
      </IconButton>
    </Box>
    <Box sx={{ overflowY: "auto" }}>
      <List>
        {sidebarOptions.map((option, index) => (
          <div key={index}>
            <ListItem
              button
              onClick={() => handleToggle(option.name)}
              component={Link}
              to={option.route}
              sx={{
                backgroundColor: isActive(option.route)
                  ? "rgba(0, 0, 0, 0.1)"
                  : "transparent",
                "&:hover": {
                  backgroundColor: isActive(option.route)
                    ? "rgba(0, 0, 0, 0.1)"
                    : "rgba(0, 0, 0, 0.05)",
                    marginLeft:"-10px"
                
                },
              }}
            >
              <ListItemIcon>{option.icon}</ListItemIcon>
              {open && (
                <ListItemText
                  primary={
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: "bold", fontSize: "12px",marginLeft:"-20px" }}
                    >
                      {option.name}
                    </Typography>
                  }
                />
              )}
              {option.subOptions.length > 0 && (
                <ListItemIcon>
                  {expanded[option.name] ? (
                    <Remove sx={{ color: "red" }} />
                  ) : (
                    <Add sx={{ color: "green" }} />
                  )}
                </ListItemIcon>
              )}
            </ListItem>
            {open && option.subOptions.length > 0 && (
              <Collapse
                in={expanded[option.name]}
                timeout="auto"
                unmountOnExit
                sx={{ transition: "all 0.3s ease" }}
              >
                <List component="div" disablePadding>
                  {option.subOptions.map((subOption, subIndex) => (
                    <div key={subIndex}>
                      <ListItem
                        button
                        onClick={() => handleToggle(subOption.name)}
                        component={Link}
                        to={subOption.route}
                        sx={{
                          pl: 4,
                          backgroundColor: isActive(subOption.route)
                            ? "rgba(0, 0, 0, 0.1)"
                            : "transparent",
                          "&:hover": {
                            backgroundColor: isActive(subOption.route)
                              ? "rgba(0, 0, 0, 0.1)"
                              : "rgba(0, 0, 0, 0.05)",
                                  marginLeft:"-10px"
                          },
                        }}
                      >
                        <ListItemIcon >{subOption.icon}</ListItemIcon>
                        {open && (
                          <ListItemText
                            primary={
                              <Typography
                                variant="body2"
                                sx={{ fontSize: "13px",    marginLeft:"-20px" }}
                              >
                                {subOption.name}
                              </Typography>
                            }
                          />
                        )}
                        {subOption.subSubOptions?.length > 0 && (
                          <ListItemIcon>
                            {expanded[subOption.name] ? (
                              <Remove sx={{ color: "red" }} />
                            ) : (
                              <Add sx={{ color: "green" }} />
                            )}
                          </ListItemIcon>
                        )}
                      </ListItem>
                      {open && subOption.subSubOptions?.length > 0 && (
                        <Collapse
                          in={expanded[subOption.name]}
                          timeout="auto"
                          unmountOnExit
                          sx={{ transition: "all 0.3s ease" }}
                        >
                          <List component="div" disablePadding>
                            {subOption.subSubOptions.map(
                              (subSubOption, subSubIndex) => (
                                <ListItem
                                  button
                                  key={subSubIndex}
                                  component={Link}
                                  to={subSubOption.route}
                                  sx={{
                                    pl: 8,
                                    backgroundColor: isActive(subSubOption.route)
                                      ? "rgba(0, 0, 0, 0.1)"
                                      : "transparent",
                                    "&:hover": {
                                      backgroundColor: isActive(subSubOption.route)
                                        ? "rgba(0, 0, 0, 0.1)"
                                        : "rgba(0, 0, 0, 0.05)",
                                    },
                                  }}
                                >
                                  <ListItemIcon>
                                    {subSubOption.icon}
                                  </ListItemIcon>
                                  {open && (
                                    <ListItemText
                                      primary={
                                        <Typography
                                          variant="body2"
                                          sx={{ fontSize: "12px" }}
                                        >
                                          {subSubOption.name}
                                        </Typography>
                                      }
                                    />
                                  )}
                                </ListItem>
                              )
                            )}
                          </List>
                        </Collapse>
                      )}
                    </div>
                  ))}
                </List>
              </Collapse>
            )}
          </div>
        ))}
      </List>
    </Box>
  </Drawer>
);
};

export default Sidebar;

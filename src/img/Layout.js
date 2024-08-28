// // src/components/Layout.js
// import React from 'react';
// import { useLocation } from 'react-router-dom';
// import Navbar from './Navbar';
// import Sidebar from './Sidebar';
// import Box from '@mui/material/Box';

// const Layout = ({ children }) => {
//   const location = useLocation();
//   const isLoginPage = location.pathname === '/';

//   return (
//     <Box sx={{ display: 'flex' }}>
//       {!isLoginPage && <Navbar />}
//       {!isLoginPage && <Sidebar />}
//       <Box
//         component="main"
//         sx={{ flexGrow: 1, p: 3, mt: 8 }} // Adjust mt for Navbar height
//       >
//         {children}
//       </Box>
//     </Box>
//   );
// };

// export default Layout;


import React from 'react';
import { useLocation, Outlet } from 'react-router-dom'; // Import Outlet
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Box from '@mui/material/Box';

const Layout = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/';

  return (
    <Box sx={{ display: 'flex' }}>
      {!isLoginPage && <Navbar />}
      {!isLoginPage && <Sidebar />}
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, mt: 8 }} // Adjust mt for Navbar height
      >
        <Outlet /> {/* Render nested routes here */}
      </Box>
    </Box>
  );
};

export default Layout;
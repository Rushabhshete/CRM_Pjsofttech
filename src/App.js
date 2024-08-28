
// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { CssBaseline } from "@mui/material";

// import ForgotPassword from './layouts/ForgotPassword';
// import Login from './layouts/Login';
// import Layout from './layouts/layout';
// import ProtectedRoute from './layouts/ProtectedRoute';
// import UpdateSource from './Enquiry/ConductBy/Sources/UpdateSource';
// import AddSource from './Enquiry/ConductBy/Sources/AddSource';
// import Source from './Enquiry/ConductBy/Sources/Source';
// import UpdateExam from './Enquiry/ExamPages/UpdateExam';
// import Exam from './Enquiry/ExamPages/Exam';
// import AddExam from './Enquiry/ExamPages/AddExam';
// import UpdateConduct from './Enquiry/ConductBy/UpdateConduct';
// import Conduct from './Enquiry/ConductBy/Conduct';
// import AddConduct from './Enquiry/ConductBy/AddConduct';
// import Report from './Enquiry/Report';
// import UpdateEnquiry from './Enquiry/pages/UpdateInquiry';
// import AddEnquiry from './Enquiry/pages/AddInquiry';
// import DashBoard from './Enquiry/DashBoard';
// import AddmissionDashboard from './Addmission/AdmissionDashboard';
// import AddmissionSource from './Addmission/AddmissionSource';
// import AdmissionForm from './Addmission/AdmissionForm';
// import StudentList from './Addmission/StudentList';
// import UpdateForm from './Addmission/AdmissionUpdateForm';
// import StudentFormDataDisplay from './Addmission/StudentFormDataDisplay';
// import AddCourse from './Addmission/AdmissionAddCourse';
// import AddGuide from './Addmission/AddGuide';



// // Import components

// // import AdminProfile from './layouts/Admin/AdminProfile';

// function AppContent() {
//   const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('isAuthenticated') === 'true');
//   const location = useLocation();
//   const showHelpDeskButton = location.pathname !== "/";

//   useEffect(() => {
//     const checkAuth = () => {
//       const authStatus = localStorage.getItem('isAuthenticated') === 'true';
//       setIsAuthenticated(authStatus);
//     };
//     checkAuth();
//   }, []);

//   const handleLogin = () => {
//     setIsAuthenticated(true);
//     localStorage.setItem('isAuthenticated', 'true');
//   };

//   return (
//     <>
//       <Routes>
//          <Route path='/login' element={<Login onLogin={handleLogin} />} /> 
//           <Route path="/forgot-password" element={<ForgotPassword />} /> 
//             <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
//           <   Route path='/layout' element={<Layout />}>
//            <Route path="AdminProfile" element={<AdminProfile />} /> 
//              {/* Enquiry Rootes */}
//              <Route path="dashboard" element={<DashBoard />} />
//               <Route path="add" element={<AddEnquiry />} />
//               <Route path="manage/:id" element={<UpdateEnquiry />} />
//               <Route path="report" element={<Report />} />
//               <Route path="addconduct" element={<AddConduct />} />
//               <Route path="conduct" element={<Conduct />} />
//               <Route path="updateconduct/:id" element={<UpdateConduct />} />
//               <Route path="addexam" element={<AddExam />} />
//               <Route path="exam" element={<Exam />} />
//               <Route path="updateexam/:id" element={<UpdateExam />} />
//               <Route path="source" element={<Source />} />
//               <Route path="addsource" element={<AddSource />} />
//               <Route path="updatesource/:id" element={<UpdateSource />} />

//               {/* Addmission Routes */}
//               <Route path="Addmission-Dashboard" element={<AddmissionDashboard />}/>
//               <Route path="AdmissionForm" element={<AdmissionForm />} />
//               <Route path="students" element={<StudentList />} />
//               <Route path="updateAdmission/:sid" element={<UpdateForm />} />
//               <Route path="studentFormDataDisplay" element={<StudentFormDataDisplay />}  />
//               <Route path="AddCourse" element={<AddCourse />}  />
//               <Route path="Addmission-Source" element={<AddmissionSource />} />
//               <Route path="AddGuide" element={<AddGuide />}  />
          



//               <Route path="account" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Account /></ProtectedRoute>} />
            


//           </Route>
//         </Route>
//         <Route path="/" element={<Navigate to="/layout" />} />
//         {/* Catch-all route to redirect all other paths to login */}
//         <Route path="*" element={<Navigate to="/login" />} />
//       </Routes>
//       {/* {showHelpDeskButton && <FloatingHelpDeskButton />} */}
//     </>
//   );
// }

// function App() {
//   return (
//     <Router>
//       <CssBaseline />
//       <AppContent />
//     </Router>
//   );
// }

// export default App;



import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { CssBaseline } from "@mui/material";

// Import components
import ForgotPassword from './layouts/ForgotPassword';
import Login from './layouts/Login';
import Layout from './layouts/layout';
import ProtectedRoute from './layouts/ProtectedRoute';
import UpdateSource from './Enquiry/ConductBy/Sources/UpdateSource';
import AddSource from './Enquiry/ConductBy/Sources/AddSource';
import Source from './Enquiry/ConductBy/Sources/Source';
import UpdateExam from './Enquiry/ExamPages/UpdateExam';
import Exam from './Enquiry/ExamPages/Exam';
import AddExam from './Enquiry/ExamPages/AddExam';
import UpdateConduct from './Enquiry/ConductBy/UpdateConduct';
import Conduct from './Enquiry/ConductBy/Conduct';
import AddConduct from './Enquiry/ConductBy/AddConduct';
import Report from './Enquiry/Report';
import UpdateEnquiry from './Enquiry/pages/UpdateInquiry';
import AddEnquiry from './Enquiry/pages/AddInquiry';
import DashBoard from './Enquiry/DashBoard';
import AddmissionDashboard from './Addmission/AdmissionDashboard';
import AddmissionSource from './Addmission/AddmissionSource';
import AdmissionForm from './Addmission/AdmissionForm';
import StudentList from './Addmission/StudentList';
import UpdateForm from './Addmission/AdmissionUpdateForm';
import StudentFormDataDisplay from './Addmission/StudentFormDataDisplay';
import AddCourse from './Addmission/AdmissionAddCourse';
import AddGuide from './Addmission/AddGuide';
import IncomeExpenseDashboard from './Income Expense/IncomeExpenseDashboard';
import AddIncomeExpense from './Income Expense/AddIncomeExpense';
import Category from './Income Expense/Category';
import AddCategory from './Income Expense/AddCategory';
import AddUser from './Income Expense/AddUser';
 import AdminProfile from './layouts/AdminProfile'; // Ensure this path is correct
import Memo from './layouts/Memo';
import ManageMemo from './layouts/ManageMemo';
import ManageNotification from './layouts/ManageNotification';
import CombineDashboard from './layouts/CombineDashboard';
import FloatingHelpDeskButton from './layouts/FloatingHelpDeskButton'
import HelpDesk from './layouts/HelpDesk';
import AddSubAdmin from './layouts/AddSubAdmin';
import  Settings  from './layouts/Settings';
// import Account from './layouts/Account'; // Ensure this path is correct

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('isAuthenticated') === 'true');
  const location = useLocation();
  const showHelpDeskButton = location.pathname !== "/";

  useEffect(() => {
    const checkAuth = () => {
      const authStatus = localStorage.getItem('isAuthenticated') === 'true';
      setIsAuthenticated(authStatus);
    };
    checkAuth();
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
  };

  return (
    <>
      <Routes>
         <Route path='/systems/' element={<Login onLogin={handleLogin} />} /> 
          <Route path="/forgot-password" element={<ForgotPassword />} /> 
            {/* <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}> */}
          <Route path='/layout/*' element={<Layout />}>
           <Route path="admin-profile" element={<AdminProfile />} /> 
             {/* Enquiry Routes */}
             <Route path='combineDash' element={<CombineDashboard />} />
             <Route path="memo" element={<Memo />} />
             <Route path="manage-memo" element={<ManageMemo />} />
             <Route path="manage-notifications" element={<ManageNotification />} />
             
             <Route path="dashboard" element={<DashBoard />} />
              <Route path="add" element={<AddEnquiry />} />
              <Route path="manage/:id" element={<UpdateEnquiry />} />
              <Route path="report" element={<Report />} />
              <Route path="addconduct" element={<AddConduct />} />
              <Route path="conduct" element={<Conduct />} />
              <Route path="updateconduct/:id" element={<UpdateConduct />} />
              <Route path="addexam" element={<AddExam />} />
              <Route path="exam" element={<Exam />} />
              <Route path="updateexam/:id" element={<UpdateExam />} />
              <Route path="source" element={<Source />} />
              <Route path="addsource" element={<AddSource />} />
              <Route path="updatesource/:id" element={<UpdateSource />} />

              {/* Admission Routes */}
              <Route path="admission-dashboard" element={<AddmissionDashboard />}/>
              <Route path="admission-form" element={<AdmissionForm />} />
              <Route path="students" element={<StudentList />} />
              <Route path="update-admission/:sid" element={<UpdateForm />} />
              <Route path="student-form-data-display" element={<StudentFormDataDisplay />}  />
              <Route path="add-course" element={<AddCourse />}  />
              <Route path="admission-source" element={<AddmissionSource />} />
              <Route path="add-guide" element={<AddGuide />}  />

              {/* Income Expense */}

              <Route path="Income-Expense-dashboard" element={<IncomeExpenseDashboard />} />
              <Route path="AddIncomeExpense" element={<AddIncomeExpense />} />
              <Route path="incomeExpenseList" element={<Category />} />
              <Route path="AddCategory" element={<AddCategory />} />
              <Route path="AddUser" element={<AddUser />} />
              <Route path="helpDesk" element={<HelpDesk />} />
              <Route path="subadmin" element={<AddSubAdmin />} />
              <Route path="Settings" element={<Settings />} />

              {/* <Route path="account" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Account /></ProtectedRoute>} /> */}
          </Route>
        {/* </Route> */}
        <Route path="/systems/" element={<Navigate to="/layout" />} />
       
        {/* <Route path="/" element={<Navigate to="/layout" />} /> */}
        {/* Catch-all route to redirect all other paths to login */}
        <Route path="*" element={<Navigate to="/systems/" />} />
      </Routes>
      {showHelpDeskButton && <FloatingHelpDeskButton />}
      
    </>
  );
}

function App() {
  return (
    <Router>
      <CssBaseline />
      <AppContent />
    </Router>
  );
}

export default App;

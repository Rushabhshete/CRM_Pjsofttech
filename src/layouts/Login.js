// // import React, { useState } from 'react';
// // import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
// // import { useNavigate } from 'react-router-dom';
// // import axios from 'axios';
// // import '../css/login.css';
// // import logo from '../img/logo.jpg';

// // function Login({ onLogin }) {
// //   const [email, setEmail] = useState('');
// //   const [password, setPassword] = useState('');
// //   const [error, setError] = useState('');
// //   const navigate = useNavigate();

// //   const handleSubmit = async (event) => {
// //     event.preventDefault();
// //     try {
// //       const response = await axios.post('http://localhost:8081/login', {
// //         email,
// //         password,
// //         confirmPassword: password, // Assuming the confirmPassword is same as password for login
// //       });
// //       if (response.status === 200) {
// //         console.log('Login successful!');
// //         localStorage.setItem('token', 'mockToken'); // Mock storing token
// //         onLogin(); // Update authentication state
// //         navigate('/layout/dashboard');
// //       }
// //     } catch (error) {
// //       if (error.response) {
// //         // Error response from server
// //         setError(error.response.data.message || 'Login failed. Please try again.');
// //       } else {
// //         // Network error or other issue
// //         setError('An error occurred. Please try again.');
// //       }
// //       console.error('Login failed', error);
// //     }
// //   };

// //   return (
// //     <Container fluid className="d-flex justify-content-center align-items-center vh-100">
// //       <Row className="w-100">
// //         <Col className="d-flex justify-content-center">
// //           <Card className="p-4">
// //             <Card.Body>
// //               <img src={logo} alt="Logo" className="logo mb-4" />
// //               <h1 className="text-center mb-4">Welcome to PjsoftTech</h1>
// //               <Form onSubmit={handleSubmit} className="custom-form">
// //                 <Form.Group controlId="formBasicEmail">
// //                   <Form.Label>Email address</Form.Label>
// //                   <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email" />
// //                 </Form.Group>
// //                 <Form.Group controlId="formBasicPassword">
// //                   <Form.Label>Password</Form.Label>
// //                   <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
// //                 </Form.Group>
// //                 {error && <p className="text-danger">{error}</p>}
// //                 <Button variant="primary" type="submit" className="w-100 mb-2">
// //                   Login
// //                 </Button>
// //               </Form>
// //             </Card.Body>
// //           </Card>
// //         </Col>
// //       </Row>
// //     </Container>
// //   );
// // }

// // export default Login;

//   // const handleSubmit = async (event) => {
//   //   event.preventDefault();
//   //   try {
//   //     const response = await axios.post('http://localhost:8081/login',
//   //     //  const response = await axios.post('http://localhost:8081/student/adminLogin',
//   //      {
//   //       email,
//   //       password,
//   //       confirmPassword: password, // Assuming the confirmPassword is same as password for login
//   //     });
//   //     if (response.status === 200) {
//   //       console.log('Login successful!');
//   //       localStorage.setItem('token', 'mockToken'); // Mock storing token
//   //       onLogin(); // Update authentication state
//   //       navigate('/layout/dashboard');
//   //     }
//   //   } catch (error) {
//   //     if (error.response) {
//   //       // Error response from server
//   //       setError(error.response.data);
//   //     } else {
//   //       // Network error or other issue
//   //       setError('An error occurred. Please try again.');
//   //     }
//   //     console.error('Login failed', error);
//   //   }
//   // };

//   import React, { useState } from 'react';
//   import { Container, Grid, Paper, TextField, Button, Typography, Link } from '@mui/material';
//   import styled from '@emotion/styled';
//   import { keyframes } from '@emotion/react';
//   import axios from 'axios';
//   import { useNavigate } from 'react-router-dom';

//   const fadeIn = keyframes`
//     from {
//       opacity: 0;
//     }
//     to {
//       opacity: 1;
//     }
//   `;

//   const LoginContainer = styled(Container)`
//     min-height: 100vh;
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     background-color: #0e1a2b;
//     animation: ${fadeIn} 1s ease-in-out;
//     padding: 0;
//   `;

//   const LoginGrid = styled(Grid)`
//     height: 100vh;
//   `;

//   const LoginPaper = styled(Paper)`
//     padding: 32px;
//     width: 100%;
//     max-width: 400px;
//     box-shadow: 0 3px 5px 2px rgba(255, 105, 135, 0.3);
//     animation: ${fadeIn} 1s ease-in-out;
//     background-color: #1e2a38;
//     color: #fff;
//     @media (max-width: 600px) {
//       padding: 16px;
//     }
//   `;

//   const Logo = styled('img')`
//     display: block;
//     margin: 0 auto 20px;
//     width: 100px;
//     height: 100px;
//     animation: ${fadeIn} 1s ease-in-out;
//   `;

//   const LoginHeader = styled(Typography)`
//     text-align: center;
//     margin-bottom: 24px;
//     animation: ${fadeIn} 1s ease-in-out;
//     color: #fff;
//   `;

//   const CustomForm = styled('form')`
//     display: flex;
//     flex-direction: column;
//   `;

//   const FormGroup = styled('div')`
//     margin-bottom: 16px;
//   `;

//   const FormControl = styled(TextField)`
//     width: 100%;
//     .MuiInputBase-root {
//       color: #fff;
//     }
//     .MuiOutlinedInput-notchedOutline {
//       border-color: #fff;
//     }
//     .MuiInputLabel-root {
//       color: #fff;
//     }
//   `;

//   const ErrorMessage = styled(Typography)`
//     color: red;
//     margin-bottom: 16px;
//   `;

//   const BtnPrimary = styled(Button)`
//     margin-bottom: 16px;
//   `;

//   const ForgotPasswordLink = styled(Link)`
//     display: block;
//     text-align: center;
//     margin-top: 16px;
//     color: #fff;
//   `;

//   const BackgroundContainer = styled('div')`
//     display: flex;
//     width: 100vw;
//     height: 100vh;
//     background-color: #0e1a2b;
//     background-image: url('./path_to_your_background_image.png'); // Ensure you use the correct path to your background image
//     background-size: cover;
//     background-position: center;
//   `;

//   function Login({ onLogin }) {
//     const[institutecode, setInstitutecode]=useState('');
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState('');
//     const navigate = useNavigate();

//     const loginUser = async (institutecode,email, password) => {
//       return axios.post('http://localhost:8081/login', { institutecode,email, password });
//     };

//     // const handleSubmit = async (event) => {
//     //   event.preventDefault();
//     //   try {
//     //     const response = await loginUser(institutecode,email, password);
//     //     if (response && response.data) {
//     //       console.log('Login successful!', response.data);
//     //       localStorage.setItem('token', response.data.token); // Store the token
//     //       localStorage.setItem('userId', response.data.userId); // Store the user ID
//     //       localStorage.setItem('email', email); // Store the email
//     //       onLogin(); // Update the authentication state
//     //       navigate('/layout');
//     //     } else {
//     //       throw new Error('Invalid response from the server');
//     //     }
//     //   } catch (error) {
//     //     console.error('Error logging in:', error.response ? error.response.data : error.message);
//     //     setError('Invalid email or password');
//     //   }
//     // };

//     const handleForgotPassword = () => {
//       navigate('/forgot-password');
//     };

//     const handleSubmit = async (event) => {
//       event.preventDefault();
//       try {
//         const response = await loginUser(institutecode, email, password);

//         if (response.status === 200) {
//           console.log('Login successful!', response.data);
//           localStorage.setItem('token', response.data.token); // Assuming token is sent in the response
//           localStorage.setItem('userId', response.data.userId); // Assuming userId is sent in the response
//           localStorage.setItem('email', email); // Store the email
//           onLogin(); // Update the authentication state
//           navigate('/layout');
//         } else if (response.status === 401) {
//           if (response.data === 'Incorrect password') {
//             setError('Incorrect password');
//           } else if (response.data === 'Account expired') {
//             setError('Account expired');
//           } else {
//             setError('Unauthorized access');
//           }
//         } else if (response.status === 404) {
//           if (response.data === 'Incorrect institutecode') {
//             setError('Incorrect Institute Code');
//           } else if (response.data === 'Admin not found') {
//             setError('Admin not found');
//           }
//         } else {
//           throw new Error('Unexpected response from the server');
//         }
//       } catch (error) {
//         console.error('Error logging in:', error.response ? error.response.data : error.message);
//         setError('An error occurred during login. Please try again later.');
//       }
//     };

//     return (
//       <BackgroundContainer>
//         <LoginContainer>
//           <LoginGrid container spacing={0}>
//             <Grid item xs={12} md={6}>
//               {/* <GifContainer>
//                 <GifImage src={'https://media-s3-us-east-1.ceros.com/chronicle-of-higher-education/images/2023/07/17/42089013023ff427b96cac277f91d8f4/thetranscriptofthefuture.gif'} alt="Animation" />
//               </GifContainer> */}
//             </Grid>
//             <Grid item xs={12} md={6} display="flex" justifyContent="center" alignItems="center">
//               <LoginPaper elevation={6}>
//                 {/* <Logo src={logo} alt="Logo" /> */}
//                 <LoginHeader variant="h4">Welcome to PjsoftTech</LoginHeader>
//                 <CustomForm onSubmit={handleSubmit}>
//                 <FormGroup>
//                     <FormControl
//                       label="Institute Code"
//                       type="text"
//                       value={institutecode}
//                       onChange={(e) => setInstitutecode(e.target.value)}
//                       placeholder="Enter Institute Code"
//                       variant="outlined"
//                       fullWidth
//                     />
//                   </FormGroup>
//                   <FormGroup>
//                     <FormControl
//                       label="Email address"
//                       type="email"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       placeholder="Enter email"
//                       variant="outlined"
//                       fullWidth
//                     />
//                   </FormGroup>
//                   <FormGroup>
//                     <FormControl
//                       label="Password"
//                       type="password"
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                       placeholder="Password"
//                       variant="outlined"
//                       fullWidth
//                     />
//                   </FormGroup>
//                   {error && <ErrorMessage>{error}</ErrorMessage>}
//                   <BtnPrimary variant="contained" color="primary" type="submit">
//                     Login
//                   </BtnPrimary>
//                   <ForgotPasswordLink href="#" onClick={handleForgotPassword} underline="hover" sx={{ color: '#007BFF', '&:hover': { color: '#0056B3' } }}>Forgot Password?</ForgotPasswordLink>
//                 </CustomForm>
//               </LoginPaper>
//             </Grid>
//           </LoginGrid>
//         </LoginContainer>
//       </BackgroundContainer>
//     );
//   }

//   export default Login;
import React, { useState } from "react";
import {
  Container,
  Grid,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
} from "@mui/material";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from '../img/logo.jpg';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const BackgroundContainer = styled("div")`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #0e1a2b;
  padding: 0;
`;

const ContentWrapper = styled("div")`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 1300px;
  padding: 10px;
`;

const GifContainer = styled("div")`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const GifImage = styled("img")`
  width: 100%;
  max-width: 700px;
  height: auto;
  animation: ${fadeIn} 1s ease-in-out;
`;

const LoginContainer = styled("div")`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LoginPaper = styled(Paper)`
  padding: 32px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 3px 5px 2px rgba(255, 105, 135, 0.3);
  background-color: #1e2a38;
  color: #fff;
  animation: ${fadeIn} 1s ease-in-out;
`;

const Logo = styled("img")`
  display: block;
  margin: 0 auto 20px;
  width: 100px;
  height: 100px;
  animation: ${fadeIn} 1s ease-in-out;
`;

const LoginHeader = styled(Typography)`
  text-align: center;
  margin-bottom: 24px;
  animation: ${fadeIn} 1s ease-in-out;
  color: #fff;
`;

const CustomForm = styled("form")`
  display: flex;
  flex-direction: column;
`;

const FormGroup = styled("div")`
  margin-bottom: 16px;
`;

const FormControl = styled(TextField)`
  width: 100%;
  .MuiInputBase-root {
    color: #fff;
  }
  .MuiOutlinedInput-notchedOutline {
    border-color: #fff;
  }
  .MuiInputLabel-root {
    color: #fff;
  }
`;

const ErrorMessage = styled(Typography)`
  color: red;
  margin-bottom: 16px;
`;

const BtnPrimary = styled(Button)`
  margin-bottom: 16px;
`;

const ForgotPasswordLink = styled(Link)`
  display: block;
  text-align: center;
  margin-top: 16px;
  color: #fff;
`;

function Login({ onLogin }) {
  const [institutecode, setInstitutecode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loginUser = async (institutecode, email, password) => {
    return axios.post(
      `http://localhost:8081/institutelogin?institutecode=${institutecode}&emailaddress=${email}&password=${password}`
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(""); // Clear previous error messages
    try {
      const response = await loginUser(institutecode, email, password);

      if (response.status === 200) {
        console.log("Login successful!", response.data);
        localStorage.setItem("institutecode", institutecode);
        localStorage.setItem("email", email);
        onLogin();
        navigate("/layout/combineDash");
      } else if (response.status === 401) {
        if (response.data === "Incorrect password") {
          setError("Incorrect password");
        } else if (response.data === "Account expired") {
          setError("Account expired");
        } else {
          setError("Unauthorized access");
        }
      } else if (response.status === 404) {
        if (response.data === "Incorrect institutecode") {
          setError("Incorrect Institute Code");
        } else if (response.data === "Admin not found") {
          setError("Admin not found");
        }
      } else {
        throw new Error("Unexpected response from the server");
      }
    } catch (error) {
      console.error(
        "Error logging in:",
        error.response ? error.response.data : error.message
      );
      setError("An error occurred during login. Please try again later.");
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <BackgroundContainer>
      <ContentWrapper>
        <GifContainer>
          <GifImage
            src="https://cdn.dribbble.com/users/2401141/screenshots/5487982/developers-gif-showcase.gif"
            alt="Animation"
          />
        </GifContainer>
        <LoginContainer>
          <LoginPaper elevation={6}>
            <Logo src={logo} alt="Logo" />
            <LoginHeader variant="h4">Welcome to PjsoftTech</LoginHeader>
            <CustomForm onSubmit={handleSubmit}>
              <FormGroup>
                <FormControl
                  label="Institute Code"
                  type="text"
                  value={institutecode}
                  onChange={(e) => setInstitutecode(e.target.value)}
                  placeholder="Enter Institute Code"
                  variant="outlined"
                  fullWidth
                />
              </FormGroup>
              <FormGroup>
                <FormControl
                  label="Email address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  variant="outlined"
                  fullWidth
                />
              </FormGroup>
              <FormGroup>
                <FormControl
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  variant="outlined"
                  fullWidth
                />
              </FormGroup>
              {error && <ErrorMessage>{error}</ErrorMessage>}
              <BtnPrimary variant="contained" color="primary" type="submit">
                Login
              </BtnPrimary>
              <ForgotPasswordLink
                href="#"
                onClick={handleForgotPassword}
                underline="hover"
                sx={{ color: "#007BFF", "&:hover": { color: "#0056B3" } }}
              >
                Forgot Password?
              </ForgotPasswordLink>
            </CustomForm>
          </LoginPaper>
        </LoginContainer>
      </ContentWrapper>
    </BackgroundContainer>
  );
}

export default Login;

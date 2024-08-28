// import React, { useState } from 'react';
// import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import './Login.css';
// import logo from './logo.jpg';

// function Login({ onLogin }) {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     try {
//       const response = await axios.post('http://localhost:8081/login', {
//         email,
//         password,
//         confirmPassword: password, // Assuming the confirmPassword is same as password for login
//       });
//       if (response.status === 200) {
//         console.log('Login successful!');
//         //localStorage.setItem('token', 'mockToken'); // Mock storing token
//         localStorage.setItem('email', email); // Storing email in localStorage
//         onLogin(); // Update authentication state
//         navigate('/layout/dashboard');
//       }
//     } catch (error) {
//       if (error.response) {
//         // Error response from server
//         setError(error.response.data);
//       } else {
//         // Network error or other issue
//         setError('An error occurred. Please try again.');
//       }
//       console.error('Login failed', error);
//     }
//   };

//   return (
//     <Container fluid className="custom-container ">
//       <Row className="w-100">
//         <Col className="d-flex justify-content-center">
//           <Card className="custom-card vh-100">
//             <Card.Body>
//               <img src={logo} alt="Logo" className="logo" />
//               <h1 className="text-center mb-4">Welcome to PjsoftTech</h1>
//               <Form onSubmit={handleSubmit} className="custom-form">
//                 <Form.Group controlId="formBasicEmail">
//                   <Form.Label>Email address</Form.Label>
//                   <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email" />
//                 </Form.Group>
//                 <Form.Group controlId="formBasicPassword">
//                   <Form.Label>Password</Form.Label>
//                   <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
//                 </Form.Group>
//                 {error && <p className="text-danger">{error}</p>}
//                 <Button variant="primary" type="submit" className="w-100 mb-2">
//                   Login
//                 </Button>
//               </Form>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// }

// export default Login;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Grid,
  Paper,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "./logo.jpg";
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;
const LoginContainer = styled(Container)`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #0e1a2b;
  animation: ${fadeIn} 1s ease-in-out;
  padding: 0;
`;
const LoginGrid = styled(Grid)`
  height: 100vh;
`;
const LoginPaper = styled(Paper)`
  padding: 32px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 3px 5px 2px rgba(255, 105, 135, 0.3);
  animation: ${fadeIn} 1s ease-in-out;
  background-color: #1e2a38;
  color: #fff;
  @media (max-width: 600px) {
    padding: 16px;
  }
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
const GifContainer = styled("div")`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
`;
const GifImage = styled("img")`
  width: 100%;
  height: auto;
  max-height: 100%;
  animation: ${fadeIn} 1s ease-in-out;
`;
const BackgroundContainer = styled("div")`
  display: flex;
  width: 100vw;
  height: 100vh;
  background-color: #0e1a2b;
  background-image: url("./path_to_your_background_image.png"); // Ensure you use the correct path to your background image
  background-size: cover;
  background-position: center;
`;
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State for error message
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8081/login", {
        email,
        password,
      });
      if (response.status === 200) {
        localStorage.setItem("APIemail", email);
        navigate("/dashboard"); // Redirect to the dashboard upon successful login
      } else {
        setError("Invalid credentials"); // Set error message for invalid credentials
      }
    } catch (error) {
      console.error("Login Error:", error);
      setError("An error occurred. Please try again."); // Set error message for server error
    }
  };
  return (
    <BackgroundContainer>
      <LoginContainer>
        <LoginGrid container spacing={0}>
          <Grid item xs={12} md={6}>
            <GifContainer>
              <GifImage
                src="https://cdn.dribbble.com/users/2401141/screenshots/5487982/developers-gif-showcase.gif"
                alt="Animation"
              />
            </GifContainer>
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <LoginPaper elevation={6}>
              <Logo src={logo} alt="Logo" />
              <LoginHeader variant="h4">Welcome to PjsoftTech</LoginHeader>
              <CustomForm onSubmit={handleLogin}>
                {error && <ErrorMessage>{error}</ErrorMessage>}
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
                <BtnPrimary variant="contained" color="primary" type="submit">
                  Login
                </BtnPrimary>
                {/* <ForgotPasswordLink href="#">
                  Forgot Password?
                </ForgotPasswordLink>
                <Link
                  to="/student/register"
                  style={{
                    color: "white",
                    textDecoration: "none",
                    margin: "10px 0",
                    justifyContent: "center",
                  }}
                >
                  Don't Have an Account?
                </Link> */}
              </CustomForm>
            </LoginPaper>
          </Grid>
        </LoginGrid>
      </LoginContainer>
    </BackgroundContainer>
  );
};
export default Login;

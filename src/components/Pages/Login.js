import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup"; // Validation library for form

// Form validation schema using Yup
const validationSchema = Yup.object({
  name: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
});

function Login() {
  const [error, setError] = useState(""); 
  // State to store error messages
  const navigate = useNavigate(); 
  // Hook for navigation

  // Check if the user is already authenticated and redirect to the dashboard
  useEffect(() => {
    if (localStorage.getItem("isAuthenticated")) {
      navigate("/dashboard", { replace: true }); // Prevent back navigation
    }
  }, [navigate]);

  // Form submit handler
  const handleSubmit = async (values) => {
    const { name, password } = values;
    setError(""); 

    // Check if the user is already logged in
    if (localStorage.getItem("isLoggedIn") === "true") {
      navigate("/dashboard"); // Redirect to dashboard
      return;
    }

    try {
      // Make an API request to fetch user details based on the username
      const response = await fetch(
        `http://localhost:5000/users?username=${name}`
      );
      const data = await response.json();

      // Check if user exists and validate password
      if (data.length === 0) {
        setError("Invalid username or password"); 
      } else if (data[0].password === password) {
        // If the password matches, authenticate the user store in localstorage
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("username",data[0].username );
        navigate("/dashboard"); // Redirect to dashboard
      } else {
        setError("Incorrect password"); // Show error for incorrect password
      }
    } catch (err) {
      setError("Something went wrong. Please try again later."); // Handle API errors
    }
  };

  return (
    <Container maxWidth="sm">
      {/* Login Form Container */}
      <Box
        sx={{ mt: 8, p: 4, boxShadow: 3, borderRadius: 2, textAlign: "center" }}
      >
        {/* Page Title */}
        <Typography variant="h4" data-testid="login-header">
          Login
        </Typography>

        {/* Formik for handling form state & validation */}
        <Formik
          initialValues={{ name: "", password: "" }} // Initial form values
          validationSchema={validationSchema} // Attach validation schema
          onSubmit={handleSubmit} // Submit handler
        >
          {({ isSubmitting }) => (
            <Form>
              {/* Username field */}
              <Field
                as={TextField}
                fullWidth
                margin="normal"
                label="Username"
                name="name"
                required
                variant="outlined"
                helperText={<ErrorMessage name="name" />} // Display validation error
                error={false}
              />

              {/* Password field */}
              <Field
                as={TextField}
                fullWidth
                margin="normal"
                label="Password"
                type="password"
                name="password"
                required
                variant="outlined"
                helperText={<ErrorMessage name="password" />} // Display validation error
                error={false}
              />

              {/* Display error message if login fails */}
              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}

          
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                type="submit"
                disabled={isSubmitting} // Disable button when submitting
              >
                Login
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
}

export default Login;

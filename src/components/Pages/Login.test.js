import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; // For using matchers like toBeInTheDocument
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter to wrap Login component
import Login from './Login'; // Path to your Login component

// Mock fetch to avoid making real API calls
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([]), // Simulating no user found (invalid login)
  })
);

describe('Login Component', () => {
  test('displays error messages when username or password is empty and submit is clicked', async () => {
    // Step 1: Render the Login component wrapped in BrowserRouter
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // Step 2: Get the username and password input fields, and the submit button using screen queries
    const usernameInput = screen.getByLabelText(/username/i); 
    const passwordInput = screen.getByLabelText(/password/i); 
    const loginButton = screen.getByRole('button', { name: /Login/i }); // Query for the login button

    // Step 3: Leave the username field empty and enter a password
    fireEvent.change(passwordInput, { target: { value: 'demo@123' } }); // Set password input value

    // Step 4: Click the login button
    fireEvent.click(loginButton); // Trigger the click event for the login button

    // Step 5: Check if the error message for the username field is displayed
    expect(await screen.findByText(/username is required/i)).toBeInTheDocument(); // Expect an error message for username

    // Step 6: Clear the password field and enter a username
    fireEvent.change(usernameInput, { target: { value: 'John Doe' } });
    fireEvent.change(passwordInput, { target: { value: '' } }); 

    // Step 7: Click the login button again
    fireEvent.click(loginButton); // Trigger the click event for the login button again

    // Step 8: Check if the error message for the password field is displayed
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument(); // Expect an error message for password
  });
});

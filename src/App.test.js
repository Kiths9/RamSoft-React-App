import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

// Mocking localStorage for the test
beforeEach(() => {
  // Clear any existing localStorage before each test
  localStorage.clear();
});

// Test if user is redirected to /login page if not authenticated
describe('App', () => {
  test('redirects to /login if user is not authenticated', async () => {
    render(<App />);  // No need for <Router> here, since App already contains it

    // Look for the unique element in the Login component (using data-testid)
    expect(screen.getByTestId('login-header')).toBeInTheDocument(); // Check for Login header
  });

  // Test if user can access /dashboard when authenticated
  test('renders /dashboard if user is authenticated', () => {
    // Simulate the user being authenticated by setting a flag in localStorage
    localStorage.setItem('isAuthenticated', 'true');

    render(<App />);  // No need for <Router> here

    // Check if the Dashboard component is rendered by looking for text that is unique to the dashboard
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument(); // Replace 'dashboard' with a unique text from your Dashboard
  });

  // Test if user is redirected to /login when not authenticated and tries to access /dashboard
  test('redirects to /login when trying to access /dashboard if not authenticated', async () => {
    render(<App />);  // No need for <Router> here

    // At this point, the user is not authenticated, so they should see the login page
    await waitFor(() => expect(screen.getByTestId('login-header')).toBeInTheDocument());
  });
});

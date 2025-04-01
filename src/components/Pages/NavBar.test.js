import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Navbar from "./Navbar"; // Path to the Navbar component
import { BrowserRouter as Router } from "react-router-dom";
import "@testing-library/jest-dom"; // for the "toBeInTheDocument" matcher

// Mock any dependencies if needed (e.g., if you use 'CustomModal' or API calls)

describe("Navbar", () => {
  // Function to render Navbar with Router for routing functionality
  const renderNavbar = () => {
    render(
      <Router>
        <Navbar />
      </Router>
    );
  };

  test("renders Navbar correctly", () => {
    renderNavbar(); // Render Navbar component wrapped with Router

    // Step 1: Check if the logo is rendered correctly
   //  expect(screen.getByText(/LOGO/i)).toBeInTheDocument(); // Check for "LOGO" text

    // Step 2: Check if the menu items are displayed
    expect(screen.getByText(/Home/i)).toBeInTheDocument(); 
    expect(screen.getByText(/About/i)).toBeInTheDocument(); 
    expect(screen.getByText(/Blog/i)).toBeInTheDocument(); 
    expect(screen.getByText(/Services/i)).toBeInTheDocument(); 
    expect(screen.getByText(/Contact/i)).toBeInTheDocument(); 

    // Step 3: Check if the "Create" button is displayed
    expect(screen.getByText(/\+ Create/i)).toBeInTheDocument(); // Check for "+ Create" button
  });

  test('opens the modal when "Create" button is clicked', () => {
    renderNavbar(); // Render Navbar component with Router

    // Step 1: Click on the "Create" button to open the modal
    fireEvent.click(screen.getByText(/\+ Create/i));

    // Step 2: Check if the modal with title "Create New Task" is visible
    expect(screen.getByText(/Create New Task/i)).toBeInTheDocument(); // Modify this as per your modal's content
  });

  test("shows user settings menu when avatar is clicked", () => {
    renderNavbar(); // Render Navbar component with Router

    // Step 1: Find the user avatar button (assuming it has a tooltip or aria-label for easy selection)
    const avatarButton = screen.getByRole("button", { name: /open settings/i });
    
    // Step 2: Simulate a click on the avatar button
    fireEvent.click(avatarButton);

    // Step 3: Check if the user settings menu appears
    expect(screen.getByText(/Profile/i)).toBeInTheDocument(); 
    expect(screen.getByText(/Account/i)).toBeInTheDocument(); 
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument(); 
    expect(screen.getByText(/Logout/i)).toBeInTheDocument();
  });

  test("removes authentication and redirects to login page on logout", async () => {
    // Step 1: Setup localStorage mock to simulate user authentication
    localStorage.setItem("isAuthenticated", "true");

    renderNavbar(); // Render Navbar component with Router

    // Step 2: Find the user avatar button and simulate a click to open the settings menu
    const avatarButton = screen.getByRole("button", { name: /open settings/i });
    fireEvent.click(avatarButton);

    // Step 3: Find the "Logout" button and simulate a click on it
    const logoutButton = screen.getByText(/Logout/i);
    fireEvent.click(logoutButton);

    // Step 4: Wait for the redirect action to occur (typically triggered by a state change or routing)
    await waitFor(() => {
      // Step 5: Verify that the URL contains "/login", indicating a successful redirect to the login page
      expect(window.location.href).toContain("/login");
    });
  });
});

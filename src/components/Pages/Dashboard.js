import React, { useEffect } from "react";
import Navbar from "./Navbar";
import TaskManager from "./TaskManager";
import { Box } from "@mui/material";

function Dashboard() {
  useEffect(() => {
    if (window.history && window.history.replaceState) {
      // Prevent users from navigating back to the login page after login
      // This replaces the current history state without creating a new entry
      window.history.replaceState(null, null, window.location.href);
    }
  }, []);//runs on;y once

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      {/* Navigation bar at the top */}
      <Navbar />

      {/* Page heading */}
      <h1>Dashboard</h1>

      {/* Main task management component */}
      <TaskManager />
    </Box>
  );
}

export default Dashboard;
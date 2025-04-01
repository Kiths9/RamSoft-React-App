
import './App.css';
import Login from './components/Pages/Login';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from './components/Pages/Dashboard';
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from './Theme'; // Ensure your theme is imported correctly

const PrivateRoute = ({ element }) => {
  return localStorage.getItem("isAuthenticated") ? element : <Navigate to="/login" />;
};

function App() {
  return (
    <ThemeProvider theme={theme}> 
      <CssBaseline />
      <Router>
        <Routes>
          {/* Route for login page */}
          <Route path="/login" element={<Login />} />
          
          {/* Private Route: Only accessible when authenticated */}
          <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
          
          {/* Default route: Redirect to login if no route matches */}
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;

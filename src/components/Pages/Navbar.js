import React, { useState } from "react";
import "../styles/Nav.css";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Container,
  Menu,
  MenuItem,
  Button,
  Avatar,
  Tooltip,
  Box,

  Backdrop,

  MenuItem as MuiMenuItem,

} from "@mui/material";
import AdbIcon from "@mui/icons-material/Adb";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import CustomModal from "../Modal/CustomModal";
import dayjs from "dayjs";

const pages = ["Home", "About", "Blog", "Services", "Contact"];
const settings = ["Profile", "Account", "Dashboard", "Logout"];


const Navbar = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [title1, setSelectedProject] = useState("");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [assignee, setAssignee] = useState("");
  const [deadline, setDeadline] = useState(dayjs());
  const [newTask, setNewTask] = useState({
    title: "",
    summary: "",
    status: "active",
  });
  const navigate = useNavigate(); // Navigation hook
  const [tasks, setTasks] = useState([]);
  // Open & Close Menus
  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);
  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  // Handle menu item click
  const handleMenuClick = (page) => {
    console.log("Clicked:", page);
    if (page === "Logout") {
      localStorage.removeItem("isAuthenticated");
      navigate("/login"); // Explicit navigation to login page
    }
  };

  // Open & Close Modal
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  // Handle Form Submission
  const handleCreate = () => {
    setNewTask({ title, summary, assignee });
    console.log({ title, summary, status: "active" });
    alert("Task Created Successfully!");

    fetch("http://localhost:5000/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, summary, status: "active", deadline }),
    })
      .then((res) => res.json())
      .then((data) => setTasks([...tasks, data]));
    setNewTask({ title: "", summary: "", status: "active", deadline });

    handleCloseModal();
  };

  return (
    <>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            
            <Typography
              variant="h6"
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              TaskMinds
            </Typography>

            {/* Mobile Menu */}
            {/* <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton size="large" onClick={handleOpenNavMenu} color="inherit">
                <MenuIcon />
              </IconButton>
              <Menu anchorEl={anchorElNav} open={Boolean(anchorElNav)} onClose={handleCloseNavMenu}>
                {pages.map((page) => (
                  <MenuItem key={page} onClick={() => handleMenuClick(page)}>
                    <Typography>{page}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box> */}

            {/* Desktop Menu with "Create" Button */}
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {pages.map((page) => (
                <Button
                  key={page}
                  // onClick={() => handleMenuClick(page)}
                  sx={{ my: 2, color: "white" }}
                >
                  {page}
                </Button>
              ))}
              {/* 🔴 "Create" Button */}
              <Button
                className="myBtn"
                variant="contained"
                // color="secondary"
                sx={{ ml: 2, mt: 1, background: "white", color: "black" }}
                onClick={handleOpenModal}
              >
                + Create
              </Button>
            </Box>

            {/* User Avatar & Menu */}
            <Box sx={{ flexGrow: 0 }}>
            {localStorage.getItem("username")+" "}
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                 
                  <Avatar alt="User Avatar" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                anchorEl={anchorElUser}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem
                    key={setting}
                    onClick={() => handleMenuClick(setting)}
                  >
                    <Typography>{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* 🔴 MODAL: Create Task Form */}
      <CustomModal
        summary={summary}
        setSummary={setSummary}
        assignee={assignee}
        setAssignee={setAssignee}
        openModal={openModal}
        onClose={handleCloseModal}
        setDeadline={setDeadline}
        deadline={deadline}
        closeAfterTransition
        Backdrop={Backdrop}
        BackdropProps={{ timeout: 500 }}
        setSelectedProject={setSelectedProject}
        title={title}
        setTitle={setTitle}
    
        handleCreate={handleCreate}
      ></CustomModal>
    </>
  );
};

export default Navbar;

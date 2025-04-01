import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Box,
  Typography,
  Card,
  Menu,
  MenuItem,
  IconButton,
  Modal,
  Button,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const TaskManager = () => {
  // State hooks for managing tasks, search query, modal state, and task data
  const [tasks, setTasks] = useState([]); // List of tasks
  const [tasksId, setTasksId] = useState(null); // Current task ID being edited
  const [searchQuery, setSearchQuery] = useState(""); // Search filter for tasks
  const [openModal, setOpenModal] = useState(false); // Modal visibility for editing
  const [selectedTask, setSelectedTask] = useState(null); // Task selected for editing
  const [editedTitle, setEditedTitle] = useState(""); // Edited task title
  const [editedSummary, setEditedSummary] = useState(""); // Edited task summary
  const [deadline, setDeadline] = useState(dayjs()); // Task deadline date (using dayjs)

  // Fetch tasks from the API on component mount
  useEffect(() => {
    fetch("http://localhost:5000/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data)); // Set tasks to state after fetching
  }, []); 

  // Function to move task to a different status (done, deleted, etc.)
  const handleMoveTask = (taskId, status) => {
    fetch(`http://localhost:5000/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }), // Send new status in the request body
    })
      .then((response) => response.json())
      .then((updatedTask) => {
        setTasks(
          tasks.map((task) => (task.id === taskId ? updatedTask : task))
        ); // Update task 
      })
      .catch((error) => console.error("Error updating task:", error));
  };

  // Function to set task data when the edit button is clicked
  const handleEditTask = (task) => {
    setTasksId(task.id); 
    setSelectedTask(task); 
    setEditedTitle(task.title); 
    setEditedSummary(task.summary); 
    setDeadline(dayjs(task.deadline)); 
    setOpenModal(true); 
  };

  // Function to save changes after editing the task
  const handleSaveEdit = () => {
    fetch(`http://localhost:5000/tasks/${tasksId}`, {
      method: "PATCH", 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: editedTitle,
        summary: editedSummary,
        status: selectedTask.status,
        deadline: deadline.toISOString(), // Convert dayjs object to ISO string
      }),
    })
      .then((response) => response.json())
      .then((updatedTask) => {
        setTasks(
          tasks.map((task) => (task.id === tasksId ? updatedTask : task))
        ); // Update task in the list after saving
      })
      .catch((error) => console.error("Error updating task:", error));

    setOpenModal(false);
  };

  // Filter tasks based on search query
  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // TaskItem component displays each task with a menu for actions
  const TaskItem = ({ task }) => {
    const [anchorEl, setAnchorEl] = useState(null); // Anchor for the dropdown menu

    const handleMenuOpen = (event) => {
      setAnchorEl(event.currentTarget); // Set menu anchor to clicked element
    };

    const handleMenuClose = () => {
      setAnchorEl(null); // Close the menu when an option is selected
    };

    return (
      <Card
        sx={{
          mb: 1,
          p: 2,
          maxHeight: 100,
          overflow: "hidden",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer", // Make it look clickable
        }}
      >
        <Typography
          noWrap
          data-testid={`task-title-${task.id}`} // For testing purposes
          onClick={handleMenuOpen} // Clicking title opens menu
        >
          {task.title}
        </Typography>

        {task.status !== "deleted" && (
          <>
            <IconButton
              data-testid={`more-button-${task.id}`} // For testing purposes
              onClick={handleMenuOpen} // Open menu on button click
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl} 
              open={Boolean(anchorEl)} // Menu open state
              onClose={handleMenuClose} // Close menu
            >
              {/* Menu options */}
              <MenuItem
                onClick={() => {
                  handleEditTask(task); // Handle editing task
                  handleMenuClose();
                }}
              >
                View
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleMoveTask(task.id, "done"); // Move task to "done"
                  handleMenuClose();
                }}
              >
                Move to Done
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleMoveTask(task.id, "deleted"); // Move task to "deleted"
                  handleMenuClose();
                }}
              >
                Delete
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleMoveTask(task.id, "active"); // Move task back to "active"
                  handleMenuClose();
                }}
              >
                Move to Active
              </MenuItem>
            </Menu>
          </>
        )}
      </Card>
    );
  };

  // TaskList component for displaying tasks by status (active, done, deleted)
  const TaskList = ({ status, title }) => {
    const [sortOrder, setSortOrder] = useState("asc"); // Default sorting order

    // Sorting tasks by title
    const sortedTasks = [...filteredTasks]
      .filter((task) => task.status === status)
      .sort((a, b) => {
        return sortOrder === "asc"
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title); // Toggle between ascending and descending order
      });

    return (
      <Box
        sx={{
          minHeight: 200,
          maxHeight: 400, // Set max height for scrolling
          overflowY: "auto", // Enable vertical scrolling
          p: 2,
          borderRadius: 4,
          boxShadow: `0.3em 0.3em 1em rgba(0,0,0,0.3)`,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6">{title}</Typography>
          <Button
            size="small"
            variant="outlined"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          >
            Sort {sortOrder === "asc" ? "↓" : "↑"} {/* Sort order toggle */}
          </Button>
        </Box>

        {sortedTasks.map((task) => (
          <TaskItem key={task.id} task={task} /> // Render each task
        ))}
      </Box>
    );
  };

  return (
    <Container>
      <TextField
        fullWidth
        label="Search Tasks"
        onChange={(e) => setSearchQuery(e.target.value)} // Handle search input
        sx={{ mb: 2 }}
      />

      <Box sx={{ display: "flex", gap: 2 }}>
        <Box sx={{ flex: 1 }}>
          <TaskList status="active" title="To Do Tasks" /> {/* Active tasks */}
        </Box>
        <Box sx={{ flex: 1 }}>
          <TaskList status="done" title="Completed Tasks" /> {/* Completed tasks */}
        </Box>
        <Box sx={{ flex: 1 }}>
          <TaskList status="deleted" title="Deleted Items" /> {/* Deleted tasks */}
        </Box>
      </Box>

      {/* Task Edit Modal */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "white",
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6">View Task</Typography>
          <TextField
            fullWidth
            sx={{ mt: 2 }}
            label="Title"
            value={editedTitle} // Bind title input to state
            onChange={(e) => setEditedTitle(e.target.value)} // Update title on change
          />
          <TextField
            fullWidth
            sx={{ mt: 2 }}
            label="Summary"
            value={editedSummary} // Bind summary input to state
            onChange={(e) => setEditedSummary(e.target.value)} // Update summary on change
            multiline
            rows={3}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Deadline"
              sx={{ width: "100%", marginBottom: "10%", mt: 2 }}
              value={deadline} // Bind deadline to state
              onChange={(newValue) => setDeadline(newValue)} // Update deadline on change
            />
          </LocalizationProvider>
          <Box
            sx={{ mt: 2, display: "flex", justifyContent: "flex-end", gap: 1 }}
          >
            <Button onClick={() => setOpenModal(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleSaveEdit}>
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
};

export default TaskManager;

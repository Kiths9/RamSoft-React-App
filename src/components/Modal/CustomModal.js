import React from "react";
import {

  Typography,


  Button,

  Box,
  Modal,
  Fade,
  Backdrop,
  TextField,
  MenuItem as MuiMenuItem,

} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

function CustomModal(props) {
  return (
    <Modal
      open={props.openModal}
      onClose={props.handleCloseModal}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
    >
      <Fade in={props.openModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Create New Task
          </Typography>


          {/* Title TextField */}
          <TextField
            fullWidth
            label="Title"
            value={props.title}
            onChange={(e) => props.setTitle(e.target.value)}
            sx={{ mb: 2 }}
          />

          {/* Summary TextField */}
          <TextField
            fullWidth
            label="Summary"
            multiline
            rows={3}
            value={props.summary}
            onChange={(e) => props.setSummary(e.target.value)}
            sx={{ mb: 2 }}
          />

  

          {/* Deadline Date Picker */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
  label="Deadline"
  sx={{ width: "100%", marginBottom: "10%", mt: 2 }}
  value={props.deadline}
  onChange={(newValue) => props.setDeadline(newValue)}
  textField={(params) => <TextField fullWidth sx={{ mb: 2 }} {...params} />}
/>
          </LocalizationProvider>

          {/* Submit and Close Buttons */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={props.handleCreate}
            >
              Create
            </Button>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              onClick={props.onClose}
            >
              Close
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
}

export default CustomModal;

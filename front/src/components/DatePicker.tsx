import React from "react";
import { IconButton, Box, Typography } from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, addDays, subDays } from "date-fns";

interface CustomDatePickerProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({ selectedDate, setSelectedDate }) => {
  const handlePrevDay = () => setSelectedDate(subDays(selectedDate, 1));
  const handleNextDay = () => setSelectedDate(addDays(selectedDate, 1));

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
        padding: "8px 16px",
        borderRadius: "20px",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        gap: 1,
        maxWidth: 300,
      }}
    >
      <IconButton onClick={handlePrevDay} size="small">
        <span className="material-symbols-rounded" style={{ color: "#757575" }}>
          chevron_left
        </span>
      </IconButton>

      <DatePicker
        selected={selectedDate}
        onChange={(date) => date && setSelectedDate(date)}
        maxDate={new Date()}
        customInput={
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            <Typography variant="body1">
              {format(selectedDate, "EEE, MMM d, yyyy")}
            </Typography>
            <IconButton size="small">
              <span className="material-symbols-rounded" style={{ color: "#757575", marginLeft: "4px" }}>
                keyboard_arrow_down
              </span>
            </IconButton>
          </Box>
        }
      />

      <IconButton onClick={handleNextDay} size="small">
        <span className="material-symbols-rounded" style={{ color: "#757575" }}>
          chevron_right
        </span>
      </IconButton>
    </Box>
  );
};

export default CustomDatePicker;

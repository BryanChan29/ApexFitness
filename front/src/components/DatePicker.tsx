
import React from 'react';
// import { TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

interface CustomDatePickerProps {
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
  label?: string;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  selectedDate,
  setSelectedDate,
  label = 'Select Date',
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        label={label}
        value={selectedDate}
        onChange={(newDate) => setSelectedDate(newDate)}
        slotProps={{
          textField: {
            variant: 'outlined', 
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default CustomDatePicker;
import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';

interface EditableStatCardProps {
  label: string;
  value: number | string | null;
  type: 'number' | 'select';
  onChange: (val: number | string | null) => void;
  selectOptions?: string[]; // only used if type === 'select'
}

const EditableStatCard: React.FC<EditableStatCardProps> = ({
  label,
  value,
  type,
  onChange,
  selectOptions,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState<string>(
    value !== null ? String(value) : ''
  );

  useEffect(() => {
    setLocalValue(value !== null ? String(value) : '');
  }, [value]);

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    // Convert back to number if type=number
    if (type === 'number') {
      const parsed = localValue === '' ? null : parseInt(localValue, 10);
      onChange(isNaN(parsed as number) ? null : parsed);
    } else {
      // type === 'select'
      onChange(localValue === '' ? null : localValue);
    }
  };

  // For numeric fields, pressing Enter should commit changes
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (type === 'number' && e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    setLocalValue(e.target.value);
  };

  return (
    <Paper
      elevation={2}
      sx={{
        width: 120,
        p: 2,
        textAlign: 'center',
        borderRadius: 2,
        cursor: !isEditing ? 'pointer' : 'default',
      }}
      onClick={!isEditing ? handleClick : undefined}
    >
      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
        {label.toUpperCase()}
      </Typography>

      {!isEditing ? (
        <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
          {value !== null && value !== '' ? value : 'Not Set'}
        </Typography>
      ) : type === 'number' ? (
        <TextField
          variant="standard"
          type="number"
          value={localValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          inputProps={{
            style: { textAlign: 'center', fontWeight: 'bold' },
          }}
        />
      ) : (
        // type === 'select'
        <Select
          variant="standard"
          value={localValue}
          onChange={handleSelectChange}
          onBlur={handleBlur}
          autoFocus
        >
          {selectOptions?.map((opt) => (
            <MenuItem key={opt} value={opt}>
              {opt}
            </MenuItem>
          ))}
        </Select>
      )}
    </Paper>
  );
};

export default EditableStatCard;
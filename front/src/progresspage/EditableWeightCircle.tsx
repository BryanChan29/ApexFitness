import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField } from '@mui/material';

interface EditableWeightCircleProps {
  weight: number | null;
  color: string;
  onChange: (newWeight: number | null) => void;
}

const EditableWeightCircle: React.FC<EditableWeightCircleProps> = ({
  weight,
  color,
  onChange,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState<string>(
    weight !== null ? weight.toString() : ''
  );

  useEffect(() => {
    setLocalValue(weight !== null ? weight.toString() : '');
  }, [weight]);

  const handleClick = () => setIsEditing(true);
  const handleBlur = () => {
    setIsEditing(false);
    const parsedValue = localValue === '' ? null : parseFloat(localValue);
    onChange(parsedValue);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }

    if (e.key === '-') {
      e.preventDefault();
      return;
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
  };

  return (
    <Box
      sx={{
        width: 130,
        height: 130,
        borderRadius: '50%',
        backgroundColor: color,
        boxShadow: 3,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: !isEditing ? 'pointer' : 'default',
        transition: 'transform 0.3s ease',
        ':hover': {
          transform: !isEditing ? 'scale(1.05)' : 'none',
        },
      }}
      onClick={!isEditing ? handleClick : undefined}
    >
      {isEditing ? (
        <TextField
          variant="standard"
          type="number"
          inputMode="numeric"
          autoFocus
          value={localValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          slotProps={{
            input: {
              inputProps: {
                min: 1, // Moved 'min' into inputProps
              },
              style: { textAlign: 'center', color: 'white',
                fontWeight: 'bold',
                fontSize: '2rem',
                width: '100%'},
            },
          }}
          
        />
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
          <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
            {weight !== null ? weight : '—'}
          </Typography>
          {weight !== null && (
            <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
              lbs
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default EditableWeightCircle;
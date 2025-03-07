import React, { useState } from 'react';
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  Switch,
  FormControlLabel,
} from '@mui/material';

interface AddMealPlanModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (mealPlanName: string, isPublic: boolean) => void;
}

const AddMealPlanModal: React.FC<AddMealPlanModalProps> = ({
  open,
  onClose,
  onSave,
}) => {
  const [mealPlanName, setMealPlanName] = useState('');
  const [isPublic, setIsPublic] = useState(false);

  const handleSave = () => {
    if (!mealPlanName.trim()) {
      alert('Meal Plan name cannot be empty!');
      return;
    }
    onSave(mealPlanName, isPublic);
    setMealPlanName('');
    setIsPublic(false);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="add-meal-plan-modal">
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Create New Meal Plan
        </Typography>
        <TextField
          fullWidth
          label="Meal Plan Name"
          variant="outlined"
          value={mealPlanName}
          onChange={(e) => setMealPlanName(e.target.value)}
          sx={{ mb: 2 }}
        />
        <FormControlLabel
          control={
            <Switch
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
          }
          label="Public Visibility"
        />
        <Box
          sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}
        >
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddMealPlanModal;

import React, { useState } from 'react';
import LogFood from '../pages/LogFood';
import NutritionTable from '../components/NutritionTable';
import { Box, TextField, Button } from '@mui/material';
import { DailyFoodItem } from '../progresspage/Dashboard';

const NewMeal: React.FC = () => {
  const [foodItems, setFoodItems] = useState<DailyFoodItem[]>([]);
  const [mealPlanName, setMealPlanName] = useState<string>('');

  const handleFoodAdd = (newFood: DailyFoodItem) => {
    setFoodItems((prevItems) => [...prevItems, newFood]);
  };

  const handleMealPlanNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMealPlanName(event.target.value);
  };

  const handleSaveMeal = () => {
    console.log('Meal saved:', { mealPlanName, foodItems });
  };

  const isSaveDisabled = foodItems.length === 0 || mealPlanName.trim() === '';

  return (
    <Box>
      <LogFood onAddMealItem={handleFoodAdd} />

      <Box sx={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 2 }}>
        <TextField
          label="Meal Name"
          value={mealPlanName}
          onChange={handleMealPlanNameChange}
          margin="normal"
          sx={{
            width: '20%',
          }}
          slotProps={{
            input: {
              style: {
                backgroundColor: 'white',
                borderRadius: '30px',
              },
            },
          }}
        />
      </Box>
      <NutritionTable foodData={foodItems} />

      {!isSaveDisabled && (
        <Button
          className="primary-button"
          onClick={handleSaveMeal}
          variant="contained"
          color="primary"
        >
          Save Meal
        </Button>
      )}
    </Box>
  );
};

export default NewMeal;

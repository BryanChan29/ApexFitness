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

  const handleSaveMeal = async () => {
    try {
      const loggedFoodIds: number[] = [];
      for (const foodItem of foodItems) {
        const response = await fetch('/api/daily_food', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            meal_type: 'MealItem',
            name: foodItem.name,
            quantity: foodItem.quantity,
            calories: foodItem.calories,
            carbs: foodItem.carbs,
            fat: foodItem.fat,
            protein: foodItem.protein,
            sodium: foodItem.sodium,
            sugar: foodItem.sugar,
            date: new Date().toISOString(),
          }),
        });
        const data = await response.json();
        if (response.ok && data.id) {
          loggedFoodIds.push(data.id);
        } else {
          throw new Error('Error logging food item');
        }
      }

      // After logging all food items, create the meal
      const mealResponse = await fetch('/api/meals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mealPlanName,
          foodItems: loggedFoodIds.map((id) => ({ id })),
        }),
      });

      const mealData = await mealResponse.json();
      if (mealResponse.ok) {
        console.log('Meal saved successfully:', mealData);
        window.history.back();
      } else {
        throw new Error('Error creating meal');
      }
    } catch (error) {
      console.error('Error saving meal:', error);
    }
  };

  const isSaveDisabled = foodItems.length === 0 || mealPlanName.trim() === '';

  return (
    <Box sx={{ padding: '20px', maxWidth: '1500px', margin: '0 auto' }}>
      <LogFood onAddMealItem={handleFoodAdd} />

      <Box sx={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 2, maxWidth: '1500px', margin: 'auto' }}>
        <TextField
          label="Meal Name"
          value={mealPlanName}
          onChange={handleMealPlanNameChange}
          margin="normal"
          sx={{
            width: '30%',
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

      <Box sx={{ width: '100%'}}>
        <NutritionTable foodData={foodItems} />
      </Box>

      {!isSaveDisabled && (
        <Button
          className="primary-button"
          onClick={handleSaveMeal}
          variant="contained"
          color="primary"
          sx={{ marginTop: '20px' }} // Add spacing above the button
        >
          Save Meal
        </Button>
      )}
    </Box>
  );
}

export default NewMeal;

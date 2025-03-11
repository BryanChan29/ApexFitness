import React, { useState } from 'react';
import LogFood from '../pages/LogFood';
import NutritionTable from '../components/NutritionTable';
import { Box } from '@mui/material';
import { DailyFoodItem } from '../progresspage/Dashboard';

const NewMeal: React.FC = () => {
    const [foodItems, setFoodItems] = useState<DailyFoodItem[]>([]);

    const handleFoodAdd = (newFood: DailyFoodItem) => {
        setFoodItems((prevItems) => [...prevItems, newFood]);
    };

    return (
        <Box>
            <LogFood onAddMealItem={handleFoodAdd} />
            <NutritionTable foodData={foodItems} />
        </Box>
    );
};

export default NewMeal;

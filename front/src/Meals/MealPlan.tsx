import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid2 as Grid,
  IconButton,
  Button,
  Table,
  TableRow,
  TableCell,
  Paper,
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  DBDailyFoodItem,
  UIFormattedDailyFoodItem,
  UIFormattedMealPlan,
  formatMeal,
} from '@apex/shared';
import axios from 'axios';
import './SavedMeals.css';

const sampleMealPlan: UIFormattedMealPlan = {
  monday: {
    breakfast: [
      {
        name: 'Oatmeal with Bananas',
        meal_type: 'breakfast',
        calories: '300 cal',
        carbs: '45g',
        fat: '5g',
        protein: '10g',
        sodium: '200mg',
        sugar: '15g',
      },
    ],
    lunch: [
      {
        name: 'Chicken Caesar Salad',
        meal_type: 'lunch',
        calories: '450 cal',
        carbs: '30g',
        fat: '20g',
        protein: '35g',
        sodium: '800mg',
        sugar: '5g',
      },
    ],
    dinner: [
      {
        name: 'Grilled Salmon with Quinoa',
        meal_type: 'dinner',
        calories: '600 cal',
        carbs: '40g',
        fat: '25g',
        protein: '50g',
        sodium: '700mg',
        sugar: '2g',
      },
    ],
    snack: [
      {
        name: 'Greek Yogurt with Berries',
        meal_type: 'snack',
        calories: '200 cal',
        carbs: '30g',
        fat: '3g',
        protein: '15g',
        sodium: '100mg',
        sugar: '20g',
      },
    ],
  },
  tuesday: {
    breakfast: [
      {
        name: 'Avocado Toast with Egg',
        meal_type: 'breakfast',
        calories: '350 cal',
        carbs: '40g',
        fat: '15g',
        protein: '12g',
        sodium: '250mg',
        sugar: '3g',
      },
    ],
    lunch: [
      {
        name: 'Turkey Sandwich',
        meal_type: 'lunch',
        calories: '500 cal',
        carbs: '55g',
        fat: '10g',
        protein: '30g',
        sodium: '900mg',
        sugar: '4g',
      },
    ],
    dinner: [
      {
        name: 'Spaghetti with Meatballs',
        meal_type: 'dinner',
        calories: '650 cal',
        carbs: '70g',
        fat: '20g',
        protein: '35g',
        sodium: '1000mg',
        sugar: '6g',
      },
    ],
    snack: [
      {
        name: 'Mixed Nuts',
        meal_type: 'snack',
        calories: '250 cal',
        carbs: '15g',
        fat: '20g',
        protein: '5g',
        sodium: '150mg',
        sugar: '2g',
      },
    ],
  },
  wednesday: {
    breakfast: [
      {
        name: 'Smoothie with Protein Powder',
        meal_type: 'breakfast',
        calories: '400 cal',
        carbs: '60g',
        fat: '5g',
        protein: '25g',
        sodium: '300mg',
        sugar: '35g',
      },
    ],
    lunch: [
      {
        name: 'Chicken Wrap with Veggies',
        meal_type: 'lunch',
        calories: '550 cal',
        carbs: '50g',
        fat: '15g',
        protein: '35g',
        sodium: '850mg',
        sugar: '4g',
      },
    ],
    dinner: [
      {
        name: 'Beef Stir-fry with Rice',
        meal_type: 'dinner',
        calories: '700 cal',
        carbs: '65g',
        fat: '18g',
        protein: '45g',
        sodium: '1100mg',
        sugar: '5g',
      },
    ],
    snack: [
      {
        name: 'Apple with Peanut Butter',
        meal_type: 'snack',
        calories: '300 cal',
        carbs: '40g',
        fat: '10g',
        protein: '7g',
        sodium: '120mg',
        sugar: '30g',
      },
    ],
  },
  thursday: {
    breakfast: [],
    lunch: [],
    dinner: [],
    snack: [],
  },
  friday: {
    breakfast: [],
    lunch: [],
    dinner: [],
    snack: [],
  },
  saturday: {
    breakfast: [],
    lunch: [],
    dinner: [],
    snack: [],
  },
  sunday: {
    breakfast: [],
    lunch: [],
    dinner: [],
    snack: [],
  },
};

function MealPlan() {
  // ? eventually, use database to get meal plans...
  // ! Need to transpose/rotate table?
  // ! Since we want it to be...
  // ? X          Day   day   day
  // ? Breakfast  M1    M2    M3
  // ? Lunch      M1    M2    M3
  // ? Dinner     M1    M2    M3
  // ? Snack      M1    M2    M3
  // ? Then... make a utility function that takes a UIFormattedMealPlan
  // ? then... return an object or 2d array in the format:
  // ? Breakfast: {[day_1meal, day2_meal, ...]}
  // ? But then... need to grab all food items from each meal, and display?

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4">Meal Plan</Typography>
      <Table component={Paper}>
        <TableRow>
          <TableCell>Header 1</TableCell>
          <TableCell>Cell 1</TableCell>
          <TableCell> Hello</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Header 1</TableCell>
          <TableCell>Cell 2</TableCell>
          <TableCell> Hello</TableCell>
        </TableRow>
      </Table>
      <Button
        variant="contained"
        color="primary"
        style={{ borderRadius: '25px' }}
      >
        Add New Meal
        {/* TODO: navigate the user to a new page to add a meal? */}
      </Button>
    </div>
  );
}

export default MealPlan;

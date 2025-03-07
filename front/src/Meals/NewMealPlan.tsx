import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Switch,
  List,
  ListItem,
} from '@mui/material';
import { UIDailyMeal, UIFormattedMealPlan } from '@apex/shared';

const emptyMealPlan: UIFormattedMealPlan = {
  sunday: { breakfast: [], lunch: [], dinner: [], snack: [] },
  monday: { breakfast: [], lunch: [], dinner: [], snack: [] },
  tuesday: { breakfast: [], lunch: [], dinner: [], snack: [] },
  wednesday: { breakfast: [], lunch: [], dinner: [], snack: [] },
  thursday: { breakfast: [], lunch: [], dinner: [], snack: [] },
  friday: { breakfast: [], lunch: [], dinner: [], snack: [] },
  saturday: { breakfast: [], lunch: [], dinner: [], snack: [] },
};

function NewMealPlan() {
  const [mealPlan, setMealPlan] = useState<UIFormattedMealPlan>(emptyMealPlan);
  const [isPublic, setIsPublic] = useState<boolean>(false);

  const days = Object.keys(mealPlan) as Array<keyof UIFormattedMealPlan>;
  const mealTypes: Array<keyof UIDailyMeal> = [
    'breakfast',
    'lunch',
    'dinner',
    'snack',
  ];

  function handlePublicModifier(
    event: React.ChangeEvent<HTMLInputElement>
  ): void {
    setIsPublic(event.target.checked);
  }

  function addFood() {
    setMealPlan((prevMealPlan) => ({
      ...prevMealPlan,
      monday: {
        ...prevMealPlan.monday,
        breakfast: [
          ...prevMealPlan.monday.breakfast,
          {
            name: 'Toast',
            meal_type: 'breakfast',
            calories: '100',
            carbs: '5',
            fat: '5',
            protein: '5',
            sodium: '5',
            sugar: '5',
          },
        ],
      },
    }));
  }

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Create Meal Plan
      </Typography>
      <TableContainer
        component={Paper}
        sx={{ borderRadius: '20px', overflow: 'hidden' }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Meal Type</strong>
              </TableCell>
              {days.map((day) => (
                <TableCell key={day} align="center">
                  <strong>{day.charAt(0).toUpperCase() + day.slice(1)}</strong>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {mealTypes.map((mealType) => (
              <TableRow key={mealType}>
                <TableCell>
                  <strong>
                    {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                  </strong>
                </TableCell>
                {days.map((day) => (
                  <TableCell key={day} align="center">
                    {mealPlan[day][mealType].length > 0 ? (
                      <List sx={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                        {mealPlan[day][mealType].map((meal, idx) => (
                          <ListItem key={idx} sx={{ display: 'list-item' }}>
                            {meal.name}
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div style={{ marginTop: '20px' }}>
        <Typography variant="h6">Public Visibility</Typography>
        <Switch
          checked={isPublic}
          onChange={handlePublicModifier}
          inputProps={{ 'aria-label': 'controlled' }}
        />
      </div>

      <Button
        variant="contained"
        style={{ marginTop: '20px', borderRadius: '25px' }}
        onClick={addFood}
      >
        Add Food
      </Button>
    </div>
  );
}

export default NewMealPlan;

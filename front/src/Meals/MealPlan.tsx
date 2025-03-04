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
  List,
  ListItem,
  Switch,
} from '@mui/material';
import { UIDailyMeal, UIFormattedMealPlan } from '@apex/shared';

interface MealPlanProps {
  mealPlan: UIFormattedMealPlan;
}

function MealPlan({ mealPlan }: MealPlanProps) {
  const [isPublic, setIsPublic] = useState<boolean>(false);

  function handlePublicModifier(
    event: React.ChangeEvent<HTMLInputElement>
  ): void {
    setIsPublic(event.target.checked);
  }

  const formatMealPlan = (mealPlan: UIFormattedMealPlan) => {
    const days = Object.keys(mealPlan) as Array<keyof UIFormattedMealPlan>;
    const mealTypes: Array<keyof UIDailyMeal> = [
      'breakfast',
      'lunch',
      'dinner',
      'snack',
    ];

    return mealTypes.map((mealType) => ({
      mealType,
      meals: days.map(
        (day) => mealPlan[day][mealType]?.flatMap((meal) => meal.name) || []
      ),
    }));
  };

  const formattedMeals = formatMealPlan(mealPlan);
  const days = Object.keys(mealPlan).map(
    (day) => day.charAt(0).toUpperCase() + day.slice(1)
  );

  function shareMealPlan(): void {
    console.log('Not yet implemented');
  }

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Meal Plan
      </Typography>
      <TableContainer component={Paper} sx={{ borderRadius: '20px', overflow: 'hidden' }}>
      <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Meal Type</strong>
              </TableCell>
              {days.map((day) => (
                <TableCell key={day} align="center">
                  <strong>{day}</strong>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {formattedMeals.map((row) => (
              <TableRow key={row.mealType}>
                <TableCell>
                  <strong>
                    {row.mealType.charAt(0).toUpperCase() +
                      row.mealType.slice(1)}
                  </strong>
                </TableCell>
                {row.meals.map((meals, index) => (
                  <TableCell key={index} align="center">
                    {meals.length > 0 ? (
                      <List
                        style={{ paddingLeft: '15px', margin: 0 }}
                        sx={{ listStyleType: 'disc' }}
                      >
                        {meals.map((meal, idx) => (
                          <ListItem key={idx} sx={{ display: 'list-item' }}>
                            {meal}
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
        <div>
          <Typography variant="h6">Public Visibility</Typography>
          <Switch
            checked={isPublic}
            onChange={handlePublicModifier}
            inputProps={{ 'aria-label': 'controlled' }}
          />
          {isPublic && (
            <Button
              variant="contained"
              style={{ marginBottom: '10px', borderRadius: '25px' }}
              onClick={shareMealPlan}
            >
              Copy Link
            </Button>
          )}
        </div>
      </TableContainer>
      <Button
        variant="contained"
        color="primary"
        style={{ marginTop: '20px', borderRadius: '25px' }}
      >
        Add New Meal Plan
      </Button>
    </div>
  );
}

export default MealPlan;

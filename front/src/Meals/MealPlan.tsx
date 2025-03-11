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
  mealPlanName: string;
  isMealPublic: boolean;
  mealPlanId: string;
}

function MealPlan({
  mealPlan,
  mealPlanName,
  isMealPublic,
  mealPlanId,
}: MealPlanProps) {
  const [isPublic, setIsPublic] = useState<boolean>(isMealPublic);

  function handlePublicModifier(
    event: React.ChangeEvent<HTMLInputElement>
  ): void {
    const isChecked = event.target.checked;
    setIsPublic(event.target.checked);

    const payload = {
      id: mealPlanId,
      name: mealPlanName,
      // ? We store as "isPrivate", but this is "isPublic"
      isPrivate: !isChecked,
    };
    // Call the PUT endpoint
    fetch('/api/meal_plan', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to update meal plan visibility');
        }
        return response.json();
      })
      .catch((error) => {
        console.error('Error updating meal plan:', error);
      });
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
    const text = `${window.location.origin}/share/meal-plan/${mealPlanId}`;
    navigator.clipboard.writeText(text);
  }

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        {mealPlanName}
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
    </div>
  );
}

export default MealPlan;

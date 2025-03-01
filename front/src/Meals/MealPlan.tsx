import { useEffect, useState } from 'react';
import {
  Typography,
  Button,
  Table,
  TableRow,
  TableCell,
  Paper,
  TableContainer,
  TableHead,
  TableBody,
  List,
  ListItem,
  Switch,
} from '@mui/material';
import {
  UIDailyMeal,
  UIFormattedMealPlan,
  mockBreakfast,
  mockLunch,
  mockDinner,
  mockSnack,
} from '@apex/shared';
import './SavedMeals.css';
import axios from 'axios';

const mp: UIFormattedMealPlan = {
  monday: {
    breakfast: [mockBreakfast[0], mockBreakfast[1]],
    lunch: [mockLunch[0]],
    dinner: [mockDinner[5]],
    snack: [mockSnack[0]],
  },
  tuesday: {
    breakfast: [mockBreakfast[1], mockBreakfast[4]],
    lunch: [mockLunch[1]],
    dinner: [mockDinner[4]],
    snack: [mockSnack[1]],
  },
  wednesday: {
    breakfast: [mockBreakfast[3]],
    lunch: [mockLunch[2]],
    dinner: [mockDinner[1]],
    snack: [mockSnack[2]],
  },
  thursday: {
    breakfast: [mockBreakfast[2]],
    lunch: [mockLunch[3]],
    dinner: [mockDinner[3]],
    snack: [mockSnack[3]],
  },
  friday: {
    breakfast: [mockBreakfast[6]],
    lunch: [mockLunch[4]],
    dinner: [mockDinner[3]],
    snack: [mockSnack[4]],
  },
  saturday: {
    breakfast: [mockBreakfast[0], mockBreakfast[2]],
    lunch: [mockLunch[5]],
    dinner: [mockDinner[2]],
    snack: [mockSnack[0]],
  },
  sunday: {
    breakfast: [mockBreakfast[5]],
    lunch: [mockLunch[6]],
    dinner: [mockDinner[0]],
    snack: [mockSnack[1]],
  },
};

function MealPlan() {
  // ? X          Day   day   day
  // ? Breakfast  M1    M2    M3
  // ? Lunch      M1    M2    M3
  // ? Dinner     M1    M2    M3
  // ? Snack      M1    M2    M3

  const [sampleMealPlan, setSampleMealPlan] = useState<UIFormattedMealPlan>(mp);

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

    // * Returns an array of food names, so that we can later format with List
    return mealTypes.map((mealType) => ({
      mealType,
      meals: days.map(
        (day) => mealPlan[day][mealType]?.flatMap((meal) => meal.name) || []
      ),
    }));
  };

  useEffect(() => {
    axios.get('/api/meal_plan/100', { withCredentials: true }).then((res) => {
      const formattedMealPlan: UIFormattedMealPlan = res.data
        .result as UIFormattedMealPlan;
      setSampleMealPlan(formattedMealPlan);
    });
    console.log(sampleMealPlan);
  }, []);

  const formattedMeals = formatMealPlan(sampleMealPlan);
  const days = Object.keys(sampleMealPlan).map(
    (day) => day.charAt(0).toUpperCase() + day.slice(1)
  ); // * ['Monday', 'Tuesday', ..., 'Sunday']

  function shareMealPlan(): void {
    // TODO: not implemented yet
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
                          </ListItem> // Render as a bullet point
                        ))}
                      </List>
                    ) : (
                      '-' // ? Note to self: Just so we can keep a dash when there is nothing logged
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

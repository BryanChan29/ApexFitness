import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid2 as Grid,
  IconButton,
  Button,
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  DBDailyFoodItem,
  UIFormattedDailyFoodItem,
  formatMeal,
} from '@apex/shared';
import axios from 'axios';
import './SavedMeals.css';

function SavedMeals() {
  // ? eventually, use database to get meals
  // ?
  const [formattedMeals, setFormattedMeals] = useState<
    UIFormattedDailyFoodItem[]
  >([]);

  async function getDailyFood(): Promise<void> {
    try {
      // ? hardcode it for now...
      // ? end goal is to grab all meals from the user?
      const routeToCall = `api/meals/${1}`;
      const response = await axios.get(routeToCall);
      console.log(response);
      console.log(response.data.result);
      let dailyFoodResponse: DBDailyFoodItem[] = response.data.result;
      dailyFoodResponse = dailyFoodResponse.sort((a, b) => {
        return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
      });
      setFormattedMeals(dailyFoodResponse.map((meal) => formatMeal(meal)));
    } catch (error) {
      console.error('Error fetching daily food:', error);
    }
    // TODO: think about return type? what if an error occurs, what should show up?
  }

  useEffect(() => {
    getDailyFood();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4">Saved meals</Typography>

      {formattedMeals.map((meal, index) => (
        <Card key={index} className="Card">
          <CardContent>
            <Grid container spacing={2} alignItems="center" wrap="nowrap">
              <Grid size={{ xs: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Food
                </Typography>
                <Typography variant="body1">{meal.name}</Typography>
              </Grid>
              <Grid size={{ xs: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Meal Type
                </Typography>
                <Typography variant="body1">{meal.meal_type}</Typography>
              </Grid>
              <Grid size={{ xs: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Calories
                </Typography>
                <Typography variant="body1">{meal.calories}</Typography>
              </Grid>
              <Grid size={{ xs: 1.5 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Carbs
                </Typography>
                <Typography variant="body1">{meal.carbs}</Typography>
              </Grid>
              <Grid size={{ xs: 1.5 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Fat
                </Typography>
                <Typography variant="body1">{meal.fat}</Typography>
              </Grid>
              <Grid size={{ xs: 1.5 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Protein
                </Typography>
                <Typography variant="body1">{meal.protein}</Typography>
              </Grid>
              <Grid size={{ xs: 1.5 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Sodium
                </Typography>
                <Typography variant="body1">{meal.sodium}</Typography>
              </Grid>
              <Grid size={{ xs: 1.5 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Sugar
                </Typography>
                <Typography variant="body1">{meal.sugar}</Typography>
              </Grid>
              <Grid size={{ xs: 1.5 }} style={{ textAlign: 'right' }}>
                <IconButton color="primary">
                  <AddCircleIcon />
                </IconButton>
                <IconButton color="secondary">
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}

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

export default SavedMeals;

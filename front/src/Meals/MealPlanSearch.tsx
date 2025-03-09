import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardActionArea,
  Typography,
  CircularProgress,
  Container,
  TextField,
  Grid,
  Button,
} from '@mui/material';
import axios from 'axios';
import MealPlan from './MealPlan';
import { MealPlanInfo } from '@apex/shared';

const MealPlanSearch = () => {
  const [mealPlans, setMealPlans] = useState<MealPlanInfo[]>([]);
  const [filteredMealPlans, setFilteredMealPlans] = useState<MealPlanInfo[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMealPlan, setSelectedMealPlan] = useState('');
  const [selectedMealPlanName, setSelectedMealPlanName] = useState('');
  const [selectedMealPlanData, setSelectedMealPlanData] = useState(null);

  useEffect(() => {
    axios
      .get('/api/meal_plans')
      .then((response) => {
        setMealPlans(response.data.result);
        setFilteredMealPlans(response.data.result);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching meal plans:', error);
        setError('Failed to load meal plans.');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setFilteredMealPlans(
      mealPlans.filter((plan) =>
        plan.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, mealPlans]);

  const getMealPlanData = (mealPlanId: string) => {
    console.log('Fetching meal plan data for ID:', mealPlanId);
    axios
      .get(`/api/meal_plan/${mealPlanId}`)
      .then((response) => {
        console.log('API Response:', response.data);
        setSelectedMealPlanData(response.data.result);
      })
      .catch((error) => {
        console.error('Error fetching meal plan details:', error);
        setError('Failed to load meal plan details.');
      });
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container>
      {selectedMealPlanData ? (
        <>
          <MealPlan
            mealPlan={selectedMealPlanData}
            mealPlanName={selectedMealPlanName}
            isMealPublic={true}
          />
          <Button
            variant="contained"
            onClick={() => setSelectedMealPlanData(null)}
            style={{ justifyContent: 'left' }}
          >
            Back to Search
          </Button>
        </>
      ) : (
        <>
          <Typography variant="h5" gutterBottom>
            Explore Meal Plans
          </Typography>
            <TextField
            fullWidth
            label="Search Meal Plans"
            variant="outlined"
            margin="normal"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            slotProps={{
              input: {
                style: {
                  backgroundColor: 'white',
                  borderRadius: '30px',
                },
              },
            }}
            />
          <Grid container spacing={2}>
            {filteredMealPlans.map((plan) => (
              <Grid item xs={12} sm={6} md={4} key={plan.id}>
                <Card>
                  <CardActionArea
                    onClick={() => {
                      console.log('📌 Clicked Meal Plan ID:', plan.id);
                      setSelectedMealPlan(plan.id);
                      setSelectedMealPlanName(plan.name);
                      getMealPlanData(plan.id);
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6">{plan.name}</Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Container>
  );
};

export default MealPlanSearch;

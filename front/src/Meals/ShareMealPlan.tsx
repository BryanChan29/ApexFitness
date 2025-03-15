import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import MealPlan from './MealPlan'; // Import your MealPlan component
import { UIFormattedMealPlan } from '@apex/shared';

interface APIResponse {
  name: string;
  result: UIFormattedMealPlan;
}

function ShareMealPlan() {
  // * Get meal plan ID from URL
  const { id } = useParams<{ id: string }>();

  const [mealPlanData, setMealPlanData] = useState<APIResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMealPlan = async () => {
      try {
        const response = await fetch(`/api/meal_plan/${id}`);
        if (!response.ok) throw new Error('Meal plan not found');
        const data: APIResponse = await response.json();
        console.log(data);
        setMealPlanData(data);
      } catch (error) {
        console.error('Error fetching meal plan:', error);
        setMealPlanData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMealPlan();
  }, [id]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!mealPlanData) {
    return (
      <Box textAlign="center" mt={5}>
        <Typography variant="h5" color="error">
          Meal plan not found, or you do not have permissions to view.
        </Typography>
      </Box>
    );
  }

  return (
    <Box maxWidth="900px" margin="auto" mt={5}>
      <MealPlan
        mealPlan={mealPlanData.result}
        mealPlanName={mealPlanData.name}
        isMealPublic={true}
        mealPlanId={id || ''}
        showToggle={false}
      />

      <Button
        variant="contained"
        onClick={() => navigate('../../meal-plans')}
        style={{ justifyContent: 'left' }}
        className='primary-button'
      >
        Back to Search
      </Button>
    </Box>
  );
}

export default ShareMealPlan;

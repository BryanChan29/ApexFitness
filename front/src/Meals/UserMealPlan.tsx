import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MealPlan from './MealPlan';
import { UIFormattedMealPlan } from '@apex/shared';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function UserMealPlans() {
  const [mealPlans, setMealPlans] = useState<
    { id: number; data: UIFormattedMealPlan; name: string }[]
  >([]);
  const [allMealPlanIds, setAllMealPlanIds] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('/api/user/meal_plan', { withCredentials: true })
      .then((res) => {
        const mealPlanIds = res.data.meal_plan_ids as number[];
        setAllMealPlanIds(mealPlanIds);

        if (mealPlanIds.length === 0) {
          console.log('No meal plans found');
          setMealPlans([]); // Ensure UI updates correctly
          setLoading(false);
          return;
        }

        // Fetch all meal plans dynamically when IDs are loaded
        return Promise.all(
          mealPlanIds.map((id) =>
            axios
              .get(`/api/meal_plan/${id}`, { withCredentials: true })
              .then((res) => ({
                id,
                data: res.data.result as UIFormattedMealPlan,
                name: res.data.name,
              }))
              .catch((err) => {
                console.error(`Error fetching meal plan ${id}:`, err);
                return null; // Handle failed fetches
              })
          )
        );
      })
      .then((results) => {
        if (!results) return; // If no meal plans, avoid setting state
        const validMealPlans = results.filter((plan) => plan !== null) as {
          id: number;
          data: UIFormattedMealPlan;
          name: string;
        }[];
        setMealPlans(validMealPlans);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching meal plan IDs:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>User Meal Plans</h2>
      {mealPlans.length === 0 || allMealPlanIds.length === 0 ? (
        <p>No meal plans found, create one below!</p>
      ) : (
        mealPlans.map((mealPlan) => (
          <MealPlan
            key={mealPlan.id}
            mealPlan={mealPlan.data}
            mealPlanName={mealPlan.name}
          />
        ))
      )}
      <Button
        variant="contained"
        color="primary"
        style={{ marginTop: '20px', borderRadius: '25px' }}
        onClick={() => navigate('/new-meal-plan')}
      >
        Add New Meal Plan
      </Button>
    </div>
  );
}

export default UserMealPlans;

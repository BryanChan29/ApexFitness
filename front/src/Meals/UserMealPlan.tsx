import { useEffect, useState } from 'react';
import axios from 'axios';
import MealPlan from './MealPlan';
import { UIFormattedMealPlan } from '@apex/shared';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function UserMealPlans() {
  const [mealPlans, setMealPlans] = useState<
    {
      id: number;
      data: UIFormattedMealPlan;
      name: string;
      is_private: boolean;
    }[]
  >([]);
  const [allMealPlanIdsAndVisibility, setAllMealPlanIdsAndVisibility] =
    useState<{ meal_plan_id: number; is_private: boolean }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('/api/user/meal_plan', { withCredentials: true })
      .then((res) => {
        const mealPlanIdAndPublicModifier = res.data.meal_plans as {
          meal_plan_id: number;
          is_private: boolean;
        }[];

        setAllMealPlanIdsAndVisibility(mealPlanIdAndPublicModifier);

        if (mealPlanIdAndPublicModifier.length === 0) {
          console.log('No meal plans found');
          setMealPlans([]);
          setLoading(false);
          return;
        }

        return Promise.all(
          mealPlanIdAndPublicModifier.map((plan) =>
            axios
              .get(`/api/meal_plan/${plan.meal_plan_id}`, {
                withCredentials: true,
              })
              .then((res) => ({
                id: plan.meal_plan_id,
                data: res.data.result as UIFormattedMealPlan,
                name: res.data.name,
                is_private: !plan.is_private,
              }))
              .catch((err) => {
                console.error(
                  `Error fetching meal plan ${plan.meal_plan_id}:`,
                  err
                );
                return null; // Handle failed fetches
              })
          )
        );
      })
      .then((results) => {
        // ? If there are no meal plans, avoid setting state
        if (!results) return;

        const validMealPlans = results.filter(
          (
            plan
          ): plan is {
            id: number;
            data: UIFormattedMealPlan;
            name: string;
            is_private: boolean;
          } => plan !== null
        );

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
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
        }}
      >
        <h2 style={{ margin: 0 }}>User Meal Plans</h2>
        <Button
          variant="contained"
          color="primary"
          style={{ borderRadius: '25px' }}
          onClick={() => navigate('/new-meal-plan')}
        >
          Add New Meal Plan
        </Button>
      </div>
      {mealPlans.length === 0 || allMealPlanIdsAndVisibility.length === 0 ? (
        <p>No meal plans found, create a new one!</p>
      ) : (
        mealPlans.map((mealPlan) => (
          <MealPlan
            key={mealPlan.id}
            mealPlan={mealPlan.data}
            mealPlanName={mealPlan.name}
            isMealPublic={mealPlan.is_private}
            mealPlanId={mealPlan.id.toString()}
            showToggle={true}
          />
        ))
      )}
    </div>
  );
}

export default UserMealPlans;

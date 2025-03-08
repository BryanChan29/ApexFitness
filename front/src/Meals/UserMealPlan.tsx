import { useEffect, useState } from 'react';
import axios from 'axios';
import MealPlan from './MealPlan';
import { UIFormattedMealPlan } from '@apex/shared';
import { Button } from '@mui/material';
import AddMealPlanModal from './CreateMealPlanModal';

function UserMealPlans() {
  const [mealPlans, setMealPlans] = useState<
    { id: number; data: UIFormattedMealPlan; name: string }[]
  >([]);
  const [allMealPlanIds, setAllMealPlanIds] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  function routeToCall(id: number | string) {
    return `/api/meal_plan/${id}`;
  }
  const [modalOpen, setModalOpen] = useState(false);

  const handleSaveMealPlan = (mealPlanName: string, isPublic: boolean) => {
    console.log('Saving Meal Plan:', { mealPlanName, isPublic });
    axios
      .post(
        '/api/meal_plan',
        { name: mealPlanName, isPrivate: !isPublic },
        { withCredentials: true }
      )
      .then((res) => {
        alert(`${mealPlanName} saved successfully with id: ${res.data.mealID}`);
      })
      .catch((err) => {
        console.error('Error posting meal plan', err);
      });
    // TODO: Discuss with team. How does a meal plan get populated?
    // TODO: Bottom line; add a user id to a meal plan
  };

  useEffect(() => {
    axios
      .get('/api/user/meal_plan', { withCredentials: true })
      .then((res) => {
        setAllMealPlanIds(res.data.meal_plan_ids as number[]);
      })
      .catch((err) => {
        console.error('Error fetching meal plan IDs:', err);
      });
  }, []);

  // Fetch all meal plans dynamically when IDs are loaded
  useEffect(() => {
    if (allMealPlanIds.length === 0) return;

    setLoading(true);

    Promise.all(
      allMealPlanIds.map((id) =>
        axios
          .get(routeToCall(id), { withCredentials: true })
          .then((res) => ({
            id,
            data: res.data.result as UIFormattedMealPlan,
            name: res.data.name,
          }))
          .catch((err) => {
            console.error(`Error fetching meal plan ${id}:`, err);
            // * If a request fails, I will add a null to the results and then later filter it out
            return null;
          })
      )
    ).then((results) => {
      // * Filter out any null responses (failed requests)
      const validMealPlans = results.filter((plan) => plan !== null) as {
        id: number;
        data: UIFormattedMealPlan;
        name: string;
      }[];
      setMealPlans(validMealPlans);
      setLoading(false);
    });
  }, [allMealPlanIds]);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>User Meal Plans</h2>
      {mealPlans.length === 0 ? (
        <p>No meal plans found</p>
      ) : (
        mealPlans.map((mealPlan) => (
          <MealPlan
            key={mealPlan.id}
            mealPlan={mealPlan.data}
            mealPlanName={mealPlan.name}
            isMealPublic={false}
          />
        ))
      )}
      <Button
        variant="contained"
        color="primary"
        style={{ marginTop: '20px', borderRadius: '25px' }}
        onClick={() => setModalOpen(true)}
      >
        Add New Meal Plan
      </Button>

      <AddMealPlanModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveMealPlan}
      />
    </div>
  );
}

export default UserMealPlans;

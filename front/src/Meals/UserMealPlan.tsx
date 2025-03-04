import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MealPlan from './MealPlan';
import { UIFormattedMealPlan } from '@apex/shared';

function UserMealPlans() {
  const [mealPlan, setMealPlan] = useState<UIFormattedMealPlan | null>(null);
  const [allMealPlanIds, setAllMealPlanIds] = useState<number[]>([]);

  useEffect(() => {
    axios.get('/api/meal_plan/100', { withCredentials: true }).then((res) => {
      setMealPlan(res.data.result as UIFormattedMealPlan);
    });
  }, []);

  useEffect(() => {
    axios.get('/api/user/meal_plan', { withCredentials: true }).then((res) => {
      console.log(res.data.meal_plan_ids);
      setAllMealPlanIds(res.data.meal_plan_ids as number[]);
      console.log(allMealPlanIds);
    });
  }, []);

  if (!mealPlan) return <p>Loading...</p>;

  return <MealPlan mealPlan={mealPlan} />;
}

export default UserMealPlans;

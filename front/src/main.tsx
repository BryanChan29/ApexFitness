import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import SavedMeals from './Meals/SavedMeals.tsx';
import MealPlan from './Meals/MealPlan.tsx';

// TODO: set up router
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SavedMeals />
  </StrictMode>
);

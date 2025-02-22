import { DBDailyFoodItem, UIFormattedDailyFoodItem } from './models.js';
import axios from 'axios';

function formatMeal(meal: DBDailyFoodItem): UIFormattedDailyFoodItem {
  const calories = formatCalories(meal.calories);
  const carbs = formatGrams(meal.carbs);
  const fat = formatGrams(meal.fat);
  const protein = formatGrams(meal.protein);
  const sodium = formatMG(meal.sodium);
  const sugar = formatGrams(meal.sugar);
  const formattedMeal: UIFormattedDailyFoodItem = {
    name: meal.name,
    meal_type: meal.meal_type,
    calories,
    carbs,
    fat,
    protein,
    sodium,
    sugar,
  };

  return formattedMeal;
}

function formatCalories(num: number): string {
  return `${num} cal`;
}
function formatGrams(num: number): string {
  return `${num}g`;
}
function formatMG(num: number): string {
  return `${num}mg`;
}

// https://medium.com/with-orus/the-5-commandments-of-clean-error-handling-in-typescript-93a9cbdf1af5
function ensureError(value: unknown): Error {
  if (value instanceof Error) return value;

  let stringified;
  try {
    stringified = JSON.stringify(value);
  } catch {
    stringified = '[Unable to stringify the thrown value]';
  }

  const error = new Error(
    `Thrown value was originally not an error; stringified value is: ${stringified}`
  );
  return error;
}

// https://axios-http.com/docs/handling_errors
// https://github.com/axios/axios/issues/3612
function getAxiosErrorMessages(err: unknown): string[] {
  const error = ensureError(err);

  if (!axios.isAxiosError(error)) {
    return [error.toString()];
  }

  if (!error.response) {
    return ['Server never sent response'];
  }

  if (error.response.status === 400) {
    return [error.response.data.error];
  }

  // TODO assumes API's body will be { error: <string>[] } if error
  if (!error.response.data?.errors) {
    return [error.message];
  }

  return error.response.data.errors;
}

export {
  formatMeal,
  formatCalories,
  formatGrams,
  formatMG,
  getAxiosErrorMessages,
};

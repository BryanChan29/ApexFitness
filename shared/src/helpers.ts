import { DBDailyFoodItem, UIFormattedDailyFoodItem } from './models.js';

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

export { formatMeal, formatCalories, formatGrams, formatMG };

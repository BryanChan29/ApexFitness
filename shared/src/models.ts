export interface DBDailyFoodItem {
  id: number;
  user_id: string;
  name: string;
  meal_type: string;
  calories: number;
  carbs: number;
  fat: number;
  protein: number;
  sodium: number;
  sugar: number;
}
export interface UIFormattedDailyFoodItem {
  name: string;
  meal_type: string;
  calories: string;
  carbs: string;
  fat: string;
  protein: string;
  sodium: string;
  sugar: string;
}

export interface UIDailyMeal {
  breakfast: UIFormattedDailyFoodItem[];
  lunch: UIFormattedDailyFoodItem[];
  dinner: UIFormattedDailyFoodItem[];
  snack: UIFormattedDailyFoodItem[];
}

export interface UIFormattedMealPlan {
  monday: UIDailyMeal;
  tuesday: UIDailyMeal;
  wednesday: UIDailyMeal;
  thursday: UIDailyMeal;
  friday: UIDailyMeal;
  saturday: UIDailyMeal;
  sunday: UIDailyMeal;
}

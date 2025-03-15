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
  quantity: string;
  date: string;
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
  mealPlanType?: string;
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

export interface MealPlanInfo {
  id: string;
  name: string;
  is_private: boolean;
}
// id VARCHAR(50) PRIMARY KEY,
//     email VARCHAR(50) NOT NULL,
//     username VARCHAR(50) NOT NULL,
//     password VARCHAR(25) NOT NULL,
//     current_weight INTEGER,
//     goal_weight INTEGER,
//     height INTEGER,
//     age INTEGER,
//     activity_level VARCHAR(25)

export interface User {
  id: string;
  email: string;
  username: string;
  password: string;
  current_weight?: number;
  goal_weight?: number;
  height?: number;
  age?: number;
  activity_level?: string;
}

// src/utils/calorieCalculations.ts

// Define types for clarity
export interface CalorieResults {
    bmr: number | null;
    tdee: number | null;
    dailyIntake: number | null;
    daysToGoal: number | null;
  }
  
  // BMR calculation using Mifflin-St Jeor formula
  export const calculateBMR = (weight: number, height: number, age: number, gender: 'male' | 'female'): number => {
    if (gender === 'male') {
      return 10 * weight + 6.25 * height - 5 * age + 5;
    }
    return 10 * weight + 6.25 * height - 5 * age - 161;
  };
  
  // TDEE calculation based on activity level
  export const calculateTDEE = (bmr: number, activityLevel: string): number => {
    const activityMultipliers: Record<string, number> = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      'very active': 1.9,
    };
    return bmr * (activityMultipliers[activityLevel.toLowerCase()] || 1.2);
  };
  
  // Daily intake with a deficit (default 500 kcal)
  export const calculateDailyIntake = (tdee: number, deficit: number = 500): number => {
    return tdee - deficit;
  };
  
  // Days to reach goal weight (assumes kg; adjust for lb if needed)
  export const calculateDaysToGoal = (currentWeight: number, goalWeight: number, deficit: number = 500): number => {
    const weightToLose = currentWeight - goalWeight;
    const kcalToLose = weightToLose * 7700; // 1 kg = ~7700 kcal
    return kcalToLose / deficit;
  };
  
  // Optional: A single function to compute all results at once
  export const calculateCalorieMetrics = (
    currentWeight: number,
    goalWeight: number,
    height: number,
    age: number,
    activityLevel: string,
    gender: 'male' | 'female'
  ): CalorieResults => {
    const bmr = calculateBMR(currentWeight, height, age, gender);
    const tdee = calculateTDEE(bmr, activityLevel);
    const dailyIntake = calculateDailyIntake(tdee);
    const daysToGoal = calculateDaysToGoal(currentWeight, goalWeight);
    return { bmr, tdee, dailyIntake, daysToGoal };
  };
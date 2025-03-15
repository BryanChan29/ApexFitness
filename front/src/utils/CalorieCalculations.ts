
export type GoalType = 'lose' | 'gain' | 'maintain';

export interface CalorieResults {
  bmr: number | null;
  tdee: number | null;
  dailyIntake: number | null;
  daysToGoal: number | null;
}

export const calculateBMR = (weight: number, height: number, age: number, gender: 'male' | 'female'): number => {
  if (weight <= 0 || height <= 0 || age <= 0) {
    throw new Error('Invalid input: Weight, height, and age must be positive numbers.');
  }
  const totalInches = height * 12;
  const weightInKg = weight * 0.453592;
  const heightInCm = totalInches * 2.54;
  if (gender === 'male') {
    return 10 * weightInKg + 6.25 * heightInCm - 5 * age + 5;
  }
  return 10 * weightInKg + 6.25 * heightInCm - 5 * age - 161;
};

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

export const calculateDailyIntake = (
  tdee: number,
  currentWeight: number,
  goalWeight: number,
  deficit: number = 500,
  surplus: number = 250
): number => {
  if (currentWeight === goalWeight) {
    return tdee;
  }
  const goalType: GoalType = goalWeight > currentWeight ? 'gain' : 'lose';
  if (goalType === 'lose') {
    return tdee - deficit;
  }
  return tdee + surplus;
};

export const calculateDaysToGoal = (
  currentWeight: number,
  goalWeight: number,
  deficit: number = 500,
  surplus: number = 250
): number | null => {
  const weightChange = Math.abs(currentWeight - goalWeight);
  const caloriesPerPound = 3500;
  const totalCalories = weightChange * caloriesPerPound;

  if (weightChange === 0) {
    return null;
  }

  const goalType: GoalType = goalWeight > currentWeight ? 'gain' : 'lose';
  if (goalType === 'lose') {
    return Math.ceil(totalCalories / deficit);
  }

  // Use the surplus directly for muscle gain timeline
  return Math.ceil(totalCalories / surplus);
};

export const calculateCalorieMetrics = (
  currentWeight: number,
  goalWeight: number,
  height: number,
  age: number,
  activityLevel: string,
  gender: 'male' | 'female',
  deficit: number = 500,
  surplus: number = 250
): CalorieResults => {
  try {
    if (currentWeight <= 0 || goalWeight <= 0) {
      return { bmr: null, tdee: null, dailyIntake: null, daysToGoal: null };
    }
    const bmr = calculateBMR(currentWeight, height, age, gender);
    const tdee = calculateTDEE(bmr, activityLevel);
    const dailyIntake = calculateDailyIntake(tdee, currentWeight, goalWeight, deficit, surplus);
    const daysToGoal = calculateDaysToGoal(currentWeight, goalWeight, deficit, surplus);
    return { bmr, tdee, dailyIntake, daysToGoal };
  } catch (error) {
    return { bmr: null, tdee: null, dailyIntake: null, daysToGoal: null };
  }
};
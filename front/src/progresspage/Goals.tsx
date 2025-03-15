import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  Tooltip,
  IconButton,
  CircularProgress,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import EditableWeightCircle from './EditableWeightCircle';
import EditableStatCard from './EditableStatCard';
import {
  calculateCalorieMetrics,
  CalorieResults,
  GoalType
} from '../utils/CalorieCalculations';


interface WeightMetrics {
  current_weight: number | null;
  goal_weight: number | null;
  height: number | null;
  age: number | null;
  activity_level: string | null;
  gender: 'male' | 'female' | null; 
}

const WeightMetricsUI: React.FC = () => {
  const theme = useTheme();

  const [metrics, setMetrics] = useState<WeightMetrics>({
    current_weight: null,
    goal_weight: null,
    height: null,
    age: null,
    activity_level: null,
    gender: null,
  });

  const [calorieResults, setCalorieResults] = useState<CalorieResults>({
    bmr: null,
    tdee: null,
    dailyIntake: null,
    daysToGoal: null,
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const response = await axios.get('/api/user', { withCredentials: true });
        const user = response.data;
        setMetrics({
          current_weight: user.current_weight,
          goal_weight: user.goal_weight,
          height: user.height,
          age: user.age,
          activity_level: user.activity_level,
          gender: user.gender,
        });
      } catch (err) {
        console.error('Error fetching metrics:', err);
        setError('Failed to load metrics.');
      } finally {
        setLoading(false);
      }
    }
    fetchMetrics();
  }, []);

  useEffect(() => {
    const { current_weight, goal_weight, height, age, activity_level, gender } = metrics;
    if (
      current_weight !== null &&
      goal_weight !== null &&
      height !== null &&
      age !== null &&
      activity_level !== null &&
      gender !== null
    ) {
      const results = calculateCalorieMetrics(
        current_weight,
        goal_weight,
        height,
        age,
        activity_level,
        gender
      );
      setCalorieResults(results);
    } else {
      setCalorieResults({ bmr: null, tdee: null, dailyIntake: null, daysToGoal: null });
    }
  }, [metrics]);

  const handleCurrentWeightChange = (newWeight: number | null) => {
    setMetrics((prev) => ({ ...prev, current_weight: newWeight }));
  };

  const handleGoalWeightChange = (newWeight: number | null) => {
    setMetrics((prev) => ({ ...prev, goal_weight: newWeight }));
  };

  const weightDifference =
    metrics.current_weight !== null && metrics.goal_weight !== null
      ? Math.abs(metrics.current_weight - metrics.goal_weight)
      : null;

  const getGoalType = (): GoalType => {
    if (
      metrics.current_weight === null ||
      metrics.goal_weight === null ||
      metrics.current_weight === metrics.goal_weight
    ) {
      return 'maintain';
    }
    return metrics.current_weight < metrics.goal_weight ? 'gain' : 'lose';
  };

  const handleSave = async () => {
    try {
      const payload = {...metrics
        // current_weight: metrics.current_weight,
        // goal_weight: metrics.goal_weight,
        // height: metrics.height,
        // age: metrics.age,
        // activity_level: metrics.activity_level,
      };
      const response = await axios.patch('/api/user/metrics', payload, { withCredentials: true,});
      if (response.status === 200) {
        console.log('Metrics updated successfully!', response.data);
        // navigate('/dashboard');
      } else {
        console.error('Failed to update metrics.');
      }
    } catch (err) {
      console.error('Error updating metrics:', err);
    }
  };
  

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          height: '100vh',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          height: '100vh',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box
    sx={{
      display: 'flex', // Enables flexbox
      justifyContent: 'center', // Center main metrics container
      alignItems: 'flex-start', // Align to the top
      gap: 1, // Spacing between columns
      minHeight: '100vh',
      py: 5,
    }}
  >
    {/* Left Column: Calorie Info */}
    {calorieResults.dailyIntake !== null && (
      <Paper
        elevation={2}
        sx={{
          p: 3,
          maxWidth: 300, // Adjust width as needed
          textAlign: 'center',
          borderRadius: 2,
          mx: 'auto',
          // flexGrow: 1,
          // ml: -2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Calorie Plan
          <Tooltip
                title={
                  getGoalType() === 'lose'
                    ? 'This plan calculates your daily calorie needs for weight loss based on your BMR, TDEE, and a 500-calorie deficit.'
                    : getGoalType() === 'gain'
                    ? 'This plan calculates your daily calorie needs for muscle gain based on your BMR, TDEE, and a 250-calorie surplus.'
                    : 'This plan calculates your daily calorie needs to maintain your current weight based on your BMR and TDEE.'
                }
                
              >
                <IconButton size="small" sx={{ ml: 0.5 }}>
                  <InfoOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
        </Typography>
        <Typography>BMR: {calorieResults.bmr?.toFixed(0)} calories
          <Tooltip title="Basal Metabolic Rate: The number of calories your body burns at rest.">
            <IconButton size="small" sx={{ ml: 0.5 }}>
              <InfoOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Typography>
        <Typography>
          TDEE: {calorieResults.tdee?.toFixed(0)} calories
          <Tooltip title="Total Daily Energy Expenditure: Your BMR adjusted for your activity level.">
            <IconButton size="small" sx={{ ml: 0.5 }}>
              <InfoOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Typography>
        <Typography>
        Daily Intake: {calorieResults.dailyIntake.toFixed(0)} calories{' '}
            {getGoalType() !== 'maintain' && (
              <>
                ({getGoalType() === 'gain' ? '250-calorie surplus' : '500-calorie deficit'})
              </>
            )}
            <Tooltip
              title={
                getGoalType() === 'lose'
                  ? 'Recommended daily calorie intake to achieve a 500-calorie deficit for weight loss.'
                  : getGoalType() === 'gain'
                  ? 'Recommended daily calorie intake to achieve a 250-calorie surplus for muscle gain.'
                  : 'Recommended daily calorie intake to maintain your current weight.'
              }
        
            >
              <IconButton size="small" sx={{ ml: 0.5 }}>
                <InfoOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
        </Typography>
        <Typography>
        Days to Goal: {calorieResults.daysToGoal?.toFixed(0)}
              {getGoalType() === 'gain' && (
                <Typography variant="caption" color="textSecondary" sx={{ ml: 1 }}>
                  (Note: Realistic muscle gain may take longer, typically 1-2 lbs/month.)
                </Typography>
              )}
              <Tooltip
                title={
                  getGoalType() === 'gain'
                    ? 'Estimated days to gain your target muscle based on a maximum sustainable gain rate of 1-2 lbs/month.'
                    : 'Estimated days to lose your target weight based on a 500-calorie deficit.'
                }
              >
                <IconButton size="small" sx={{ ml: 0.5 }}>
                  <InfoOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
        {/* Days to Goal: {calorieResults.daysToGoal?.toFixed(0)} */}
        </Typography>
      </Paper>
    )}
    
      <Paper
        elevation={4}
        sx={{
          p: 4,
          maxWidth: 700,
          mx: 'auto',
          textAlign: 'center',
          borderRadius: 5,
        }}
      >
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
          My Metrics
        </Typography>

        {/* Circles Row */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'flex-start',
            gap: 8,
            mb: 3,
          }}
        >
          {/* Current Weight */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="subtitle1"
              sx={{ mb: 1, fontWeight: 'bold', textTransform: 'uppercase' }}
            >
              Current
            </Typography>
            <EditableWeightCircle
              weight={metrics.current_weight}
              // color={theme.palette.primary.main}
              color="#ff0000"
              onChange={handleCurrentWeightChange}
            />
          </Box>

          {/* Goal Weight */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="subtitle1"
              sx={{ mb: 1, fontWeight: 'bold', textTransform: 'uppercase' }}
            >
              Goal
            </Typography>
            <EditableWeightCircle
              weight={metrics.goal_weight}
              // color={theme.palette.secondary.main}
              color="#0BDA51"
              onChange={handleGoalWeightChange}
            />
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: 2,
            mb: 3,
          }}
        >

          {/* Height */}
          <EditableStatCard
            label="Height"
            value={metrics.height !== null ? metrics.height : ''}
            type="number"
            onChange={(val) => {
              setMetrics((prev) => ({
                ...prev,
                height: typeof val === 'number' ? val : null,
              }));
            }}            
          />

          {/* Age */}
          <EditableStatCard
            label="Age"
            value={metrics.age !== null ? metrics.age : ''}
            type="number"
            onChange={(val) => {
              setMetrics((prev) => ({
                ...prev,
                age: typeof val === 'number' ? val : null,
              }));
            }}
          />

          {/* Activity Level */}
          <EditableStatCard
            label="Activity"
            value={metrics.activity_level || ''}
            type="select"
            selectOptions={['sedentary', 'light', 'moderate', 'active', 'very active']}
            onChange={(val) => {
              setMetrics((prev) => ({
                ...prev,
                activity_level: typeof val === 'string' ? val : null,
              }));
            }}
          />
          <EditableStatCard
            label="Gender"
            value={metrics.gender || ''}
            type="select"
            selectOptions={['male', 'female']}
            onChange={(val) => setMetrics((prev) => ({ ...prev, gender: typeof val === 'string' ? (val as 'male' | 'female') : null }))}
          />
        
        </Box>

        

        {weightDifference !== null && (
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 3 }}>
            {getGoalType() === 'maintain'
              ? 'Maintaining your current weight!'
              : `${weightDifference.toFixed(1)} pounds to ${getGoalType() === 'gain' ? 'gain' : 'lose'}!`}
          </Typography>
        )}


        {/* Save Button */}
        <Button
          variant="contained"
          size="large"
          sx={{ px: 4, py: 1.5, fontWeight: 'bold' }}
          onClick={handleSave}
          className='primary-button'
        >
          Save Metrics
        </Button>
      </Paper>
    </Box>
  );
};

export default WeightMetricsUI;
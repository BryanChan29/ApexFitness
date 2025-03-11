import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  CircularProgress,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import EditableWeightCircle from './EditableWeightCircle';
import EditableStatCard from './EditableStatCard';
import {
  calculateCalorieMetrics,
  CalorieResults,
} from '../utils/CalorieCalculations';


interface WeightMetrics {
  current_weight: number | null;
  goal_weight: number | null;
  height: number | null;
  age: number | null;
  activity_level: string | null;
  gender: 'male' | 'female' | null; // Add this
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
        minHeight: '100vh',
        py: 5,
      }}
    >
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

        {/* Difference Text */}
        {weightDifference !== null && (
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 3 }}>
            {weightDifference.toFixed(1)} pounds to go!
          </Typography>
        )}

        {/* New Calorie Results */}
        {calorieResults.dailyIntake !== null && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Calorie Plan
            </Typography>
            <Typography>BMR: {calorieResults.bmr?.toFixed(0)} kcal</Typography>
            <Typography>TDEE: {calorieResults.tdee?.toFixed(0)} kcal</Typography>
            <Typography>Daily Intake: {calorieResults.dailyIntake.toFixed(0)} kcal (500 kcal deficit)</Typography>
            <Typography>Days to Goal: {calorieResults.daysToGoal?.toFixed(0)}</Typography>
          </Box>
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
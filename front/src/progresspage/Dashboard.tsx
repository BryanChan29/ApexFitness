
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Paper, Typography, Box, Button } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title as ChartTitle, Tooltip, Legend } from 'chart.js';
import CustomDatePicker from '../components/DatePicker';
import NutritionTable from '../components/NutritionTable';
import axios from 'axios';
import { format } from 'date-fns';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ChartTitle, Tooltip, Legend);

interface ProgressEntry {
  date: string;
  weight: number;
}

export interface DailyFoodItem {
  id: number;
  name: string;
  meal_type: string;
  quantity: string;
  calories: number;
  carbs: number;
  fat: number;
  protein: number;
  sodium: number;
  sugar: number;
  date: string;
}

const ProgressDashboard: React.FC = () => {
  const [progressData, setProgressData] = useState<ProgressEntry[]>([]);
  const [breakfastData, setBreakfastData] = useState<DailyFoodItem[]>([]);
  const [lunchData, setLunchData] = useState<DailyFoodItem[]>([]);
  const [dinnerData, setDinnerData] = useState<DailyFoodItem[]>([]);
  const [snackData, setSnackData] = useState<DailyFoodItem[]>([]);

  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date()); 
  const [startDate, setStartDate] = useState<Date | null>(null); 
  const [endDate, setEndDate] = useState<Date | null>(null); 

  useEffect(() => {
    // Fetch weight history data
    const fetchWeightHistory = async () => {
      try {
        const params: any = {};
        if (startDate) {
          params.start_date = format(startDate, 'yyyy-MM-dd');
        }
        if (endDate) {
          params.end_date = format(endDate, 'yyyy-MM-dd');
        }

        const response = await axios.get('/api/weight_history', {
          params,
          withCredentials: true,
        });
        const weightData: ProgressEntry[] = response.data.map((entry: any) => ({
          date: format(new Date(entry.date), 'MMM'), // Format as short month (e.g., 'May')
          weight: entry.weight,
        }));
        setProgressData(weightData);
      } catch (error) {
        console.error('Error fetching weight history:', error);
        setProgressData([]);
      }
    };

    // Fetch daily food data
    const fetchDailyFood = async () => {
      try {
        if (!selectedDate) return; // Guard against null
        const formattedDate = format(selectedDate, 'yyyy-MM-dd');

        const fetchMealData = async (mealType: string) => {
          const response = await axios.get('/api/daily_food', {
            params: {
              date: formattedDate,
              meal_type: mealType,
            },
          });
          return response.data.result;
        };

        const [breakfast, lunch, dinner, snack] = await Promise.all([
          fetchMealData('breakfast'),
          fetchMealData('lunch'),
          fetchMealData('dinner'),
          fetchMealData('snack'),
        ]);

        setBreakfastData(breakfast);
        setLunchData(lunch);
        setDinnerData(dinner);
        setSnackData(snack);
      } catch (error) {
        console.error('Error fetching daily food data:', error);
      }
    };

    fetchWeightHistory();
    fetchDailyFood();
  }, [selectedDate, startDate, endDate]); 

  const chartData = {
    labels: progressData.map((entry) => entry.date),
    datasets: [
      {
        label: 'Weight (lbs)',
        data: progressData.map((entry) => entry.weight),
        borderColor: '#3f51b5',
        backgroundColor: 'rgba(63, 81, 181, 0.1)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  return (
    <Container maxWidth="lg" sx={{ mb: 4 }}>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Box sx={{ mb: 2 }}>
          <CustomDatePicker selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
        </Box>

        <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
          <CustomDatePicker
            selectedDate={startDate}
            setSelectedDate={setStartDate}
            label="Start Date"
          />
          <CustomDatePicker
            selectedDate={endDate}
            setSelectedDate={setEndDate}
            label="End Date"
          />
        </Box>

        <Box display="flex" justifyContent="center" sx={{ mb: 4 }}>
          <Paper sx={{ p: 2, height: 200, width: 400, borderRadius: 5, textAlign: 'center' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              Weight Progress
            </Typography>
            {progressData.length > 0 ? (
              <Box sx={{ height: 150, width: '100%' }}>
                <Line
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      title: { display: false },
                      legend: { display: false },
                    },
                    scales: {
                      x: { display: true },
                      y: { display: true },
                    },
                  }}
                />
              </Box>
            ) : (
              <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                No weight history available. Start tracking your weight to see your progress!
              </Typography>
            )}
          </Paper>
        </Box>

        <Box
          sx={{
            mb: 4,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 2 }}>
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
              Breakfast
            </Typography>
            <Link to="/add-food?mealType=breakfast">
              <Button variant="contained" className="primary-button">
                Add Breakfast
              </Button>
            </Link>
          </Box>
          <NutritionTable foodData={breakfastData} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 2 }}>
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
              Lunch
            </Typography>
            <Link to="/add-food?mealType=lunch">
              <Button variant="contained" className="primary-button">
                Add Lunch
              </Button>
            </Link>
          </Box>
          <NutritionTable foodData={lunchData} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 2 }}>
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
              Dinner
            </Typography>
            <Link to="/add-food?mealType=dinner">
              <Button variant="contained" className="primary-button">
                Add Dinner
              </Button>
            </Link>
          </Box>
          <NutritionTable foodData={dinnerData} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 2 }}>
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
              Snacks
            </Typography>
            <Link to="/add-food?mealType=snack">
              <Button variant="contained" className="primary-button">
                Add Snack
              </Button>
            </Link>
          </Box>
          <NutritionTable foodData={snackData} />

          <Typography variant="h3" sx={{ mb: 2, fontWeight: 'bold' }}>
            Total
          </Typography>
            <NutritionTable foodData={[...breakfastData, ...lunchData, ...dinnerData, ...snackData]} summation={true} />
          </Box>
      </Box>
    </Container>
  );
};

export default ProgressDashboard;
import React, { useEffect, useState } from 'react';
import { Container, Paper, Typography, Box } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title as ChartTitle, Tooltip, Legend } from 'chart.js';
import CustomDatePicker from '../components/DatePicker';
import NutritionTable from '../components/NutritionTable';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ChartTitle, Tooltip, Legend);

interface ProgressEntry {
  date: string;
  weight: number;
}

const ProgressDashboard: React.FC = () => {
  const [progressData, setProgressData] = useState<ProgressEntry[]>([]);

  useEffect(() => {
    const dummyData: ProgressEntry[] = [
      { date: 'May', weight: 225 },
      { date: 'Jun', weight: 223 },
      { date: 'Jul', weight: 222 },
      { date: 'Aug', weight: 221 },
      { date: 'Sep', weight: 220 },
      { date: 'Oct', weight: 219 },
      { date: 'Nov', weight: 217 },
      { date: 'Dec', weight: 215 },
      { date: 'Jan', weight: 211.5 },
    ];
    setProgressData(dummyData);
  }, []);

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
          <CustomDatePicker />
        </Box>

        <Box display="flex" justifyContent="center" sx={{ mb: 4 }}>
          <Paper sx={{ p: 2, height: 200, width: 400, borderRadius: 5, textAlign: 'center' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              Weight Progress
            </Typography>
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
          </Paper>
        </Box>

        <Box sx={{ mb: 4, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <Typography variant="h3" sx={{ mb: 2, fontWeight: 'bold' }}>
            Breakfast
          </Typography>
          <NutritionTable />
          <Box sx={{ mb: 4 }} />

          <Typography variant="h3" sx={{ mb: 2, fontWeight: 'bold' }}>
            Lunch
          </Typography>
          <NutritionTable />
          <Box sx={{ mb: 4 }} />

          <Typography variant="h3" sx={{ mb: 2, fontWeight: 'bold' }}>
            Dinner
          </Typography>
          <NutritionTable />
          <Box sx={{ mb: 4 }} />

          <Typography variant="h3" sx={{ mb: 2, fontWeight: 'bold' }}>
            Snacks
          </Typography>
          <NutritionTable />
          <Box sx={{ mb: 4 }} />

          <Typography variant="h3" sx={{ mb: 2, fontWeight: 'bold' }}>
            Total
          </Typography>
          <NutritionTable />
        </Box>
      </Box>
    </Container>
  );
};

export default ProgressDashboard;

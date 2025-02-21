import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button
} from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
} from 'chart.js';

// 1. Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartTitle,
  Tooltip,
  Legend
);

// 2. Define a TypeScript interface for data
interface ProgressEntry {
  date: string;
  weight: number;
}

// 3. Example component
const ProgressDashboard: React.FC = () => {
  const [progressData, setProgressData] = useState<ProgressEntry[]>([]);

  // Example: Hardcoded dummy data (replace with real API call)
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

  // 4. Prepare data for the chart
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

  // 5. Chart configuration
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Weight Over Time',
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Page Title */}
      <Typography variant="h4" gutterBottom>
        Weight
      </Typography>

      <Grid container spacing={3}>
        {/* Left Column: Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Box sx={{ height: 300 }}>
              <Line data={chartData} options={options} />
            </Box>
          </Paper>
        </Grid>

        {/* Right Column: Last Logged Weight Card */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
            }}
          >
            <Typography variant="subtitle1" color="text.secondary">
              Last logged weight
            </Typography>
            <Typography variant="body2">Wed, Feb 13, 2025</Typography>

            <Typography variant="h2" sx={{ mt: 2, mb: 1 }}>
              211.5 lbs
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Goal: 200 lbs
            </Typography>

            {/* Button at bottom */}
            <Box sx={{ mt: 'auto' }}>
              <Button variant="contained" color="primary">
                Log New Weight
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProgressDashboard;

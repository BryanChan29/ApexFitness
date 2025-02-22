import React, { useState } from 'react';
import { Box, Button, Typography, Card, CardContent } from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from 'chart.js';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import AuthModal from './AuthModal';

// Register Chart.js components
Chart.register(LineElement, CategoryScale, LinearScale, PointElement);

const LandingPage: React.FC = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authType, setAuthType] = useState<'register' | 'login'>('login');

  const handleOpenAuthModal = (type: 'register' | 'login') => {
    setAuthType(type);
    setAuthModalOpen(true);
  };

  const handleCloseAuthModal = () => {
    setAuthModalOpen(false);
  };
  const progressData = [
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
  // Mock data for weight over time graph
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
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: '#f7f8fc',
        padding: 4,
        position: 'relative',
      }}
    >
      {/* Navbar */}
      <Box
        sx={{
          position: 'absolute',
          top: 20,
          right: 20,
          display: 'flex',
          gap: 2,
        }}
      >
        <Button
          variant="outlined"
          sx={{
            borderRadius: 20,
            px: 3,
            color: 'black',
            borderColor: 'black',
            '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.05)' },
          }}
          onClick={() => handleOpenAuthModal('register')}
        >
          Register
        </Button>
        <Button
          variant="contained"
          sx={{
            borderRadius: 20,
            px: 3,
            backgroundColor: 'black',
            '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.8)' },
          }}
          onClick={() => handleOpenAuthModal('login')}
        >
          Login
        </Button>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          display: 'flex',
          //   justifyContent: 'center',
          //   alignItems: 'center',
          flexGrow: 1,
          gap: 7,
          px: 8,
        }}
      >
        {/* Left Section - Hero Content */}
        <Box
          sx={{
            backgroundColor: 'white',
            borderRadius: 3,
            padding: 5,
            maxWidth: 600,
            maxHeight: 300,
            textAlign: 'left',
            boxShadow: 3,
            mt: 5,
          }}
        >
          <Typography variant="h2" fontWeight="bold">
            Apex Tracker
          </Typography>
          <Typography variant="h5" sx={{ mt: 2 }}>
            Achieve your fitness goals with our all-in-one wellness platform.
            Track nutrition, plan meals, and log workouts—all in one place.
          </Typography>
        </Box>

        {/* Right Section - Graphs */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Weight Over Time */}
          <Card
            sx={{
              width: 220,
              height: 220,
              boxShadow: 3,
              borderRadius: 3,
              textAlign: 'center',
              mt: 8,
            }}
          >
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold">
                Weight Over Time
              </Typography>
              <Box sx={{ height: 160 }}>
                <Line
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                  }}
                />
              </Box>
            </CardContent>
          </Card>

          {/* Remaining Calories */}
          <Card
            sx={{
              width: 220,
              height: 200,
              boxShadow: 3,
              borderRadius: 3,
              textAlign: 'center',
              ml: 25,
              mt: -5,
            }}
          >
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold">
                Remaining Calories
              </Typography>
              <Box sx={{ width: 125, mx: 'auto', mt: 1 }}>
                <CircularProgressbar
                  value={775}
                  maxValue={2000}
                  text={`775/2000`}
                  styles={buildStyles({
                    pathColor: 'black',
                    textColor: 'black',
                    trailColor: 'gray',
                  })}
                />
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Authentication Modal */}
      <AuthModal
        open={authModalOpen}
        onClose={handleCloseAuthModal}
        type={authType}
      />
    </Box>
  );
};

export default LandingPage;

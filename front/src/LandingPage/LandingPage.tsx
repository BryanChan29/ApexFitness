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
        height: '90vh',
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
          width: '95%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Logo */}
        <Box sx={{ ml: 3 }}>
          <img
            src="/logo.png"
            alt="Logo"
            style={{
              width: 125,
              height: 'auto',
            }}
          />
        </Box>

        {/* Authentication Buttons */}
        <Box sx={{ display: 'flex', gap: 2 }}>
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
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          display: 'flex',
          flexGrow: 1,
          gap: 7,
          px: 8,
        }}
      >
        {/* Left Section - Hero Content */}
        <Box
          sx={{
            backgroundColor: 'white',
            borderRadius: 10,
            padding: 8,
            width: '50%',
            height: '50%',
            textAlign: 'left',
            boxShadow: 10,
            mt: 15,
          }}
        >
          <Typography variant="h1" fontWeight="bold" sx={{ fontSize: '5rem' }}>
            Apex Tracker
          </Typography>
          <Typography variant="h4" sx={{ mt: 5, fontSize: '1.5rem' }}>
            Achieve your fitness goals with our all-in-one wellness platform. Track your nutrition intake, plan balanced meals, monitor your progress, and log detailed workout sessions—all conveniently in one place.
          </Typography>
          <Button
            variant="contained"
            sx={{
              borderRadius: 20,
              px: 5,
              py: 2,
              mt: 4,
              fontSize: '1.4rem',
              backgroundColor: '#3f51b5',
              textTransform: 'none',
              '&:hover': { backgroundColor: '#303f9f' },
            }}
            onClick={() => handleOpenAuthModal('register')}
          >
            Get started
          </Button>
        </Box>

        <Box
          sx={{
            backgroundColor: 'white',
            borderRadius: 10,
            padding: 8,
            boxShadow: 3,
            width: '50%',
            height: '50%',
            display: 'flex',
            alignItems: 'center',
            mt: 15,
          }}
        >
          {/* Left Side - Graph Cards */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Weight Over Time */}
            <Card sx={{ width: "80%", height: "40%", boxShadow: 10, borderRadius: 5, textAlign: 'center' }}>
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
            <Card sx={{ width: "80%", height: "40%", boxShadow: 10, borderRadius: 5, textAlign: 'center' }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold">
                  Remaining Calories
                </Typography>
                <Box sx={{ width: '125', mx: 'auto', mt: 1 }}>
                  <CircularProgressbar
                    value={775}
                    maxValue={2000}
                    text={`775/2000`}
                    styles={buildStyles({
                      pathColor: 'black',
                      textColor: 'black',
                      trailColor: 'gray',
                      textSize: '1rem',
                    })}
                  />
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Right Side - Image Inside the Same Box */}
          <Box
            component="img"
            src="/exampleEntry.png"
            alt="Example Entry"
            sx={{
              width: '70%',
              height: 'auto',
              borderRadius: 3,
              boxShadow: 10,
              ml: 3,
            }}
          />
        </Box>
      </Box>

      {/* Authentication Modal */}
      <AuthModal open={authModalOpen} onClose={handleCloseAuthModal} type={authType} />
    </Box>
  );
};

export default LandingPage;

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from 'react-router-dom';
import {
  Box,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  CircularProgress,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import Dashboard from './progresspage/Dashboard';
import FoodDash from './pages/FoodDash';
import LandingPage from './LandingPage/LandingPage';
import LogoutButton from './components/LogoutButton';
import { useAuth } from './LandingPage/authUtils';
import WorkoutPage from './workouts/Workout';
import './App.css';
import { AccessDenied, NotFound } from './components/error';

import FlagIcon from '@mui/icons-material/Flag';
import Goals from './progresspage/Goals';
import UserMealPlans from './Meals/UserMealPlan';

// Drawer width
const drawerWidth = 125;

function App() {
  const isAuthenticated = useAuth();

  if (isAuthenticated === null) {
    return (
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  function Dashboard() {
    return <Typography variant="h4">Dashboard Content</Typography>;
  }

  return (
    <Router>
      {/* If user is not authenticated, show only the Landing Page */}
      {!isAuthenticated ? (
        <LandingPage />
      ) : (
        <Box sx={{ display: 'flex' }}>
          {/* Permanent Sidebar Drawer */}
          <Drawer
            variant="permanent"
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              [`& .MuiDrawer-paper`]: {
                width: drawerWidth,
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              },
            }}
            open
          >
            <Toolbar>
              <Box
                component="img"
                sx={{
                  height: 85,
                  width: 85,
                }}
                alt="Logo"
                src="/public/logo.png"
              />
            </Toolbar>

            <List
              sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}
            >
              <ListItemButton
                component={Link}
                to="/dashboard"
                sx={{
                  justifyContent: 'center',
                  padding: 2,
                  flexDirection: 'column',
                }}
              >
                <ListItemIcon
                  sx={{ display: 'flex', justifyContent: 'center' }}
                >
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItemButton>
              <ListItemButton
                component={Link}
                to="/meals"
                sx={{
                  justifyContent: 'center',
                  padding: 2,
                  flexDirection: 'column',
                }}
              >
                <ListItemIcon
                  sx={{ display: 'flex', justifyContent: 'center' }}
                >
                  <RestaurantMenuIcon />
                </ListItemIcon>
                <ListItemText primary="Meal Plans" />
              </ListItemButton>
              <ListItemButton
                component={Link}
                to="/workouts"
                sx={{
                  justifyContent: 'center',
                  padding: 2,
                  flexDirection: 'column',
                }}
              >
                <ListItemIcon
                  sx={{ display: 'flex', justifyContent: 'center' }}
                >
                  <FitnessCenterIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Workouts"
                  sx={{ textAlign: 'center', marginTop: 1 }}
                />
              </ListItemButton>

              <ListItemButton
                component={Link}
                to="/goals"
                sx={{
                  justifyContent: 'center',
                  padding: 2,
                  flexDirection: 'column',
                }}
              >
                <ListItemIcon
                  sx={{ display: 'flex', justifyContent: 'center' }}
                >
                  <FlagIcon />
                </ListItemIcon>
                <ListItemText
                  primary="My Goals"
                  sx={{ textAlign: 'center', marginTop: 1 }}
                />
              </ListItemButton>

              <Box sx={{ paddingBottom: 2 }}>
                <LogoutButton />
              </Box>
            </List>
          </Drawer>

          {/* Main Content */}
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              ml: `${drawerWidth}px`,
            }}
          >
            <Toolbar />
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/food-dash" element={<FoodDash />} />
              <Route path="/meals" element={<UserMealPlans />} />
              <Route path="/workouts" element={<WorkoutPage />} />
              <Route path="/goals" element={<Goals />} />

              {/* Redirect to Dashboard if user is logged in */}
              <Route path="*" element={<Navigate to="/dashboard" />} />

              {/* Access Denied Route */}
              <Route path="/access-denied" element={<AccessDenied />} />

              {/* 404 Not Found Page */}
              <Route path="/not-found" element={<NotFound />} />
            </Routes>
          </Box>
        </Box>
      )}
    </Router>
  );
}

export default App;

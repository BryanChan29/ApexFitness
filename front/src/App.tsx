import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import {
  Box,
  Toolbar,
  CircularProgress,
} from '@mui/material';
import Sidebar from './components/Sidebar';
import ProgressDashboard from './progresspage/Dashboard';
import LogFood from './pages/LogFood';
import NewMeal from './Meals/NewMeal'
import LandingPage from './LandingPage/LandingPage';
import { useAuth } from './LandingPage/authUtils';
import WorkoutPage from './workouts/Workout';
import { AccessDenied, NotFound } from './components/error';
import Goals from './progresspage/Goals';
import './App.css';
import UserMealPlans from './Meals/UserMealPlan';
import NewMealPlan from './Meals/NewMealPlan';
import MealPlanSearch from './Meals/MealPlanSearch';


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

  return (
    <Router>
      {!isAuthenticated ? (
        <LandingPage />
      ) : (
        <Box sx={{ display: 'flex' }}>
          <Sidebar />

          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
            }}
          >
            <Toolbar />
            <Routes>
              <Route path="/dashboard" element={<ProgressDashboard />} />
              <Route path="/meals" element={<UserMealPlans />} />
              <Route path="/workouts" element={<WorkoutPage />} />
              <Route path="/goals" element={<Goals/>} />
              <Route path="/new-meal-plan" element={<NewMealPlan />} />
              <Route path="/add-food" element={<LogFood />} />
              <Route path="/new-meal" element={<NewMeal />} />
              <Route path="/meal-plans" element={<MealPlanSearch />} />

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

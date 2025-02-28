import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from 'react-router-dom';
import {
  Box,
  CssBaseline,
  AppBar,
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
import MealPlan from './Meals/MealPlan';

function AccessDenied() {
  return (
    <Box
      sx={{
        mt: 10,
      }}
    >
      <Typography variant="h4" color="error">
        Access Denied
      </Typography>
      <Typography variant="body1">
        You do not have permission to view this page.
      </Typography>
    </Box>
  );
}

function NotFound() {
  return (
    <Box sx={{ mt: 10 }}>
      <Typography variant="h4" color="error">
        Page Not Found
      </Typography>
      <Typography variant="body1">
        The page you are looking for does not exist.
      </Typography>
    </Box>
  );
}

// Drawer width
const drawerWidth = 240;

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
      {/* If user is not authenticated, show only the Landing Page */}
      {!isAuthenticated ? (
        <LandingPage />
      ) : (
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />

          {/* Top AppBar */}
          <AppBar
            position="fixed"
            sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
          >
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6" noWrap component="div">
                Nutrition Tracker
              </Typography>
              <LogoutButton />
            </Toolbar>
          </AppBar>

          {/* Permanent Sidebar Drawer */}
          <Drawer
            variant="permanent"
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              [`& .MuiDrawer-paper`]: {
                width: drawerWidth,
                boxSizing: 'border-box',
              },
            }}
            open
          >
            <Toolbar>
              <Typography variant="h6" noWrap>
                My App
              </Typography>
            </Toolbar>
            <List>
              <ListItemButton component={Link} to="/dashboard">
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItemButton>

              <ListItemButton component={Link} to="/meals">
                <ListItemIcon>
                  <RestaurantMenuIcon />
                </ListItemIcon>
                <ListItemText primary="Meals" />
              </ListItemButton>

              <ListItemButton component={Link} to="/workouts">
                <ListItemIcon>
                  <FitnessCenterIcon />
                </ListItemIcon>
                <ListItemText primary="Workouts" />
              </ListItemButton>
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
              <Route path="/meals" element={<MealPlan />} />
              <Route path="/workouts" element={<WorkoutPage />} />
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

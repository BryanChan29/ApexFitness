import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
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
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import Dashboard from './progresspage/Dashboard';

// Placeholder pages
function DashboardPage() {
  return <Typography variant="h4">Dashboard Content</Typography>;
}

function MealsPage() {
  return <Typography variant="h4">Meals Content</Typography>;
}

function WorkoutsPage() {
  return <Typography variant="h4">Workouts Content</Typography>;
}

// Drawer width
const drawerWidth = 240;

function App() {
  // Sidebar content
  const drawer = (
    <div>
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
    </div>
  );

  return (
    <Router>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />

        {/* Top AppBar */}
        <AppBar
          position="fixed"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <Toolbar>
            <Typography variant="h6" noWrap component="div">
              Nutrition Tracker
            </Typography>
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
          {drawer}
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
          {/* Add spacing so content starts below the AppBar */}
          <Toolbar />

          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/meals" element={<MealsPage />} />
            <Route path="/workouts" element={<WorkoutsPage />} />
            <Route path="/" element={<DashboardPage />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;

import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Modal,
  FormControl,
  Snackbar,
  Alert,
} from '@mui/material';
import axios from 'axios';

interface CardioWorkoutEntry {
  id: number;
  workoutType: string;
  duration: number;
  caloriesBurned: number;
}

interface StrengthWorkoutEntry {
  id: number;
  workoutType: string;
  sets: number;
  reps: number;
  weight: number;
}

interface ApiCaloriesBurnedResponse {
  name: string;
  calories_per_hour: number;
  duration_minutes?: number;
  total_calories?: number;
}

interface Workout {
  id: number;
  name: string;
  date: string;
  exercises: CardioWorkoutEntry[] | StrengthWorkoutEntry[];
  user_id: number;
}

const WorkoutPage: React.FC = () => {
  const [cardioData, setCardioData] = useState<CardioWorkoutEntry[]>([]);
  const [strengthData, setStrengthData] = useState<StrengthWorkoutEntry[]>([]);
  const [openCardioModal, setOpenCardioModal] = useState(false);
  const [openStrengthModal, setOpenStrengthModal] = useState(false);
  const [newCardio, setNewCardio] = useState<Omit<CardioWorkoutEntry, 'id'>>({ workoutType: '', duration: 0, caloriesBurned: 0 });
  const [newStrength, setNewStrength] = useState<Omit<StrengthWorkoutEntry, 'id'>>({ workoutType: '', sets: 0, reps: 0, weight: 0 });
  const [nextCardioId, setNextCardioId] = useState(1);
  const [nextStrengthId, setNextStrengthId] = useState(1);
  const [searchResults, setSearchResults] = useState<ApiCaloriesBurnedResponse[]>([]);
  const [openSearchResultsModal, setOpenSearchResultsModal] = useState(false);
  const [selectedSearchResult, setSelectedSearchResult] = useState<ApiCaloriesBurnedResponse | null>(null);
  const [workoutName, setWorkoutName] = useState('');
  const [openNameModal, setOpenNameModal] = useState(false);
  const [isCardioSave, setIsCardioSave] = useState(false);
  const [userWorkouts, setUserWorkouts] = useState<Workout[]>([]);
  const [openUserWorkoutsModal, setOpenUserWorkoutsModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleOpenCardioModal = () => setOpenCardioModal(true);
  const handleCloseCardioModal = () => setOpenCardioModal(false);
  const handleOpenStrengthModal = () => setOpenStrengthModal(true);
  const handleCloseStrengthModal = () => setOpenStrengthModal(false);
  const handleOpenSearchResultsModal = () => setOpenSearchResultsModal(true);
  const handleCloseSearchResultsModal = () => setOpenSearchResultsModal(false);
  const handleOpenNameModal = (isCardio: boolean) => {
    setIsCardioSave(isCardio);
    setOpenNameModal(true);
  };
  const handleCloseNameModal = () => setOpenNameModal(false);
  const handleOpenUserWorkoutsModal = () => setOpenUserWorkoutsModal(true);
  const handleCloseUserWorkoutsModal = () => setOpenUserWorkoutsModal(false);


  const handleAddCardio = () => {
    if (selectedSearchResult) {
      const caloriesPerHour = selectedSearchResult.calories_per_hour;
      const durationHours = newCardio.duration / 60;
      const calculatedCalories = caloriesPerHour * durationHours;

      const updatedCardio = { ...newCardio, caloriesBurned: calculatedCalories };
      setCardioData([...cardioData, { id: nextCardioId, ...updatedCardio }]);
      setNextCardioId(nextCardioId + 1);
      setNewCardio({ workoutType: '', duration: 0, caloriesBurned: 0 });
      setSelectedSearchResult(null);
      handleCloseCardioModal();
    } else {
      setCardioData([...cardioData, { id: nextCardioId, ...newCardio }]);
      setNextCardioId(nextCardioId + 1);
      setNewCardio({ workoutType: '', duration: 0, caloriesBurned: 0 });
      handleCloseCardioModal();
    }
  };

  const handleAddStrength = () => {
    setStrengthData([...strengthData, { id: nextStrengthId, ...newStrength }]);
    setNextStrengthId(nextStrengthId + 1);
    setNewStrength({ workoutType: '', sets: 0, reps: 0, weight: 0 });
    handleCloseStrengthModal();
  };

  const handleSearchWorkoutTypes = async () => {
    try {
      const response = await axios.get('/api/calories-burned', {
        params: { activity: newCardio.workoutType },
      });
      setSearchResults(response.data);
      handleOpenSearchResultsModal();
    } catch (error) {
      console.error('Error fetching workout types:', error);
      handleOpenSearchResultsModal();
    }
  };

  const handleSelectSearchResult = (workoutType: string) => {
    const selected = searchResults.find((result) => result.name === workoutType);
    setSelectedSearchResult(selected || null);
    setNewCardio({ ...newCardio, workoutType });
    handleCloseSearchResultsModal();
  };

  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleSaveCardioWorkout = async () => {
    try {
      const response = await axios.post('/api/workouts', {
        name: workoutName,
        date: new Date().toISOString(),
        exercises: cardioData,
      });
      console.log('Workout saved:', response.data);
      setCardioData([]);
      setWorkoutName('');
      handleCloseNameModal();
      setSuccessMessage('Cardio workout saved successfully!');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error saving workout:', error);
    }
  };

  const handleSaveStrengthWorkout = async () => {
    try {
      const response = await axios.post('/api/workouts', {
        name: workoutName,
        date: new Date().toISOString(),
        exercises: strengthData,
      });
      console.log('Strength workout saved:', response.data);
      setStrengthData([]);
      setWorkoutName('');
      handleCloseNameModal();
      setSuccessMessage('Strength workout saved successfully!');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error saving strength workout:', error);
    }
  };

  const handleLoadUserWorkouts = async () => {
    try {
      const response = await axios.get('/api/workouts');
      setUserWorkouts(response.data.workouts);
      handleOpenUserWorkoutsModal();
    } catch (error) {
      console.error('Error loading user workouts:', error);
    }
  };

  const handleSelectUserWorkout = async (workout: Workout) => {
    try {
      const response = await axios.get(`/api/workouts/${workout.id}/exercises`);
      const exercises = response.data.exercises;

      console.log('Exercises from API:', exercises); // Check the API response


      // Clear existing data before populating
      setCardioData([]);
      setStrengthData([]);

      // Populate cardioData and strengthData based on exercise types
      exercises.forEach((exercise: any) => {
        if (exercise.duration && exercise.calories_burned) {
          setCardioData((prev) => [...prev, {
            id: prev.length + 1,
            workoutType: exercise.name_of_workout,
            duration: exercise.duration,
            caloriesBurned: exercise.calories_burned,
          }]);
          console.log('Cardio Data:', cardioData)

        } else if (exercise.sets && exercise.reps && exercise.weight) {
          setStrengthData((prev) => [...prev, {
            id: prev.length + 1,
            workoutType: exercise.name_of_workout,
            sets: exercise.sets,
            reps: exercise.reps,
            weight: exercise.weight,
          }]);
        }
      });

      handleCloseUserWorkoutsModal();
    } catch (error: any) {
      console.error('Error loading workout exercises:', error);
      console.error('API Response:', error.response); // Log the full error response

    }
  };

  const cardioModal = (
    <Modal open={openCardioModal} onClose={handleCloseCardioModal}>
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
        <Typography variant="h6" gutterBottom>Add Cardio Workout</Typography>
        <TextField
          label="Workout Type"
          fullWidth
          margin="normal"
          value={newCardio.workoutType}
          onChange={(e) => setNewCardio({ ...newCardio, workoutType: e.target.value })}
        />
        <Button variant="contained" color="primary" onClick={handleSearchWorkoutTypes} sx={{ mt: 2 }}>
          Search Workout Types
        </Button>
        <TextField
          label="Duration (minutes)"
          type="number"
          fullWidth
          margin="normal"
          value={newCardio.duration}
          onChange={(e) => setNewCardio({ ...newCardio, duration: Number(e.target.value) })}
        />
        <Button variant="contained" color="primary" onClick={handleAddCardio} sx={{ mt: 2 }}>Add</Button>
      </Box>
    </Modal>
  );

  const searchResultsModal = (
    <Modal open={openSearchResultsModal} onClose={handleCloseSearchResultsModal}>
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
        <Typography variant="h6" gutterBottom>Search Results</Typography>
        {searchResults.map((result, index) => (
          <Button
            key={index}
            fullWidth
            sx={{ my: 1 }}
            variant="outlined"
            onClick={() => handleSelectSearchResult(result.name)}
          >
            {result.name}
          </Button>
        ))}
      </Box>
    </Modal>
  );

  const strengthModal = (
    <Modal open={openStrengthModal} onClose={handleCloseStrengthModal}>
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
        <Typography variant="h6" gutterBottom>Add Strength Workout</Typography>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Workout Type"
            fullWidth
            margin="normal"
            value={newStrength.workoutType}
            onChange={(e) => setNewStrength({ ...newStrength, workoutType: e.target.value })}
          />
        </FormControl>
        <TextField label="Sets" type="number" fullWidth margin="normal" value={newStrength.sets} onChange={(e) => setNewStrength({ ...newStrength, sets: Number(e.target.value) })} />
        <TextField label="Reps" type="number" fullWidth margin="normal" value={newStrength.reps} onChange={(e) => setNewStrength({ ...newStrength, reps: Number(e.target.value) })} />
        <TextField label="Weight (lbs)" type="number" fullWidth margin="normal" value={newStrength.weight} onChange={(e) => setNewStrength({ ...newStrength, weight: Number(e.target.value) })} />
        <Button variant="contained" color="primary" onClick={handleAddStrength}>Add</Button>
      </Box>
    </Modal>
  );

  const nameModal = (
    <Modal open={openNameModal} onClose={handleCloseNameModal}>
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
        <Typography variant="h6" gutterBottom>Enter Workout Name</Typography>
        <TextField
          label="Workout Name"
          fullWidth
          margin="normal"
          value={workoutName}
          onChange={(e) => setWorkoutName(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={isCardioSave ? handleSaveCardioWorkout : handleSaveStrengthWorkout} sx={{ mt: 2 }}>
          Save
        </Button>
      </Box>
    </Modal>
  );

  const userWorkoutsModal = (
    <Modal open={openUserWorkoutsModal} onClose={handleCloseUserWorkoutsModal}>
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
        <Typography variant="h6" gutterBottom>Select Workout</Typography>
        {userWorkouts.map((workout) => (
          <Button
            key={workout.id}
            fullWidth
            sx={{ my: 1 }}
            variant="outlined"
            onClick={() => handleSelectUserWorkout(workout)}
          >
            {workout.name}
          </Button>
        ))}
      </Box>
    </Modal>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>Cardio Workouts</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, borderRadius: 5 }}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Workout Type</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Calories Burned</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cardioData.map((workout) => (
                    <TableRow key={workout.id}>
                      <TableCell>{workout.workoutType}</TableCell>
                      <TableCell>{workout.duration}</TableCell>
                      <TableCell>{workout.caloriesBurned}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" className='primary-button' onClick={handleOpenCardioModal}>Add Cardio Workout</Button>
              <Button variant="contained" onClick={() => handleOpenNameModal(true)} sx={{ ml: 2 }} className='primary-button'>
                Save Cardio Workout
              </Button>
              <Button variant="contained" onClick={handleLoadUserWorkouts} sx={{ ml: 2 }} className='primary-button'>
                Load Workouts
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {cardioModal}
      {searchResultsModal}
      {nameModal}
      {userWorkoutsModal}

      <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>Strength Training Workouts</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, borderRadius: 5 }}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Workout Type</TableCell>
                    <TableCell>Sets</TableCell>
                    <TableCell>Reps</TableCell>
                    <TableCell>Weight</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {strengthData.map((workout) => (
                    <TableRow key={workout.id}>
                      <TableCell>{workout.workoutType}</TableCell>
                      <TableCell>{workout.sets}</TableCell>
                      <TableCell>{workout.reps}</TableCell>
                      <TableCell>{workout.weight}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" color="primary" onClick={handleOpenStrengthModal} sx={{ ml: 2 }} className='primary-button'>
                Add Strength Workout</Button>
              <Button variant="contained" color="secondary" onClick={() => handleOpenNameModal(false)} sx={{ ml: 2 }} className='primary-button'>
                Save Strength Workout
              </Button>
              <Button
                variant="contained"
                onClick={handleLoadUserWorkouts} // load button added here.
                sx={{ ml: 2 }}
                className="primary-button"
              >
                Load Workouts
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {strengthModal}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default WorkoutPage;
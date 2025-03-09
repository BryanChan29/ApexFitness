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
  duration_minutes?: number; //Add if they exist
  total_calories?: number; //Add if they exist
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


  const handleOpenCardioModal = () => setOpenCardioModal(true);
  const handleCloseCardioModal = () => setOpenCardioModal(false);
  const handleOpenStrengthModal = () => setOpenStrengthModal(true);
  const handleCloseStrengthModal = () => setOpenStrengthModal(false);
  const handleOpenSearchResultsModal = () => setOpenSearchResultsModal(true);
  const handleCloseSearchResultsModal = () => setOpenSearchResultsModal(false);

  const handleAddCardio = () => {
    if (selectedSearchResult) {
      const caloriesPerHour = selectedSearchResult.calories_per_hour;
      const durationHours = newCardio.duration / 60;
      const calculatedCalories = caloriesPerHour * durationHours;

      const updatedCardio = { ...newCardio, caloriesBurned: calculatedCalories };
      setCardioData([...cardioData, { id: nextCardioId, ...updatedCardio }]);
      setNextCardioId(nextCardioId + 1);
      setNewCardio({ workoutType: '', duration: 0, caloriesBurned: 0 });
      setSelectedSearchResult(null); // Reset selected result
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
      console.log("handleSearchWorkoutType");
      const response = await axios.get('/api/calories-burned', {
        params: { activity: newCardio.workoutType },
      });
      console.log(response.data);

      setSearchResults(response.data);
      handleOpenSearchResultsModal();
    } catch (error) {
      console.error('Error fetching workout types:', error);
      // setSearchResults([{ name: 'Error fetching data', calories_per_hour: 0 }]);
      handleOpenSearchResultsModal();
    }
  };

  const handleSelectSearchResult = (workoutType: string) => {
    const selected = searchResults.find((result) => result.name === workoutType);
    setSelectedSearchResult(selected || null);
    setNewCardio({ ...newCardio, workoutType });
    handleCloseSearchResultsModal();
  };

  const handleSaveCardioWorkout = async () => {
    try {
      const response = await axios.post('/api/workouts', {
        name: 'Cardio Workout', // You can customize the workout name
        date: new Date().toISOString(), // Current date/time
        exercises: cardioData, // Send cardioData as exercises
      });
      console.log('Workout saved:', response.data);
      // Optionally, clear the cardioData or show a success message
      setCardioData([]);
    } catch (error) {
      console.error('Error saving workout:', error);
      // Handle error (e.g., show an error message)
    }
  };

  const handleSaveStrengthWorkout = async () => {
    try {
      const response = await axios.post('/api/workouts', {
        name: 'Strength Workout', // Customize workout name if needed
        date: new Date().toISOString(),
        exercises: strengthData, // Send strengthData as exercises
      });
      console.log('Strength workout saved:', response.data);
      // Optionally, clear strengthData or show a success message
      setStrengthData([]);
    } catch (error) {
      console.error('Error saving strength workout:', error);
      // Handle error (e.g., show an error message)
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
          onChange={(e) => setNewCardio({ ...newCardio, duration: Number(e.target.value) })} />
        {/* <TextField label="Calories Burned" type="number" fullWidth margin="normal" value={newCardio.caloriesBurned} onChange={(e) => setNewCardio({ ...newCardio, caloriesBurned: Number(e.target.value) })} /> */}
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
          onClick={() => handleSelectSearchResult(result.name)} // Pass only the name
        >
          {result.name} {/* Render only the name */}
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
              <Button variant="contained" onClick={handleSaveCardioWorkout} sx={{ ml: 2 }} className='primary-button'>
                Save Cardio Workout
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {cardioModal}
      {searchResultsModal}

      <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>Strength Training Workouts</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, borderRadius: 5  }}>
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
              <Button variant="contained" color="primary" onClick={handleOpenStrengthModal} className='primary-button'>Add Strength Workout</Button>
            </Box>
            <Button variant="contained" color="secondary" onClick={handleSaveStrengthWorkout} sx={{ ml: 2 }}>
              Save Strength Workout
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {strengthModal}

        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              width: '30%',
              height: '100%',
              borderRadius: 10,
              marginTop: 5,
            }}
          >
            <Typography variant="subtitle1" color="text.secondary">
              Last logged weight
            </Typography>
            <Typography variant="body2">Wed, Feb 13, 2025</Typography>

            <Typography variant="h2" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
              211.5 lbs
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Goal: 200 lbs
            </Typography>

            {/* Button at bottom */}
            <Box sx={{ mt: 'auto' }}>
                <Button variant="contained" color="primary" className="primary-button">
                Log New Weight
                </Button>
            </Box>
          </Paper>
        </Grid>
    </Container>
  );
};

export default WorkoutPage;
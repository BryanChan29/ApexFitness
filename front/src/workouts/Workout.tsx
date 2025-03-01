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
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

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

const WorkoutPage: React.FC = () => {
  const [cardioData, setCardioData] = useState<CardioWorkoutEntry[]>([]);
  const [strengthData, setStrengthData] = useState<StrengthWorkoutEntry[]>([]);
  const [openCardioModal, setOpenCardioModal] = useState(false);
  const [openStrengthModal, setOpenStrengthModal] = useState(false);
  const [newCardio, setNewCardio] = useState<Omit<CardioWorkoutEntry, 'id'>>({ workoutType: '', duration: 0, caloriesBurned: 0 });
  const [newStrength, setNewStrength] = useState<Omit<StrengthWorkoutEntry, 'id'>>({ workoutType: '', sets: 0, reps: 0, weight: 0 });
  const [nextCardioId, setNextCardioId] = useState(1);
  const [nextStrengthId, setNextStrengthId] = useState(1);

  const handleOpenCardioModal = () => setOpenCardioModal(true);
  const handleCloseCardioModal = () => setOpenCardioModal(false);
  const handleOpenStrengthModal = () => setOpenStrengthModal(true);
  const handleCloseStrengthModal = () => setOpenStrengthModal(false);

  const handleAddCardio = () => {
    setCardioData([...cardioData, { id: nextCardioId, ...newCardio }]);
    setNextCardioId(nextCardioId + 1);
    setNewCardio({ workoutType: '', duration: 0, caloriesBurned: 0 });
    handleCloseCardioModal();
  };

  const handleAddStrength = () => {
    setStrengthData([...strengthData, { id: nextStrengthId, ...newStrength }]);
    setNextStrengthId(nextStrengthId + 1);
    setNewStrength({ workoutType: '', sets: 0, reps: 0, weight: 0 });
    handleCloseStrengthModal();
  };

  const cardioModal = (
    <Modal open={openCardioModal} onClose={handleCloseCardioModal}>
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
        <Typography variant="h6" gutterBottom>Add Cardio Workout</Typography>

        <FormControl fullWidth margin="normal">
          <InputLabel id="cardio-type-label">Workout Type</InputLabel>
          <Select
            labelId="cardio-type-label"
            id="cardio-type"
            value={newCardio.workoutType}
            label="Workout Type"
            onChange={(e) => setNewCardio({ ...newCardio, workoutType: e.target.value })}
          >
            <MenuItem value="Running">Running</MenuItem>
            <MenuItem value="Swimming">Swimming</MenuItem>
            <MenuItem value="Cycling">Cycling</MenuItem>
            {/* Add more cardio types as needed */}
          </Select>
        </FormControl>

        <TextField label="Duration (minutes)" type="number" fullWidth margin="normal" value={newCardio.duration} onChange={(e) => setNewCardio({ ...newCardio, duration: Number(e.target.value) })} />
        <TextField label="Calories Burned" type="number" fullWidth margin="normal" value={newCardio.caloriesBurned} onChange={(e) => setNewCardio({ ...newCardio, caloriesBurned: Number(e.target.value) })} />
        <Button variant="contained" color="primary" onClick={handleAddCardio}>Add</Button>
      </Box>
    </Modal>
  );

  const strengthModal = (
    <Modal open={openStrengthModal} onClose={handleCloseStrengthModal}>
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
        <Typography variant="h6" gutterBottom>Add Strength Workout</Typography>

        <FormControl fullWidth margin="normal">
          <InputLabel id="strength-type-label">Workout Type</InputLabel>
          <Select
            labelId="strength-type-label"
            id="strength-type"
            value={newStrength.workoutType}
            label="Workout Type"
            onChange={(e) => setNewStrength({ ...newStrength, workoutType: e.target.value })}
          >
            <MenuItem value="Squats">Squats</MenuItem>
            <MenuItem value="Bench Press">Bench Press</MenuItem>
            <MenuItem value="Deadlifts">Deadlifts</MenuItem>
            {/* Add more strength types as needed */}
          </Select>
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
          <Paper sx={{ p: 2, borderRadius: 10 }}>
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
              <Button variant="contained" color="primary" onClick={handleOpenCardioModal}>Add Cardio Workout</Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {cardioModal}

      <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>Strength Training Workouts</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, borderRadius: 10  }}>
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
              <Button variant="contained" color="primary" onClick={handleOpenStrengthModal}>Add Strength Workout</Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {strengthModal}
    </Container>
  );
};

export default WorkoutPage;
                
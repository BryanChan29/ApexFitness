import React, { useState, useEffect } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Box } from '@mui/material';

const fetchNutritionData = async () => {
  return [];
};

const NutritionTable: React.FC = () => {
  const [nutritionData, setNutritionData] = useState<any[]>([]); // State for storing nutrition data
  const [loading, setLoading] = useState(true); // Loading state to handle async data fetching

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchNutritionData();
        setNutritionData(data);
      } catch (error) {
        console.error('Error fetching nutrition data:', error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Paper sx={{ p: 2, mb: 2, borderRadius: 5, width: '100%' }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Food</TableCell>
              <TableCell align="right">Calories</TableCell>
              <TableCell align="right">Carbs</TableCell>
              <TableCell align="right">Fat</TableCell>
              <TableCell align="right">Protein</TableCell>
              <TableCell align="right">Sodium</TableCell>
              <TableCell align="right">Sugar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {nutritionData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Box sx={{ padding: 2 }}>
                    <Typography variant="h6" color="textSecondary">
                      Nothing Logged Yet
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              nutritionData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.food}</TableCell>
                  <TableCell align="right">{item.calories}</TableCell>
                  <TableCell align="right">{item.carbs}</TableCell>
                  <TableCell align="right">{item.fat}</TableCell>
                  <TableCell align="right">{item.protein}</TableCell>
                  <TableCell align="right">{item.sodium}</TableCell>
                  <TableCell align="right">{item.sugar}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default NutritionTable;

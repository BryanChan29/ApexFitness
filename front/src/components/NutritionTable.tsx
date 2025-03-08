import React from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Box } from '@mui/material';

interface DailyFoodItem {
  id: number;
  name: string;
  quantity: string;
  calories: number;
  carbs: number;
  fat: number;
  protein: number;
  sodium: number;
  sugar: number;
  date: string;
}

interface NutritionTableProps {
  foodData: DailyFoodItem[];
}

const NutritionTable: React.FC<NutritionTableProps> = ({ foodData }) => {
  if (foodData.length === 0) {
    return (
      <Paper sx={{ p: 2, mb: 2, borderRadius: 5, width: '98%' }}>
        <Box sx={{ padding: 2, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary">
            Nothing Logged Yet
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2, mb: 2, borderRadius: 5, width: '98%' }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Food</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Calories</TableCell>
              <TableCell align="right">Carbs</TableCell>
              <TableCell align="right">Fat</TableCell>
              <TableCell align="right">Protein</TableCell>
              <TableCell align="right">Sodium</TableCell>
              <TableCell align="right">Sugar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {foodData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell align="right">{item.quantity}</TableCell>
                <TableCell align="right">{item.calories} cal</TableCell>
                <TableCell align="right">{item.carbs}g</TableCell>
                <TableCell align="right">{item.fat}g</TableCell>
                <TableCell align="right">{item.protein}g</TableCell>
                <TableCell align="right">{item.sodium}mg</TableCell>
                <TableCell align="right">{item.sugar}g</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default NutritionTable;

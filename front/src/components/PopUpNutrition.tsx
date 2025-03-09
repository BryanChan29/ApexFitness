import React from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Box, Button } from "@mui/material";
import { z } from "zod";

const NutrientSchema = z.object({
  calcium: z.coerce.number().optional(),
  calories: z.coerce.number(),
  carbohydrate: z.coerce.number(),
  cholesterol: z.coerce.number(),
  fat: z.coerce.number(),
  fiber: z.coerce.number().optional(),
  iron: z.coerce.number().optional(),
  monounsaturated_fat: z.coerce.number().optional(),
  polyunsaturated_fat: z.coerce.number().optional(),
  potassium: z.coerce.number().optional(),
  protein: z.coerce.number(),
  saturated_fat: z.coerce.number(),
  sodium: z.coerce.number(),
  sugar: z.coerce.number(),
  vitamin_a: z.coerce.number().optional(),
  vitamin_c: z.coerce.number().optional(),
  measurement_description: z.string(),
  metric_serving_amount: z.coerce.number(),
  metric_serving_unit: z.string(),
  serving_description: z.string(),
  serving_id: z.string(),
  serving_url: z.string().url(),
});

type NutrientData = z.infer<typeof NutrientSchema>;

interface PopupNutritionProps {
  open: boolean;
  onClose: () => void;
  nutritionData: NutrientData | null;
}

const PopupNutrition: React.FC<PopupNutritionProps> = ({ open, onClose, nutritionData }) => {
  if (nutritionData) {
    try {
      NutrientSchema.parse(nutritionData);
    } catch (e) {
      console.error("Invalid nutrition data", e);
      return null;
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{ "& .MuiPaper-root": { borderRadius: "20px" } }}
    >
      <DialogTitle>Full Nutrition Information</DialogTitle>
      <DialogContent>
        {nutritionData ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box><span style={{ fontWeight: "bold" }}>Serving Description:</span> {nutritionData.serving_description}</Box>
            <Box><span style={{ fontWeight: "bold" }}>Calories:</span> {Math.trunc(nutritionData.calories || 0)} cal</Box>
            <Box><span style={{ fontWeight: "bold" }}>Carbohydrates:</span> {Math.trunc(nutritionData.carbohydrate || 0)}g</Box>
            <Box><span style={{ fontWeight: "bold" }}>Protein:</span> {Math.trunc(nutritionData.protein || 0)}g</Box>
            <Box><span style={{ fontWeight: "bold" }}>Fat:</span> {Math.trunc(nutritionData.fat || 0)}g</Box>
            <Box><span style={{ fontWeight: "bold" }}>Sodium:</span> {Math.trunc(nutritionData.sodium || 0)}mg</Box>
            <Box><span style={{ fontWeight: "bold" }}>Cholesterol:</span> {Math.trunc(nutritionData.cholesterol || 0)}mg</Box>
            <Box><span style={{ fontWeight: "bold" }}>Fiber:</span> {Math.trunc(nutritionData.fiber || 0)}g</Box>
            <Box><span style={{ fontWeight: "bold" }}>Sugar:</span> {Math.trunc(nutritionData.sugar || 0)}g</Box>
            <Box><span style={{ fontWeight: "bold" }}>Calcium:</span> {Math.trunc(nutritionData.calcium || 0)}mg</Box>
            <Box><span style={{ fontWeight: "bold" }}>Iron:</span> {Math.trunc(nutritionData.iron || 0)}mg</Box>
            <Box><span style={{ fontWeight: "bold" }}>Monounsaturated Fat:</span> {Math.trunc(nutritionData.monounsaturated_fat || 0)}g</Box>
            <Box><span style={{ fontWeight: "bold" }}>Polyunsaturated Fat:</span> {Math.trunc(nutritionData.polyunsaturated_fat || 0)}g</Box>
            <Box><span style={{ fontWeight: "bold" }}>Potassium:</span> {Math.trunc(nutritionData.potassium || 0)}mg</Box>
            <Box><span style={{ fontWeight: "bold" }}>Saturated Fat:</span> {Math.trunc(nutritionData.saturated_fat || 0)}g</Box>
            <Box><span style={{ fontWeight: "bold" }}>Vitamin A:</span> {Math.trunc(nutritionData.vitamin_a || 0)} IU</Box>
            <Box><span style={{ fontWeight: "bold" }}>Vitamin C:</span> {Math.trunc(nutritionData.vitamin_c || 0)}mg</Box>
            <Box><span style={{ fontWeight: "bold" }}>Measurement Description:</span> {nutritionData.measurement_description}</Box>
            <Box><span style={{ fontWeight: "bold" }}>Metric Serving Amount:</span> {Math.trunc(nutritionData.metric_serving_amount || 0)} {nutritionData.metric_serving_unit}</Box>
          </Box>
        ) : ( 
          <Box>Loading nutrition information...</Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PopupNutrition;

import { Box, TextField, Button, InputAdornment, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from "axios";
import { z } from "zod";
import searchIcon from "../assets/search.png";
import PopupNutrition from '../components/PopUpNutrition.tsx';
import NutritionTable from "../components/NutritionTable.tsx";

const FoodItemSchema = z.object({
  food_name: z.string(),
  brand_name: z.string().optional(),
  food_description: z.string(),
  food_url: z.string().url(),
  food_id: z.string(),
});

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

const FoodDetailSchema = z.object({
  food: z.object({
    brand_name: z.string().optional(),
    food_name: z.string(),
    food_url: z.string().url(),
    servings: z.object({
      serving: z.union([
        NutrientSchema,
        z.array(NutrientSchema)
      ])
    })
  })
});

const SearchResultsSchema = z.object({
  foods: z.object({
    food: z.array(FoodItemSchema).optional(),
  }).optional(),
});

type SearchResults = z.infer<typeof SearchResultsSchema>;
type FoodItem = z.infer<typeof FoodItemSchema>;
type FoodDetail = z.infer<typeof FoodDetailSchema>;

const LogFood = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults>({});
  const [showSearchButton, setShowSearchButton] = useState(false);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [foodDetail, setFoodDetail] = useState<FoodDetail | null>(null);
  const [servingSize, setServingSize] = useState("");
  const [numServings, setNumServings] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [fullNutrition, setFullNutrition] = useState<z.infer<typeof NutrientSchema> | null>(null);
  const [servingSizes, setServingSizes] = useState<string[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const mealType = searchParams.get('mealType');

  useEffect(() => {
    if (!mealType || !["breakfast", "lunch", "dinner", "snack"].includes(mealType)) {
      navigate('/not-found');
    }
  }, [mealType, navigate]); 

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);

    if (value.length > 2) {
      setShowSearchButton(true);
    } else {
      setShowSearchButton(false);
    }
  };

  const handleSearch = async () => {
    if (query.length > 2) {
      try {
        const response = await axios.get(`/api/search-food`, {
          params: { query },
        });
  
        console.log("Raw Response:", response.data);
  
        if (!response.data.foods?.food) {
          console.error("No food items found in the response.");
          return;
        }

        if (!Array.isArray(response.data.foods.food)) {
          response.data.foods.food = [response.data.foods.food];
        }
  
        const parsedResults = SearchResultsSchema.parse(response.data);
        setResults(parsedResults);
      } catch (error) {
        console.error("Error fetching food data:", error);
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleFoodClick = async (food: FoodItem) => {
    setSelectedFood(food);
    setNumServings("1");
    try {
      const response = await axios.get(`/api/food-detail`, {
        params: { foodId: food.food_id },
      });
  
      const parsedDetail = FoodDetailSchema.parse(response.data);
      setFoodDetail(parsedDetail);
  
      // Extract serving sizes
      const servings = parsedDetail.food.servings.serving;
      if (!servings) return;
  
      const servingArray = Array.isArray(servings) ? servings : [servings];
  
      // Store all serving size descriptions
      const servingOptions = servingArray.map((serving) => serving.serving_description);
      setServingSizes(servingOptions);
  
      setServingSize(servingOptions[0]);
      setFullNutrition(servingArray[0]);
    } catch (error) {
      console.error("Error fetching food detail:", error);
    }
  };    

  const handleServingSizeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const selectedSize = event.target.value as string;
    setServingSize(selectedSize);

    if (foodDetail) {
      const servings = foodDetail.food.servings.serving;
      const selectedServing = Array.isArray(servings)
        ? servings.find((serving) => serving.serving_description === selectedSize)
        : servings.serving_description === selectedSize
        ? servings
        : null;

      if (selectedServing) {
        console.log("Selected Serving:", selectedServing); 
        setFullNutrition(selectedServing);
      }
    }
  };

  const handleNumServingsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setNumServings(value);
  };

  const handleAddFood = async () => {
    if (!fullNutrition || !mealType) {
      console.error("No nutrition data or meal type selected");
      return;
    }
  
    try {
      const response = await axios.post('/api/daily_food', {
        user_id: "a71e0ca8-a4c3-40aa-b719-dddd0225f207",
        meal_type: mealType,
        name: selectedFood?.food_name || "Unknown",
        calories: fullNutrition.calories,
        carbs: fullNutrition.carbohydrate,
        fat: fullNutrition.fat,
        protein: fullNutrition.protein,
        sodium: fullNutrition.sodium,
        sugar: fullNutrition.sugar,
        date: new Date().toISOString().split("T")[0],
        quantity: `${numServings} x ${fullNutrition.serving_description}`,
      });
  
      console.log("Food added successfully:", response.data);
    } catch (error) {
      console.error("Error adding food:", error);
    }
  };

  useEffect(() => {
    if (!foodDetail || !fullNutrition) return;
  
    const servings = foodDetail.food.servings.serving;
    const selectedServing = Array.isArray(servings)
      ? servings.find((serving) => serving.serving_description === servingSize)
      : servings.serving_description === servingSize
      ? servings
      : null;
  
    if (selectedServing) {
      const multiplier = parseFloat(numServings) || 1;
  
      const updatedNutrition = {
        ...selectedServing,
        calories: selectedServing.calories * multiplier,
        carbohydrate: selectedServing.carbohydrate * multiplier,
        fat: selectedServing.fat * multiplier,
        protein: selectedServing.protein * multiplier,
        sodium: selectedServing.sodium * multiplier,
        sugar: selectedServing.sugar * multiplier,
        cholesterol: selectedServing.cholesterol * multiplier,
        saturated_fat: selectedServing.saturated_fat * multiplier,
        ...(selectedServing.fiber !== undefined && { fiber: selectedServing.fiber * multiplier }),
        ...(selectedServing.iron !== undefined && { iron: selectedServing.iron * multiplier }),
        ...(selectedServing.vitamin_a !== undefined && { vitamin_a: selectedServing.vitamin_a * multiplier }),
        ...(selectedServing.vitamin_c !== undefined && { vitamin_c: selectedServing.vitamin_c * multiplier }),
      };
  
      setFullNutrition(updatedNutrition);
    }
  }, [numServings, servingSize, foodDetail]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        padding: "20px",
      }}
    >
      <Typography variant="h4" component="h1" sx={{ marginBottom: "20px" }}>
        {mealType ? `Add Food for ${mealType.charAt(0).toUpperCase() + mealType.slice(1)}` : "Add Food"}
      </Typography>

      <TextField
        variant="outlined"
        placeholder="Search food database..."
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        sx={{
          borderRadius: "50px",
          backgroundColor: "white",
          "& .MuiOutlinedInput-root": {
            borderRadius: "50px",
            padding: "4px 12px",
          },
          "& .MuiInputBase-input": {
            padding: "10px 12px",
            height: "auto",
          },
          marginBottom: "20px",
        }}
        InputProps={{
          endAdornment: showSearchButton ? (
            <InputAdornment position="end">
              <Button
                variant="contained"
                onClick={handleSearch}
                sx={{
                  borderRadius: "50px",
                  padding: "10px",
                  minWidth: "40px",
                  minHeight: "40px",
                  backgroundColor: "#000000",
                  height: "auto",
                }}
              >
                <img
                  src={searchIcon}
                  alt="Search"
                  style={{ width: "24px", height: "24px" }}
                />
              </Button>
            </InputAdornment>
          ) : null,
        }}
      />

      {results.foods?.food && results.foods.food.length > 0 && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: "20px",
          }}
        >
          <Box
            sx={{
              width: "40%",
              padding: "10px",
              backgroundColor: "white",
              borderRadius: "30px",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
              overflowY: "auto",
              maxHeight: "400px",
            }}
          >
            {results.foods?.food?.map((result, index) => (
              <Box
                key={index}
                sx={{
                  padding: "10px",
                  borderBottom: "1px solid #ccc",
                  cursor: "pointer",
                  backgroundColor:
                    selectedFood?.food_id === result.food_id
                      ? "#b9e1fc"
                      : "transparent",
                  "&:hover": {
                    backgroundColor: "#d9f0ff",
                  },
                  borderRadius: "15px",
                }}        
                onClick={() => handleFoodClick(result)}
              >
                  <Box>
                    <Box>{result.food_name}</Box>
                    <Box sx={{ color: "gray", fontSize: "12px" }}>
                    {result.brand_name && `${result.brand_name} - `}
                    {result.food_description}
                    </Box>
                  </Box>
              </Box>
            ))}
          </Box>

          <Box
            sx={{
              width: "60%",
              padding: "10px",
              backgroundColor: "white",
              borderRadius: "30px",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
              textAlign: "left",
            }}
          >
            {selectedFood ? (
              <>
                <Box sx={{ fontWeight: "bold", fontSize: "32px" }}>
                  {selectedFood.food_name}
                </Box>

                <Box sx={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Box sx={{ fontWeight: "bold" }}>Serving Size</Box>
                    <TextField
                      select
                      variant="outlined"
                      value={servingSize}
                      onChange={handleServingSizeChange}
                      SelectProps={{
                        native: true,
                      }}
                      sx={{
                        backgroundColor: "#ffffff",
                        width: "300px",
                      }}
                    >
                      {servingSizes.map((size, index) => (
                        <option key={index} value={size}>
                          {size}
                        </option>
                      ))}
                    </TextField>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Box sx={{ fontWeight: "bold" }}>Number of Servings</Box>
                    <TextField
                      type="number"
                      variant="outlined"
                      value={numServings}
                      onChange={handleNumServingsChange}
                      inputProps={{ min: "1", style: { textAlign: "center", width: "50px" } }}
                    />
                  </Box>

                  {fullNutrition && (
                    <Box sx={{ marginTop: "20px" }}>
                      <Box sx={{ fontSize: "18px", fontWeight: "bold" }}>Nutritional Information</Box>
                      <Box sx={{ display: "flex", flexDirection: "column", gap: "5px", marginTop: "10px" }}>
                        <Box>Calories: {Math.round(fullNutrition.calories)}</Box>
                        <Box>Carbs: {Math.round(fullNutrition.carbohydrate)}g</Box>
                        <Box>Fat: {Math.round(fullNutrition.fat)}g</Box>
                        <Box>Protein: {Math.round(fullNutrition.protein)}g</Box>
                      </Box>
                    </Box>
                  )}

                  <Box sx={{ marginTop: "20px", display: "flex", justifyContent: "space-between" }}>
                    <Button
                      variant="contained"
                      onClick={() => setOpenDialog(true)}
                      className="primary-button"
                    >
                      Full Nutrition
                    </Button>

                    <Button
                      variant="contained"
                      onClick={handleAddFood}
                      className="primary-button"
                    >
                      Add Food
                    </Button>
                  </Box>
                  <PopupNutrition
                    open={openDialog}
                    onClose={() => setOpenDialog(false)}
                    nutritionData={fullNutrition}
                  />
                </Box>
              </>
            ) : (
              <Box sx={{ fontSize: "18px", color: "#888" }}>
                Select a food item to see more details.
              </Box>
            )}
          </Box>
        </Box>
      )}

      <Box sx={{mb: 4, mt: 4, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
          <Typography variant="h3" sx={{ mb: 2, fontWeight: 'bold' }}>Saved Meals</Typography>
          <NutritionTable foodData={[]} />
      </Box>
    </Box>
  );
};

export default LogFood;

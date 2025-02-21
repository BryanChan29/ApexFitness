import { Box, TextField, Button, InputAdornment, Chip } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { z } from "zod";
import searchIcon from "../assets/search.png";

const FoodItemSchema = z.object({
  food_name: z.string(),
  food_description: z.string(),
  food_url: z.string().url(),
  food_id: z.string(),
});

const SearchResultsSchema = z.object({
  foods: z.object({
    food: z.array(FoodItemSchema),
  }).optional(),
});

type SearchResults = z.infer<typeof SearchResultsSchema>;
type FoodItem = z.infer<typeof FoodItemSchema>;

const Dashboard = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults>({});
  const [showSearchButton, setShowSearchButton] = useState(false);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [servingSize, setServingSize] = useState("");
  const [numServings, setNumServings] = useState("");

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

  const handleFoodClick = (food: FoodItem) => {
    setSelectedFood(food);
    console.log("Selected Food:", food);
    setServingSize("");
    setNumServings("");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        padding: "20px",
      }}
    >
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
              }}
              onClick={() => handleFoodClick(result)}
            >
              <Box sx={{ fontWeight: "bold" }}>{result.food_name}</Box>
              <Box>{result.food_description}</Box>
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
      <Box sx={{ marginTop: "10px" }}>{selectedFood.food_description}</Box>
      <Box sx={{ marginTop: "10px" }}>
        <a href={selectedFood.food_url} target="_blank" rel="noopener noreferrer">
          More Info
        </a>
      </Box>

      <Box sx={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box sx={{ fontWeight: "bold" }}>Serving Size</Box>
          <Chip
            label={
              <TextField
                type="number"
                variant="outlined"
                value={servingSize}
                onChange={(e) => setServingSize(e.target.value)}
                inputProps={{ style: { textAlign: "center", width: "50px" } }}
              />
            }
            sx={{
              backgroundColor: "#ffffff",
            }}
          />
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box sx={{ fontWeight: "bold" }}>Number of Servings</Box>
          <Chip
            label={
              <TextField
                type="number"
                variant="outlined"
                value={numServings}
                onChange={(e) => setNumServings(e.target.value)}
                inputProps={{ style: { textAlign: "center", width: "50px" } }}
              />
            }
            sx={{
              backgroundColor: "#ffffff",
            }}
          />
        </Box>
      </Box>
    </>
  ) : (
    <Box sx={{ fontSize: "18px", color: "#888" }}>
      Select a food item to see more details.
    </Box>
  )}
</Box>
      </Box>
    </Box>
  );
};

export default Dashboard;

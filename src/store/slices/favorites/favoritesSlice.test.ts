import favoritesReducer, {
  addFavorite,
  removeFavorite,
  clearFavorites,
  updateFavoriteNote,
  addFavoriteIngredient,
  removeFavoriteIngredient,
  clearFavoriteIngredients,
} from "@/store/slices/favorites/favoritesSlice";
import type { FavoriteItem } from "@/lib/types/usda";

const food: FavoriteItem = {
  fdcId: 1,
  description: "Apple, raw",
  dataType: "SR Legacy",
  foodCategory: "Fruits and Fruit Juices",
};

const initialState = { favoritedFoods: [], favoritedIngredients: [] };

describe("favoritesSlice — food reducers", () => {
  it("addFavorite adds a food to the list", () => {
    const state = favoritesReducer(initialState, addFavorite(food));
    expect(state.favoritedFoods).toHaveLength(1);
    expect(state.favoritedFoods[0]).toEqual(food);
  });

  it("removeFavorite removes the matching food by fdcId", () => {
    const withFood = favoritesReducer(initialState, addFavorite(food));
    const state = favoritesReducer(withFood, removeFavorite(1));
    expect(state.favoritedFoods).toHaveLength(0);
  });

  it("removeFavorite leaves other foods untouched", () => {
    const other: FavoriteItem = { ...food, fdcId: 2, description: "Banana" };
    let state = favoritesReducer(initialState, addFavorite(food));
    state = favoritesReducer(state, addFavorite(other));
    state = favoritesReducer(state, removeFavorite(1));
    expect(state.favoritedFoods).toHaveLength(1);
    expect(state.favoritedFoods[0].fdcId).toBe(2);
  });

  it("clearFavorites empties the food list", () => {
    const withFood = favoritesReducer(initialState, addFavorite(food));
    const state = favoritesReducer(withFood, clearFavorites());
    expect(state.favoritedFoods).toHaveLength(0);
  });

  it("updateFavoriteNote sets the note on the matching food", () => {
    const withFood = favoritesReducer(initialState, addFavorite(food));
    const state = favoritesReducer(
      withFood,
      updateFavoriteNote({ fdcId: 1, note: "great source of fiber" }),
    );
    expect(state.favoritedFoods[0].note).toBe("great source of fiber");
  });

  it("updateFavoriteNote does nothing when fdcId is not found", () => {
    const withFood = favoritesReducer(initialState, addFavorite(food));
    const state = favoritesReducer(
      withFood,
      updateFavoriteNote({ fdcId: 999, note: "ghost note" }),
    );
    expect(state.favoritedFoods[0].note).toBeUndefined();
  });
});

describe("favoritesSlice — ingredient reducers", () => {
  it("addFavoriteIngredient adds an ingredient", () => {
    const state = favoritesReducer(
      initialState,
      addFavoriteIngredient("Vitamin C"),
    );
    expect(state.favoritedIngredients).toContain("Vitamin C");
  });

  it("removeFavoriteIngredient removes the matching ingredient", () => {
    let state = favoritesReducer(
      initialState,
      addFavoriteIngredient("Vitamin C"),
    );
    state = favoritesReducer(state, removeFavoriteIngredient("Vitamin C"));
    expect(state.favoritedIngredients).toHaveLength(0);
  });

  it("clearFavoriteIngredients empties the ingredient list", () => {
    let state = favoritesReducer(
      initialState,
      addFavoriteIngredient("Vitamin C"),
    );
    state = favoritesReducer(state, clearFavoriteIngredients());
    expect(state.favoritedIngredients).toHaveLength(0);
  });
});

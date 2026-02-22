import { screen, fireEvent } from "@testing-library/react";
import NoteInput from "@/components/NoteInput/NoteInput";
import { renderWithStore } from "@/test-utils/renderWithStore";
import type { FavoriteItem } from "@/lib/types/usda";

const food: FavoriteItem = {
  fdcId: 12345,
  description: "Chicken Breast",
  dataType: "SR Legacy",
  foodCategory: "Poultry Products",
};

describe("NoteInput", () => {
  it("hides Save button when note is unchanged", () => {
    renderWithStore(<NoteInput fdcId={12345} />, {
      preloadedState: {
        favorites: {
          favoritedFoods: [{ ...food, note: "high protein" }],
          favoritedIngredients: [],
        },
      },
    });
    // inputValue initializes to savedNote — no change, no button
    expect(
      screen.queryByRole("button", { name: /save/i }),
    ).not.toBeInTheDocument();
  });

  it("shows Save button when input differs from saved note", () => {
    renderWithStore(<NoteInput fdcId={12345} />, {
      preloadedState: {
        favorites: {
          favoritedFoods: [food],
          favoritedIngredients: [],
        },
      },
    });
    fireEvent.change(screen.getByPlaceholderText(/add a note/i), {
      target: { value: "good protein source" },
    });
    expect(
      screen.getByRole("button", { name: /save/i }),
    ).toBeInTheDocument();
  });

  it("dispatches updateFavoriteNote with trimmed value on Save", () => {
    const { store } = renderWithStore(<NoteInput fdcId={12345} />, {
      preloadedState: {
        favorites: {
          favoritedFoods: [food],
          favoritedIngredients: [],
        },
      },
    });
    fireEvent.change(screen.getByPlaceholderText(/add a note/i), {
      target: { value: "  lean meat  " },
    });
    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    expect(store.getState().favorites.favoritedFoods[0].note).toBe("lean meat");
  });

  it("hides Save button after saving", () => {
    renderWithStore(<NoteInput fdcId={12345} />, {
      preloadedState: {
        favorites: {
          favoritedFoods: [food],
          favoritedIngredients: [],
        },
      },
    });
    fireEvent.change(screen.getByPlaceholderText(/add a note/i), {
      target: { value: "lean meat" },
    });
    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    // After save, inputValue === savedNote → button disappears
    expect(
      screen.queryByRole("button", { name: /save/i }),
    ).not.toBeInTheDocument();
  });
});

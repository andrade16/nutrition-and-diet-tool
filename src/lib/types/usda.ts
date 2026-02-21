export interface FoodNutrient {
  nutrientId: number;
  nutrientName: string;
  unitName: string;
  value: number;
}

export interface FoodDetailNutrient {
  id: number;
  nutrient: {
    id: number;
    name: string;
    unitName: string;
  };
  amount: number;
}

export interface FoodDetail {
  fdcId: number;
  description: string;
  dataType: string;
  brandOwner?: string;
  brandName?: string;
  servingSize?: number;
  servingSizeUnit?: string;
  householdServingFullText?: string;
  foodCategory?: string;
  foodNutrients: FoodDetailNutrient[];
  ingredients?: string;
}

export interface FoodItem {
  fdcId: number;
  description: string;
  brandOwner?: string;
  foodCategory?: string;
  servingSize?: number;
  servingSizeUnit?: string;
  householdServingFullText?: string;
  foodNutrients?: (FoodNutrient | FoodDetailNutrient)[];
  dataType: string;
  publishedDate?: string;
  brandName?: string;
}

export interface SearchResponse {
  foods: FoodItem[];
  totalHits: number;
  currentPage: number;
  totalPages: number;
}

export interface FavoriteItem {
  fdcId: number;
  description: string;
  brandName?: string;
  brandOwner?: string;
  foodCategory?: string;
  servingSize?: number;
  servingSizeUnit?: string;
  dataType: string;
}

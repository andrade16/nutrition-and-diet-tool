export interface FoodNutrient {
  nutrientId: number;
  nutrientName: string;
  unitName: string;
  value: number;
}

export interface FoodItem {
  fdcId: number;
  description: string;
  brandOwner?: string;
  foodCategory?: string;
  servingSize?: number;
  servingSizeUnit?: string;
  householdServingFullText?: string;
  foodNutrients: FoodNutrient[];
  dataType: string;
  publishedDate: string;
}

export interface SearchResponse {
  foods: FoodItem[];
  totalHits: number;
  currentPage: number;
  totalPages: number;
}

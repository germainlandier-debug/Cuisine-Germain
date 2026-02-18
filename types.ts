
export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  servings: number;
  ingredients: Ingredient[];
  steps: string[];
  imageUrl?: string;
  prepTime?: string;
  category?: string;
}

export interface PantryItem {
  id: string;
  name: string;
  amount: number;
  unit: string;
  category: string;
}

export interface ShoppingItem extends Ingredient {
  id: string;
  checked: boolean;
  isMissing?: boolean;
}

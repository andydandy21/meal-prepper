export interface Ingredient {
  pk: "#IngredientList#";
  sk: string;
  name: string;
  portions?: {
    gramWeight: number;
    name: string;
    abbreviation: string;
  }[];
  iron: number;
  calcium: number;
  protein: number;
  potassium: number;
  sodium: number;
  cholesterol: number;
  transFat: number;
  saturatedFat: number;
  totalFat: number;
  fiber: number;
  sugar: number;
  vitaminD: number;
  carbohydrate: number;
}

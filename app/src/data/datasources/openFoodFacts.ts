import axios from "axios";

const BASE_URL = "https://world.openfoodfacts.org/api/v2";

export interface NutrientLevels {
  fat?: string;
  salt?: string;
  "saturated-fat"?: string;
  sugars?: string;
}

export interface Nutriments {
  energy_100g?: number;
  "energy-kcal_100g"?: number;
  fat_100g?: number;
  "saturated-fat_100g"?: number;
  carbohydrates_100g?: number;
  sugars_100g?: number;
  fiber_100g?: number;
  proteins_100g?: number;
  salt_100g?: number;
  sodium_100g?: number;
}

export interface Product {
  product_name?: string;
  brands?: string;
  image_url?: string;
  image_small_url?: string;
  nutriments?: Nutriments;
  nutriscore_grade?: string;
  nutrition_grades?: string;
  quantity?: string;
  categories?: string;
  ingredients_text?: string;
  nutrient_levels?: NutrientLevels;
  nova_group?: number;
  ecoscore_grade?: string;
}

export interface FoodFactsResponse {
  status: number;
  status_verbose: string;
  code: string;
  product?: Product;
}

/**
 * Busca un producto por su código de barras en la API de Open Food Facts
 * @param barcode Código de barras del producto
 * @returns Datos del producto o null si no se encuentra
 */
export const getProductByBarcode = async (
  barcode: string
): Promise<Product | null> => {
  try {
    const response = await axios.get<FoodFactsResponse>(
      `${BASE_URL}/product/${barcode}.json`
    );

    if (response.data.status === 1 && response.data.product) {
      return response.data.product;
    }

    return null;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw new Error("No se pudo obtener la información del producto");
  }
};

/**
 * Formatea las calorías para mostrar
 */
export const getCalories = (nutriments?: Nutriments): number => {
  return nutriments?.["energy-kcal_100g"] || nutriments?.energy_100g || 0;
};

/**
 * Obtiene el nivel nutricional en español
 */
export const getNutrientLevelText = (level?: string): string => {
  switch (level) {
    case "low":
      return "Bajo";
    case "moderate":
      return "Moderado";
    case "high":
      return "Alto";
    default:
      return "N/A";
  }
};

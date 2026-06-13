import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '../../data/datasources/openFoodFacts';

const LIBRARY_KEY = '@foodscan_library';

export interface SavedProduct extends Product {
  savedAt: string;
  barcode: string;
}

export async function saveProductToLibrary(product: Product, barcode: string): Promise<void> {
  try {
    const library = await getLibrary();
    
    // Verificar si el producto ya existe
    const exists = library.some(p => p.barcode === barcode);
    if (exists) {
      return; // Ya está guardado
    }

    const savedProduct: SavedProduct = {
      ...product,
      barcode,
      savedAt: new Date().toISOString(),
    };

    library.unshift(savedProduct); // Agregar al principio
    await AsyncStorage.setItem(LIBRARY_KEY, JSON.stringify(library));
  } catch (error) {
    console.error('Error saving product:', error);
    throw error;
  }
}

export async function getLibrary(): Promise<SavedProduct[]> {
  try {
    const data = await AsyncStorage.getItem(LIBRARY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading library:', error);
    return [];
  }
}

export async function removeFromLibrary(barcode: string): Promise<void> {
  try {
    const library = await getLibrary();
    const filtered = library.filter(p => p.barcode !== barcode);
    await AsyncStorage.setItem(LIBRARY_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error removing product:', error);
    throw error;
  }
}

export async function isProductInLibrary(barcode: string): Promise<boolean> {
  try {
    const library = await getLibrary();
    return library.some(p => p.barcode === barcode);
  } catch (error) {
    console.error('Error checking library:', error);
    return false;
  }
}

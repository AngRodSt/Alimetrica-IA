import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  Product,
  getCalories,
  getNutrientLevelText,
} from "../../data/datasources/openFoodFacts";
import { saveProductToLibrary, isProductInLibrary } from "../../services/storage/storage";

interface ProductDetailsProps {
  product: Product | null;
  loading: boolean;
  error: string | null;
  onScanAgain: () => void;
  onClose: () => void;
  onGoToLibrary?: () => void;
  barcode?: string;
}

export default function ProductDetails({
  product,
  loading,
  error,
  onScanAgain,
  onClose,
  onGoToLibrary,
  barcode,
}: ProductDetailsProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (barcode) {
      checkIfSaved();
    }
  }, [barcode]);

  const checkIfSaved = async () => {
    if (barcode) {
      const saved = await isProductInLibrary(barcode);
      setIsSaved(saved);
    }
  };

  const handleSaveToLibrary = async () => {
    if (!product || !barcode) return;

    setSaving(true);
    try {
      await saveProductToLibrary(product, barcode);
      setIsSaved(true);
      Alert.alert("✅ Guardado", "Producto agregado a tu biblioteca");
    } catch (error) {
      Alert.alert("Error", "No se pudo guardar el producto");
    } finally {
      setSaving(false);
    }
  };
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#F4B942" />
        <Text style={styles.loadingText}>Buscando producto...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="close-circle" size={64} color="#EF5350" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.scanAgainButton} onPress={onScanAgain}>
          <Text style={styles.scanAgainButtonText}>Escanear de nuevo</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!product) {
    return null;
  }

  const calories = getCalories(product.nutriments);
  const nutriments = product.nutriments || {};

  return (
    <ScrollView style={styles.container}>
      {/* Botón de cerrar */}
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Ionicons name="close" size={28} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Header con imagen y título */}
      <View style={styles.imageContainer}>
        {product.image_url && (
          <Image
            source={{ uri: product.image_url }}
            style={styles.productImage}
            resizeMode="cover"
          />
        )}
        <View style={styles.overlay}>
          <Text style={styles.productName}>
            {product.product_name || "Producto sin nombre"}
          </Text>
          {product.brands && (
            <Text style={styles.brandText}>{product.brands}</Text>
          )}
          {calories > 0 && (
            <View style={styles.caloriesBadge}>
              <Text style={styles.caloriesText}>
                {calories.toFixed(0)} kcal
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.content}>
        {/* Macronutrientes en tarjetas circulares */}
        <View style={styles.macrosContainer}>
          {nutriments.fiber_100g !== undefined && (
            <MacroCard
              label="Fibra"
              value={nutriments.fiber_100g.toFixed(1)}
              percentage={calculatePercentage(nutriments.fiber_100g, 30)}
            />
          )}
          {nutriments.carbohydrates_100g !== undefined && (
            <MacroCard
              label="Carbohidratos"
              value={nutriments.carbohydrates_100g.toFixed(1)}
              percentage={calculatePercentage(
                nutriments.carbohydrates_100g,
                100
              )}
            />
          )}
          {nutriments.proteins_100g !== undefined && (
            <MacroCard
              label="Proteínas"
              value={nutriments.proteins_100g.toFixed(1)}
              percentage={calculatePercentage(nutriments.proteins_100g, 50)}
            />
          )}
        </View>

        {/* Ingredientes */}
        {product.ingredients_text && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ingredientes</Text>
            {parseIngredients(product.ingredients_text).map(
              (ingredient, index) => (
                <View key={index} style={styles.ingredientItem}>
                  <Text style={styles.ingredientName}>{ingredient.name}</Text>
                  {ingredient.quantity && (
                    <Text style={styles.ingredientQuantity}>
                      {ingredient.quantity}
                    </Text>
                  )}
                </View>
              )
            )}
          </View>
        )}

        {/* Información nutricional detallada */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Información Nutricional (por 100g)
          </Text>

          {nutriments.fat_100g !== undefined && (
            <NutrientRow label="Grasas totales" value={nutriments.fat_100g} />
          )}
          {nutriments["saturated-fat_100g"] !== undefined && (
            <NutrientRow
              label="Grasas saturadas"
              value={nutriments["saturated-fat_100g"]}
              level={product.nutrient_levels?.["saturated-fat"]}
            />
          )}
          {nutriments.sugars_100g !== undefined && (
            <NutrientRow
              label="Azúcares"
              value={nutriments.sugars_100g}
              level={product.nutrient_levels?.sugars}
            />
          )}
          {nutriments.salt_100g !== undefined && (
            <NutrientRow
              label="Sal"
              value={nutriments.salt_100g}
              level={product.nutrient_levels?.salt}
            />
          )}
        </View>

        {/* Botones de acción */}
        {barcode && !isSaved && (
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveToLibrary}
            disabled={saving}
          >
            <Ionicons
              name="bookmark-outline"
              size={20}
              color="#000"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.saveButtonText}>
              {saving ? "Guardando..." : "Agregar a Biblioteca"}
            </Text>
          </TouchableOpacity>
        )}

        {isSaved && onGoToLibrary && (
          <TouchableOpacity
            style={styles.goToLibraryButton}
            onPress={onGoToLibrary}
          >
            <Ionicons
              name="bookmark"
              size={20}
              color="#000"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.goToLibraryText}>Ver en Biblioteca</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.scanAgainButton} onPress={onScanAgain}>
          <Text style={styles.scanAgainButtonText}>Escanear otro producto</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// Función auxiliar para calcular porcentajes
function calculatePercentage(value: number, reference: number): number {
  return Math.min((value / reference) * 100, 100);
}

// Función para parsear ingredientes
function parseIngredients(
  text: string
): Array<{ name: string; quantity?: string }> {
  const ingredients = text
    .split(/[,;]/)
    .map((ing) => ing.trim())
    .filter((ing) => ing.length > 0);
  return ingredients.slice(0, 10).map((ing) => {
    const match = ing.match(/^(.*?)(\d+\.?\d*\s*%?.*)?$/);
    return {
      name: match?.[1]?.trim() || ing,
      quantity: match?.[2]?.trim(),
    };
  });
}

// Componente para tarjetas de macronutrientes
interface MacroCardProps {
  label: string;
  value: string;
  percentage: number;
}

function MacroCard({ label, value, percentage }: MacroCardProps) {
  return (
    <View style={styles.macroCard}>
      <View style={styles.circleProgress}>
        <View
          style={[
            styles.circleProgressFill,
            {
              borderColor: "#F4B942",
              borderTopWidth: 4,
              borderRightWidth: percentage > 25 ? 4 : 0,
              borderBottomWidth: percentage > 50 ? 4 : 0,
              borderLeftWidth: percentage > 75 ? 4 : 0,
            },
          ]}
        />
        <View style={styles.circleInner}>
          <Text style={styles.macroValue}>{value}g</Text>
        </View>
      </View>
      <Text style={styles.macroLabel}>{label}</Text>
    </View>
  );
}

interface NutrientRowProps {
  label: string;
  value: number;
  level?: string;
}

function NutrientRow({ label, value, level }: NutrientRowProps) {
  return (
    <View style={styles.nutrientRow}>
      <Text style={styles.nutrientLabel}>{label}</Text>
      <View style={styles.nutrientRight}>
        <Text style={styles.nutrientValue}>{value.toFixed(1)}g</Text>
        {level && (
          <View
            style={[styles.levelDot, { backgroundColor: getLevelColor(level) }]}
          />
        )}
      </View>
    </View>
  );
}

function getNutriscoreColor(grade: string): string {
  const colors: { [key: string]: string } = {
    a: "#038141",
    b: "#85BB2F",
    c: "#FECB02",
    d: "#EE8100",
    e: "#E63E11",
  };
  return colors[grade.toLowerCase()] || "#ccc";
}
function getLevelColor(level: string): string {
  const colors: { [key: string]: string } = {
    low: "#4CAF50",
    moderate: "#FF9800",
    high: "#f44336",
  };
  return colors[level] || "#000000"; // Color por defecto si el nivel no existe
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  closeButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    padding: 20,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  imageContainer: {
    width: "100%",
    height: 320,
    position: "relative",
    backgroundColor: "#2C2C2E",
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: 20,
  },
  productName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 5,
  },
  brandText: {
    fontSize: 14,
    color: "#E0E0E0",
    marginBottom: 10,
  },
  caloriesBadge: {
    backgroundColor: "#F4B942",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    alignSelf: "flex-start",
  },
  caloriesText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
  content: {
    padding: 20,
  },
  macrosContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 25,
  },
  macroCard: {
    alignItems: "center",
  },
  circleProgress: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#F4B942",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    marginBottom: 10,
  },
  circleProgressFill: {
    position: "absolute",
    width: 90,
    height: 90,
    borderRadius: 45,
    borderColor: "transparent",
  },
  circleInner: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  macroValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  macroLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 15,
  },
  ingredientItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  ingredientName: {
    fontSize: 14,
    color: "#333",
    flex: 1,
    textTransform: "capitalize",
  },
  ingredientQuantity: {
    fontSize: 14,
    color: "#999",
    fontWeight: "500",
  },
  nutrientRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  nutrientLabel: {
    fontSize: 14,
    color: "#666",
    flex: 1,
  },
  nutrientRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  nutrientValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000",
  },
  levelDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  saveButton: {
    backgroundColor: "#F4B942",
    paddingVertical: 16,
    borderRadius: 25,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  saveButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
  goToLibraryButton: {
    backgroundColor: "#F4B942",
    paddingVertical: 16,
    borderRadius: 25,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  goToLibraryText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
  scanAgainButton: {
    backgroundColor: "#F4B942",
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
  },
  scanAgainButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
});

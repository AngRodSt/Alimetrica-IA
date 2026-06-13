import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState } from "react";
import {
  getLibrary,
  SavedProduct,
  removeFromLibrary,
} from "../../services/storage/storage";
import { getCalories } from "../../data/datasources/openFoodFacts";
import { Ionicons } from "@expo/vector-icons";

interface LibraryScreenProps {
  onProductSelect: (product: SavedProduct) => void;
  onRefresh?: number; // Para forzar actualización
}

export default function LibraryScreen({
  onProductSelect,
  onRefresh,
}: LibraryScreenProps) {
  const [library, setLibrary] = useState<SavedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const loadLibrary = async () => {
    try {
      const data = await getLibrary();
      setLibrary(data);
    } catch (error) {
      console.error("Error loading library:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLibrary();
  }, [onRefresh]);

  const handleDelete = async (barcode: string) => {
    try {
      await removeFromLibrary(barcode);
      loadLibrary();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  if (library.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Image
          source={require("../../../../assets/Imagen-inicio.png")}
          style={styles.emptyImage}
          resizeMode="contain"
        />
        <Text style={styles.emptyTitle}>Tu biblioteca está vacía</Text>
        <Text style={styles.emptyMessage}>
          Inicia a escanear productos y agrégalos a tu galería
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={library}
        keyExtractor={(item) => item.barcode}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.productCard}
            onPress={() => onProductSelect(item)}
          >
            <View style={styles.imageContainer}>
              {item.image_url ? (
                <Image
                  source={{ uri: item.image_url }}
                  style={styles.productImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.noImage}>
                  <Text style={styles.noImageText}>Sin imagen</Text>
                </View>
              )}
            </View>

            <View style={styles.productInfo}>
              <Text style={styles.productName} numberOfLines={2}>
                {item.product_name || "Producto sin nombre"}
              </Text>
              {item.brands && (
                <Text style={styles.brandText} numberOfLines={1}>
                  {item.brands}
                </Text>
              )}
              <View style={styles.caloriesRow}>
                <Text style={styles.caloriesText}>
                  {getCalories(item.nutriments).toFixed(0)} kcal
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDelete(item.barcode)}
            >
              <Ionicons name="trash-outline" size={24} color="#EF5350" />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    backgroundColor: "#FAFAFA",
  },
  emptyImage: {
    width: 200,
    height: 200,
    marginBottom: 30,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  emptyMessage: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 50,
  },
  listContent: {
    padding: 15,
  },
  productCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    marginBottom: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    width: 100,
    height: 100,
    backgroundColor: "#F5F5F5",
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  noImage: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E0E0E0",
  },
  noImageText: {
    fontSize: 12,
    color: "#999",
  },
  productInfo: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  brandText: {
    fontSize: 13,
    color: "#666",
    marginBottom: 6,
  },
  caloriesRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  caloriesText: {
    fontSize: 12,
    color: "#F4B942",
    fontWeight: "600",
  },
  deleteButton: {
    width: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});

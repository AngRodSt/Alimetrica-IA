import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SplashScreen from "./app/src/presentation/screens/SplashScreen";
import WelcomeScreen from "./app/src/presentation/screens/WelcomeScreen";
import BarcodeScanner from "./app/src/presentation/components/BarcodeScanner";
import ProductDetails from "./app/src/presentation/screens/ProductDetails";
import LibraryScreen from "./app/src/presentation/screens/LibraryScreen";
import BottomNavigation from "./app/src/presentation/navigation/BottomNavigation";
import { getProductByBarcode, Product } from "./app/src/data/datasources/openFoodFacts";
import { SavedProduct } from "./app/src/services/storage/storage";

type Screen = "splash" | "welcome" | "home" | "library" | "scanner" | "details";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("splash");
  const [activeTab, setActiveTab] = useState<"home" | "library">("home");
  const [product, setProduct] = useState<Product | null>(null);
  const [scannedBarcode, setScannedBarcode] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [libraryRefresh, setLibraryRefresh] = useState(0);

  const handleSplashFinish = () => {
    setCurrentScreen("welcome");
  };

  const handleGetStarted = () => {
    setCurrentScreen("home");
    setActiveTab("home");
  };

  const handleTabChange = (tab: "home" | "library") => {
    setActiveTab(tab);
    setCurrentScreen(tab);
  };

  const handleStartScan = () => {
    setCurrentScreen("scanner");
    setError(null);
  };

  const handleBarcodeScanned = async (barcode: string) => {
    setScannedBarcode(barcode);
    setCurrentScreen("details");
    setLoading(true);
    setError(null);

    try {
      const productData = await getProductByBarcode(barcode);

      if (productData) {
        setProduct(productData);
      } else {
        setError("Producto no encontrado en la base de datos");
      }
    } catch (err) {
      setError("Error al buscar el producto. Verifica tu conexión a internet.");
    } finally {
      setLoading(false);
    }
  };

  const handleScanAgain = () => {
    setProduct(null);
    setError(null);
    setScannedBarcode("");
    setLibraryRefresh((prev) => prev + 1); // Actualizar biblioteca
    setCurrentScreen("home");
    setActiveTab("home");
  };

  const handleCancelScan = () => {
    setCurrentScreen("home");
    setActiveTab("home");
  };

  const handleProductSelect = (selectedProduct: SavedProduct) => {
    setProduct(selectedProduct);
    setScannedBarcode(selectedProduct.barcode);
    setCurrentScreen("details");
  };

  const handleCloseDetails = () => {
    setProduct(null);
    setError(null);
    setScannedBarcode("");
    setLibraryRefresh((prev) => prev + 1);
    // Volver a la pantalla anterior (home o library)
    setCurrentScreen(activeTab);
  };

  const handleGoToLibrary = () => {
    setLibraryRefresh((prev) => prev + 1);
    setActiveTab("library");
    setCurrentScreen("library");
  };

  if (currentScreen === "splash") {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  if (currentScreen === "welcome") {
    return <WelcomeScreen onGetStarted={handleGetStarted} />;
  }

  if (currentScreen === "scanner") {
    return (
      <BarcodeScanner
        onBarcodeScanned={handleBarcodeScanned}
        onCancel={handleCancelScan}
      />
    );
  }

  if (currentScreen === "details") {
    return (
      <ProductDetails
        product={product}
        loading={loading}
        error={error}
        onScanAgain={handleScanAgain}
        onClose={handleCloseDetails}
        onGoToLibrary={handleGoToLibrary}
        barcode={scannedBarcode}
      />
    );
  }

  if (currentScreen === "library") {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.header}>
          <Text style={styles.title}>Mi Biblioteca</Text>
        </View>
        <LibraryScreen
          onProductSelect={handleProductSelect}
          onRefresh={libraryRefresh}
        />
        <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Text style={styles.title}>FoodScan</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.scanArea}>
          <View style={styles.scanFrame}>
            <View style={styles.cornerTopLeft} />
            <View style={styles.cornerTopRight} />
            <View style={styles.cornerBottomLeft} />
            <View style={styles.cornerBottomRight} />

            <Image
              source={require("./assets/food-home.png")}
              style={styles.foodImage}
              resizeMode="contain"
            />
          </View>
        </View>

        <Text style={styles.instruction}>
          Toca el botón para identificar tu alimento
        </Text>

        <TouchableOpacity style={styles.scanButton} onPress={handleStartScan}>
          <View style={styles.scanButtonContent}>
            <Ionicons name="camera" size={32} color="#000" />
          </View>
        </TouchableOpacity>

        <Text style={styles.footerText}>Powered by Open Food Facts</Text>
      </View>

      <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    backgroundColor: "#ffe293",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#0c0c0c",
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  scanArea: {
    width: "100%",
    aspectRatio: 1,
    maxWidth: 350,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  scanFrame: {
    width: "90%",
    height: "90%",
    backgroundColor: "#F4B942",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    padding: 20,
  },
  cornerTopLeft: {
    position: "absolute",
    top: 30,
    left: 30,
    width: 50,
    height: 50,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: "#FFFFFF",
    borderTopLeftRadius: 15,
  },
  cornerTopRight: {
    position: "absolute",
    top: 30,
    right: 30,
    width: 50,
    height: 50,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: "#FFFFFF",
    borderTopRightRadius: 15,
  },
  cornerBottomLeft: {
    position: "absolute",
    bottom: 30,
    left: 30,
    width: 50,
    height: 50,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: "#FFFFFF",
    borderBottomLeftRadius: 15,
  },
  cornerBottomRight: {
    position: "absolute",
    bottom: 30,
    right: 30,
    width: 50,
    height: 50,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: "#FFFFFF",
    borderBottomRightRadius: 15,
  },
  foodImage: {
    width: 180,
    height: 180,
  },
  instruction: {
    fontSize: 15,
    color: "#333",
    textAlign: "center",
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  scanButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#F4B942",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#F4B942",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  scanButtonContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  scanIcon: {
    fontSize: 32,
  },

  footerText: {
    fontSize: 11,
    color: "#999",
    textAlign: "center",
    marginTop: 4,
  },
});

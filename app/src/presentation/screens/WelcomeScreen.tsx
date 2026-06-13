import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useState } from "react";

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export default function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  const [currentPage, setCurrentPage] = useState(0);

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require("../../../../assets/Imagen-inicio.png")}
          style={styles.foodImage}
          resizeMode="contain"
        />
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>Bienvenido a</Text>
        <Text style={styles.appName}>FoodScan</Text>

        <Text style={styles.description}>
          Escanea códigos de barras de productos alimenticios para ver su
          información nutricional completa. Datos proporcionados por Open Food
          Facts.
        </Text>

        <TouchableOpacity style={styles.button} onPress={onGetStarted}>
          <Text style={styles.buttonText}>Comenzar</Text>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5E6B3",
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 80,
  },
  foodImage: {
    width: 320,
    height: 320,
  },
  contentContainer: {
    backgroundColor: "#F5E6B3",
    paddingHorizontal: 30,
    paddingBottom: 50,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    color: "#333",
    textAlign: "center",
    fontWeight: "400",
  },
  appName: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  description: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 60,
    paddingHorizontal: 10,
  },
  pageIndicator: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D4A574",
  },
  activeDot: {
    width: 24,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#8B6F47",
  },
  button: {
    backgroundColor: "#F4C542",
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginRight: 10,
  },
  arrow: {
    fontSize: 20,
    color: "#333",
    fontWeight: "bold",
  },
});

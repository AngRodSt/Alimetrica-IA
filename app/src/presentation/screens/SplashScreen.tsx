import { View, Text, StyleSheet, Image } from "react-native";
import { useEffect } from "react";

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.barcodeIcon}>
            <View style={styles.barcodeLine} />
            <View style={[styles.barcodeLine, { height: 50 }]} />
            <View style={styles.barcodeLine} />
            <View style={[styles.barcodeLine, { height: 55 }]} />
            <View style={[styles.barcodeLine, { height: 45 }]} />
            <View style={styles.barcodeLine} />
            <View style={[styles.barcodeLine, { height: 50 }]} />
          </View>
        </View>

        <Text style={styles.appName}>FoodScan</Text>
        <Text style={styles.tagline}>Conoce lo que Comes</Text>
      </View>

      <View style={styles.bottomImageContainer}>
        <Image
          source={require("../../../../assets/Imagen-inicio.png")}
          style={styles.foodImage}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  logoContainer: {
    marginBottom: 20,
  },
  barcodeIcon: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 4,
    padding: 15,
    borderWidth: 3,
    borderColor: "#FFD700",
    borderRadius: 10,
  },
  barcodeLine: {
    width: 4,
    height: 60,
    backgroundColor: "#000",
  },
  appName: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#FFD700",
    marginTop: 30,
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
    letterSpacing: 0.5,
  },
  bottomImageContainer: {
    height: 300,
    alignItems: "center",
    justifyContent: "center",
  },
  foodImage: {
    width: 250,
    height: 250,
  },
});

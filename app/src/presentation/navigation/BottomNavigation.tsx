import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface BottomNavigationProps {
  activeTab: "home" | "library";
  onTabChange: (tab: "home" | "library") => void;
}

export default function BottomNavigation({
  activeTab,
  onTabChange,
}: BottomNavigationProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.tab, activeTab === "home" && styles.activeTab]}
        onPress={() => onTabChange("home")}
      >
        <Ionicons
          name={activeTab === "home" ? "home" : "home-outline"}
          size={24}
          color={activeTab === "home" ? "#F4B942" : "#999"}
        />
        <Text
          style={[styles.label, activeTab === "home" && styles.activeLabel]}
        >
          Inicio
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, activeTab === "library" && styles.activeTab]}
        onPress={() => onTabChange("library")}
      >
        <Ionicons
          name={activeTab === "library" ? "bookmarks" : "bookmarks-outline"}
          size={24}
          color={activeTab === "library" ? "#F4B942" : "#999"}
        />
        <Text
          style={[styles.label, activeTab === "library" && styles.activeLabel]}
        >
          Biblioteca
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    paddingBottom: 10,
    paddingTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 10,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  activeTab: {
    backgroundColor: "transparent",
  },
  label: {
    fontSize: 12,
    color: "#999",
    fontWeight: "500",
  },
  activeLabel: {
    color: "#F4B942",
    fontWeight: "600",
  },
});

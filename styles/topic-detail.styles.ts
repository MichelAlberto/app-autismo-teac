import { Dimensions, StyleSheet } from "react-native";

const { height: screenHeight } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
    flex: 1,
    textAlign: "center",
    paddingHorizontal: 10,
  },
  slidesContainer: {
    flex: 1,
    marginBottom: 20,
    justifyContent: "center", // Centralizar verticalmente
  },
  slidesList: {
    paddingHorizontal: 8,
  },
  slide: {
    width: 320,
    height: screenHeight * 0.7, // Ajustar altura baseada na tela
    borderRadius: 24,
    padding: 32,
    marginHorizontal: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center", // Centralizar horizontalmente
  },
  slideIconContainer: {
    marginBottom: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  slideTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 20,
    textAlign: "center",
  },
  slideContent: {
    fontSize: 18,
    color: "#ffffff",
    lineHeight: 28,
    textAlign: "center",
    opacity: 0.95,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "#ffffff",
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  continuBtn: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 20,
  },
  continuBtnText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#667eea",
    marginRight: 8,
  },
});

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
    marginHorizontal: 8,
    alignSelf: "center", // Centralizar horizontalmente
  },
  card: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  cardFace: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
    padding: 32,
    justifyContent: "center",
    alignItems: "center",
    position: 'absolute',
    backfaceVisibility: 'hidden',
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  cardBack: {
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
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
    opacity: 1,
  },
  instructionContainer: {
    position: 'absolute',
    bottom: 25,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  instructionText: {
    color: '#ffffff',
    fontSize: 13,
    marginLeft: 0,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  backLabel: {
    position: 'absolute',
    top: 20,
    right: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  backLabelText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
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

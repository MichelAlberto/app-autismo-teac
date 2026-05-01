import { Dimensions, StyleSheet } from "react-native";

// Dimensões removidas para uso de useWindowDimensions no componente
export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    height: 60,
  },
  backBtn: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#ffffff",
    textAlign: "center",
    marginTop: 20,
    paddingHorizontal: 30,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 2,
  },
  topProgressBarContainer: {
    flexDirection: "row",
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 3,
    marginHorizontal: 50,
    marginTop: 15,
    overflow: "hidden",
  },
  topProgressBarActive: {
    height: "100%",
    borderRadius: 3,
  },

  slidesContainer: {
    flex: 1,
    marginTop: 20,
  },
  slideWrapper: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "transparent",
    zIndex: 1,
    transform: [{ perspective: 1000 }], // Adicionado para efeito 3D na Web
  },
  cardFace: {
    width: '100%',
    height: '100%',
    backgroundColor: "#ffffff",
    borderRadius: 40,
    padding: 25,
    alignItems: "center",
    position: 'absolute',
    backfaceVisibility: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 20,
    // Garantir que a face frontal esteja visível inicialmente
    zIndex: 2,
  },
  cardBack: {
    backgroundColor: "#ffffff",
    transform: [{ rotateY: '180deg' }],
    zIndex: 1,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#F0F4FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0D1B3E",
    textAlign: "center",
    marginBottom: 15,
  },

  contentScrollView: {
    flex: 1,
    width: '100%',
  },
  contentScrollContainer: {
    paddingBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  cardContent: {
    fontSize: 17,
    color: "#4A5568",
    lineHeight: 26,
    textAlign: "center",
    fontWeight: "500",
  },

  cardFooter: {
    width: '100%',
    alignItems: "center",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F7FAFC',
    marginTop: 10,
  },
  gestureIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  gestureText: {
    fontSize: 11,
    color: "#718096",
    marginTop: 4,
    fontWeight: "600",
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  controlsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  controlButtonWrapper: {
    alignItems: "center",
  },
  navButton: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 8,
  },
  slideCounterBadge: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  slideCounterText: {
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "bold",
  },
  controlLabel: {
    fontSize: 12,
    color: "#ffffff",
    fontWeight: "600",
  },

  footerProgressContainer: {
    paddingHorizontal: 25,
    paddingBottom: 30,
  },
  footerProgressBarBg: {
    height: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 6,
    width: "100%",
    marginBottom: 10,
    overflow: "hidden",
  },
  footerProgressBarFill: {
    height: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 6,
  },
  footerLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerLabelText: {
    fontSize: 13,
    color: "#ffffff",
    fontWeight: "600",
    opacity: 0.9,
  },
});

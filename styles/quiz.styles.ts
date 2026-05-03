import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 12,
  },
  headerIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitleContainer: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F2937",
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#6B7280",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  progressBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    marginRight: 10,
  },
  progressBarFill: {
    height: 8,
    backgroundColor: "#6B46C1",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: "#6B46C1",
    fontWeight: "600",
  },
  questionCard: {
    backgroundColor: "#F3E8FF",
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  questionText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 20,
  },
  questionIcon: {
    marginTop: 10,
  },
  optionsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100, // Espaço para o botão flutuante
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  optionCardSelected: {
    borderColor: "#6B46C1",
    backgroundColor: "#FAF5FF",
  },
  optionLetterContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  optionLetterContainerSelected: {
    backgroundColor: "#6B46C1",
  },
  optionLetter: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4B5563",
  },
  optionLetterSelected: {
    color: "#FFFFFF",
  },
  optionText: {
    flex: 1,
    fontSize: 15,
    color: "#1F2937",
  },
  feedbackCard: {
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
    marginBottom: 20,
  },
  feedbackHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  feedbackText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: "#FAFAFA",
  },
  nextButton: {
    backgroundColor: "#6B46C1",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
  },
  nextButtonDisabled: {
    backgroundColor: "#A78BFA",
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },
  
  // Estilos da tela de Resultado
  resultContainer: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    paddingHorizontal: 20,
  },
  resultHeader: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 30,
  },
  resultScoreBadge: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#6B46C1",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  resultScoreText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
  },
  resultSubtitle: {
    fontSize: 16,
    color: "#4B5563",
    textAlign: "center",
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 16,
    marginTop: 10,
  },
  historyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  historyQuestionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  historyIconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  historyQuestionText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
  },
  historyAnswerText: {
    fontSize: 13,
    color: "#4B5563",
    marginLeft: 32,
  },
  historyAnswerCorrect: {
    color: "#059669",
    fontWeight: "500",
  },
  historyAnswerWrong: {
    color: "#DC2626",
    fontWeight: "500",
  },
  resultFooter: {
    paddingVertical: 20,
  },
  primaryButton: {
    backgroundColor: "#6B46C1",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButton: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#6B46C1",
  },
  secondaryButtonText: {
    color: "#6B46C1",
    fontSize: 16,
    fontWeight: "bold",
  },
});

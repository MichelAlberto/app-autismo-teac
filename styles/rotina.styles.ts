import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    justifyContent: "space-between",
  },
  backBtn: {
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1a3b5c",
  },

  // -- INPUT TÍTULO
  titleCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#5b6574",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  input: {
    fontSize: 18,
    color: "#3b4352",
    borderBottomWidth: 2,
    borderBottomColor: "#e0eaf5",
    paddingVertical: 8,
  },

  // -- LISTA VERTICAL
  timelineContainer: {
    marginBottom: 100, // Espaço para o botão fixo
    paddingTop: 10,
  },
  taskCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  iconBox: {
    width: 55,
    height: 55,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#1a3b5c",
  },
  taskTime: {
    fontSize: 14,
    color: "#6a7fdb",
    fontWeight: "600",
    marginTop: 2,
  },
  taskDate: {
    fontSize: 12,
    color: "#8e9aaf",
    marginTop: 2,
  },
  removeBtn: {
    padding: 5,
  },

  // -- BOTÃO FIXO NO RODAPÉ
  addTaskBtn: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6a7fdb",
    paddingVertical: 18,
    borderRadius: 20,
    shadowColor: "#6a7fdb",
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
    zIndex: 10,
  },
  addTaskText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 18,
    marginLeft: 10,
  },

  // -- CAMPOS DO MODAL
  textArea: {
    fontSize: 16,
    color: "#3b4352",
    backgroundColor: "#f7f9fc",
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    minHeight: 80,
    textAlignVertical: "top",
  },
  dateTimeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  dateTimeField: {
    width: "48%",
  },
  pickerBtn: {
    backgroundColor: "#f7f9fc",
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pickerBtnText: {
    fontSize: 15,
    color: "#3b4352",
  },

  // -- MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    minHeight: "60%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a3b5c",
  },
  saveBtn: {
    backgroundColor: "#4caf50",
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 20,
  },
  saveBtnText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },

  // -- GRID DE ÍCONES
  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginVertical: 15,
  },
  iconOption: {
    width: "18%",
    aspectRatio: 1,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    backgroundColor: "#f7f9fc",
  },
  iconOptionSelected: {
    borderWidth: 2,
    borderColor: "#6a7fdb",
    backgroundColor: "#eef2ff",
  },

  // -- BOTÃO FINAL SALVAR ROTINA
  saveRoutineBtn: {
    backgroundColor: "#ff9800",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    borderRadius: 20,
    shadowColor: "#ff9800",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  saveRoutineText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 18,
    marginRight: 10,
  },
});

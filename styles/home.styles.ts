import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  
  // -- SAUDAÇÃO
  greetingHeader: {
    marginBottom: 20,
    marginTop: -10,
    paddingRight: 40,
  },
  logoutBtn: {
    position: 'absolute',
    top: 30,
    right: 20,
    zIndex: 10,
  },
  greetingTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#3b4352',
  },
  greetingSubtitle: {
    fontSize: 15,
    color: '#5b6574',
    marginTop: 5,
  },

  // -- COMPONENTES DE CARTÃO (CARDS)
  cardTop: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3b4352',
    marginBottom: 10,
  },

  // -- CARD "SEU PROGRESSO"
  progressBarBg: {
    width: '100%',
    height: 10,
    backgroundColor: '#e6ebf0',
    borderRadius: 5,
    marginTop: 5,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#6ec5cc',
    borderRadius: 5,
  },
  progressText: {
    fontSize: 14,
    color: '#3b4352',
    marginTop: 5,
    fontWeight: '600',
    marginBottom: 15,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  progressStatsList: {
    flex: 1,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  statText: {
    marginLeft: 8,
    fontSize: 13,
    color: '#5b6574',
  },
  lastActivityBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 10,
  },
  lastActivityTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#3b4352',
    marginBottom: 2,
    textAlign: 'center',
  },
  lastActivityDesc: {
    fontSize: 12,
    color: '#5b6574',
    textAlign: 'center',
  },
  continueBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f7f9fc',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e6ebf0',
  },
  continueBtnText: {
    fontSize: 15,
    color: '#3b4352',
    fontWeight: 'bold',
    marginLeft: 8,
    marginRight: 5,
  },

  // -- CARD "RECOMENDADO HOJE"
  recommendationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    paddingRight: 10, // Espaço pra imagem
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    position: 'relative',
    minHeight: 200,
  },
  bulletList: {
    width: '60%',
    marginBottom: 15,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#6ec5cc',
    marginRight: 8,
  },
  bulletText: {
    fontSize: 13,
    color: '#5b6574',
    flexShrink: 1,
  },
  verConteudoBtn: {
    backgroundColor: '#ffe28a',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    width: '60%',
  },
  verConteudoText: {
    fontSize: 14,
    color: '#3b4352',
    fontWeight: 'bold',
    marginRight: 5,
  },
  absoluteRingContainer: {
    position: 'absolute',
    right: 10,
    top: 15,
    width: 170,
    height: 170,
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingImageRing: {
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: '#c5eaff',
    borderRadius: 85,
    width: 170,
    height: 170,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
    overflow: 'hidden',
  },
  floatingImage: {
    width: 160,
    height: 160,
    borderRadius: 80,
  },

  // -- CARD "DICA DO DIA"
  tipCard: {
    backgroundColor: '#e3f3ff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3b4352',
    marginLeft: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#5b6574',
    lineHeight: 20,
  },

  // -- SEÇÃO NOTIFICAÇÕES
  notificationsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  notificationsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3b4352',
  },
  verTudoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verTudoText: {
    fontSize: 14,
    color: '#3b4352',
    marginRight: 2,
    fontWeight: '600'
  },
  gridMenu: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  gridSquare: {
    width: '23%',
    aspectRatio: 0.85,
    borderRadius: 15,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  gridIconContainer: {
    marginBottom: 8,
  },
  gridText: {
    fontSize: 11,
    color: '#3b4352',
    textAlign: 'center',
    fontWeight: '600',
  },

  // -- CITAÇÃO FINAL
  footerQuoteBox: {
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  footerQuoteText: {
    fontSize: 15,
    fontStyle: 'italic',
    color: '#3b4352',
    fontWeight: '600',
    textAlign: 'center',
  }
});

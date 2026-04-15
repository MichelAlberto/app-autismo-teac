import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  backBtn: {
    position: 'absolute',
    top: 50,
    left: 20,
    padding: 10,
    backgroundColor: '#ffffffbb',
    borderRadius: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    width: '90%',
    backgroundColor: '#ffffffee',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 16,
    marginBottom: 15,
  },
  input: {
    width: '100%',
    backgroundColor: '#f2f2f2',
    padding: 12,
    borderRadius: 10,
    marginVertical: 10,
  },
  passwordContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    marginVertical: 10,
  },
  passwordInput: {
    flex: 1,
    padding: 12,
  },
  eyeIcon: {
    padding: 10,
  },
  primaryBtn: {
    width: '100%',
    padding: 12,
    backgroundColor: '#6A7FDB',
    borderRadius: 10,
    marginTop: 15,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  errorText: {
    color: '#d9534f',
    marginTop: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  successText: {
    color: '#28a745',
    marginTop: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

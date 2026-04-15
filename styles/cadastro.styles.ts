import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
  },
  subtitle: {
    marginBottom: 10,
    backgroundColor: '#ffffffaa',
    padding: 5,
    borderRadius: 10,
  },
  image: {
    width: 120,
    height: 120,
    marginVertical: 10,
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
    fontSize: 18,
    marginBottom: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    width: '100%',
    backgroundColor: '#f2f2f2',
    padding: 12,
    borderRadius: 10,
    marginVertical: 5,
  },
  registerBtn: {
    width: '100%',
    padding: 12,
    backgroundColor: '#6A7FDB',
    borderRadius: 10,
    marginTop: 15,
    alignItems: 'center',
  },
  registerText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
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
  backBtn: {
    marginTop: 15,
  },
  backText: {
    color: '#6A7FDB',
    fontWeight: 'bold',
  },
});

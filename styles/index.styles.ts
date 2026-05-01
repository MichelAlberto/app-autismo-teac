import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 40,
  },
  subtitle: {
    marginBottom: 20,
    backgroundColor: '#ffffffaa',
    padding: 5,
    borderRadius: 10,
  },
  image: {
    width: 180,
    height: 180,
    marginVertical: 18,
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
    marginTop: -15,
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
    marginVertical: 5,
  },
  passwordContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    marginVertical: 5,
  },
  passwordInput: {
    flex: 1,
    padding: 12,
  },
  eyeIcon: {
    padding: 10,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: 5,
  },
  forgotText: {
    color: '#6A7FDB',
    fontSize: 14,
    fontWeight: 'bold',
  },
  loginBtn: {
    width: '100%',
    padding: 12,
    backgroundColor: '#6A7FDB',
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  loginText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  errorText: {
    color: '#d9534f',
    marginTop: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  registerBtn: {
    width: '100%',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 15,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#6A7FDB',
  },
  registerText: {
    color: '#6A7FDB',
    fontWeight: 'bold',
    fontSize: 16,
  },
  or: {
    marginVertical: 10,
    color: '#999',
  },
  googleBtn: {
    width: '100%',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  guest: {
    marginTop: 8,
    textDecorationLine: 'underline',
  },
  footer: {
    fontSize: 12,
    marginTop: 10,
    textAlign: 'center',
  },
});

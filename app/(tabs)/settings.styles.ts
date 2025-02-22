import { StyleSheet } from 'react-native';

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});

export const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 80, // Adds padding at the bottom to account for the navbar
  },
  section: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
  },
  label: {
    fontWeight: '600',
    width: 120,
  },
  value: {
    flex: 1,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  helperText: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 8,
  },
  link: {
    color: '#007AFF',
    marginTop: 8,
  },
  footer: {
    marginTop: 32,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#CCCCCC',
    alignItems: 'center',
  },
  footerLink: {
    color: '#007AFF',
    marginBottom: 16,
  },
  logoutText: {
    color: '#FF3B30',
    marginTop: 8,
  },
  refreshButton: {
    marginVertical: 8,
    opacity: 0.8,
  },
});

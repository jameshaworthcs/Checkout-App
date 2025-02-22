import React from 'react';
import { Modal, View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

type AuthModalProps = {
  visible: boolean;
  loading: boolean;
  success: boolean;
  error: string | null;
  username: string | null;
  onRetry: () => void;
  onClose: () => void;
};

export function AuthModal({
  visible,
  loading,
  success,
  error,
  username,
  onRetry,
  onClose,
}: AuthModalProps) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <BlurView intensity={100} style={styles.container}>
        <View style={styles.content}>
          {loading && (
            <>
              <ActivityIndicator size="large" color="#0066FF" />
              <Text style={styles.loadingText}>Logging in...</Text>
            </>
          )}

          {success && (
            <>
              <Ionicons name="checkmark-circle" size={60} color="#4CAF50" />
              <Text style={styles.successText}>Welcome, {username}!</Text>
            </>
          )}

          {error && (
            <>
              <Ionicons name="alert-circle" size={60} color="#FF3B30" />
              <Text style={styles.errorText}>{error}</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
                  <Text style={styles.buttonText}>Try Again</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    minHeight: 250,
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  successText: {
    marginTop: 20,
    fontSize: 18,
    color: '#4CAF50',
    fontWeight: '600',
  },
  errorText: {
    marginTop: 20,
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 10,
  },
  retryButton: {
    backgroundColor: '#0066FF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: '#666',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

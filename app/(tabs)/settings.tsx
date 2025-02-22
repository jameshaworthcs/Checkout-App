import { Fragment } from 'react';
import { ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { AuthModal } from '@/components/AuthModal';
import { useAuth } from '@/hooks/useAuth';
import { useSettingsAccount } from '@/hooks/useSettingsAccount';
import { commonStyles, styles } from './settings.styles';
import { CHECKOUT_API_URL } from '@/constants/api';

export default function SettingsScreen() {
  const { signIn, logout, modalState, modalActions, isLoggedIn } = useAuth();
  const { accountInfo, isRefreshing, fetchAccountInfo, clearAccountInfo } = useSettingsAccount();

  useFocusEffect(
    useCallback(() => {
      if (isLoggedIn) {
        fetchAccountInfo(false);
      }
    }, [isLoggedIn, fetchAccountInfo])
  );

  const handleLogout = async () => {
    clearAccountInfo();
    await logout();
  };

  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <ThemedView style={commonStyles.container}>
        {/* Course Section */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Course</ThemedText>
          <ThemedView style={styles.infoRow}>
            <ThemedText style={styles.label}>Institution:</ThemedText>
            <ThemedText style={styles.value}>University of York</ThemedText>
          </ThemedView>
          <ThemedView style={styles.infoRow}>
            <ThemedText style={styles.label}>Course:</ThemedText>
            <ThemedText style={styles.value}>Computer Science</ThemedText>
          </ThemedView>
          <ThemedView style={styles.infoRow}>
            <ThemedText style={styles.label}>Year:</ThemedText>
            <ThemedText style={styles.value}>2</ThemedText>
          </ThemedView>
        </ThemedView>

        {/* Account Section */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Account</ThemedText>
          {!isLoggedIn ? (
            <Fragment>
              <TouchableOpacity style={styles.button} onPress={signIn}>
                <ThemedText style={styles.buttonText}>Sign In</ThemedText>
              </TouchableOpacity>
              <ThemedText style={styles.helperText}>
                Sign in to sync your data and access additional features
              </ThemedText>
            </Fragment>
          ) : !accountInfo ? (
            <ThemedText>Loading account information...</ThemedText>
          ) : (
            <Fragment>
              <ThemedView style={styles.infoRow}>
                <ThemedText style={styles.label}>Username:</ThemedText>
                <ThemedText style={styles.value}>{accountInfo.username}</ThemedText>
              </ThemedView>
              <ThemedView style={styles.infoRow}>
                <ThemedText style={styles.label}>Email:</ThemedText>
                <ThemedText style={styles.value}>{accountInfo.email}</ThemedText>
              </ThemedView>
              <ThemedView style={styles.infoRow}>
                <ThemedText style={styles.label}>Account Created:</ThemedText>
                <ThemedText style={styles.value}>
                  {new Date(accountInfo.accountCreationTime).toLocaleDateString()}
                </ThemedText>
              </ThemedView>
              <TouchableOpacity onPress={() => openLink(`${CHECKOUT_API_URL}/account`)}>
                <ThemedText style={styles.link}>Manage Account</ThemedText>
              </TouchableOpacity>
            </Fragment>
          )}
        </ThemedView>

        {/* Theme Section */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Theme</ThemedText>
          <ThemedText style={styles.helperText}>
            The app follows your device theme settings
          </ThemedText>
        </ThemedView>

        {/* Data Section */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Data</ThemedText>
          <TouchableOpacity onPress={() => openLink(`${CHECKOUT_API_URL}/data`)}>
            <ThemedText style={styles.link}>Manage Your Data</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        {/* Footer */}
        <ThemedView style={styles.footer}>
          <TouchableOpacity onPress={() => openLink(`${CHECKOUT_API_URL}/terms-privacy`)}>
            <ThemedText style={styles.footerLink}>Privacy and Terms</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openLink(`${CHECKOUT_API_URL}/learn-faq`)}>
            <ThemedText style={styles.footerLink}>Help and Support</ThemedText>
          </TouchableOpacity>
          {isLoggedIn && (
            <Fragment>
              <TouchableOpacity onPress={() => fetchAccountInfo(true)} style={styles.refreshButton}>
                <ThemedText style={[styles.footerLink, isRefreshing && styles.textFaded]}>
                  {isRefreshing ? 'Refreshing...' : 'Refresh Account Data'}
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleLogout}>
                <ThemedText style={styles.logoutText}>Log Out</ThemedText>
              </TouchableOpacity>
            </Fragment>
          )}
        </ThemedView>
      </ThemedView>

      <AuthModal
        visible={modalState.visible}
        loading={modalState.loading}
        success={modalState.success}
        error={modalState.error}
        username={modalState.username}
        onRetry={modalActions.onRetry}
        onClose={modalActions.onClose}
      />
    </ScrollView>
  );
}

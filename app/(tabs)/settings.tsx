import { Fragment } from 'react';
import { ScrollView, TouchableOpacity, Linking, View, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { AuthModal } from '@/components/AuthModal';
import { useAuth } from '@/hooks/useAuth';
import { useSettingsAccount } from '@/hooks/useSettingsAccount';
import { CHECKOUT_API_URL } from '@/constants/api';
import { useToast } from '@/hooks/useToast';
import { createSharedStyles } from '@/app/styles/shared.styles';
import { createSettingsStyles } from '@/app/styles/settings.styles';
import { useAppTheme } from '@/hooks/useAppTheme';
import Constants from 'expo-constants';

export default function SettingsScreen() {
  const { signIn, logout, modalState, modalActions, isLoggedIn } = useAuth();
  const { accountInfo, fetchAccountInfo, clearAccountInfo } = useSettingsAccount();
  const toast = useToast();
  const { theme } = useAppTheme();
  const sharedStyles = createSharedStyles(theme);
  const styles = createSettingsStyles(theme);

  const currentYear = new Date().getFullYear();
  const appVersion = Constants.expoConfig?.version || '1.0.0';

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
    toast.success('Logged out successfully');
  };

  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  const showAdvancedOptions = () => {
    Alert.alert('Advanced Options', '', [
      {
        text: 'Refresh Account Data',
        onPress: () => fetchAccountInfo(true),
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <ThemedView style={[sharedStyles.container, { alignItems: 'stretch' }]}>
        {/* Course Section */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Course</ThemedText>
          <View style={styles.infoRow}>
            <ThemedText style={styles.label}>Institution:</ThemedText>
            <ThemedText style={styles.value}>University of York</ThemedText>
          </View>
          <View style={styles.infoRow}>
            <ThemedText style={styles.label}>Course:</ThemedText>
            <ThemedText style={styles.value}>Computer Science</ThemedText>
          </View>
          <View style={styles.infoRow}>
            <ThemedText style={styles.label}>Year:</ThemedText>
            <ThemedText style={styles.value}>2</ThemedText>
          </View>
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
              <View style={styles.infoRow}>
                <ThemedText style={styles.label}>Username:</ThemedText>
                <ThemedText style={styles.value}>{accountInfo.username}</ThemedText>
              </View>
              <View style={styles.infoRow}>
                <ThemedText style={styles.label}>Email:</ThemedText>
                <ThemedText style={styles.value}>{accountInfo.email}</ThemedText>
              </View>
              <View style={styles.infoRow}>
                <ThemedText style={styles.label}>Account Created:</ThemedText>
                <ThemedText style={styles.value}>
                  {new Date(accountInfo.accountCreationTime).toLocaleDateString()}
                </ThemedText>
              </View>
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
        <View style={styles.footer}>
          <View style={styles.footerLinksRow}>
            <TouchableOpacity onPress={() => openLink(`${CHECKOUT_API_URL}/terms-privacy`)}>
              <ThemedText style={styles.footerLink}>Privacy and Terms</ThemedText>
            </TouchableOpacity>
            <ThemedText style={styles.footerLink}> • </ThemedText>
            <TouchableOpacity onPress={() => openLink(`${CHECKOUT_API_URL}/learn-faq`)}>
              <ThemedText style={styles.footerLink}>Help</ThemedText>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={showAdvancedOptions}>
            <ThemedText style={styles.footerLink}>Advanced</ThemedText>
          </TouchableOpacity>

          {isLoggedIn && (
            <Fragment>
              <TouchableOpacity onPress={handleLogout}>
                <ThemedText style={styles.logoutText}>Log Out</ThemedText>
              </TouchableOpacity>
            </Fragment>
          )}

          <View style={styles.copyrightContainer}>
            <ThemedText style={styles.copyrightText}>Version {appVersion}</ThemedText>
            <ThemedText style={styles.copyrightText}>© {currentYear} JEM Media</ThemedText>
          </View>
        </View>
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

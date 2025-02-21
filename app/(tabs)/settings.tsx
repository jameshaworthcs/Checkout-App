import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { commonStyles } from '@/constants/Styles';

export default function SettingsScreen() {
  return (
    <ThemedView style={commonStyles.container}>
      <ThemedText style={commonStyles.title}>Settings</ThemedText>
      <ThemedText style={commonStyles.text}>
        Configure your app preferences and account settings
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
});

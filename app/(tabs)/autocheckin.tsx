import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { commonStyles } from '@/constants/Styles';

export default function AutoCheckinScreen() {
  return (
    <ThemedView style={commonStyles.container}>
      <ThemedText style={commonStyles.title}>AutoCheckin</ThemedText>
      <ThemedText style={commonStyles.text}>
        Manage AutoCheckin account and view statistics
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

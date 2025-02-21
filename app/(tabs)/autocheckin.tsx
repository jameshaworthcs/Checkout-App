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

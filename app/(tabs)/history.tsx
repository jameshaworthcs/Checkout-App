import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { commonStyles } from '@/constants/Styles';

export default function HistoryScreen() {
  return (
    <ThemedView style={commonStyles.container}>
      <ThemedText style={commonStyles.title}>Check-in History</ThemedText>
      <ThemedText style={commonStyles.text}>View your attendance history and records</ThemedText>
    </ThemedView>
  );
}

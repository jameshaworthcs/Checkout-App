import { View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { createHelpStyles } from '@/app/styles/history.styles';
import { useAppTheme } from '@/hooks/useAppTheme';

export default function HelpScreen() {
  const { theme } = useAppTheme();
  const styles = createHelpStyles(theme);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.infoBox}>
        <ThemedText style={styles.infoTitle}>Made a Mistake?</ThemedText>
        <ThemedText style={styles.infoText}>
          Don't worry! If you accidentally submitted the wrong code or need to make changes, you
          can:
        </ThemedText>
        <View style={styles.bulletPoints}>
          <ThemedText style={styles.bulletPoint}>• Undo - Revert a code submission</ThemedText>
          <ThemedText style={styles.bulletPoint}>
            • Redo - Restore a previously undone submission
          </ThemedText>
        </View>
      </View>
    </ThemedView>
  );
}

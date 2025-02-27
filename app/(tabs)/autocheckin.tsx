import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { createSharedStyles } from '@/app/styles/shared.styles';
import { useAppTheme } from '@/hooks/useAppTheme';

export default function AutoCheckinScreen() {
  const { theme } = useAppTheme();
  const styles = createSharedStyles(theme);

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>AutoCheckin</ThemedText>
      <ThemedText style={styles.text}>Manage AutoCheckin account and view statistics</ThemedText>
    </ThemedView>
  );
}

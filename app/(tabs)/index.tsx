import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { createSharedStyles } from '@/app/styles/shared.styles';
import { useAppTheme } from '@/hooks/useAppTheme';

export default function HomeScreen() {
  const { theme } = useAppTheme();
  const styles = createSharedStyles(theme);

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Code Management</ThemedText>
      <ThemedText style={styles.text}>Enter and view your check-in codes here</ThemedText>
    </ThemedView>
  );
}

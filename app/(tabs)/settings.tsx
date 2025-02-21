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

import { Stack } from 'expo-router';

export default function HistoryLayout() {
  return (
    <Stack
      screenOptions={{
        headerBackTitle: 'History',
      }}>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          title: 'History',
        }}
      />
      <Stack.Screen
        name="help"
        options={{
          presentation: 'card',
          title: 'How to use History',
        }}
      />
    </Stack>
  );
}

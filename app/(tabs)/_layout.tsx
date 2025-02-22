import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { TopBar } from '@/components/TopBar';

import { HapticTab } from '@/components/HapticTab';
import { AutocheckinIcon } from '@/components/ui/AutocheckinIcon';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { HistoryIcon } from '@/components/ui/HistoryIcon';
import { SettingsIcon } from '@/components/ui/SettingsIcon';
import { CheckOutIcon } from '@/components/ui/CheckOutIcon';
export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <>
      <TopBar />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              position: 'absolute',
            },
            default: {},
          }),
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'CheckOut',
            tabBarIcon: ({ color }) => <CheckOutIcon size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="autocheckin"
          options={{
            title: 'AutoCheckin',
            tabBarIcon: ({ color }) => <AutocheckinIcon size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="history"
          options={{
            title: 'History',
            tabBarIcon: ({ color }) => <HistoryIcon size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color }) => <SettingsIcon size={24} color={color} />,
          }}
          listeners={({ navigation }) => ({
            tabPress: () => {
              // Force a remount of the screen
              navigation.setParams({ refresh: Date.now() });
            },
          })}
        />
      </Tabs>
    </>
  );
}

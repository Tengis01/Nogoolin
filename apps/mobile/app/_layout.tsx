import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from '@/lib/auth-store';
import { colors } from '@/lib/theme';

// Navigation shell. Phase 3 replaces the plain stack entry with the Rive
// opening animation (FR-3D-010/011).
export default function RootLayout() {
  const initialize = useAuthStore((s) => s.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.paper },
          headerTintColor: colors.ink,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.paper },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Ногоолин' }} />
        <Stack.Screen name="login" options={{ title: 'Нэвтрэх' }} />
        <Stack.Screen name="signup" options={{ title: 'Бүртгүүлэх' }} />
      </Stack>
    </>
  );
}

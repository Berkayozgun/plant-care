import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack>
      <Stack.Screen name="intro1" options={{ headerShown: false }} />
      <Stack.Screen name="intro2" options={{ headerShown: false }} />
      <Stack.Screen name="intro3" options={{ headerShown: false }} />
    </Stack>
  );
}
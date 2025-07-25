import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import React from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';

type ScreenLayoutProps = ViewProps & {
  children: React.ReactNode;
  headerShown?: boolean;
};

export function ScreenLayout({
  children,
  headerShown = false,
  style,
  ...rest
}: ScreenLayoutProps) {
  return (
    <LinearGradient colors={["#f5f7fa", "#c3cfe2"]} style={styles.gradient}>
      <Stack.Screen options={{ headerShown: headerShown }} />
      <View style={[styles.container, style]} {...rest}>
        {children}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    width: '100%',
    maxWidth: 380,
  },
}); 
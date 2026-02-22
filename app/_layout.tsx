
import "react-native-reanimated";
import React, { useEffect } from "react";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { SystemBars } from "react-native-edge-to-edge";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useColorScheme, View, ActivityIndicator, StyleSheet } from "react-native";
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { WidgetProvider } from "@/contexts/WidgetContext";
import { SupabaseProvider } from "@/contexts/SupabaseContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Create QueryClient with 5 minute stale time
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF5EB',
  },
});

function AppContent() {
  const colorScheme = useColorScheme();
  const { loading } = useAuth();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded && !loading) {
      SplashScreen.hideAsync();
    }
  }, [loaded, loading]);

  if (!loaded || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1C1C1E" />
      </View>
    );
  }

  const CustomDefaultTheme: Theme = {
    ...DefaultTheme,
    dark: false,
    colors: {
      primary: "rgb(0, 122, 255)",
      background: "rgb(255, 245, 235)", // Cream background
      card: "rgb(255, 255, 255)",
      text: "rgb(28, 28, 30)",
      border: "rgb(216, 216, 220)",
      notification: "rgb(255, 59, 48)",
    },
  };

  const CustomDarkTheme: Theme = {
    ...DarkTheme,
    colors: {
      primary: "rgb(10, 132, 255)",
      background: "rgb(15, 23, 42)", // Dark slate
      card: "rgb(30, 41, 59)",
      text: "rgb(255, 255, 255)",
      border: "rgb(44, 44, 46)",
      notification: "rgb(255, 69, 58)",
    },
  };

  return (
    <ThemeProvider
      value={colorScheme === "dark" ? CustomDarkTheme : CustomDefaultTheme}
    >
      <StatusBar style="auto" animated />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colorScheme === "dark" ? "#0F172A" : "#FFF5EB" },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="welcome" />
        <Stack.Screen name="yada" />
        <Stack.Screen name="gnosis" />
        <Stack.Screen name="projects" />
        <Stack.Screen name="history" />
        <Stack.Screen name="preview" />
        <Stack.Screen name="dashboard" />
        <Stack.Screen name="premium" />
        <Stack.Screen name="setup-supabase" />
        <Stack.Screen name="setup-firestore" />
        <Stack.Screen name="setup-aws" />
        <Stack.Screen name="github" />
        <Stack.Screen name="github-setup" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="api-docs" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="auth-popup" />
        <Stack.Screen name="auth-callback" />
      </Stack>
      <SystemBars style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SupabaseProvider>
        <WidgetProvider>
          <AuthProvider>
            <QueryClientProvider client={queryClient}>
              <AppContent />
            </QueryClientProvider>
          </AuthProvider>
        </WidgetProvider>
      </SupabaseProvider>
    </GestureHandlerRootView>
  );
}

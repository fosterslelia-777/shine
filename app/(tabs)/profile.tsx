
import { SafeAreaView } from "react-native-safe-area-context";
import { IconSymbol } from "@/components/IconSymbol";
import { GlassView } from "expo-glass-effect";
import { View, Text, StyleSheet, ScrollView, Platform, ActivityIndicator } from "react-native";
import React from "react";
import { useTheme } from "@react-navigation/native";
import { useSupabase } from "@/contexts/SupabaseContext";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 48 : 0,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    fontSize: 34,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 17,
    opacity: 0.6,
    marginBottom: 24,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    overflow: "hidden",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  cardContent: {
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.8,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 12,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(128, 128, 128, 0.2)",
  },
  infoLabel: {
    fontSize: 15,
    opacity: 0.6,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "500",
  },
  iconContainer: {
    marginRight: 8,
  },
});

export default function ProfileScreen() {
  const { colors } = useTheme();
  const { isConnected, connectionStatus, user, session } = useSupabase();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollContent}>
        <Text style={[styles.header, { color: colors.text }]}>Profile</Text>
        <Text style={[styles.subtitle, { color: colors.text }]}>
          Supabase Connection Status
        </Text>

        {/* Connection Status Card */}
        <GlassView
          style={styles.card}
          intensity={Platform.OS === "ios" ? 50 : 0}
          tint={Platform.OS === "ios" ? "dark" : "light"}
        >
          <View style={[styles.statusBadge, { backgroundColor: isConnected ? 'rgba(52, 199, 89, 0.2)' : 'rgba(255, 149, 0, 0.2)' }]}>
            <IconSymbol
              ios_icon_name={isConnected ? "checkmark.circle.fill" : "exclamationmark.triangle.fill"}
              android_material_icon_name={isConnected ? "check-circle" : "warning"}
              size={20}
              color={isConnected ? '#34C759' : '#FF9500'}
            />
            <Text style={[styles.statusText, { color: isConnected ? '#34C759' : '#FF9500' }]}>
              {isConnected ? 'Connected' : 'Connecting...'}
            </Text>
          </View>
          
          <Text style={[styles.cardContent, { color: colors.text }]}>
            {connectionStatus}
          </Text>
        </GlassView>

        {/* Supabase Configuration Card */}
        <GlassView
          style={styles.card}
          intensity={Platform.OS === "ios" ? 50 : 0}
          tint={Platform.OS === "ios" ? "dark" : "light"}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <View style={styles.iconContainer}>
              <IconSymbol
                ios_icon_name="server.rack"
                android_material_icon_name="storage"
                size={24}
                color={colors.primary}
              />
            </View>
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              Supabase Configuration
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.text }]}>Project URL</Text>
            <Text style={[styles.infoValue, { color: colors.text }]} numberOfLines={1}>
              guvkrzaltbohxrvyizav
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.text }]}>Region</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              supabase.co
            </Text>
          </View>

          <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
            <Text style={[styles.infoLabel, { color: colors.text }]}>Auth Status</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              {session ? 'Authenticated' : 'Not authenticated'}
            </Text>
          </View>
        </GlassView>

        {/* User Info Card (if authenticated) */}
        {user && (
          <GlassView
            style={styles.card}
            intensity={Platform.OS === "ios" ? 50 : 0}
            tint={Platform.OS === "ios" ? "dark" : "light"}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <View style={styles.iconContainer}>
                <IconSymbol
                  ios_icon_name="person.circle.fill"
                  android_material_icon_name="account-circle"
                  size={24}
                  color={colors.primary}
                />
              </View>
              <Text style={[styles.cardTitle, { color: colors.text }]}>
                User Information
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.text }]}>User ID</Text>
              <Text style={[styles.infoValue, { color: colors.text }]} numberOfLines={1}>
                {user.id.substring(0, 8)}...
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.text }]}>Email</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {user.email || 'N/A'}
              </Text>
            </View>

            <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
              <Text style={[styles.infoLabel, { color: colors.text }]}>Created</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {new Date(user.created_at).toLocaleDateString()}
              </Text>
            </View>
          </GlassView>
        )}

        {/* Quick Start Guide */}
        <GlassView
          style={styles.card}
          intensity={Platform.OS === "ios" ? 50 : 0}
          tint={Platform.OS === "ios" ? "dark" : "light"}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <View style={styles.iconContainer}>
              <IconSymbol
                ios_icon_name="lightbulb.fill"
                android_material_icon_name="lightbulb"
                size={24}
                color={colors.primary}
              />
            </View>
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              Next Steps
            </Text>
          </View>

          <Text style={[styles.cardContent, { color: colors.text }]}>
            Your app is now connected to Supabase! You can now:{'\n\n'}
            • Use supabase.from('table_name') to query data{'\n'}
            • Implement authentication with supabase.auth{'\n'}
            • Store files with supabase.storage{'\n'}
            • Set up real-time subscriptions{'\n\n'}
            Import the supabase client from '@/lib/supabase' in any component.
          </Text>
        </GlassView>
      </ScrollView>
    </SafeAreaView>
  );
}

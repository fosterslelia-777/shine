
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Github, RefreshCw, CheckCircle, XCircle, Settings } from 'lucide-react-native';
import { apiCall } from '@/utils/api';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 48 : 16,
    paddingBottom: 24,
    backgroundColor: '#0F172A',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  githubIcon: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 4,
  },
  scrollContent: {
    padding: 20,
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  configureButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
  },
  configureButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
    marginLeft: 6,
  },
  infoRow: {
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusBadgeEnabled: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  statusBadgeDisabled: {
    backgroundColor: 'rgba(148, 163, 184, 0.2)',
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  statusTextEnabled: {
    color: '#10B981',
  },
  statusTextDisabled: {
    color: '#94A3B8',
  },
  syncButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 16,
  },
  syncButtonReady: {
    backgroundColor: '#10B981',
  },
  syncButtonSyncing: {
    backgroundColor: '#64748B',
  },
  syncButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  resultCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultCardSuccess: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  resultCardError: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  resultContent: {
    flex: 1,
    marginLeft: 12,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  resultTitleSuccess: {
    color: '#10B981',
  },
  resultTitleError: {
    color: '#EF4444',
  },
  resultText: {
    fontSize: 14,
    color: '#94A3B8',
  },
  infoCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
  },
  infoCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  infoItem: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 24,
    paddingLeft: 8,
  },
  repoLink: {
    fontSize: 14,
    color: '#3B82F6',
    marginTop: 12,
    textDecorationLine: 'underline',
  },
});

export default function GitHubScreen() {
  const router = useRouter();
  const [isSyncing, setIsSyncing] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const [syncResult, setSyncResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('GitHubScreen: Loading GitHub settings');
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      console.log('GitHubScreen: Fetching settings from /api/github/setup');
      const data = await apiCall('/api/github/setup');
      console.log('GitHubScreen: Settings loaded', data);
      setSettings(data);
    } catch (error) {
      console.error('GitHubScreen: Error loading settings', error);
      setSettings({
        githubToken: '',
        repoOwner: 'r73723189-alt',
        repoName: 'sync-supabase-hvoqnn',
        autoSync: false,
        lastSync: null,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackPress = () => {
    console.log('GitHubScreen: Back button pressed');
    router.back();
  };

  const handleConfigurePress = () => {
    console.log('GitHubScreen: Configure button pressed');
    router.push('/github-setup');
  };

  const handleSyncPress = async () => {
    console.log('GitHubScreen: Sync button pressed');
    
    if (!settings?.githubToken || settings.githubToken === '') {
      Alert.alert('Configuration Required', 'Please configure your GitHub settings first by tapping the Configure button.');
      return;
    }

    setIsSyncing(true);
    setSyncResult(null);

    try {
      console.log('GitHubScreen: Starting sync to /api/github/sync');
      const data = await apiCall('/api/github/sync', {
        method: 'POST',
        body: JSON.stringify({}),
      });
      console.log('GitHubScreen: Sync response', data);

      if (data.success) {
        const successMessage = `Successfully synced ${data.filesSynced} files to GitHub`;
        setSyncResult({
          success: true,
          filesSynced: data.filesSynced,
          filesFailed: data.filesFailed || 0,
        });
        Alert.alert('✅ Sync Complete', successMessage);
        await loadSettings();
      } else {
        const errorMessage = data.message || 'Sync failed';
        setSyncResult({
          success: false,
          error: errorMessage,
        });
        Alert.alert('❌ Sync Failed', errorMessage);
      }
    } catch (error: any) {
      console.error('GitHubScreen: Sync error', error);
      const errorMessage = error.message || 'Failed to sync to GitHub. Please check your connection and try again.';
      setSyncResult({
        success: false,
        error: errorMessage,
      });
      Alert.alert('❌ Error', errorMessage);
    } finally {
      setIsSyncing(false);
    }
  };

  const repoUrl = settings ? `github.com/${settings.repoOwner}/${settings.repoName}` : '';
  const autoSyncText = settings?.autoSync ? 'Enabled' : 'Disabled';
  const lastSyncDate = settings?.lastSync ? new Date(settings.lastSync).toLocaleString() : 'Never';

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color="#10B981" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.githubIcon}>
            <Github size={28} color="#FFFFFF" />
          </View>
          <Text style={styles.headerTitle}>GitHub Sync</Text>
        </View>
        <Text style={styles.subtitle}>Sync your project to GitHub repository</Text>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Repository Info</Text>
            <TouchableOpacity style={styles.configureButton} onPress={handleConfigurePress}>
              <Settings size={16} color="#3B82F6" />
              <Text style={styles.configureButtonText}>Configure</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Repository URL</Text>
            <Text style={styles.infoValue}>{repoUrl}</Text>
          </View>

          <View style={styles.statusRow}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Auto Sync</Text>
              <View
                style={[
                  styles.statusBadge,
                  settings?.autoSync ? styles.statusBadgeEnabled : styles.statusBadgeDisabled,
                ]}
              >
                <Text
                  style={[
                    styles.statusBadgeText,
                    settings?.autoSync ? styles.statusTextEnabled : styles.statusTextDisabled,
                  ]}
                >
                  {autoSyncText}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Last Sync</Text>
            <Text style={styles.infoValue}>{lastSyncDate}</Text>
          </View>
        </View>

        {lastSyncDate === 'Never' && (
          <View style={styles.infoCard}>
            <Text style={styles.infoCardTitle}>🚀 Ready to Sync</Text>
            <Text style={styles.infoItem}>
              Your GitHub repository is connected and ready. Tap the button below to sync your project files to GitHub for the first time.
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.syncButton, isSyncing ? styles.syncButtonSyncing : styles.syncButtonReady]}
          onPress={handleSyncPress}
          disabled={isSyncing}
        >
          {isSyncing ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <RefreshCw size={20} color="#FFFFFF" />
          )}
          <Text style={styles.syncButtonText}>
            {isSyncing ? 'Syncing Project Files...' : 'Sync to GitHub Now'}
          </Text>
        </TouchableOpacity>

        {syncResult && (
          <View
            style={[
              styles.resultCard,
              syncResult.success ? styles.resultCardSuccess : styles.resultCardError,
            ]}
          >
            {syncResult.success ? (
              <CheckCircle size={24} color="#10B981" />
            ) : (
              <XCircle size={24} color="#EF4444" />
            )}
            <View style={styles.resultContent}>
              <Text
                style={[
                  styles.resultTitle,
                  syncResult.success ? styles.resultTitleSuccess : styles.resultTitleError,
                ]}
              >
                {syncResult.success ? 'Sync Successful' : 'Sync Failed'}
              </Text>
              <Text style={styles.resultText}>
                {syncResult.success
                  ? `${syncResult.filesSynced} files synced, ${syncResult.filesFailed} failed`
                  : syncResult.error}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>📦 What Gets Synced</Text>
          <Text style={styles.infoItem}>• All React Native screens and components (.tsx, .ts, .jsx, .js)</Text>
          <Text style={styles.infoItem}>• Utility functions, hooks, and contexts</Text>
          <Text style={styles.infoItem}>• Styles and constants</Text>
          <Text style={styles.infoItem}>• Configuration files (package.json, app.json, tsconfig.json)</Text>
          <Text style={styles.infoItem}>• Assets and documentation</Text>
          <Text style={styles.repoLink}>{repoUrl}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
  TextInput,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Github, Lock, User, Folder, ShieldCheck } from 'lucide-react-native';
import { apiCall } from '@/utils/api';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 48 : 16,
    paddingBottom: 24,
    backgroundColor: '#0F172A',
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
  scrollContent: {
    padding: 20,
  },
  formCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
  },
  helperText: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 16,
  },
  toggleContainer: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 16,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  buttonSolid: {
    backgroundColor: '#10B981',
  },
  buttonDisabled: {
    backgroundColor: '#64748B',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  buttonTextOutline: {
    color: '#3B82F6',
  },
  buttonTextSolid: {
    color: '#FFFFFF',
  },
});

export default function GitHubSetupScreen() {
  const router = useRouter();
  const [githubToken, setGithubToken] = useState('');
  const [repoOwner, setRepoOwner] = useState('r73723189-alt');
  const [repoName, setRepoName] = useState('Gnosis-');
  const [autoSync, setAutoSync] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    console.log('GitHubSetupScreen: Loading existing settings');
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      console.log('GitHubSetupScreen: Fetching settings from /api/github/setup');
      const data = await apiCall('/api/github/setup');
      console.log('GitHubSetupScreen: Settings loaded', data);

      if (data.githubToken) setGithubToken(data.githubToken);
      if (data.repoOwner) setRepoOwner(data.repoOwner);
      if (data.repoName) setRepoName(data.repoName);
      setAutoSync(data.autoSync || false);
    } catch (error) {
      console.error('GitHubSetupScreen: Error loading settings', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackPress = () => {
    console.log('GitHubSetupScreen: Back button pressed');
    router.back();
  };

  const handleTestConnection = async () => {
    console.log('GitHubSetupScreen: Test connection button pressed');

    if (!githubToken.trim()) {
      Alert.alert('Error', 'Please enter a GitHub token');
      return;
    }

    setIsTesting(true);

    try {
      console.log('GitHubSetupScreen: Testing connection /api/github/setup');
      const data = await apiCall('/api/github/setup', {
        method: 'POST',
        body: JSON.stringify({
          githubToken,
          repoOwner,
          repoName,
          autoSync,
        }),
      });
      console.log('GitHubSetupScreen: Test connection response', data);

      if (data.success) {
        Alert.alert('Success', 'GitHub connection test successful!');
      } else {
        Alert.alert('Error', data.error || 'Connection test failed');
      }
    } catch (error) {
      console.error('GitHubSetupScreen: Test connection error', error);
      Alert.alert('Error', 'Failed to test connection');
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = async () => {
    console.log('GitHubSetupScreen: Save button pressed');

    if (!githubToken.trim()) {
      Alert.alert('Error', 'Please enter a GitHub token');
      return;
    }

    if (!repoOwner.trim()) {
      Alert.alert('Error', 'Please enter a repository owner');
      return;
    }

    if (!repoName.trim()) {
      Alert.alert('Error', 'Please enter a repository name');
      return;
    }

    setIsSaving(true);

    try {
      console.log('GitHubSetupScreen: Saving settings /api/github/setup');
      const data = await apiCall('/api/github/setup', {
        method: 'POST',
        body: JSON.stringify({
          githubToken,
          repoOwner,
          repoName,
          autoSync,
        }),
      });
      console.log('GitHubSetupScreen: Save response', data);

      if (data.success) {
        Alert.alert('Success', 'GitHub connected successfully', [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]);
      } else {
        Alert.alert('Error', data.error || 'Failed to save settings');
      }
    } catch (error) {
      console.error('GitHubSetupScreen: Save error', error);
      Alert.alert('Error', 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

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
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.githubIcon}>
          <Github size={28} color="#FFFFFF" />
        </View>
        <Text style={styles.headerTitle}>GitHub Setup</Text>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formCard}>
          <Text style={styles.fieldLabel}>GitHub Token</Text>
          <View style={styles.inputContainer}>
            <View style={styles.inputIcon}>
              <Lock size={20} color="#94A3B8" />
            </View>
            <TextInput
              style={styles.input}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              placeholderTextColor="#64748B"
              value={githubToken}
              onChangeText={setGithubToken}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          <Text style={styles.helperText}>
            Personal access token with repo permissions
          </Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.fieldLabel}>Repository Owner</Text>
          <View style={styles.inputContainer}>
            <View style={styles.inputIcon}>
              <User size={20} color="#94A3B8" />
            </View>
            <TextInput
              style={styles.input}
              placeholder="username or organization"
              placeholderTextColor="#64748B"
              value={repoOwner}
              onChangeText={setRepoOwner}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.fieldLabel}>Repository Name</Text>
          <View style={styles.inputContainer}>
            <View style={styles.inputIcon}>
              <Folder size={20} color="#94A3B8" />
            </View>
            <TextInput
              style={styles.input}
              placeholder="repository-name"
              placeholderTextColor="#64748B"
              value={repoName}
              onChangeText={setRepoName}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        </View>

        <View style={styles.toggleContainer}>
          <Text style={styles.toggleLabel}>Automatically sync on code changes</Text>
          <Switch
            value={autoSync}
            onValueChange={setAutoSync}
            trackColor={{ false: '#64748B', true: '#10B981' }}
            thumbColor="#FFFFFF"
          />
        </View>

        <TouchableOpacity
          style={[styles.button, styles.buttonOutline]}
          onPress={handleTestConnection}
          disabled={isTesting}
        >
          {isTesting ? (
            <ActivityIndicator size="small" color="#3B82F6" />
          ) : (
            <ShieldCheck size={20} color="#3B82F6" />
          )}
          <Text style={[styles.buttonText, styles.buttonTextOutline]}>
            {isTesting ? 'Testing...' : 'Test Connection'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, isSaving ? styles.buttonDisabled : styles.buttonSolid]}
          onPress={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : null}
          <Text style={[styles.buttonText, styles.buttonTextSolid]}>
            {isSaving ? 'Saving...' : 'Save GitHub Settings'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

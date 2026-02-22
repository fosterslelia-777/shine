
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Cloud, Globe, Key, MapPin, CheckCircle } from 'lucide-react-native';
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
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  backButton: {
    padding: 8,
  },
  headerIcon: {
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  formCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    paddingVertical: 14,
  },
  buttonContainer: {
    marginBottom: 16,
  },
  testButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FFCA28',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  testButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFCA28',
    marginLeft: 8,
  },
  setupButton: {
    backgroundColor: '#FFCA28',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  setupButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
  },
  saveButton: {
    backgroundColor: '#FFCA28',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  infoCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 20,
    marginBottom: 8,
  },
  collectionItem: {
    fontSize: 14,
    color: '#FFCA28',
    marginLeft: 8,
    marginBottom: 4,
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default function SetupFirestoreScreen() {
  const router = useRouter();
  const [projectId, setProjectId] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [region, setRegion] = useState('');
  const [testing, setTesting] = useState(false);
  const [settingUp, setSettingUp] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleBackPress = () => {
    console.log('SetupFirestoreScreen: Navigating back');
    router.back();
  };

  const handleTestConnection = async () => {
    console.log('SetupFirestoreScreen: Testing connection');
    
    if (!projectId || !apiKey) {
      Alert.alert('Missing Fields', 'Please enter Project ID and API Key');
      return;
    }

    setTesting(true);
    try {
      const response = await apiCall('/api/firestore/test-connection', {
        method: 'POST',
        body: JSON.stringify({
          projectId,
          apiKey,
          region,
        }),
      });

      console.log('SetupFirestoreScreen: Test connection response:', response);
      Alert.alert('Success', 'Connection successful!');
    } catch (error) {
      console.error('SetupFirestoreScreen: Test connection error:', error);
      Alert.alert('Error', error.message || 'Failed to connect to Firestore');
    } finally {
      setTesting(false);
    }
  };

  const handleSetupCollections = async () => {
    console.log('SetupFirestoreScreen: Setting up collections');
    
    if (!projectId || !apiKey) {
      Alert.alert('Missing Fields', 'Please enter all required fields');
      return;
    }

    setSettingUp(true);
    try {
      const response = await apiCall('/api/firestore/setup-collections', {
        method: 'POST',
        body: JSON.stringify({
          projectId,
          apiKey,
          region,
        }),
      });

      console.log('SetupFirestoreScreen: Setup collections response:', response);
      Alert.alert('Success', 'Collections initialized successfully!');
    } catch (error) {
      console.error('SetupFirestoreScreen: Setup collections error:', error);
      Alert.alert('Error', error.message || 'Failed to initialize collections');
    } finally {
      setSettingUp(false);
    }
  };

  const handleSave = async () => {
    console.log('SetupFirestoreScreen: Saving settings');
    
    if (!projectId || !apiKey) {
      Alert.alert('Missing Fields', 'Please enter at least Project ID and API Key');
      return;
    }

    setSaving(true);
    try {
      const response = await apiCall('/api/settings', {
        method: 'POST',
        body: JSON.stringify({
          integration: 'firestore',
          projectId,
          apiKey,
          region,
        }),
      });

      console.log('SetupFirestoreScreen: Save settings response:', response);
      Alert.alert('Success', 'Firestore settings saved!');
      router.back();
    } catch (error) {
      console.error('SetupFirestoreScreen: Save settings error:', error);
      Alert.alert('Error', error.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerIcon}>
          <Cloud size={28} color="#FFCA28" />
        </View>
        <Text style={styles.headerTitle}>Firestore Setup</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.formCard}>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Project ID</Text>
            <View style={styles.inputRow}>
              <Globe size={20} color="#FFCA28" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="your-project-id"
                placeholderTextColor="#64748B"
                value={projectId}
                onChangeText={setProjectId}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>API Key</Text>
            <View style={styles.inputRow}>
              <Key size={20} color="#FFCA28" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter API key"
                placeholderTextColor="#64748B"
                value={apiKey}
                onChangeText={setApiKey}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Region (Optional)</Text>
            <View style={styles.inputRow}>
              <MapPin size={20} color="#FFCA28" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="us-central1"
                placeholderTextColor="#64748B"
                value={region}
                onChangeText={setRegion}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.testButton, testing && styles.disabledButton]}
            onPress={handleTestConnection}
            disabled={testing}
          >
            {testing ? (
              <ActivityIndicator size="small" color="#FFCA28" />
            ) : (
              <>
                <CheckCircle size={20} color="#FFCA28" />
                <Text style={styles.testButtonText}>Test Connection</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.setupButton, settingUp && styles.disabledButton]}
            onPress={handleSetupCollections}
            disabled={settingUp}
          >
            {settingUp ? (
              <ActivityIndicator size="small" color="#0F172A" />
            ) : (
              <Text style={styles.setupButtonText}>Initialize Collections</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>📊 What Gets Created</Text>
          <Text style={styles.infoText}>The following collections will be created in your Firestore database:</Text>
          <Text style={styles.collectionItem}>• users</Text>
          <Text style={styles.collectionItem}>• projects</Text>
          <Text style={styles.collectionItem}>• code</Text>
          <Text style={styles.collectionItem}>• chat_history</Text>
          <Text style={styles.collectionItem}>• integrations</Text>
          <Text style={styles.collectionItem}>• executions</Text>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, saving && styles.disabledButton]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#0F172A" />
          ) : (
            <Text style={styles.saveButtonText}>Save Settings</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

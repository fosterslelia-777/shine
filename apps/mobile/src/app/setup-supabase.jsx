
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
import { ArrowLeft, Database, Globe, Key, Shield, CheckCircle } from 'lucide-react-native';
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
    borderColor: '#3ECF8E',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  testButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3ECF8E',
    marginLeft: 8,
  },
  setupButton: {
    backgroundColor: '#3ECF8E',
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
    backgroundColor: '#3ECF8E',
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
  tableItem: {
    fontSize: 14,
    color: '#3ECF8E',
    marginLeft: 8,
    marginBottom: 4,
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default function SetupSupabaseScreen() {
  const router = useRouter();
  const [projectUrl, setProjectUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [serviceRoleKey, setServiceRoleKey] = useState('');
  const [testing, setTesting] = useState(false);
  const [settingUp, setSettingUp] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleBackPress = () => {
    console.log('SetupSupabaseScreen: Navigating back');
    router.back();
  };

  const handleTestConnection = async () => {
    console.log('SetupSupabaseScreen: Testing connection');
    
    if (!projectUrl || !anonKey) {
      Alert.alert('Missing Fields', 'Please enter Project URL and Anon Key');
      return;
    }

    setTesting(true);
    try {
      const response = await apiCall('/api/supabase/test-connection', {
        method: 'POST',
        body: JSON.stringify({
          projectUrl,
          anonKey,
        }),
      });

      console.log('SetupSupabaseScreen: Test connection response:', response);
      Alert.alert('Success', 'Connection successful!');
    } catch (error) {
      console.error('SetupSupabaseScreen: Test connection error:', error);
      Alert.alert('Error', error.message || 'Failed to connect to Supabase');
    } finally {
      setTesting(false);
    }
  };

  const handleSetupTables = async () => {
    console.log('SetupSupabaseScreen: Setting up tables');
    
    if (!projectUrl || !anonKey || !serviceRoleKey) {
      Alert.alert('Missing Fields', 'Please enter all fields');
      return;
    }

    setSettingUp(true);
    try {
      const response = await apiCall('/api/supabase/setup-tables', {
        method: 'POST',
        body: JSON.stringify({
          projectUrl,
          anonKey,
          serviceRoleKey,
        }),
      });

      console.log('SetupSupabaseScreen: Setup tables response:', response);
      Alert.alert('Success', 'Database schema initialized successfully!');
    } catch (error) {
      console.error('SetupSupabaseScreen: Setup tables error:', error);
      Alert.alert('Error', error.message || 'Failed to initialize database schema');
    } finally {
      setSettingUp(false);
    }
  };

  const handleSave = async () => {
    console.log('SetupSupabaseScreen: Saving settings');
    
    if (!projectUrl || !anonKey) {
      Alert.alert('Missing Fields', 'Please enter at least Project URL and Anon Key');
      return;
    }

    setSaving(true);
    try {
      const response = await apiCall('/api/settings', {
        method: 'POST',
        body: JSON.stringify({
          integration: 'supabase',
          projectUrl,
          anonKey,
          serviceRoleKey,
        }),
      });

      console.log('SetupSupabaseScreen: Save settings response:', response);
      Alert.alert('Success', 'Supabase settings saved!');
      router.back();
    } catch (error) {
      console.error('SetupSupabaseScreen: Save settings error:', error);
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
          <Database size={28} color="#3ECF8E" />
        </View>
        <Text style={styles.headerTitle}>Supabase Setup</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.formCard}>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Project URL</Text>
            <View style={styles.inputRow}>
              <Globe size={20} color="#3ECF8E" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="your-project.supabase.co"
                placeholderTextColor="#64748B"
                value={projectUrl}
                onChangeText={setProjectUrl}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Anon Key</Text>
            <View style={styles.inputRow}>
              <Key size={20} color="#3ECF8E" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter anon key"
                placeholderTextColor="#64748B"
                value={anonKey}
                onChangeText={setAnonKey}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Service Role Key</Text>
            <View style={styles.inputRow}>
              <Shield size={20} color="#3ECF8E" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter service role key"
                placeholderTextColor="#64748B"
                value={serviceRoleKey}
                onChangeText={setServiceRoleKey}
                secureTextEntry
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
              <ActivityIndicator size="small" color="#3ECF8E" />
            ) : (
              <>
                <CheckCircle size={20} color="#3ECF8E" />
                <Text style={styles.testButtonText}>Test Connection</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.setupButton, settingUp && styles.disabledButton]}
            onPress={handleSetupTables}
            disabled={settingUp}
          >
            {settingUp ? (
              <ActivityIndicator size="small" color="#0F172A" />
            ) : (
              <Text style={styles.setupButtonText}>Initialize Database Schema</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>📊 What Gets Created</Text>
          <Text style={styles.infoText}>The following tables will be created in your Supabase database:</Text>
          <Text style={styles.tableItem}>• users</Text>
          <Text style={styles.tableItem}>• projects</Text>
          <Text style={styles.tableItem}>• code_snippets</Text>
          <Text style={styles.tableItem}>• chat_history</Text>
          <Text style={styles.tableItem}>• integrations</Text>
          <Text style={styles.tableItem}>• executions</Text>
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

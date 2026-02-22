
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
import { ArrowLeft, Server, Key, Shield, MapPin, CheckCircle } from 'lucide-react-native';
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
    borderColor: '#FF9900',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  testButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF9900',
    marginLeft: 8,
  },
  setupButton: {
    backgroundColor: '#FF9900',
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
    backgroundColor: '#FF9900',
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
    color: '#FF9900',
    marginLeft: 8,
    marginBottom: 4,
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default function SetupAWSScreen() {
  const router = useRouter();
  const [accessKeyId, setAccessKeyId] = useState('');
  const [secretAccessKey, setSecretAccessKey] = useState('');
  const [region, setRegion] = useState('');
  const [testing, setTesting] = useState(false);
  const [settingUp, setSettingUp] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleBackPress = () => {
    console.log('SetupAWSScreen: Navigating back');
    router.back();
  };

  const handleTestConnection = async () => {
    console.log('SetupAWSScreen: Testing connection');
    
    if (!accessKeyId || !secretAccessKey || !region) {
      Alert.alert('Missing Fields', 'Please enter all fields');
      return;
    }

    setTesting(true);
    try {
      const response = await apiCall('/api/aws/test-connection', {
        method: 'POST',
        body: JSON.stringify({
          accessKeyId,
          secretAccessKey,
          region,
        }),
      });

      console.log('SetupAWSScreen: Test connection response:', response);
      Alert.alert('Success', 'Connection successful!');
    } catch (error) {
      console.error('SetupAWSScreen: Test connection error:', error);
      Alert.alert('Error', error.message || 'Failed to connect to AWS DynamoDB');
    } finally {
      setTesting(false);
    }
  };

  const handleSetupTables = async () => {
    console.log('SetupAWSScreen: Setting up tables');
    
    if (!accessKeyId || !secretAccessKey || !region) {
      Alert.alert('Missing Fields', 'Please enter all fields');
      return;
    }

    setSettingUp(true);
    try {
      const response = await apiCall('/api/aws/setup-tables', {
        method: 'POST',
        body: JSON.stringify({
          accessKeyId,
          secretAccessKey,
          region,
        }),
      });

      console.log('SetupAWSScreen: Setup tables response:', response);
      Alert.alert('Success', 'DynamoDB tables initialized successfully!');
    } catch (error) {
      console.error('SetupAWSScreen: Setup tables error:', error);
      Alert.alert('Error', error.message || 'Failed to initialize tables');
    } finally {
      setSettingUp(false);
    }
  };

  const handleSave = async () => {
    console.log('SetupAWSScreen: Saving settings');
    
    if (!accessKeyId || !secretAccessKey || !region) {
      Alert.alert('Missing Fields', 'Please enter all fields');
      return;
    }

    setSaving(true);
    try {
      const response = await apiCall('/api/settings', {
        method: 'POST',
        body: JSON.stringify({
          integration: 'aws',
          accessKeyId,
          secretAccessKey,
          region,
        }),
      });

      console.log('SetupAWSScreen: Save settings response:', response);
      Alert.alert('Success', 'AWS DynamoDB settings saved!');
      router.back();
    } catch (error) {
      console.error('SetupAWSScreen: Save settings error:', error);
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
          <Server size={28} color="#FF9900" />
        </View>
        <Text style={styles.headerTitle}>AWS DynamoDB Setup</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.formCard}>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Access Key ID</Text>
            <View style={styles.inputRow}>
              <Key size={20} color="#FF9900" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter access key ID"
                placeholderTextColor="#64748B"
                value={accessKeyId}
                onChangeText={setAccessKeyId}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Secret Access Key</Text>
            <View style={styles.inputRow}>
              <Shield size={20} color="#FF9900" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter secret access key"
                placeholderTextColor="#64748B"
                value={secretAccessKey}
                onChangeText={setSecretAccessKey}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Region</Text>
            <View style={styles.inputRow}>
              <MapPin size={20} color="#FF9900" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="us-east-1"
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
              <ActivityIndicator size="small" color="#FF9900" />
            ) : (
              <>
                <CheckCircle size={20} color="#FF9900" />
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
          <Text style={styles.infoText}>The following tables will be created in your DynamoDB:</Text>
          <Text style={styles.tableItem}>• Users</Text>
          <Text style={styles.tableItem}>• Projects</Text>
          <Text style={styles.tableItem}>• CodeSnippets</Text>
          <Text style={styles.tableItem}>• ChatHistory</Text>
          <Text style={styles.tableItem}>• Integrations</Text>
          <Text style={styles.tableItem}>• Executions</Text>
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

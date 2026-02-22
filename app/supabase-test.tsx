
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
import { ArrowLeft, Database, CheckCircle, XCircle, RefreshCw } from 'lucide-react-native';
import { supabase, testSupabaseConnection, PROJECT_INFO } from '@/lib/supabase';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 48 : 16,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
    marginRight: 8,
  },
  infoValue: {
    fontSize: 14,
    color: '#1A1A1A',
    flex: 1,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginBottom: 12,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
    flex: 1,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  tablesList: {
    marginTop: 8,
  },
  tableItem: {
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginBottom: 8,
  },
  tableName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  errorText: {
    fontSize: 14,
    color: '#FF3B30',
    marginTop: 8,
  },
  codeBlock: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  codeText: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#1A1A1A',
  },
});

export default function SupabaseTestScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<string>('Not tested');
  const [isConnected, setIsConnected] = useState(false);
  const [tables, setTables] = useState<string[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    console.log('Supabase Test Screen loaded');
    testConnection();
  }, []);

  const handleBackPress = () => {
    console.log('User tapped back button');
    router.back();
  };

  const testConnection = async () => {
    console.log('Testing Supabase connection...');
    setLoading(true);
    setError('');
    
    try {
      const result = await testSupabaseConnection();
      
      if (result.success) {
        setIsConnected(true);
        const statusMessage = 'Connected successfully';
        setConnectionStatus(statusMessage);
        console.log('✅ Supabase connection successful');
        
        // Try to list tables
        await listTables();
      } else {
        setIsConnected(false);
        const errorMessage = result.error || 'Unknown error';
        setConnectionStatus(errorMessage);
        setError(errorMessage);
        console.log('❌ Supabase connection failed:', errorMessage);
      }
    } catch (err) {
      setIsConnected(false);
      const errorMessage = String(err);
      setConnectionStatus(errorMessage);
      setError(errorMessage);
      console.error('❌ Connection test error:', err);
    } finally {
      setLoading(false);
    }
  };

  const listTables = async () => {
    console.log('Attempting to list Supabase tables...');
    
    try {
      // Query the information_schema to get table names
      const { data, error } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');
      
      if (error) {
        console.log('⚠️ Could not query information_schema:', error.message);
        
        // Try an alternative approach - query a known table
        const { data: testData, error: testError } = await supabase
          .from('_test')
          .select('*')
          .limit(1);
        
        if (testError) {
          if (testError.message.includes('does not exist')) {
            setTables(['No tables found or insufficient permissions']);
            console.log('ℹ️ No tables accessible or table does not exist');
          } else {
            setError(testError.message);
            console.log('⚠️ Error querying tables:', testError.message);
          }
        }
      } else if (data) {
        const tableNames = data.map((row: any) => row.table_name);
        setTables(tableNames);
        console.log('✅ Found tables:', tableNames);
      }
    } catch (err) {
      console.error('❌ Error listing tables:', err);
      setError(String(err));
    }
  };

  const handleQueryExample = async () => {
    console.log('Running example query...');
    Alert.alert(
      'Example Query',
      'To query your Supabase tables, use:\n\nconst { data, error } = await supabase\n  .from("your_table")\n  .select("*");',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <ArrowLeft size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Supabase Connection Test</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Project Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Project Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Name:</Text>
            <Text style={styles.infoValue}>{PROJECT_INFO.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>GitHub:</Text>
            <Text style={styles.infoValue} numberOfLines={1}>
              {PROJECT_INFO.githubRepo}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Supabase:</Text>
            <Text style={styles.infoValue} numberOfLines={1}>
              {PROJECT_INFO.supabaseUrl}
            </Text>
          </View>
        </View>

        {/* Connection Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connection Status</Text>
          <View style={styles.statusRow}>
            {loading ? (
              <ActivityIndicator size="small" color="#007AFF" />
            ) : isConnected ? (
              <CheckCircle size={20} color="#34C759" />
            ) : (
              <XCircle size={20} color="#FF3B30" />
            )}
            <Text
              style={[
                styles.statusText,
                { color: isConnected ? '#34C759' : '#FF3B30' },
              ]}
            >
              {connectionStatus}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={testConnection}
            disabled={loading}
          >
            <RefreshCw size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>
              {loading ? 'Testing...' : 'Test Connection'}
            </Text>
          </TouchableOpacity>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>

        {/* Tables */}
        {isConnected && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Database Tables</Text>
            {tables.length > 0 ? (
              <View style={styles.tablesList}>
                {tables.map((table, index) => (
                  <View key={index} style={styles.tableItem}>
                    <Text style={styles.tableName}>{table}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.infoValue}>
                No tables found. You may need to create tables in your Supabase dashboard.
              </Text>
            )}
          </View>
        )}

        {/* Usage Example */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How to Use Supabase</Text>
          <Text style={styles.infoValue}>
            The Supabase client is already configured and ready to use in your app.
          </Text>
          <View style={styles.codeBlock}>
            <Text style={styles.codeText}>
              {`import { supabase } from '@/lib/supabase';

// Query data
const { data, error } = await supabase
  .from('your_table')
  .select('*');

// Insert data
const { data, error } = await supabase
  .from('your_table')
  .insert({ column: 'value' });

// Update data
const { data, error } = await supabase
  .from('your_table')
  .update({ column: 'new_value' })
  .eq('id', 123);`}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#34C759', marginTop: 16 }]}
            onPress={handleQueryExample}
          >
            <Database size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>View Query Examples</Text>
          </TouchableOpacity>
        </View>

        {/* Important Note */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚠️ Important Note</Text>
          <Text style={styles.infoValue}>
            The backend API (Specular) uses its own PostgreSQL database, which is separate from your Supabase database.
          </Text>
          <Text style={[styles.infoValue, { marginTop: 8 }]}>
            To use Supabase tables, query them directly from the frontend using the Supabase client (as shown above).
          </Text>
          <Text style={[styles.infoValue, { marginTop: 8 }]}>
            If you need the backend to access Supabase, let me know and I can add that integration.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

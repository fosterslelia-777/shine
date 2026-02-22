
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Database, Github, CheckCircle, XCircle, Zap, Shield, Menu } from 'lucide-react-native';
import { useSupabase } from '@/contexts/SupabaseContext';
import Sidebar from '@/components/Sidebar';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5EB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 48 : 16,
    paddingBottom: 16,
    backgroundColor: '#FFF5EB',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuButton: {
    padding: 8,
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 6,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginLeft: 12,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  scrollContent: {
    padding: 20,
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusCardConnected: {
    borderColor: '#10B981',
  },
  statusCardDisconnected: {
    borderColor: '#EF4444',
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  statusText: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
  },
  statusUrl: {
    fontSize: 12,
    color: '#3B82F6',
    marginTop: 8,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default function WelcomeScreen() {
  const router = useRouter();
  const { isConnected, connectionStatus } = useSupabase();
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  useEffect(() => {
    console.log('WelcomeScreen: Mounted');
    console.log('WelcomeScreen: Supabase connection status:', connectionStatus);
    
    // Give Supabase a moment to connect
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [connectionStatus]);

  const handleNavigate = (route: string) => {
    console.log(`WelcomeScreen: Navigating to ${route}`);
    router.push(route as any);
  };

  const supabaseUrl = 'https://rfqmzuucqkqjmgbjjxcy.supabase.co';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => {
              console.log('WelcomeScreen: Opening sidebar');
              setSidebarVisible(true);
            }}
          >
            <Menu size={24} color="#1C1C1E" />
          </TouchableOpacity>
          <Image
            source={{
              uri: 'https://image2url.com/r2/default/images/1767183581317-68102f31-454b-45f6-9d39-025ce8604ac3.png',
            }}
            style={styles.logo}
          />
          <Text style={styles.headerTitle}>Natively</Text>
        </View>
      </View>
      <Text style={styles.headerSubtitle}>Your React Native Development Platform</Text>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.statusCard,
            isConnected ? styles.statusCardConnected : styles.statusCardDisconnected,
          ]}
        >
          <View style={styles.statusHeader}>
            <View
              style={[
                styles.statusIconCircle,
                {
                  backgroundColor: isConnected
                    ? 'rgba(16, 185, 129, 0.2)'
                    : 'rgba(239, 68, 68, 0.2)',
                },
              ]}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#8E8E93" />
              ) : isConnected ? (
                <CheckCircle size={24} color="#10B981" />
              ) : (
                <XCircle size={24} color="#EF4444" />
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.statusTitle}>Supabase Connection</Text>
            </View>
          </View>
          <Text style={styles.statusText}>
            {isLoading ? 'Testing connection...' : connectionStatus}
          </Text>
          <Text style={styles.statusUrl}>{supabaseUrl}</Text>
        </View>

        <TouchableOpacity
          style={[styles.card, { borderColor: '#10B981' }]}
          onPress={() => handleNavigate('/github')}
        >
          <View style={styles.cardHeader}>
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(16, 185, 129, 0.2)' }]}>
              <Github size={24} color="#10B981" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>GitHub Sync</Text>
            </View>
          </View>
          <Text style={styles.cardDescription}>
            Configure your GitHub repository and sync your project files automatically.
          </Text>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Configure GitHub</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, { borderColor: '#3B82F6' }]}
          onPress={() => handleNavigate('/yada')}
        >
          <View style={styles.cardHeader}>
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(59, 130, 246, 0.2)' }]}>
              <Zap size={24} color="#3B82F6" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Yada AI Assistant</Text>
            </View>
          </View>
          <Text style={styles.cardDescription}>
            Build React Native apps with AI assistance. Generate components and features.
          </Text>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Start Building</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, { borderColor: '#8B5CF6' }]}
          onPress={() => handleNavigate('/gnosis')}
        >
          <View style={styles.cardHeader}>
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(139, 92, 246, 0.2)' }]}>
              <Shield size={24} color="#8B5CF6" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Gnosis Knowledge Base</Text>
            </View>
          </View>
          <Text style={styles.cardDescription}>
            Access your knowledge base and have conversations about code and learning.
          </Text>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Explore Knowledge</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      <Sidebar visible={sidebarVisible} onClose={() => {
        console.log('WelcomeScreen: Closing sidebar');
        setSidebarVisible(false);
      }} />
    </SafeAreaView>
  );
}

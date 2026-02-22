
import { Shield, Lock, Zap, Github, Menu, Database } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
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
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#F5F5F7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: '#8E8E93',
  },
});

export default function DashboardScreen() {
  const router = useRouter();
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const handleNavigate = (route: string) => {
    console.log(`DashboardScreen: Navigating to ${route}`);
    router.push(route as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => {
              console.log('DashboardScreen: Opening sidebar');
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
          <Text style={styles.headerTitle}>Dashboard</Text>
        </View>
      </View>
      <Text style={styles.headerSubtitle}>Multi-Tenant Architecture</Text>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={[styles.card, { borderColor: '#06B6D4' }]}
          onPress={() => handleNavigate('/supabase-test')}
        >
          <View style={styles.cardHeader}>
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(6, 182, 212, 0.2)' }]}>
              <Database size={24} color="#06B6D4" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Supabase Connection</Text>
            </View>
          </View>
          <Text style={styles.cardDescription}>
            Test your Supabase connection and view database schema. Your Supabase credentials are configured and ready to use.
          </Text>
          <View style={styles.tagContainer}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>Database</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>Connected</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>Schema</Text>
            </View>
          </View>
        </TouchableOpacity>

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
            Sync your project files to GitHub repository. Configure your repository settings and enable automatic synchronization.
          </Text>
          <View style={styles.tagContainer}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>Version Control</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>Auto Sync</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>Backup</Text>
            </View>
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
            Build React Native apps with AI assistance. Chat with Yada to generate components, screens, and features.
          </Text>
          <View style={styles.tagContainer}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>AI Powered</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>Code Generation</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>React Native</Text>
            </View>
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
            Access your knowledge base and have conversations about general topics, code explanations, and learning.
          </Text>
          <View style={styles.tagContainer}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>General Knowledge</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>Learning</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>Brainstorming</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, { borderColor: '#F59E0B' }]}
          onPress={() => handleNavigate('/api-docs')}
        >
          <View style={styles.cardHeader}>
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(245, 158, 11, 0.2)' }]}>
              <Lock size={24} color="#F59E0B" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>API Documentation</Text>
            </View>
          </View>
          <Text style={styles.cardDescription}>
            View all available API endpoints, request/response formats, and integration examples.
          </Text>
          <View style={styles.tagContainer}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>REST API</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>Documentation</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>Integration</Text>
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>

      <Sidebar visible={sidebarVisible} onClose={() => {
        console.log('DashboardScreen: Closing sidebar');
        setSidebarVisible(false);
      }} />
    </SafeAreaView>
  );
}

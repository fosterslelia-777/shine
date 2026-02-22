
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Shield, Lock, Zap } from 'lucide-react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 48 : 60,
    paddingBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#94A3B8',
    lineHeight: 24,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
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
    marginBottom: 16,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardIconGreen: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
  },
  cardText: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 20,
    marginBottom: 12,
  },
  numberedItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  numberCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  numberText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 20,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonGreen: {
    backgroundColor: '#10B981',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  backendCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  backendCardSupabase: {
    borderColor: '#3ECF8E',
  },
  backendCardFirestore: {
    borderColor: '#FFCA28',
  },
  backendCardAWS: {
    borderColor: '#FF9900',
  },
  backendIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  backendIconSupabase: {
    backgroundColor: 'rgba(62, 207, 142, 0.2)',
  },
  backendIconFirestore: {
    backgroundColor: 'rgba(255, 202, 40, 0.2)',
  },
  backendIconAWS: {
    backgroundColor: 'rgba(255, 153, 0, 0.2)',
  },
  backendTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  backendDescription: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 20,
    marginBottom: 16,
  },
  backendFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  backendBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
    marginLeft: 6,
  },
  githubCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  githubIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  githubContent: {
    flex: 1,
  },
  githubTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  githubDescription: {
    fontSize: 14,
    color: '#94A3B8',
  },
  actionsCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
  },
  actionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  actionsIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  actionItem: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 24,
    paddingLeft: 16,
  },
});

export default function DashboardScreen() {
  const router = useRouter();

  const handleNavigate = (route) => {
    console.log('DashboardScreen: Navigating to', route);
    router.push(route);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Multi-Tenant Architecture</Text>
          <Text style={styles.subtitle}>
            Each user gets their own isolated backend environment
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={[styles.cardIcon, styles.cardIconGreen]}>
                <Shield size={24} color="#10B981" />
              </View>
              <Text style={styles.cardTitle}>🔗 How Users Build & Connect</Text>
            </View>

            <View style={styles.numberedItem}>
              <View style={styles.numberCircle}>
                <Text style={styles.numberText}>1</Text>
              </View>
              <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>Frontend Freedom</Text>
                <Text style={styles.itemDescription}>
                  Build your React Native app with complete control over UI and logic
                </Text>
              </View>
            </View>

            <View style={styles.numberedItem}>
              <View style={styles.numberCircle}>
                <Text style={styles.numberText}>2</Text>
              </View>
              <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>Database Choice</Text>
                <Text style={styles.itemDescription}>
                  Connect to Supabase, Firestore, or DynamoDB with your own credentials
                </Text>
              </View>
            </View>

            <View style={styles.numberedItem}>
              <View style={styles.numberCircle}>
                <Text style={styles.numberText}>3</Text>
              </View>
              <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>OAuth & Integrations</Text>
                <Text style={styles.itemDescription}>
                  Add Google, Apple, GitHub auth with your own OAuth apps
                </Text>
              </View>
            </View>

            <View style={styles.numberedItem}>
              <View style={styles.numberCircle}>
                <Text style={styles.numberText}>4</Text>
              </View>
              <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>Code Preview</Text>
                <Text style={styles.itemDescription}>
                  View and edit generated code in real-time
                </Text>
              </View>
            </View>

            <View style={styles.numberedItem}>
              <View style={styles.numberCircle}>
                <Text style={styles.numberText}>5</Text>
              </View>
              <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>Security & Separation</Text>
                <Text style={styles.itemDescription}>
                  Your data stays in your database, completely isolated from other users
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.button, styles.buttonGreen]}
            onPress={() => handleNavigate('/api-docs')}
          >
            <Text style={styles.buttonText}>📖 View API Documentation</Text>
          </TouchableOpacity>

          <Text style={[styles.cardTitle, { marginBottom: 16, marginTop: 8 }]}>
            Backend Options
          </Text>

          <TouchableOpacity
            style={[styles.backendCard, styles.backendCardSupabase]}
            onPress={() => handleNavigate('/setup-supabase')}
          >
            <View style={[styles.backendIconCircle, styles.backendIconSupabase]}>
              <Text style={{ fontSize: 32 }}>🗄️</Text>
            </View>
            <Text style={styles.backendTitle}>Supabase</Text>
            <Text style={styles.backendDescription}>
              PostgreSQL database with real-time subscriptions and built-in auth
            </Text>
            <View style={styles.backendFooter}>
              <View style={styles.backendBadge}>
                <Lock size={14} color="#10B981" />
                <Text style={styles.backendBadgeText}>Row-level isolation</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.backendCard, styles.backendCardFirestore]}
            onPress={() => handleNavigate('/setup-firestore')}
          >
            <View style={[styles.backendIconCircle, styles.backendIconFirestore]}>
              <Text style={{ fontSize: 32 }}>🔥</Text>
            </View>
            <Text style={styles.backendTitle}>Firestore</Text>
            <Text style={styles.backendDescription}>
              NoSQL document database with real-time sync and offline support
            </Text>
            <View style={styles.backendFooter}>
              <View style={styles.backendBadge}>
                <Lock size={14} color="#10B981" />
                <Text style={styles.backendBadgeText}>Collection-level isolation</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.backendCard, styles.backendCardAWS]}
            onPress={() => handleNavigate('/setup-aws')}
          >
            <View style={[styles.backendIconCircle, styles.backendIconAWS]}>
              <Text style={{ fontSize: 32 }}>☁️</Text>
            </View>
            <Text style={styles.backendTitle}>AWS DynamoDB</Text>
            <Text style={styles.backendDescription}>
              Serverless NoSQL database with unlimited scalability
            </Text>
            <View style={styles.backendFooter}>
              <View style={styles.backendBadge}>
                <Lock size={14} color="#10B981" />
                <Text style={styles.backendBadgeText}>Partition-key isolation</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.githubCard}
            onPress={() => handleNavigate('/github')}
          >
            <View style={styles.githubIcon}>
              <Text style={{ fontSize: 24 }}>🐙</Text>
            </View>
            <View style={styles.githubContent}>
              <Text style={styles.githubTitle}>GitHub Integration</Text>
              <Text style={styles.githubDescription}>
                Private repo sync with user-scoped tokens
              </Text>
            </View>
            <View style={styles.backendBadge}>
              <Shield size={14} color="#10B981" />
            </View>
          </TouchableOpacity>

          <View style={styles.actionsCard}>
            <View style={styles.actionsHeader}>
              <View style={styles.actionsIconCircle}>
                <Zap size={24} color="#F59E0B" />
              </View>
              <Text style={styles.actionsTitle}>User-Scoped Actions</Text>
            </View>
            <Text style={styles.actionItem}>• Create namespaced tables</Text>
            <Text style={styles.actionItem}>• Deploy isolated functions</Text>
            <Text style={styles.actionItem}>• Manage user-specific API keys</Text>
            <Text style={styles.actionItem}>• Configure custom domains</Text>
            <Text style={styles.actionItem}>• Monitor usage & analytics</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

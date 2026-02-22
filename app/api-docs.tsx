
import { useRouter } from 'expo-router';
import React from 'react';
import { ArrowLeft, Book } from 'lucide-react-native';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
} from 'react-native';

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
  bookIcon: {
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 24,
    marginBottom: 16,
  },
  endpointCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  methodBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  methodBadgeGET: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  methodBadgePOST: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
  },
  methodText: {
    fontSize: 12,
    fontWeight: '600',
  },
  methodTextGET: {
    color: '#10B981',
  },
  methodTextPOST: {
    color: '#3B82F6',
  },
  endpointPath: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
    marginBottom: 8,
  },
  endpointDescription: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 20,
  },
  codeBlock: {
    backgroundColor: '#0F172A',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  codeText: {
    fontSize: 12,
    color: '#E2E8F0',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
});

export default function ApiDocsScreen() {
  const router = useRouter();

  const handleBackPress = () => {
    console.log('ApiDocsScreen: Back button pressed');
    router.back();
  };

  const MethodBadge = ({ method }: { method: string }) => {
    const isGET = method === 'GET';
    const badgeStyle = isGET ? styles.methodBadgeGET : styles.methodBadgePOST;
    const textStyle = isGET ? styles.methodTextGET : styles.methodTextPOST;

    return (
      <View style={[styles.methodBadge, badgeStyle]}>
        <Text style={[styles.methodText, textStyle]}>{method}</Text>
      </View>
    );
  };

  const EndpointCard = ({
    method,
    path,
    description,
    requestExample,
    responseExample,
  }: {
    method: string;
    path: string;
    description: string;
    requestExample?: string;
    responseExample?: string;
  }) => (
    <View style={styles.endpointCard}>
      <MethodBadge method={method} />
      <Text style={styles.endpointPath}>{path}</Text>
      <Text style={styles.endpointDescription}>{description}</Text>
      {requestExample && (
        <View style={styles.codeBlock}>
          <Text style={styles.codeText}>{requestExample}</Text>
        </View>
      )}
      {responseExample && (
        <View style={styles.codeBlock}>
          <Text style={styles.codeText}>{responseExample}</Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.bookIcon}>
          <Book size={28} color="#10B981" />
        </View>
        <Text style={styles.headerTitle}>API Documentation</Text>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>GitHub Endpoints</Text>

        <EndpointCard
          method="GET"
          path="/api/github/setup"
          description="Get current GitHub settings for the authenticated user"
          responseExample={`{
  "githubToken": "****",
  "repoOwner": "username",
  "repoName": "repo-name",
  "autoSync": false,
  "lastSync": "2026-01-26T12:00:00Z"
}`}
        />

        <EndpointCard
          method="POST"
          path="/api/github/setup"
          description="Save or update GitHub configuration and test connection"
          requestExample={`{
  "githubToken": "ghp_xxx",
  "repoOwner": "username",
  "repoName": "repo-name",
  "autoSync": true
}`}
          responseExample={`{
  "success": true,
  "message": "GitHub connected successfully"
}`}
        />

        <EndpointCard
          method="GET"
          path="/api/github/get-files"
          description="Get list of files that will be synced to GitHub"
          responseExample={`[
  {
    "path": "projects/uuid.json",
    "name": "Project Name",
    "size": 1024
  }
]`}
        />

        <EndpointCard
          method="POST"
          path="/api/github/sync"
          description="Sync all project files to the configured GitHub repository"
          requestExample="{}"
          responseExample={`{
  "success": true,
  "filesSynced": 5,
  "filesFailed": 0,
  "message": "Successfully synced 5 files"
}`}
        />

        <Text style={styles.sectionTitle}>Projects Endpoints</Text>

        <EndpointCard
          method="GET"
          path="/api/projects"
          description="Get all projects for the authenticated user"
          responseExample={`[
  {
    "id": "uuid",
    "name": "Project Name",
    "description": "Description",
    "type": "web",
    "created_at": "2026-01-26T12:00:00Z"
  }
]`}
        />

        <EndpointCard
          method="GET"
          path="/api/projects/{id}"
          description="Get a specific project by ID"
          responseExample={`{
  "id": "uuid",
  "name": "Project Name",
  "description": "Description",
  "type": "web",
  "created_at": "2026-01-26T12:00:00Z"
}`}
        />

        <Text style={styles.sectionTitle}>Authentication</Text>

        <EndpointCard
          method="POST"
          path="/api/auth/*"
          description="Better Auth endpoints for authentication (email/password, Google, Apple OAuth)"
          requestExample="See Better Auth documentation"
          responseExample="Varies by endpoint"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

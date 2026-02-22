
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Book } from 'lucide-react-native';

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
    backgroundColor: '#1E293B',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerIcon: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  categorySection: {
    marginBottom: 32,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#10B981',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  endpointCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  endpointHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  methodBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 12,
  },
  methodBadgePost: {
    backgroundColor: '#10B981',
  },
  methodBadgeGet: {
    backgroundColor: '#3B82F6',
  },
  methodBadgePut: {
    backgroundColor: '#F59E0B',
  },
  methodBadgeDelete: {
    backgroundColor: '#EF4444',
  },
  methodText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  endpointPath: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
    flex: 1,
  },
  endpointDescription: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 20,
    marginBottom: 12,
  },
  codeBlockContainer: {
    backgroundColor: '#0F172A',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  codeBlockTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
    marginBottom: 8,
  },
  codeText: {
    fontSize: 12,
    color: '#E2E8F0',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    lineHeight: 18,
  },
  codeKeyword: {
    color: '#10B981',
  },
  codeString: {
    color: '#3B82F6',
  },
});

export default function ApiDocsScreen() {
  const router = useRouter();

  const handleBackPress = () => {
    console.log('ApiDocsScreen: Navigating back');
    router.back();
  };

  const MethodBadge = ({ method }) => {
    let badgeStyle = styles.methodBadgeGet;
    
    if (method === 'POST') {
      badgeStyle = styles.methodBadgePost;
    } else if (method === 'PUT') {
      badgeStyle = styles.methodBadgePut;
    } else if (method === 'DELETE') {
      badgeStyle = styles.methodBadgeDelete;
    }

    return (
      <View style={[styles.methodBadge, badgeStyle]}>
        <Text style={styles.methodText}>{method}</Text>
      </View>
    );
  };

  const EndpointCard = ({ method, path, description, requestExample, responseExample }) => (
    <View style={styles.endpointCard}>
      <View style={styles.endpointHeader}>
        <MethodBadge method={method} />
        <Text style={styles.endpointPath}>{path}</Text>
      </View>
      
      <Text style={styles.endpointDescription}>{description}</Text>

      {requestExample && (
        <View style={styles.codeBlockContainer}>
          <Text style={styles.codeBlockTitle}>Request Example:</Text>
          <Text style={styles.codeText}>{requestExample}</Text>
        </View>
      )}

      {responseExample && (
        <View style={styles.codeBlockContainer}>
          <Text style={styles.codeBlockTitle}>Response Example:</Text>
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
        <Book size={24} color="#10B981" style={styles.headerIcon} />
        <Text style={styles.headerTitle}>API Documentation</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.categorySection}>
          <Text style={styles.categoryTitle}>USER ENDPOINTS</Text>
          
          <EndpointCard
            method="POST"
            path="/api/user/{userId}/provision"
            description="Provision a new user environment with isolated resources and database setup."
            requestExample={`{
  "userId": "user_123",
  "email": "user@example.com",
  "plan": "free"
}`}
            responseExample={`{
  "success": true,
  "userId": "user_123",
  "environment": "provisioned"
}`}
          />

          <EndpointCard
            method="GET"
            path="/api/user/{userId}/data"
            description="Retrieve user-specific data including projects, settings, and usage statistics."
            responseExample={`{
  "userId": "user_123",
  "projects": [...],
  "settings": {...},
  "usage": {...}
}`}
          />

          <EndpointCard
            method="POST"
            path="/api/user/{userId}/oauth"
            description="Configure OAuth integrations for user-scoped authentication with external services."
            requestExample={`{
  "provider": "github",
  "accessToken": "ghp_...",
  "scopes": ["repo", "user"]
}`}
            responseExample={`{
  "success": true,
  "provider": "github",
  "connected": true
}`}
          />

          <EndpointCard
            method="POST"
            path="/api/user/{userId}/sandbox"
            description="Execute code in a sandboxed environment with user-scoped isolation."
            requestExample={`{
  "code": "console.log('Hello');",
  "language": "javascript",
  "timeout": 5000
}`}
            responseExample={`{
  "output": "Hello",
  "executionTime": 45,
  "success": true
}`}
          />
        </View>

        <View style={styles.categorySection}>
          <Text style={styles.categoryTitle}>YADA ENDPOINTS</Text>
          
          <EndpointCard
            method="POST"
            path="/api/yada/chat"
            description="Send a message to Yada AI for code generation and assistance."
            requestExample={`{
  "message": "Build a todo app",
  "projectId": "proj_123",
  "conversationHistory": [...]
}`}
            responseExample={`{
  "response": "I'll help you...",
  "projectId": "proj_123",
  "codeGenerated": true
}`}
          />

          <EndpointCard
            method="POST"
            path="/api/yada/projects"
            description="Create a new project with AI-generated code structure."
            requestExample={`{
  "name": "My Todo App",
  "description": "A simple todo list",
  "type": "mobile"
}`}
            responseExample={`{
  "projectId": "proj_123",
  "name": "My Todo App",
  "createdAt": "2024-01-15T10:30:00Z"
}`}
          />

          <EndpointCard
            method="GET"
            path="/api/yada/code-snippets/{projectId}"
            description="Retrieve all code snippets generated for a specific project."
            responseExample={`{
  "projectId": "proj_123",
  "snippets": [
    {
      "id": "snip_1",
      "filename": "App.tsx",
      "content": "...",
      "language": "typescript"
    }
  ]
}`}
          />

          <EndpointCard
            method="GET"
            path="/api/yada/history/{projectId}"
            description="Get conversation history and code generation timeline for a project."
            responseExample={`{
  "projectId": "proj_123",
  "history": [
    {
      "timestamp": "2024-01-15T10:30:00Z",
      "message": "Build a todo app",
      "response": "..."
    }
  ]
}`}
          />
        </View>

        <View style={styles.categorySection}>
          <Text style={styles.categoryTitle}>DATABASE ENDPOINTS</Text>
          
          <EndpointCard
            method="POST"
            path="/api/supabase/setup-tables"
            description="Initialize Supabase database schema with required tables for user projects."
            requestExample={`{
  "projectUrl": "https://xxx.supabase.co",
  "serviceKey": "eyJ..."
}`}
            responseExample={`{
  "success": true,
  "tablesCreated": ["users", "projects", "code_snippets"],
  "message": "Database initialized"
}`}
          />

          <EndpointCard
            method="POST"
            path="/api/supabase/test-connection"
            description="Test connection to Supabase database with provided credentials."
            requestExample={`{
  "projectUrl": "https://xxx.supabase.co",
  "anonKey": "eyJ..."
}`}
            responseExample={`{
  "success": true,
  "connected": true,
  "latency": 45
}`}
          />

          <EndpointCard
            method="POST"
            path="/api/firestore/setup"
            description="Configure Firestore database with collections and security rules."
            requestExample={`{
  "projectId": "my-project",
  "apiKey": "AIza...",
  "region": "us-central1"
}`}
            responseExample={`{
  "success": true,
  "collectionsCreated": ["users", "projects"],
  "rulesApplied": true
}`}
          />

          <EndpointCard
            method="POST"
            path="/api/aws/setup"
            description="Set up AWS DynamoDB tables with proper indexes and permissions."
            requestExample={`{
  "accessKeyId": "AKIA...",
  "secretAccessKey": "...",
  "region": "us-east-1"
}`}
            responseExample={`{
  "success": true,
  "tablesCreated": ["Users", "Projects"],
  "region": "us-east-1"
}`}
          />
        </View>

        <View style={styles.categorySection}>
          <Text style={styles.categoryTitle}>GITHUB ENDPOINTS</Text>
          
          <EndpointCard
            method="POST"
            path="/api/github/setup"
            description="Configure GitHub integration with personal access token and repository details."
            requestExample={`{
  "githubToken": "ghp_...",
  "repoOwner": "username",
  "repoName": "my-repo",
  "autoSync": true
}`}
            responseExample={`{
  "success": true,
  "connected": true,
  "repository": "username/my-repo"
}`}
          />

          <EndpointCard
            method="POST"
            path="/api/github/sync"
            description="Synchronize generated code files to configured GitHub repository."
            requestExample={`{
  "projectId": "proj_123",
  "commitMessage": "Update from Yada"
}`}
            responseExample={`{
  "success": true,
  "filesSynced": 12,
  "commitSha": "abc123...",
  "url": "https://github.com/..."
}`}
          />

          <EndpointCard
            method="GET"
            path="/api/github/get-files"
            description="Retrieve list of files from the connected GitHub repository."
            responseExample={`{
  "files": [
    {
      "path": "src/App.tsx",
      "name": "App.tsx",
      "content": "...",
      "sha": "abc123"
    }
  ],
  "totalFiles": 25
}`}
          />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

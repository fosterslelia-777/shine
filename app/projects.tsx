
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
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Folder, Clock, Eye, MoreVertical } from 'lucide-react-native';
import { apiCall } from '@/utils/api';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5EB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 48 : 16,
    paddingBottom: 16,
    backgroundColor: '#FFF5EB',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginLeft: 16,
  },
  scrollContent: {
    padding: 16,
  },
  projectCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E5E7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5F5F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  projectName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  projectDescription: {
    fontSize: 13,
    color: '#8E8E93',
  },
  moreButton: {
    padding: 4,
  },
  cardMetadata: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metadataText: {
    fontSize: 12,
    color: '#8E8E93',
    marginLeft: 4,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#F5F5F7',
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  previewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1C1C1E',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  previewButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#1C1C1E',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
});

interface Project {
  id: string;
  name: string;
  description: string;
  lastModified: string;
  type: string;
}

export default function ProjectsScreen() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('ProjectsScreen: Loading projects');
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('ProjectsScreen: Fetching projects from API');
      const data = await apiCall('/api/projects');
      console.log('ProjectsScreen: Projects loaded', data);
      setProjects(data);
    } catch (error: any) {
      console.error('ProjectsScreen: Error loading projects', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackPress = () => {
    console.log('ProjectsScreen: Back button pressed');
    router.back();
  };

  const handleProjectPress = (projectId: string) => {
    console.log('ProjectsScreen: Project card tapped', projectId);
    router.push('/preview');
  };

  const handlePreviewPress = (projectId: string) => {
    console.log('ProjectsScreen: Preview button pressed', projectId);
    router.push('/preview');
  };

  const handleMorePress = (projectId: string) => {
    console.log('ProjectsScreen: More options pressed', projectId);
  };

  const renderProjectCard = (project: Project) => {
    const lastModifiedText = project.lastModified;
    const typeText = project.type;

    return (
      <TouchableOpacity
        key={project.id}
        style={styles.projectCard}
        onPress={() => handleProjectPress(project.id)}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <View style={styles.iconCircle}>
            <Folder size={24} color="#8E8E93" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.projectName}>{project.name}</Text>
            <Text style={styles.projectDescription}>{project.description}</Text>
          </View>
          <TouchableOpacity
            style={styles.moreButton}
            onPress={() => handleMorePress(project.id)}
          >
            <MoreVertical size={20} color="#8E8E93" />
          </TouchableOpacity>
        </View>

        <View style={styles.cardMetadata}>
          <View style={styles.metadataItem}>
            <Clock size={14} color="#8E8E93" />
            <Text style={styles.metadataText}>{lastModifiedText}</Text>
          </View>
          <View style={styles.typeBadge}>
            <Text style={styles.typeBadgeText}>{typeText}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.previewButton}
          onPress={() => handlePreviewPress(project.id)}
        >
          <Eye size={16} color="#FFFFFF" />
          <Text style={styles.previewButtonText}>Preview</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <ArrowLeft size={24} color="#1C1C1E" />
          </TouchableOpacity>
          <Text style={styles.title}>My Projects</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1C1C1E" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <ArrowLeft size={24} color="#1C1C1E" />
          </TouchableOpacity>
          <Text style={styles.title}>My Projects</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Failed to load projects: {error}
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadProjects}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <ArrowLeft size={24} color="#1C1C1E" />
        </TouchableOpacity>
        <Text style={styles.title}>My Projects</Text>
      </View>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {projects.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No projects yet. Create your first project to get started!
            </Text>
          </View>
        ) : (
          projects.map((project) => renderProjectCard(project))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

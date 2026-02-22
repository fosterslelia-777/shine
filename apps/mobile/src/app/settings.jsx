
import React, { useState } from 'react';
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
import { ArrowLeft } from 'lucide-react-native';

const AI_MODELS = {
  google: [
    {
      id: 'gemini-2.5-flash',
      name: 'Gemini 2.5 Flash',
      icon: '⚡',
      badge: 'Fastest',
      description: 'Lightning-fast responses for quick tasks',
      color: '#4285F4',
    },
    {
      id: 'gemini-2.5-pro',
      name: 'Gemini 2.5 Pro',
      icon: '🎯',
      badge: 'Balanced',
      description: 'Best balance of speed and quality',
      color: '#4285F4',
    },
    {
      id: 'gemini-3.0-pro',
      name: 'Gemini 3.0 Pro',
      icon: '🚀',
      badge: 'Latest',
      description: 'Most advanced model with cutting-edge capabilities',
      color: '#4285F4',
    },
  ],
  openai: [
    {
      id: 'gpt-4-turbo',
      name: 'GPT-4 Turbo',
      icon: '⚡',
      badge: 'Fast',
      description: 'Optimized GPT-4 with faster response times',
      color: '#10A37F',
    },
    {
      id: 'gpt-5.2',
      name: 'GPT-5.2',
      icon: '🧠',
      badge: 'Powerful',
      description: 'Most capable OpenAI model for complex tasks',
      color: '#10A37F',
    },
  ],
  anthropic: [
    {
      id: 'claude-3-haiku',
      name: 'Claude 3 Haiku',
      icon: '⚡',
      badge: 'Fast',
      description: 'Quick and efficient for everyday tasks',
      color: '#D97757',
    },
    {
      id: 'claude-3-sonnet',
      name: 'Claude 3 Sonnet',
      icon: '🎯',
      badge: 'Balanced',
      description: 'Great balance of intelligence and speed',
      color: '#D97757',
    },
    {
      id: 'claude-3-opus',
      name: 'Claude 3 Opus',
      icon: '🚀',
      badge: 'Best',
      description: 'Most powerful Claude model for complex reasoning',
      color: '#D97757',
    },
  ],
};

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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginLeft: 16,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  currentModelCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  currentModelLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 1,
    marginBottom: 8,
  },
  currentModelName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  currentModelBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  currentModelBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  currentModelDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
    marginBottom: 8,
  },
  currentModelProvider: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 16,
  },
  providerSection: {
    marginBottom: 32,
  },
  providerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  providerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  providerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  modelCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E5E5EA',
  },
  modelCardSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#F0F8FF',
  },
  modelCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  modelIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  modelInfo: {
    flex: 1,
  },
  modelName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 2,
  },
  modelBadge: {
    backgroundColor: '#E5E5EA',
    borderRadius: 8,
    paddingVertical: 2,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
  },
  modelBadgeSelected: {
    backgroundColor: '#007AFF',
  },
  modelBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666666',
  },
  modelBadgeTextSelected: {
    color: '#FFFFFF',
  },
  modelDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  checkmark: {
    fontSize: 20,
    color: '#007AFF',
  },
});

export default function SettingsScreen() {
  const router = useRouter();
  const [selectedModel, setSelectedModel] = useState('gemini-2.5-pro');

  const handleSelectModel = (modelId) => {
    console.log('SettingsScreen: Selected model:', modelId);
    setSelectedModel(modelId);
  };

  const getCurrentModel = () => {
    for (const provider in AI_MODELS) {
      const model = AI_MODELS[provider].find((m) => m.id === selectedModel);
      if (model) {
        return { ...model, provider };
      }
    }
    return null;
  };

  const currentModel = getCurrentModel();

  const renderModelCard = (model) => {
    const isSelected = selectedModel === model.id;

    return (
      <TouchableOpacity
        key={model.id}
        style={[styles.modelCard, isSelected && styles.modelCardSelected]}
        onPress={() => handleSelectModel(model.id)}
      >
        <View style={styles.modelCardHeader}>
          <Text style={styles.modelIcon}>{model.icon}</Text>
          <View style={styles.modelInfo}>
            <Text style={styles.modelName}>{model.name}</Text>
            <View
              style={[styles.modelBadge, isSelected && styles.modelBadgeSelected]}
            >
              <Text
                style={[
                  styles.modelBadgeText,
                  isSelected && styles.modelBadgeTextSelected,
                ]}
              >
                {model.badge}
              </Text>
            </View>
          </View>
          {isSelected && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text style={styles.modelDescription}>{model.description}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#1C1C1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {currentModel && (
          <View
            style={[
              styles.currentModelCard,
              { backgroundColor: currentModel.color },
            ]}
          >
            <Text style={styles.currentModelLabel}>CURRENTLY ACTIVE</Text>
            <Text style={styles.currentModelName}>{currentModel.name}</Text>
            <View style={styles.currentModelBadge}>
              <Text style={styles.currentModelBadgeText}>
                {currentModel.badge}
              </Text>
            </View>
            <Text style={styles.currentModelDescription}>
              {currentModel.description}
            </Text>
            <Text style={styles.currentModelProvider}>
              Provider: {currentModel.provider.toUpperCase()}
            </Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>AI Model Selection</Text>

        <View style={styles.providerSection}>
          <View style={styles.providerHeader}>
            <View style={[styles.providerDot, { backgroundColor: '#4285F4' }]} />
            <Text style={styles.providerName}>Google</Text>
          </View>
          {AI_MODELS.google.map((model) => renderModelCard(model))}
        </View>

        <View style={styles.providerSection}>
          <View style={styles.providerHeader}>
            <View style={[styles.providerDot, { backgroundColor: '#10A37F' }]} />
            <Text style={styles.providerName}>OpenAI</Text>
          </View>
          {AI_MODELS.openai.map((model) => renderModelCard(model))}
        </View>

        <View style={styles.providerSection}>
          <View style={styles.providerHeader}>
            <View style={[styles.providerDot, { backgroundColor: '#D97757' }]} />
            <Text style={styles.providerName}>Anthropic</Text>
          </View>
          {AI_MODELS.anthropic.map((model) => renderModelCard(model))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

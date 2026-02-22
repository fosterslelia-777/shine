
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
import { Menu, Code2, MessageCircle } from 'lucide-react-native';
import Sidebar from '@/components/Sidebar';

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
  },
  menuButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1C1C1E',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    marginBottom: 20,
  },
  logoImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#666666',
  },
  yadaCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#1C1C1E',
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  gnosisCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#3B82F6',
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  architectureCard: {
    backgroundColor: '#0F172A',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#10B981',
    padding: 24,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1C1C1E',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  cardIconCircleBlue: {
    backgroundColor: '#3B82F6',
  },
  cardIconCircleGreen: {
    backgroundColor: '#10B981',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1C1E',
    flex: 1,
  },
  cardTitleWhite: {
    color: '#FFFFFF',
  },
  cardDescription: {
    fontSize: 15,
    color: '#666666',
    lineHeight: 22,
    marginBottom: 16,
  },
  cardDescriptionLight: {
    color: '#94A3B8',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#F0F0F0',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tagDark: {
    backgroundColor: '#1E293B',
  },
  tagText: {
    fontSize: 13,
    color: '#1C1C1E',
    fontWeight: '500',
  },
  tagTextLight: {
    color: '#94A3B8',
  },
  emojiIcon: {
    fontSize: 32,
  },
});

export default function WelcomeScreen() {
  const router = useRouter();
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const handleMenuPress = () => {
    console.log('WelcomeScreen: Opening sidebar');
    setSidebarVisible(true);
  };

  const handleCloseSidebar = () => {
    console.log('WelcomeScreen: Closing sidebar');
    setSidebarVisible(false);
  };

  const handleYadaPress = () => {
    console.log('WelcomeScreen: Navigating to Yada');
    router.push('/yada');
  };

  const handleGnosisPress = () => {
    console.log('WelcomeScreen: Navigating to Gnosis');
    router.push('/gnosis');
  };

  const handleArchitecturePress = () => {
    console.log('WelcomeScreen: Navigating to Dashboard');
    router.push('/dashboard');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={handleMenuPress}>
          <Menu size={28} color="#1C1C1E" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Image
              source={{ uri: 'https://image2url.com/r2/default/images/1767183581317-68102f31-454b-45f6-9d39-025ce8604ac3.png' }}
              style={styles.logoImage}
              resizeMode="cover"
            />
          </View>
          <Text style={styles.welcomeTitle}>Welcome to Yada</Text>
          <Text style={styles.welcomeSubtitle}>Choose your AI companion</Text>
        </View>

        <TouchableOpacity style={styles.yadaCard} onPress={handleYadaPress} activeOpacity={0.7}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIconCircle}>
              <Code2 size={32} color="#FFFFFF" />
            </View>
            <Text style={styles.cardTitle}>Yada Coding Agent</Text>
          </View>
          
          <Text style={styles.cardDescription}>
            Build full-stack applications with AI assistance. Yada helps you create mobile apps, web apps, and APIs with intelligent code generation and debugging support.
          </Text>

          <View style={styles.tagsContainer}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>Full-stack apps</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>React Native</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>Web apps</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>Database design</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gnosisCard} onPress={handleGnosisPress} activeOpacity={0.7}>
          <View style={styles.cardHeader}>
            <View style={[styles.cardIconCircle, styles.cardIconCircleBlue]}>
              <MessageCircle size={32} color="#FFFFFF" />
            </View>
            <Text style={styles.cardTitle}>Gnosis Knowledge Base</Text>
          </View>
          
          <Text style={styles.cardDescription}>
            Engage in deep conversations about any topic. Gnosis provides thoughtful explanations, explores complex ideas, and helps you learn through interactive dialogue.
          </Text>

          <View style={styles.tagsContainer}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>General knowledge</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>Code explanations</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>Learning</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>Brainstorming</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.architectureCard} onPress={handleArchitecturePress} activeOpacity={0.7}>
          <View style={styles.cardHeader}>
            <View style={[styles.cardIconCircle, styles.cardIconCircleGreen]}>
              <Text style={styles.emojiIcon}>🏗️</Text>
            </View>
            <Text style={[styles.cardTitle, styles.cardTitleWhite]}>Multi-Tenant Architecture</Text>
          </View>
          
          <Text style={[styles.cardDescription, styles.cardDescriptionLight]}>
            Explore how each user gets their own isolated backend environment. Learn about user-scoped data, sandboxed code execution, and secure multi-tenant infrastructure.
          </Text>

          <View style={styles.tagsContainer}>
            <View style={[styles.tag, styles.tagDark]}>
              <Text style={[styles.tagText, styles.tagTextLight]}>User isolation</Text>
            </View>
            <View style={[styles.tag, styles.tagDark]}>
              <Text style={[styles.tagText, styles.tagTextLight]}>API Gateway</Text>
            </View>
            <View style={[styles.tag, styles.tagDark]}>
              <Text style={[styles.tagText, styles.tagTextLight]}>Sandboxed code</Text>
            </View>
            <View style={[styles.tag, styles.tagDark]}>
              <Text style={[styles.tagText, styles.tagTextLight]}>Private data</Text>
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>

      <Sidebar visible={sidebarVisible} onClose={handleCloseSidebar} />
    </SafeAreaView>
  );
}


import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Plus,
  LayoutDashboard,
  FolderOpen,
  Clock,
  Crown,
  Database,
  Github,
  MessageSquare,
  Settings,
  X,
  Book,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');
const SIDEBAR_WIDTH = 280;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    backgroundColor: '#FFF5EB',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  brandText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginLeft: 12,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999999',
    letterSpacing: 1,
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  menuItemQuickAccess: {
    backgroundColor: '#E3F2FD',
  },
  menuItemText: {
    fontSize: 16,
    color: '#1C1C1E',
    marginLeft: 12,
    fontWeight: '500',
  },
  menuItemTextBlue: {
    color: '#3B82F6',
  },
});

export default function Sidebar({ visible, onClose }) {
  const router = useRouter();
  const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;

  useEffect(() => {
    console.log('Sidebar: Visibility changed to', visible);
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 280,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -SIDEBAR_WIDTH,
        duration: 280,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  const handleNavigate = (route) => {
    console.log('Sidebar: Navigating to', route);
    onClose();
    router.push(route);
  };

  const MenuItem = ({ icon: Icon, text, route, quickAccess, iconColor }) => {
    const itemStyle = quickAccess ? styles.menuItemQuickAccess : null;
    const textStyle = quickAccess ? styles.menuItemTextBlue : null;
    const color = iconColor || '#1C1C1E';

    return (
      <TouchableOpacity
        style={[styles.menuItem, itemStyle]}
        onPress={() => handleNavigate(route)}
      >
        <Icon size={20} color={color} />
        <Text style={[styles.menuItemText, textStyle]}>{text}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <Animated.View
          style={[
            styles.sidebar,
            {
              transform: [{ translateX: slideAnim }],
            },
          ]}
          onStartShouldSetResponder={() => true}
        >
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Image
                source={{
                  uri: 'https://image2url.com/r2/default/images/1767183581317-68102f31-454b-45f6-9d39-025ce8604ac3.png',
                }}
                style={styles.logo}
              />
              <Text style={styles.brandText}>Yada</Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={24} color="#1C1C1E" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <Text style={styles.sectionHeader}>CODE WITH YADA</Text>
              <MenuItem icon={Plus} text="New project" route="/yada" />
              <MenuItem icon={LayoutDashboard} text="Dashboard" route="/dashboard" />
              <MenuItem icon={FolderOpen} text="Projects" route="/projects" />
              <MenuItem icon={Clock} text="History" route="/history" />
              <MenuItem icon={Crown} text="Premium" route="/premium" />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionHeader}>QUICK ACCESS (TEMP)</Text>
              <MenuItem
                icon={Database}
                text="Supabase"
                route="/setup-supabase"
                quickAccess
                iconColor="#3B82F6"
              />
              <MenuItem
                icon={Github}
                text="GitHub Sync"
                route="/github"
                quickAccess
                iconColor="#3B82F6"
              />
              <MenuItem
                icon={Book}
                text="API Docs"
                route="/api-docs"
                quickAccess
                iconColor="#10B981"
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionHeader}>TALK WITH GNOSIS</Text>
              <MenuItem icon={MessageSquare} text="New chat" route="/gnosis" />
              <MenuItem icon={Clock} text="History" route="/gnosis/history" />
              <MenuItem icon={Settings} text="Settings" route="/settings" />
            </View>
          </ScrollView>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}

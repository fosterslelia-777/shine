
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Menu } from 'lucide-react-native';
import Sidebar from '@/components/Sidebar';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5EB',
  },
  safeArea: {
    flex: 1,
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginLeft: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  inputContainer: {
    backgroundColor: '#FFF5EB',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E5EA',
    padding: 16,
    minHeight: 120,
    marginTop: 20,
  },
  input: {
    fontSize: 16,
    color: '#1C1C1E',
    textAlignVertical: 'top',
    minHeight: 80,
  },
  placeholder: {
    fontSize: 16,
    color: '#999999',
  },
});

export default function HomePage() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [inputText, setInputText] = useState('');

  const handleMenuPress = () => {
    console.log('HomePage: Opening sidebar');
    setSidebarVisible(true);
  };

  const handleCloseSidebar = () => {
    console.log('HomePage: Closing sidebar');
    setSidebarVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.menuButton} onPress={handleMenuPress}>
            <Menu size={28} color="#1C1C1E" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Yada</Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Ask me anything..."
              placeholderTextColor="#999999"
              multiline
              value={inputText}
              onChangeText={setInputText}
              textAlignVertical="top"
            />
          </View>
        </ScrollView>

        <Sidebar visible={sidebarVisible} onClose={handleCloseSidebar} />
      </View>
    </SafeAreaView>
  );
}

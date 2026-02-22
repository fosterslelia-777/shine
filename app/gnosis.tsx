
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Menu } from 'lucide-react-native';
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
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginLeft: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyLogo: {
    width: 80,
    height: 80,
    borderRadius: 16,
    marginBottom: 24,
  },
  emptyHeading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1C1E',
    textAlign: 'center',
    marginBottom: 32,
  },
  exampleButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  exampleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userAvatar: {
    backgroundColor: '#007AFF',
  },
  assistantAvatar: {
    backgroundColor: '#FFF5EB',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  avatarLogo: {
    width: 24,
    height: 24,
    borderRadius: 4,
  },
  messageContent: {
    flex: 1,
  },
  messageName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    color: '#1C1C1E',
    lineHeight: 22,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  loadingText: {
    fontSize: 14,
    color: '#999999',
    marginLeft: 8,
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFF5EB',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  inputWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1C1C1E',
    maxHeight: 100,
    paddingTop: 0,
    paddingBottom: 0,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#E5E5EA',
  },
  sendButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  helperText: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default function GnosisScreen() {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (scrollViewRef.current && messages.length > 0) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) {
      console.log('GnosisScreen: Cannot send empty message or already loading');
      return;
    }

    const userMessage = inputText.trim();
    console.log('GnosisScreen: Sending message:', userMessage);
    setInputText('');

    const newUserMessage = {
      role: 'user',
      content: userMessage,
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);

    // TODO: Backend Integration - POST /api/gnosis/chat
    // Body: { messages: [...messages, newUserMessage] }
    // Response: { response: string }
    
    // Simulate API call
    setTimeout(() => {
      const assistantMessage = {
        role: 'assistant',
        content: 'That\'s a fascinating question! Let me share my thoughts on that...',
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleExamplePress = (example: string) => {
    console.log('GnosisScreen: Example pressed:', example);
    setInputText(example);
  };

  const renderEmptyState = () => {
    return (
      <View style={styles.emptyState}>
        <Image
          source={{
            uri: 'https://image2url.com/r2/default/images/1767183581317-68102f31-454b-45f6-9d39-025ce8604ac3.png',
          }}
          style={styles.emptyLogo}
        />
        <Text style={styles.emptyHeading}>Welcome to Gnosis</Text>
        
        <TouchableOpacity
          style={styles.exampleButton}
          onPress={() => handleExamplePress('Divinations and Spirituality')}
        >
          <Text style={styles.exampleButtonText}>Divinations and Spirituality</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderMessage = (message: { role: string; content: string }, index: number) => {
    const isUser = message.role === 'user';
    
    return (
      <View key={index} style={styles.messageRow}>
        <View style={[styles.avatar, isUser ? styles.userAvatar : styles.assistantAvatar]}>
          {isUser ? (
            <Text style={styles.avatarText}>You</Text>
          ) : (
            <Image
              source={{
                uri: 'https://image2url.com/r2/default/images/1767183581317-68102f31-454b-45f6-9d39-025ce8604ac3.png',
              }}
              style={styles.avatarLogo}
            />
          )}
        </View>
        <View style={styles.messageContent}>
          <Text style={styles.messageName}>{isUser ? 'You' : 'Gnosis'}</Text>
          <Text style={styles.messageText}>{message.content}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => setSidebarVisible(true)}
            >
              <Menu size={24} color="#1C1C1E" />
            </TouchableOpacity>
            <Image
              source={{
                uri: 'https://image2url.com/r2/default/images/1767183581317-68102f31-454b-45f6-9d39-025ce8604ac3.png',
              }}
              style={styles.logo}
            />
            <Text style={styles.headerTitle}>Gnosis</Text>
          </View>
        </View>

        {messages.length === 0 ? (
          renderEmptyState()
        ) : (
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            {messages.map((message, index) => renderMessage(message, index))}
            {isLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#007AFF" />
                <Text style={styles.loadingText}>Gnosis is thinking...</Text>
              </View>
            )}
          </ScrollView>
        )}

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Ask Gnosis anything..."
              placeholderTextColor="#999999"
              multiline
              value={inputText}
              onChangeText={setInputText}
              editable={!isLoading}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                (!inputText.trim() || isLoading) && styles.sendButtonDisabled,
              ]}
              onPress={handleSendMessage}
              disabled={!inputText.trim() || isLoading}
            >
              <Text style={styles.sendButtonText}>↑</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.helperText}>
            Gnosis can discuss any topic and explain concepts
          </Text>
        </View>

        <Sidebar visible={sidebarVisible} onClose={() => setSidebarVisible(false)} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useChat } from '../../hooks';
import { AppIcon, AppImage, AppList } from '../../lib';
import styles from './ChatScreen.Style';

// Format message time (e.g. "10:45 AM")
const formatMessageTime = (timestamp) => {
  if (!timestamp) return '';
  return new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const ChatScreen = ({ route, navigation }) => {
  const { match } = route.params || {};
  const otherUser = match?.otherUser || { displayName: 'Match', photoURL: '' };

  const [inputText, setInputText] = useState('');
  const flatListRef = useRef(null);

  const {
    activeChatMessages,
    currentUserId,
    openChat,
    send,
    closeChat,
    addLocalMessage,
  } = useChat();

  // Auto-scroll to latest message when keyboard pops up
  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => {
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    );
    return () => {
      showSub.remove();
    };
  }, []);

  // Load chat messages on mount
  useEffect(() => {
    if (match?.id) {
      openChat(match.id);
    }
    return () => {
      closeChat();
    };
  }, [match?.id, openChat, closeChat]);

  // Handle sending a message
  const handleSend = async () => {
    const textToSend = inputText.trim();
    if (!textToSend || !match?.id) return;

    setInputText('');

    // Send through Redux & Realtime Database
    await send(match.id, textToSend);

    // Scroll to newest message
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // If testing with demo match, simulate instant reply after 1.5s
    if (match.id.includes('demo')) {
      setTimeout(() => {
        const replyMessage = {
          id: `reply_${Date.now()}`,
          senderId: otherUser.uid,
          text: "That's wonderful! Really glad we connected on Tinder 😊",
          timestamp: Date.now(),
        };
        addLocalMessage(replyMessage);
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 1500);
    }
  };

  const renderMessageItem = ({ item }) => {
    const isSentByMe = item.senderId === currentUserId;

    return (
      <View
        style={[
          styles.messageRow,
          isSentByMe ? styles.messageRowSent : styles.messageRowReceived,
        ]}
      >
        <View
          style={[
            styles.bubble,
            isSentByMe ? styles.bubbleSent : styles.bubbleReceived,
          ]}
        >
          <Text
            style={
              isSentByMe ? styles.bubbleTextSent : styles.bubbleTextReceived
            }
          >
            {item.text}
          </Text>
          <Text
            style={[
              styles.timeText,
              isSentByMe ? styles.timeTextSent : styles.timeTextReceived,
            ]}
          >
            {formatMessageTime(item.timestamp)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <AppIcon name="chevron-left" size={20} color="#222222" />
        </TouchableOpacity>

        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('UserProfile', { profile: otherUser })}
        >
          <AppImage
            source={{
              uri:
                otherUser.photoURL ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
            }}
            style={styles.headerAvatar}
          />

          <View style={{ flex: 1 }}>
            <Text style={styles.headerName}>{otherUser.displayName}</Text>
            <Text style={styles.headerSubtitle}>Tap to view profile</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ padding: 8 }}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('UserProfile', { profile: otherUser })}
        >
          <AppIcon name="info-circle" size={20} color="#888888" />
        </TouchableOpacity>
      </View>

      {/* Messages List & Input */}
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 25}
      >
        <AppList
          ref={flatListRef}
          data={activeChatMessages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessageItem}
          contentContainerStyle={styles.messagesList}
          estimatedItemSize={60}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />

        {/* Message Input Bar */}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor="#999999"
            value={inputText}
            onChangeText={setInputText}
            multiline
            returnKeyType="send"
            onSubmitEditing={handleSend}
            onFocus={() => {
              setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
              }, 150);
            }}
          />

          <TouchableOpacity
            style={[
              styles.sendButton,
              inputText.trim().length > 0 && styles.sendButtonActive,
            ]}
            activeOpacity={0.7}
            disabled={inputText.trim().length === 0}
            onPress={handleSend}
          >
            <AppIcon
              name="paper-plane"
              size={18}
              color={inputText.trim().length > 0 ? '#FFFFFF' : '#FE3C72'}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;


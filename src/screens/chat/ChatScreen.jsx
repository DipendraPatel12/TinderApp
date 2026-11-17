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
import { Colors } from '../../constants';
import styles from './ChatScreen.Style';

const formatMessageTime = (timestamp) => {
  if (!timestamp) return '';
  const num = typeof timestamp === 'number' ? timestamp : Number(timestamp);
  if (isNaN(num)) return '';
  const d = new Date(num);
  return isNaN(d.getTime())
    ? ''
    : d.toLocaleTimeString([], {
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
    subscribeToMatch,
  } = useChat();

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

  useEffect(() => {
    let unsubscribe = () => {};
    if (match?.id) {
      openChat(match.id);
      unsubscribe = subscribeToMatch(match.id);
    }
    return () => {
      unsubscribe();
      closeChat();
    };
  }, [match?.id, openChat, closeChat, subscribeToMatch]);

  const handleSend = async () => {
    const textToSend = inputText.trim();
    if (!textToSend || !match?.id) return;

    setInputText('');

    await send(match.id, textToSend);

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
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
      <StatusBar backgroundColor={Colors.white} barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <AppIcon name="chevron-left" size={20} color={Colors.textHeading} />
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
          <AppIcon name="info-circle" size={20} color={Colors.textDim} />
        </TouchableOpacity>
      </View>

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

        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor={Colors.textPlaceholder}
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
              color={inputText.trim().length > 0 ? Colors.white : Colors.primary}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;


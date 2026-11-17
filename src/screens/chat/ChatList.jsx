import React, { useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useChat } from '../../hooks';
import { AppIcon, AppImage, AppList } from '../../lib';
import { Colors } from '../../constants';
import styles from './ChatList.Style';

const formatTime = (timestamp) => {
  if (!timestamp) return '';
  const num = typeof timestamp === 'number' ? timestamp : Number(timestamp);
  if (isNaN(num) || num <= 0) return '';

  const now = Date.now();
  const diffMinutes = Math.floor((now - num) / (1000 * 60));

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d`;
  const d = new Date(num);
  return isNaN(d.getTime())
    ? ''
    : d.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

const ChatList = ({ navigation }) => {
  const { matches, loadingMatches, loadMatches } = useChat();

  useFocusEffect(
    useCallback(() => {
      loadMatches();
    }, [loadMatches])
  );

  const handleOpenChat = (match) => {
    navigation.navigate('ChatScreen', { match });
  };

  const renderConversationItem = ({ item }) => (
    <TouchableOpacity
      style={styles.conversationItem}
      activeOpacity={0.7}
      onPress={() => handleOpenChat(item)}
    >
      <AppImage
        source={{
          uri:
            item.otherUser?.photoURL ||
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        }}
        style={styles.convAvatar}
      />
      <View style={styles.convInfo}>
        <View style={styles.convHeader}>
          <Text style={styles.convName}>{item.otherUser?.displayName || 'Match'}</Text>
          <Text style={styles.convTime}>{formatTime(item.lastMessageTimestamp)}</Text>
        </View>
        <Text style={styles.convMessage} numberOfLines={1}>
          {item.lastMessage || 'Say hello 👋'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View>
      {loadingMatches && matches.length === 0 ? (
        <View style={{ paddingVertical: 40, alignItems: 'center' }}>
          <ActivityIndicator size="small" color={Colors.primary} />
        </View>
      ) : null}

      {matches.length > 0 ? (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>New Matches</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.matchesScroll}
          >
            {matches.map((item) => (
              <TouchableOpacity
                key={`new_match_${item.id}`}
                style={styles.matchAvatarItem}
                activeOpacity={0.8}
                onPress={() => handleOpenChat(item)}
              >
                <View style={styles.matchAvatarBorder}>
                  <AppImage
                    source={{
                      uri:
                        item.otherUser?.photoURL ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
                    }}
                    style={styles.matchAvatarImage}
                  />
                </View>
                <Text style={styles.matchAvatarName} numberOfLines={1}>
                  {item.otherUser?.displayName || 'Match'}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.divider} />
        </>
      ) : null}

      {matches.length > 0 ? (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Conversations</Text>
        </View>
      ) : null}
    </View>
  );

  const renderEmpty = () => {
    if (loadingMatches) return null;
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIcon}>
          <AppIcon name="comments-o" size={50} color={Colors.borderMedium} />
        </View>
        <Text style={styles.emptyTitle}>No messages yet</Text>
        <Text style={styles.emptySubtitle}>
          When you match with someone, they will appear here. Keep swiping to discover new people!
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar backgroundColor={Colors.white} barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity onPress={loadMatches} activeOpacity={0.7} style={{ padding: 4 }}>
          <AppIcon name="refresh" size={18} color={Colors.textGray} />
        </TouchableOpacity>
      </View>

      <AppList
        data={matches}
        keyExtractor={(item) => item.id}
        renderItem={renderConversationItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        estimatedItemSize={84}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default ChatList;


import React, { useEffect, useCallback } from 'react';
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
import { AppIcon, AppImage } from '../../lib';
import styles from './ChatList.Style';

// Format timestamp to friendly string (e.g. "5m", "2h", "Yesterday")
const formatTime = (timestamp) => {
  if (!timestamp) return '';
  const now = Date.now();
  const diffMinutes = Math.floor((now - timestamp) / (1000 * 60));

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d`;
  return new Date(timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' });
};

const ChatList = ({ navigation }) => {
  const { matches, loadingMatches, loadMatches } = useChat();

  // Reload matches whenever screen gains focus
  useFocusEffect(
    useCallback(() => {
      loadMatches();
    }, [loadMatches])
  );

  const handleOpenChat = (match) => {
    navigation.navigate('ChatScreen', { match });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

      {/* Screen Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity onPress={loadMatches} activeOpacity={0.7} style={{ padding: 4 }}>
          <AppIcon name="refresh" size={18} color="#666666" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Loading Indicator */}
        {loadingMatches && matches.length === 0 ? (
          <View style={{ paddingVertical: 40, alignItems: 'center' }}>
            <ActivityIndicator size="small" color="#FE3C72" />
          </View>
        ) : null}

        {/* Section 1: New Matches Carousel */}
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
                  key={item.id}
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

        {/* Section 2: Active Conversations */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Conversations</Text>
        </View>

        {matches.length === 0 && !loadingMatches ? (
          /* Empty State */
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <AppIcon name="comments-o" size={50} color="#DDDDDD" />
            </View>
            <Text style={styles.emptyTitle}>No messages yet</Text>
            <Text style={styles.emptySubtitle}>
              When you match with someone, they will appear here. Keep swiping to discover new people!
            </Text>
          </View>
        ) : (
          /* List of Conversations */
          matches.map((item) => (
            <TouchableOpacity
              key={`conv_${item.id}`}
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
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChatList;


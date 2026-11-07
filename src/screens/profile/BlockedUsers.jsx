import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBlock } from '../../hooks';
import { AppIcon, AppImage, AppList } from '../../lib';
import { Colors, s, vs, ms } from '../../constants';

const BlockedUsers = ({ navigation }) => {
  const { blockedList, loading, loadBlockedList, unblock } = useBlock();

  useEffect(() => {
    loadBlockedList();
  }, [loadBlockedList]);

  const handleUnblock = (user) => {
    Alert.alert(
      'Unblock User',
      `Are you sure you want to unblock ${user.displayName || 'this user'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unblock',
          style: 'default',
          onPress: async () => {
            const success = await unblock(user.uid);
            if (success) {
              Alert.alert('Unblocked', `${user.displayName || 'User'} has been unblocked.`);
            } else {
              Alert.alert('Error', 'Failed to unblock user. Please try again.');
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => {
    const avatarUri = item.photoURL || null;

    return (
      <View style={styles.userRow}>
        <View style={styles.userInfo}>
          {avatarUri ? (
            <AppImage source={{ uri: avatarUri }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <AppIcon name="user" size={20} color="#999999" />
            </View>
          )}
          <View style={styles.nameContainer}>
            <Text style={styles.userName} numberOfLines={1}>
              {item.displayName || 'User'}
            </Text>
            <Text style={styles.blockedSubtitle}>Blocked</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.unblockBtn}
          activeOpacity={0.7}
          onPress={() => handleUnblock(item)}
        >
          <Text style={styles.unblockBtnText}>Unblock</Text>
        </TouchableOpacity>
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
        <Text style={styles.headerTitle}>Blocked Users</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      {/* Body */}
      {loading && blockedList.length === 0 ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#FE3C72" />
          <Text style={styles.loadingText}>Loading blocked list...</Text>
        </View>
      ) : blockedList.length === 0 ? (
        <View style={styles.centerContainer}>
          <View style={styles.emptyIconCircle}>
            <AppIcon name="shield" size={44} color="#B0B0B0" />
          </View>
          <Text style={styles.emptyTitle}>No Blocked Users</Text>
          <Text style={styles.emptySubtitle}>
            When you block someone, they won't be able to see your profile or send you messages.
          </Text>
        </View>
      ) : (
        <AppList
          data={blockedList}
          keyExtractor={(item) => item.uid || String(Math.random())}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          estimatedItemSize={72}
          onRefresh={loadBlockedList}
          refreshing={loading}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: s(16),
    paddingVertical: vs(14),
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: s(6),
  },
  headerTitle: {
    fontSize: ms(18),
    fontWeight: '700',
    color: '#222222',
  },
  headerPlaceholder: {
    width: s(32),
  },
  listContent: {
    paddingVertical: vs(8),
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: s(16),
    paddingVertical: vs(12),
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: s(12),
  },
  avatar: {
    width: ms(48),
    height: ms(48),
    borderRadius: ms(24),
    backgroundColor: '#EEEEEE',
  },
  avatarPlaceholder: {
    width: ms(48),
    height: ms(48),
    borderRadius: ms(24),
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameContainer: {
    marginLeft: s(12),
    flex: 1,
  },
  userName: {
    fontSize: ms(16),
    fontWeight: '600',
    color: '#222222',
  },
  blockedSubtitle: {
    fontSize: ms(13),
    color: '#999999',
    marginTop: vs(2),
  },
  unblockBtn: {
    paddingHorizontal: s(16),
    paddingVertical: vs(8),
    borderRadius: ms(20),
    borderWidth: 1,
    borderColor: '#FE3C72',
    backgroundColor: '#FFF5F6',
  },
  unblockBtnText: {
    color: '#FE3C72',
    fontSize: ms(13),
    fontWeight: '700',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: s(36),
  },
  emptyIconCircle: {
    width: ms(80),
    height: ms(80),
    borderRadius: ms(40),
    backgroundColor: '#F6F6F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: vs(16),
  },
  emptyTitle: {
    fontSize: ms(20),
    fontWeight: '700',
    color: '#333333',
    marginBottom: vs(8),
  },
  emptySubtitle: {
    fontSize: ms(14),
    color: '#888888',
    textAlign: 'center',
    lineHeight: ms(20),
  },
  loadingText: {
    marginTop: vs(12),
    fontSize: ms(14),
    color: '#888888',
  },
});

export default BlockedUsers;


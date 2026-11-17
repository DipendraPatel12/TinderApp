import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBlock } from '../../hooks';
import { AppIcon, AppImage, AppList } from '../../lib';
import { Colors } from '../../constants';
import styles from './BlockedUsers.Style';

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
              <AppIcon name="user" size={20} color={Colors.textPlaceholder} />
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
      <StatusBar backgroundColor={Colors.white} barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <AppIcon name="chevron-left" size={20} color={Colors.textHeading} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Blocked Users</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      {loading && blockedList.length === 0 ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading blocked list...</Text>
        </View>
      ) : blockedList.length === 0 ? (
        <View style={styles.centerContainer}>
          <View style={styles.emptyIconCircle}>
            <AppIcon name="shield" size={44} color={Colors.textHint} />
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

export default BlockedUsers;


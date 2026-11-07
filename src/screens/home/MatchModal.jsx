import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { Colors, s, vs, ms, Metrics } from '../../constants';
import { AppIcon, AppImage } from '../../lib';

const MatchModal = ({ visible, currentUser, matchedUser, onClose, onSendMessage }) => {
  if (!visible || !matchedUser) return null;

  const currentPhoto =
    currentUser?.photoURL ||
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80';
  const targetPhoto =
    matchedUser?.photoURL ||
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <StatusBar backgroundColor="rgba(0,0,0,0.85)" barStyle="light-content" />
      <View style={styles.overlay}>
        {/* Celebration Header */}
        <Text style={styles.badgeText}>🔥 IT'S A MATCH! 🔥</Text>
        <Text style={styles.subtitle}>
          You and <Text style={styles.nameHighlight}>{matchedUser.displayName}</Text> have liked each other.
        </Text>

        {/* Avatars Container */}
        <View style={styles.avatarsRow}>
          {/* Current User Avatar */}
          <View style={[styles.avatarWrapper, styles.leftAvatar]}>
            <AppImage source={{ uri: currentPhoto }} style={styles.avatar} priority="high" />
          </View>

          {/* Heart Badge in Center */}
          <View style={styles.heartBadge}>
            <AppIcon name="heart" size={22} color="#FE3C72" />
          </View>

          {/* Matched User Avatar */}
          <View style={[styles.avatarWrapper, styles.rightAvatar]}>
            <AppImage source={{ uri: targetPhoto }} style={styles.avatar} priority="high" />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.sendMessageButton}
            activeOpacity={0.85}
            onPress={onSendMessage || onClose}
          >
            <Text style={styles.sendMessageText}>SEND A MESSAGE</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.keepSwipingButton}
            activeOpacity={0.7}
            onPress={onClose}
          >
            <Text style={styles.keepSwipingText}>KEEP SWIPING</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 15, 20, 0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: s(24),
  },
  badgeText: {
    fontSize: ms(32),
    fontWeight: '900',
    color: '#FE3C72',
    letterSpacing: ms(1.5),
    textAlign: 'center',
    marginBottom: vs(12),
    fontStyle: 'italic',
  },
  subtitle: {
    fontSize: ms(16),
    color: '#E0E0E0',
    textAlign: 'center',
    marginBottom: vs(36),
    lineHeight: ms(22),
    paddingHorizontal: s(16),
  },
  nameHighlight: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  avatarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: vs(48),
    position: 'relative',
    height: ms(140),
    width: Metrics.screenWidth * 0.8,
  },
  avatarWrapper: {
    width: ms(130),
    height: ms(130),
    borderRadius: ms(65),
    borderWidth: ms(4),
    borderColor: '#FFFFFF',
    overflow: 'hidden',
    position: 'absolute',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
  },
  leftAvatar: {
    left: s(18),
  },
  rightAvatar: {
    right: s(18),
  },
  avatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heartBadge: {
    width: ms(48),
    height: ms(48),
    borderRadius: ms(24),
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    elevation: 10,
    shadowColor: '#FE3C72',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  heartIcon: {
    fontSize: ms(22),
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: s(16),
  },
  sendMessageButton: {
    backgroundColor: '#FE3C72',
    paddingVertical: vs(16),
    borderRadius: ms(30),
    alignItems: 'center',
    marginBottom: vs(14),
    elevation: 4,
    shadowColor: '#FE3C72',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  sendMessageText: {
    color: '#FFFFFF',
    fontSize: ms(15),
    fontWeight: '800',
    letterSpacing: ms(1.2),
  },
  keepSwipingButton: {
    paddingVertical: vs(14),
    borderRadius: ms(30),
    borderWidth: ms(1.5),
    borderColor: 'rgba(255, 255, 255, 0.4)',
    alignItems: 'center',
  },
  keepSwipingText: {
    color: '#FFFFFF',
    fontSize: ms(14),
    fontWeight: '700',
    letterSpacing: ms(1),
  },
});

export default MatchModal;


import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { AppIcon, AppImage } from '../../lib';
import { Colors } from '../../constants';
import styles from './MatchModal.Style';

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
      <StatusBar backgroundColor={Colors.overlayDarker} barStyle="light-content" />
      <View style={styles.overlay}>
        <Text style={styles.badgeText}>🔥 IT'S A MATCH! 🔥</Text>
        <Text style={styles.subtitle}>
          You and <Text style={styles.nameHighlight}>{matchedUser.displayName}</Text> have liked each other.
        </Text>

        <View style={styles.avatarsRow}>
          <View style={[styles.avatarWrapper, styles.leftAvatar]}>
            <AppImage source={{ uri: currentPhoto }} style={styles.avatar} priority="high" />
          </View>

          <View style={styles.heartBadge}>
            <AppIcon name="heart" size={22} color={Colors.primary} />
          </View>

          <View style={[styles.avatarWrapper, styles.rightAvatar]}>
            <AppImage source={{ uri: targetPhoto }} style={styles.avatar} priority="high" />
          </View>
        </View>

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

export default MatchModal;


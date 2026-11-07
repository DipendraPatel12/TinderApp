import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks';
import { Colors, s, vs, ms } from '../../constants';
import { promptImagePicker, AppIcon, AppImage } from '../../lib';
import { uploadImageToCloudinary } from '../../services/cloudinary';

const Profile = ({ navigation }) => {
  const { user, userData, saveProfile, logout } = useAuth();
  const [isUploading, setIsUploading] = useState(false);

  const handleUpdateAvatar = () => {
    promptImagePicker({
      title: 'Change Profile Photo',
      message: 'Upload a new photo to Cloudinary',
      onImageSelected: async (image) => {
        setIsUploading(true);
        try {
          const uploadedUrl = await uploadImageToCloudinary(image);
          await saveProfile({
            photoURL: uploadedUrl,
          });
        } catch (err) {
          Alert.alert('Upload Error', err.message || 'Failed to upload photo');
        } finally {
          setIsUploading(false);
        }
      },
      onError: (err) => {
        Alert.alert('Error', err.message || 'Could not access image');
      },
    });
  };

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: logout },
    ]);
  };

  const avatarUrl =
    userData?.photoURL ||
    user?.photoURL ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';

  const displayName = userData?.displayName || user?.displayName || 'User';

  const hobbiesList = Array.isArray(userData?.hobbies)
    ? userData.hobbies
    : Object.values(userData?.hobbies || {});

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <AppIcon name="fire" size={24} color="#FE3C72" style={{ marginRight: 6 }} />
          <Text style={styles.headerTitle}>Profile</Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('EditProfile')}
          style={styles.headerEditBtn}
          activeOpacity={0.7}
        >
          <AppIcon name="pencil" size={16} color="#FE3C72" style={{ marginRight: 6 }} />
          <Text style={styles.headerEditText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* User Card Header */}
        <View style={styles.profileHeaderCard}>
          <TouchableOpacity
            style={styles.avatarContainer}
            activeOpacity={0.8}
            onPress={handleUpdateAvatar}
            disabled={isUploading}
          >
            <AppImage source={{ uri: avatarUrl }} style={styles.avatar} priority="high" />

            <View style={styles.cameraBadge}>
              <AppIcon name="camera" size={14} color="#FFFFFF" />
            </View>

            {isUploading && (
              <View style={styles.uploadingOverlay}>
                <ActivityIndicator size="small" color="#FFFFFF" />
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.nameRow}>
            <Text style={styles.name}>{displayName}</Text>
            {userData?.age ? <Text style={styles.age}>, {userData.age}</Text> : null}
          </View>

          <Text style={styles.email}>{user?.email}</Text>

          {userData?.city ? (
            <View style={styles.cityRow}>
              <AppIcon name="map-marker" size={14} color="#777777" style={{ marginRight: 5 }} />
              <Text style={styles.city}>{userData.city}</Text>
            </View>
          ) : null}
        </View>

        {/* Bio Section */}
        {userData?.bio ? (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionLabel}>About Me</Text>
            <Text style={styles.bioText}>{userData.bio}</Text>
          </View>
        ) : null}

        {/* Interests Section */}
        {hobbiesList.length > 0 ? (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionLabel}>Interests</Text>
            <View style={styles.hobbiesContainer}>
              {hobbiesList.map((hobby, index) => (
                <View key={index} style={styles.hobbyChip}>
                  <Text style={styles.hobbyText}>{hobby}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {/* Settings & Management Options */}
        <View style={styles.optionsCard}>
          {/* Edit Profile */}
          <TouchableOpacity
            style={styles.optionRow}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <View style={styles.optionLeft}>
              <View style={[styles.iconCircle, { backgroundColor: '#FFF0F4' }]}>
                <AppIcon name="pencil" size={16} color="#FE3C72" />
              </View>
              <Text style={styles.optionLabel}>Edit Profile</Text>
            </View>
            <AppIcon name="chevron-right" size={14} color="#CCCCCC" />
          </TouchableOpacity>

          {/* Blocked Users */}
          <TouchableOpacity
            style={styles.optionRow}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('BlockedUsers')}
          >
            <View style={styles.optionLeft}>
              <View style={[styles.iconCircle, { backgroundColor: '#F0F4FF' }]}>
                <AppIcon name="shield" size={16} color="#3B82F6" />
              </View>
              <Text style={styles.optionLabel}>Blocked Users</Text>
            </View>
            <AppIcon name="chevron-right" size={14} color="#CCCCCC" />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          activeOpacity={0.8}
          onPress={handleLogout}
        >
          <AppIcon name="sign-out" size={16} color="#FF3F56" style={{ marginRight: 8 }} />
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>

        <View style={{ height: vs(30) }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: s(20),
    paddingVertical: vs(12),
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: ms(20),
    fontWeight: '800',
    color: '#222222',
  },
  headerEditBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(6),
    paddingHorizontal: s(12),
    borderRadius: ms(16),
    backgroundColor: '#FFF0F4',
  },
  headerEditText: {
    fontSize: ms(13),
    fontWeight: '700',
    color: '#FE3C72',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  profileHeaderCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: vs(24),
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  avatarContainer: {
    width: ms(110),
    height: ms(110),
    borderRadius: ms(55),
    borderWidth: 3,
    borderColor: '#FE3C72',
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#F0F0F0',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    paddingVertical: vs(4),
    alignItems: 'center',
  },
  uploadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: vs(14),
  },
  name: {
    fontSize: ms(22),
    fontWeight: '800',
    color: '#222222',
  },
  age: {
    fontSize: ms(20),
    fontWeight: '500',
    color: '#666666',
  },
  email: {
    fontSize: ms(13),
    color: '#888888',
    marginTop: vs(4),
  },
  cityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(6),
  },
  city: {
    fontSize: ms(13),
    color: '#666666',
    fontWeight: '500',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    marginTop: vs(12),
    paddingHorizontal: s(20),
    paddingVertical: vs(16),
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#EEEEEE',
  },
  sectionLabel: {
    fontSize: ms(12),
    fontWeight: '700',
    color: '#888888',
    textTransform: 'uppercase',
    letterSpacing: ms(0.8),
    marginBottom: vs(8),
  },
  bioText: {
    fontSize: ms(14),
    color: '#444444',
    lineHeight: ms(20),
  },
  hobbiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  hobbyChip: {
    backgroundColor: '#FFF0F4',
    paddingHorizontal: s(12),
    paddingVertical: vs(6),
    borderRadius: ms(16),
    marginRight: s(8),
    marginBottom: vs(8),
    borderWidth: 1,
    borderColor: '#FFDCE4',
  },
  hobbyText: {
    color: '#FE3C72',
    fontSize: ms(12),
    fontWeight: '600',
  },
  optionsCard: {
    backgroundColor: '#FFFFFF',
    marginTop: vs(14),
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#EEEEEE',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: s(20),
    paddingVertical: vs(14),
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: ms(34),
    height: ms(34),
    borderRadius: ms(17),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: s(12),
  },
  optionLabel: {
    fontSize: ms(15),
    fontWeight: '600',
    color: '#333333',
  },
  logoutButton: {
    marginTop: vs(24),
    marginHorizontal: s(20),
    backgroundColor: '#FFFFFF',
    paddingVertical: vs(14),
    borderRadius: ms(24),
    borderWidth: 1,
    borderColor: '#FFD5DB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButtonText: {
    color: '#FF3F56',
    fontSize: ms(15),
    fontWeight: '700',
  },
});

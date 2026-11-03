import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks';
import { Colors, scale, verticalScale, moderateScale, Fonts } from '../../constants';
import { promptImagePicker } from '../../lib';
import { uploadImageToCloudinary } from '../../services/cloudinary';

const Profile = () => {
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
            city: userData?.city || '',
            bio: userData?.bio || '',
            hobbies: userData?.hobbies || [],
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.avatarContainer}
          activeOpacity={0.8}
          onPress={handleUpdateAvatar}
          disabled={isUploading}
        >
          {userData?.photoURL ? (
            <Image source={{ uri: userData.photoURL }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {user?.displayName ? user.displayName[0].toUpperCase() : 'U'}
              </Text>
            </View>
          )}
          {isUploading && (
            <View style={styles.uploadingOverlay}>
              <ActivityIndicator size="small" color={Colors.white} />
            </View>
          )}
        </TouchableOpacity>
        <Text style={styles.changePhotoText}>Tap photo to change</Text>

        <Text style={styles.name}>
          {userData?.displayName || user?.displayName || 'User'}
        </Text>
        <Text style={styles.email}>{user?.email}</Text>
        {userData?.city ? (
          <Text style={styles.city}>📍 {userData.city}</Text>
        ) : null}

        <TouchableOpacity
          style={styles.logoutButton}
          activeOpacity={0.8}
          onPress={logout}
        >
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView >
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: verticalScale(40),
    paddingHorizontal: scale(24),
  },
  avatarContainer: {
    width: scale(110),
    height: scale(110),
    borderRadius: scale(55),
    borderWidth: 3,
    borderColor: Colors.primary,
    overflow: 'hidden',
    position: 'relative',
  },
  uploadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    flex: 1,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: moderateScale(36),
    color: Colors.primary,
    fontWeight: Fonts.weight.bold,
  },
  changePhotoText: {
    fontSize: moderateScale(12),
    color: Colors.primary,
    fontWeight: '600',
    marginTop: verticalScale(6),
    marginBottom: verticalScale(14),
  },
  name: {
    fontSize: moderateScale(24),
    fontWeight: Fonts.weight.bold,
    color: Colors.textPrimary,
  },
  email: {
    fontSize: moderateScale(14),
    color: Colors.textSecondary,
    marginTop: verticalScale(4),
  },
  city: {
    fontSize: moderateScale(14),
    color: Colors.textSecondary,
    marginTop: verticalScale(6),
  },
  logoutButton: {
    marginTop: verticalScale(40),
    backgroundColor: Colors.surface,
    paddingHorizontal: scale(32),
    paddingVertical: verticalScale(12),
    borderRadius: scale(24),
    borderWidth: 1,
    borderColor: Colors.border,
  },
  logoutButtonText: {
    color: Colors.textPrimary,
    fontSize: moderateScale(15),
    fontWeight: '600',
  },

});

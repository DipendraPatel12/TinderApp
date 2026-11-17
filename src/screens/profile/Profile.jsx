import React, { useState } from 'react';
import {
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
import { Colors, vs } from '../../constants';
import { promptImagePicker, AppIcon, AppImage } from '../../lib';
import { uploadImageToCloudinary } from '../../services/cloudinary';
import styles from './Profile.Style';

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
      <StatusBar backgroundColor={Colors.white} barStyle="dark-content" />

      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <AppIcon name="fire" size={24} color={Colors.primary} style={{ marginRight: 6 }} />
          <Text style={styles.headerTitle}>Profile</Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('EditProfile')}
          style={styles.headerEditBtn}
          activeOpacity={0.7}
        >
          <AppIcon name="pencil" size={16} color={Colors.primary} style={{ marginRight: 6 }} />
          <Text style={styles.headerEditText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeaderCard}>
          <TouchableOpacity
            style={styles.avatarContainer}
            activeOpacity={0.8}
            onPress={handleUpdateAvatar}
            disabled={isUploading}
          >
            <AppImage source={{ uri: avatarUrl }} style={styles.avatar} priority="high" />

            <View style={styles.cameraBadge}>
              <AppIcon name="camera" size={14} color={Colors.white} />
            </View>

            {isUploading && (
              <View style={styles.uploadingOverlay}>
                <ActivityIndicator size="small" color={Colors.white} />
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
              <AppIcon name="map-marker" size={14} color={Colors.textLight} style={{ marginRight: 5 }} />
              <Text style={styles.city}>{userData.city}</Text>
            </View>
          ) : null}
        </View>

        {userData?.bio ? (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionLabel}>About Me</Text>
            <Text style={styles.bioText}>{userData.bio}</Text>
          </View>
        ) : null}

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

        <View style={styles.optionsCard}>
          <TouchableOpacity
            style={styles.optionRow}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <View style={styles.optionLeft}>
              <View style={[styles.iconCircle, { backgroundColor: Colors.primaryLight }]}>
                <AppIcon name="pencil" size={16} color={Colors.primary} />
              </View>
              <Text style={styles.optionLabel}>Edit Profile</Text>
            </View>
            <AppIcon name="chevron-right" size={14} color={Colors.borderDark} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionRow}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('BlockedUsers')}
          >
            <View style={styles.optionLeft}>
              <View style={[styles.iconCircle, { backgroundColor: Colors.blueLight }]}>
                <AppIcon name="shield" size={16} color={Colors.blue} />
              </View>
              <Text style={styles.optionLabel}>Blocked Users</Text>
            </View>
            <AppIcon name="chevron-right" size={14} color={Colors.borderDark} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          activeOpacity={0.8}
          onPress={handleLogout}
        >
          <AppIcon name="sign-out" size={16} color={Colors.nope} style={{ marginRight: 8 }} />
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>

        <View style={{ height: vs(30) }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;

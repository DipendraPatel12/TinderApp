import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks';
import { AppIcon, AppImage, promptImagePicker } from '../../lib';
import { uploadImageToCloudinary } from '../../services/cloudinary';
import { Colors } from '../../constants';
import styles from './EditProfile.Style';

const ALL_HOBBIES = [
  'Traveling',
  'Photography',
  'Music',
  'Fitness',
  'Coffee',
  'Gaming',
  'Cooking',
  'Art',
  'Dogs',
  'Reading',
  'Startups',
  'Movies',
  'Hiking',
  'Fashion',
];

const EditProfile = ({ navigation }) => {
  const { user, userData, saveProfile } = useAuth();

  const [displayName, setDisplayName] = useState(
    userData?.displayName || user?.displayName || ''
  );
  const [age, setAge] = useState(userData?.age ? String(userData.age) : '');
  const [city, setCity] = useState(userData?.city || '');
  const [bio, setBio] = useState(userData?.bio || '');
  const [photoURL, setPhotoURL] = useState(userData?.photoURL || '');
  const initialHobbies = Array.isArray(userData?.hobbies)
    ? userData.hobbies
    : Object.values(userData?.hobbies || {});
  const [hobbies, setHobbies] = useState(initialHobbies);

  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const toggleHobby = (hobby) => {
    if (hobbies.includes(hobby)) {
      setHobbies(hobbies.filter((h) => h !== hobby));
    } else {
      if (hobbies.length >= 6) {
        Alert.alert('Limit Reached', 'You can select up to 6 interests.');
        return;
      }
      setHobbies([...hobbies, hobby]);
    }
  };

  const handleChangePhoto = () => {
    promptImagePicker({
      title: 'Change Profile Photo',
      message: 'Take a new photo or select from gallery',
      onImageSelected: async (image) => {
        setIsUploading(true);
        try {
          const uploadedUrl = await uploadImageToCloudinary(image);
          setPhotoURL(uploadedUrl);
        } catch (err) {
          Alert.alert('Upload Failed', err.message || 'Could not upload photo.');
        } finally {
          setIsUploading(false);
        }
      },
      onError: (err) => {
        Alert.alert('Error', err.message || 'Could not access image.');
      },
    });
  };

  const handleSave = async () => {
    if (!displayName.trim()) {
      Alert.alert('Name Required', 'Please enter your display name.');
      return;
    }

    setIsSaving(true);
    try {
      await saveProfile({
        displayName: displayName.trim(),
        age: age.trim() ? parseInt(age.trim(), 10) : '',
        photoURL,
        city: city.trim(),
        bio: bio.trim(),
        hobbies,
      });

      Alert.alert('Success', 'Your profile has been updated!');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar backgroundColor={Colors.white} barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerButton}
          activeOpacity={0.7}
        >
          <AppIcon name="chevron-left" size={20} color={Colors.textHeading} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Edit Profile</Text>

        <TouchableOpacity
          onPress={handleSave}
          style={styles.saveHeaderButton}
          activeOpacity={0.7}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color={Colors.primary} />
          ) : (
            <Text style={styles.saveHeaderText}>Done</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.avatarSection}>
          <TouchableOpacity
            style={styles.avatarContainer}
            activeOpacity={0.8}
            onPress={handleChangePhoto}
            disabled={isUploading}
          >
            <AppImage
              source={{
                uri:
                  photoURL ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
              }}
              style={styles.avatar}
              priority="high"
            />

            <View style={styles.cameraBadge}>
              <AppIcon name="camera" size={14} color={Colors.white} />
            </View>

            {isUploading && (
              <View style={styles.uploadOverlay}>
                <ActivityIndicator size="small" color={Colors.white} />
              </View>
            )}
          </TouchableOpacity>
          <Text style={styles.avatarHint}>Tap photo to upload new image</Text>
        </View>

        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Name</Text>
            <TextInput
              style={styles.input}
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Your Name"
              placeholderTextColor={Colors.textDisabled}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Age</Text>
            <TextInput
              style={styles.input}
              value={age}
              onChangeText={setAge}
              placeholder="e.g. 24"
              placeholderTextColor={Colors.textDisabled}
              keyboardType="number-pad"
              maxLength={2}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>City / Location</Text>
            <TextInput
              style={styles.input}
              value={city}
              onChangeText={setCity}
              placeholder="e.g. New York"
              placeholderTextColor={Colors.textDisabled}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>About Me</Text>
            <TextInput
              style={[styles.input, styles.bioInput]}
              value={bio}
              onChangeText={setBio}
              placeholder="Write a short bio about yourself..."
              placeholderTextColor={Colors.textDisabled}
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              Interests ({hobbies.length}/6 selected)
            </Text>
            <View style={styles.hobbiesContainer}>
              {ALL_HOBBIES.map((hobby) => {
                const isSelected = hobbies.includes(hobby);
                return (
                  <TouchableOpacity
                    key={hobby}
                    style={[
                      styles.hobbyChip,
                      isSelected && styles.hobbyChipSelected,
                    ]}
                    activeOpacity={0.7}
                    onPress={() => toggleHobby(hobby)}
                  >
                    <Text
                      style={[
                        styles.hobbyText,
                        isSelected && styles.hobbyTextSelected,
                      ]}
                    >
                      {hobby} {isSelected ? '✓' : '+'}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          activeOpacity={0.8}
          onPress={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color={Colors.white} />
          ) : (
            <Text style={styles.saveButtonText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfile;


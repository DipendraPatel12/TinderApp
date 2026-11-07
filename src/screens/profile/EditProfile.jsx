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
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks';
import { AppIcon, AppImage, promptImagePicker } from '../../lib';
import { uploadImageToCloudinary } from '../../services/cloudinary';
import { Colors, s, vs, ms } from '../../constants';

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

  // Toggle hobby selection
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

  // Change Photo via Cloudinary
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

  // Save all profile changes
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
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerButton}
          activeOpacity={0.7}
        >
          <AppIcon name="chevron-left" size={20} color="#222222" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Edit Profile</Text>

        <TouchableOpacity
          onPress={handleSave}
          style={styles.saveHeaderButton}
          activeOpacity={0.7}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color="#FE3C72" />
          ) : (
            <Text style={styles.saveHeaderText}>Done</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Photo Section */}
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

            {/* Camera Overlay Badge */}
            <View style={styles.cameraBadge}>
              <AppIcon name="camera" size={14} color="#FFFFFF" />
            </View>

            {isUploading && (
              <View style={styles.uploadOverlay}>
                <ActivityIndicator size="small" color="#FFFFFF" />
              </View>
            )}
          </TouchableOpacity>
          <Text style={styles.avatarHint}>Tap photo to upload new image</Text>
        </View>

        {/* Form Inputs */}
        <View style={styles.formSection}>
          {/* Display Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Name</Text>
            <TextInput
              style={styles.input}
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Your Name"
              placeholderTextColor="#AAAAAA"
            />
          </View>

          {/* Age */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Age</Text>
            <TextInput
              style={styles.input}
              value={age}
              onChangeText={setAge}
              placeholder="e.g. 24"
              placeholderTextColor="#AAAAAA"
              keyboardType="number-pad"
              maxLength={2}
            />
          </View>

          {/* City */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>City / Location</Text>
            <TextInput
              style={styles.input}
              value={city}
              onChangeText={setCity}
              placeholder="e.g. New York"
              placeholderTextColor="#AAAAAA"
            />
          </View>

          {/* Bio */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>About Me</Text>
            <TextInput
              style={[styles.input, styles.bioInput]}
              value={bio}
              onChangeText={setBio}
              placeholder="Write a short bio about yourself..."
              placeholderTextColor="#AAAAAA"
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Hobbies Selection */}
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

        {/* Save Button */}
        <TouchableOpacity
          style={styles.saveButton}
          activeOpacity={0.8}
          onPress={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.saveButtonText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: s(16),
    paddingVertical: vs(12),
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerButton: {
    padding: s(6),
  },
  headerTitle: {
    fontSize: ms(18),
    fontWeight: '700',
    color: '#222222',
  },
  saveHeaderButton: {
    paddingHorizontal: s(12),
    paddingVertical: vs(6),
  },
  saveHeaderText: {
    fontSize: ms(16),
    fontWeight: '700',
    color: '#FE3C72',
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: vs(24),
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  avatarContainer: {
    position: 'relative',
    width: ms(110),
    height: ms(110),
    borderRadius: ms(55),
    borderWidth: 3,
    borderColor: '#FE3C72',
    overflow: 'hidden',
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
  uploadOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarHint: {
    fontSize: ms(12),
    color: '#777777',
    marginTop: vs(8),
  },
  formSection: {
    paddingHorizontal: s(20),
    paddingTop: vs(20),
  },
  inputGroup: {
    marginBottom: vs(18),
  },
  inputLabel: {
    fontSize: ms(13),
    fontWeight: '700',
    color: '#666666',
    textTransform: 'uppercase',
    letterSpacing: ms(0.8),
    marginBottom: vs(8),
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: ms(12),
    paddingHorizontal: s(14),
    paddingVertical: vs(12),
    fontSize: ms(15),
    color: '#222222',
  },
  bioInput: {
    height: vs(90),
    textAlignVertical: 'top',
  },
  hobbiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  hobbyChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: s(12),
    paddingVertical: vs(8),
    borderRadius: ms(18),
    marginRight: s(8),
    marginBottom: vs(8),
    borderWidth: 1,
    borderColor: '#D0D0D0',
  },
  hobbyChipSelected: {
    backgroundColor: '#FE3C72',
    borderColor: '#FE3C72',
  },
  hobbyText: {
    color: '#555555',
    fontSize: ms(13),
    fontWeight: '600',
  },
  hobbyTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  saveButton: {
    backgroundColor: '#FE3C72',
    marginHorizontal: s(20),
    marginVertical: vs(30),
    paddingVertical: vs(15),
    borderRadius: ms(25),
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: ms(16),
    fontWeight: '700',
  },
});

export default EditProfile;


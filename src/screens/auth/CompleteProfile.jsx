import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Platform,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { styles } from './CompleteProfile.Style';
import { Colors } from '../../constants';
import { useAuth } from '../../hooks';
import { promptImagePicker, AppIcon, AppImage } from '../../lib';
import { uploadImageToCloudinary } from '../../services/cloudinary';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&q=80',
];

const AVAILABLE_HOBBIES = [
  'Traveling',
  'Photography',
  'Music',
  'Fitness',
  'Coffee',
  'Gaming',
  'Movies',
  'Cooking',
  'Art',
];

const CompleteProfile = () => {
  const { user, saveProfile, loading } = useAuth();
  const [selectedAvatar, setSelectedAvatar] = useState(PRESET_AVATARS[0]);
  const [selectedHobbies, setSelectedHobbies] = useState(['Traveling', 'Music']);
  const [focusedField, setFocusedField] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      city: '',
      bio: '',
    },
  });

  const handlePickImage = () => {
    promptImagePicker({
      title: 'Profile Photo',
      message: 'Upload your photo to Cloudinary',
      onImageSelected: async (image) => {
        setIsUploading(true);
        try {
          const cloudinaryUrl = await uploadImageToCloudinary(image);
          setSelectedAvatar(cloudinaryUrl);
        } catch (err) {
          Alert.alert('Upload Error', err.message || 'Could not upload to Cloudinary');
        } finally {
          setIsUploading(false);
        }
      },
      onError: (err) => {
        Alert.alert('Error', err.message || 'Could not select photo');
      },
    });
  };

  const toggleHobby = (hobby) => {
    if (selectedHobbies.includes(hobby)) {
      setSelectedHobbies(selectedHobbies.filter((h) => h !== hobby));
    } else {
      setSelectedHobbies([...selectedHobbies, hobby]);
    }
  };

  const onSubmit = async (data) => {
    Keyboard.dismiss();
    try {
      await saveProfile({
        photoURL: selectedAvatar,
        city: data.city.trim(),
        bio: data.bio.trim(),
        hobbies: selectedHobbies,
      });
      // RootNavigation will automatically route to AppNavigation when isProfileCompleted is true
    } catch (err) {
      Alert.alert('Save Failed', err.message || 'Could not save profile.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Title Header */}
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Welcome, {user?.displayName || 'Friend'}!</Text>
              <Text style={styles.subtitle}>
                Complete your profile to start seeing people in your area.
              </Text>
            </View>

            {/* Profile Avatar Selection */}
            <View style={styles.avatarSection}>
              <TouchableOpacity
                style={styles.avatarContainer}
                activeOpacity={0.8}
                onPress={handlePickImage}
                disabled={isUploading}
              >
                {selectedAvatar ? (
                  <AppImage source={{ uri: selectedAvatar }} style={styles.avatarImage} priority="high" />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <AppIcon name="camera" size={30} color={Colors.primary} />
                    <Text style={styles.avatarPlaceholderText}>Add Photo</Text>
                  </View>
                )}
                {isUploading ? (
                  <View style={styles.uploadingOverlay}>
                    <ActivityIndicator size="small" color={Colors.white} />
                  </View>
                ) : (
                  <View style={styles.badge}>
                    <AppIcon name="plus" size={14} color={Colors.white} />
                  </View>
                )}
              </TouchableOpacity>
              <Text style={styles.avatarHelperText}>
                Tap photo to upload from Camera or Gallery
              </Text>

              {/* Avatar Presets */}
              <View style={styles.avatarPresetsRow}>
                {PRESET_AVATARS.map((url, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      styles.presetThumb,
                      selectedAvatar === url && styles.presetThumbSelected,
                    ]}
                    activeOpacity={0.8}
                    onPress={() => setSelectedAvatar(url)}
                  >
                    <AppImage source={{ uri: url }} style={styles.presetImage} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Form */}
            <View style={styles.form}>
              {/* City */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Your City / Location</Text>
                <Controller
                  control={control}
                  name="city"
                  rules={{
                    required: 'City is required',
                    minLength: {
                      value: 2,
                      message: 'Please enter a valid city name',
                    },
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View
                      style={[
                        styles.inputContainer,
                        focusedField === 'city' && styles.inputContainerFocused,
                        errors.city && styles.inputContainerError,
                      ]}
                    >
                      <TextInput
                        style={styles.input}
                        placeholder="e.g. New York, London, Mumbai"
                        placeholderTextColor={Colors.textMuted}
                        autoCapitalize="words"
                        value={value}
                        onBlur={() => {
                          onBlur();
                          setFocusedField(null);
                        }}
                        onFocus={() => setFocusedField('city')}
                        onChangeText={onChange}
                      />
                    </View>
                  )}
                />
                {errors.city && (
                  <Text style={styles.errorText}>{errors.city.message}</Text>
                )}
              </View>

              {/* About / Bio */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>About You (Bio)</Text>
                <Controller
                  control={control}
                  name="bio"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View
                      style={[
                        styles.inputContainer,
                        styles.bioInputContainer,
                        focusedField === 'bio' && styles.inputContainerFocused,
                      ]}
                    >
                      <TextInput
                        style={[styles.input, styles.bioInput]}
                        placeholder="Write a short intro about yourself..."
                        placeholderTextColor={Colors.textMuted}
                        multiline={true}
                        numberOfLines={3}
                        value={value}
                        onBlur={() => {
                          onBlur();
                          setFocusedField(null);
                        }}
                        onFocus={() => setFocusedField('bio')}
                        onChangeText={onChange}
                      />
                    </View>
                  )}
                />
              </View>

              {/* Hobbies / Interests */}
              <Text style={styles.hobbiesLabel}>Passions & Hobbies</Text>
              <View style={styles.hobbiesContainer}>
                {AVAILABLE_HOBBIES.map((hobby) => {
                  const isSelected = selectedHobbies.includes(hobby);
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
                        {hobby}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Save Button */}
              <TouchableOpacity
                style={styles.saveButton}
                activeOpacity={0.85}
                onPress={handleSubmit(onSubmit)}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={Colors.white} />
                ) : (
                  <Text style={styles.saveButtonText}>Save & Start Swiping</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CompleteProfile;

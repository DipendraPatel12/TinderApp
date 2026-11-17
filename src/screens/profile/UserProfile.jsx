import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBlock, useSwipes, useChat } from '../../hooks';
import { AppIcon, AppImage } from '../../lib';
import { Colors } from '../../constants';
import styles from './UserProfile.Style';

const UserProfile = ({ route, navigation }) => {
  const { profile } = route.params || {};
  const { block } = useBlock();
  const { loadDeck } = useSwipes();
  const { loadMatches } = useChat();

  if (!profile) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <Text style={styles.errorText}>Profile not found.</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleBlockUser = () => {
    Alert.alert(
      `Block ${profile.displayName}?`,
      'They will no longer be able to see your profile, swipe on you, or message you. Any active match will be removed.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Block User',
          style: 'destructive',
          onPress: async () => {
            const success = await block(profile);
            if (success) {
              loadDeck();
              loadMatches();
              Alert.alert('Blocked', `${profile.displayName} has been blocked.`);
              navigation.navigate('MainTabs');
            } else {
              Alert.alert('Error', 'Failed to block user. Please try again.');
            }
          },
        },
      ]
    );
  };

  const photo =
    profile.photoURL ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80';

  const hobbiesList = Array.isArray(profile?.hobbies)
    ? profile.hobbies
    : Object.values(profile?.hobbies || {});

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar backgroundColor={Colors.white} barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerIconButton}
          activeOpacity={0.7}
        >
          <AppIcon name="chevron-left" size={20} color={Colors.textHeading} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{profile.displayName}</Text>

        <TouchableOpacity
          onPress={handleBlockUser}
          style={styles.headerIconButton}
          activeOpacity={0.7}
        >
          <AppIcon name="ban" size={20} color={Colors.nope} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <AppImage source={{ uri: photo }} style={styles.profileImage} priority="high" />
        </View>

        <View style={styles.infoCard}>
          <View style={styles.nameRow}>
            <Text style={styles.nameText}>{profile.displayName}</Text>
            {profile.age ? <Text style={styles.ageText}>{profile.age}</Text> : null}
          </View>

          {profile.city ? (
            <View style={styles.cityRow}>
              <AppIcon name="map-marker" size={16} color={Colors.textLight} style={{ marginRight: 6 }} />
              <Text style={styles.cityText}>{profile.city}</Text>
            </View>
          ) : null}

          {profile.bio ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About Me</Text>
              <Text style={styles.bioText}>{profile.bio}</Text>
            </View>
          ) : null}

          {hobbiesList.length > 0 ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Interests</Text>
              <View style={styles.hobbiesContainer}>
                {hobbiesList.map((hobby, index) => (
                  <View key={index} style={styles.hobbyChip}>
                    <Text style={styles.hobbyText}>{hobby}</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}

          <TouchableOpacity
            style={styles.blockButton}
            activeOpacity={0.8}
            onPress={handleBlockUser}
          >
            <AppIcon name="ban" size={16} color={Colors.nope} style={{ marginRight: 8 }} />
            <Text style={styles.blockButtonText}>Block {profile.displayName}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserProfile;

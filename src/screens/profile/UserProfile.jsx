import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBlock, useSwipes, useChat } from '../../hooks';
import { AppIcon, AppImage } from '../../lib';
import { Colors, s, vs, ms, Metrics } from '../../constants';

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
              loadDeck(); // Refresh card deck
              loadMatches(); // Refresh matches list
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
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerIconButton}
          activeOpacity={0.7}
        >
          <AppIcon name="chevron-left" size={20} color="#222222" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{profile.displayName}</Text>

        <TouchableOpacity
          onPress={handleBlockUser}
          style={styles.headerIconButton}
          activeOpacity={0.7}
        >
          <AppIcon name="ban" size={20} color="#FF3F56" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Full-width Profile Photo */}
        <View style={styles.imageContainer}>
          <AppImage source={{ uri: photo }} style={styles.profileImage} priority="high" />
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.nameRow}>
            <Text style={styles.nameText}>{profile.displayName}</Text>
            {profile.age ? <Text style={styles.ageText}>{profile.age}</Text> : null}
          </View>

          {profile.city ? (
            <View style={styles.cityRow}>
              <AppIcon name="map-marker" size={16} color="#777777" style={{ marginRight: 6 }} />
              <Text style={styles.cityText}>{profile.city}</Text>
            </View>
          ) : null}

          {/* About Me / Bio */}
          {profile.bio ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About Me</Text>
              <Text style={styles.bioText}>{profile.bio}</Text>
            </View>
          ) : null}

          {/* Interests / Hobbies */}
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

          {/* Block User Button */}
          <TouchableOpacity
            style={styles.blockButton}
            activeOpacity={0.8}
            onPress={handleBlockUser}
          >
            <AppIcon name="ban" size={16} color="#FF3F56" style={{ marginRight: 8 }} />
            <Text style={styles.blockButtonText}>Block {profile.displayName}</Text>
          </TouchableOpacity>
        </View>
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
  headerIconButton: {
    padding: s(6),
  },
  headerTitle: {
    fontSize: ms(18),
    fontWeight: '700',
    color: '#222222',
  },
  imageContainer: {
    width: Metrics.screenWidth,
    height: Metrics.screenHeight * 0.48,
    backgroundColor: '#E0E0E0',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: s(20),
    paddingVertical: vs(20),
    borderTopLeftRadius: ms(24),
    borderTopRightRadius: ms(24),
    marginTop: -vs(20),
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: vs(4),
  },
  nameText: {
    fontSize: ms(26),
    fontWeight: '800',
    color: '#222222',
  },
  ageText: {
    fontSize: ms(24),
    fontWeight: '400',
    color: '#555555',
    marginLeft: s(8),
  },
  cityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(16),
  },
  cityText: {
    fontSize: ms(15),
    color: '#777777',
    fontWeight: '500',
  },
  section: {
    marginVertical: vs(12),
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
    paddingTop: vs(12),
  },
  sectionTitle: {
    fontSize: ms(13),
    fontWeight: '700',
    color: '#888888',
    textTransform: 'uppercase',
    letterSpacing: ms(0.8),
    marginBottom: vs(8),
  },
  bioText: {
    fontSize: ms(15),
    color: '#444444',
    lineHeight: ms(22),
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
    fontSize: ms(13),
    fontWeight: '600',
  },
  blockButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: vs(28),
    marginBottom: vs(16),
    paddingVertical: vs(14),
    borderRadius: ms(25),
    borderWidth: 1.5,
    borderColor: '#FF3F56',
    backgroundColor: '#FFF5F6',
  },
  blockButtonText: {
    color: '#FF3F56',
    fontSize: ms(14),
    fontWeight: '700',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: ms(16),
    color: '#666666',
    marginBottom: vs(16),
  },
  backBtn: {
    backgroundColor: '#FE3C72',
    paddingHorizontal: s(20),
    paddingVertical: vs(10),
    borderRadius: ms(20),
  },
  backBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default UserProfile;

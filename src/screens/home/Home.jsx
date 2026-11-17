import React, { useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  PanResponder,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useSwipes, useAuth } from '../../hooks';
import { AppIcon, AppImage } from '../../lib';
import { Colors } from '../../constants';
import MatchModal from './MatchModal';
import styles from './Home.Style';

const Home = ({ navigation }) => {
  const { user, userData } = useAuth();
  const {
    deck,
    currentCard,
    loading,
    showMatchModal,
    matchedUser,
    loadDeck,
    swipeLeft,
    swipeRight,
    dismissMatchModal,
  } = useSwipes();

  useFocusEffect(
    useCallback(() => {
      loadDeck();
    }, [loadDeck])
  );

  const swipeLeftRef = useRef(swipeLeft);
  const swipeRightRef = useRef(swipeRight);

  useEffect(() => {
    swipeLeftRef.current = swipeLeft;
    swipeRightRef.current = swipeRight;
  }, [swipeLeft, swipeRight]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (evt, gesture) => {
        return Math.abs(gesture.dx) > 10;
      },
      onPanResponderTerminationRequest: () => false,
      onPanResponderRelease: (evt, gesture) => {
        if (gesture.dx < -40) {
          swipeLeftRef.current();
        }
        else if (gesture.dx > 40) {
          swipeRightRef.current();
        }
      },
    })
  ).current;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={Colors.white} barStyle="dark-content" />

      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <AppIcon name="fire" size={26} color={Colors.primary} style={{ marginRight: 6 }} />
          <Text style={styles.headerTitle}>tinder</Text>
        </View>
        <TouchableOpacity onPress={loadDeck} style={{ padding: 4 }}>
          <AppIcon name="refresh" size={18} color={Colors.textSub} />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        {loading && deck.length === 0 ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Finding people nearby...</Text>
          </View>
        ) : !currentCard ? (
          <View style={styles.centerContainer}>
            <View style={{ marginBottom: 12 }}>
              <AppIcon name="fire" size={60} color={Colors.primary} />
            </View>
            <Text style={styles.emptyTitle}>No more profiles nearby</Text>
            <Text style={styles.emptySubtitle}>
              Check back later or refresh to find more people!
            </Text>
            <TouchableOpacity style={styles.refreshButton} onPress={loadDeck}>
              <Text style={styles.refreshButtonText}>Refresh</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.cardContainer} {...panResponder.panHandlers}>
            <AppImage
              source={{
                uri:
                  currentCard.photoURL ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
              }}
              style={styles.cardImage}
              resizeMode="cover"
              priority="high"
            />

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => navigation.navigate('UserProfile', { profile: currentCard })}
              style={styles.cardInfo}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={styles.nameText}>
                  {currentCard.displayName}
                  {currentCard.age ? `, ${currentCard.age}` : ''}
                </Text>
                <AppIcon name="info-circle" size={22} color={Colors.white} />
              </View>

              {currentCard.city ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                  <AppIcon
                    name="map-marker"
                    size={15}
                    color={Colors.borderLightAlt}
                    style={{ marginRight: 6 }}
                  />
                  <Text style={styles.cityText}>{currentCard.city}</Text>
                </View>
              ) : null}

              {currentCard.bio ? (
                <Text style={styles.bioText} numberOfLines={2}>
                  {currentCard.bio}
                </Text>
              ) : null}

              {(() => {
                const cardHobbies = Array.isArray(currentCard.hobbies)
                  ? currentCard.hobbies
                  : Object.values(currentCard.hobbies || {});
                if (cardHobbies.length === 0) return null;
                return (
                  <View style={styles.hobbiesRow}>
                    {cardHobbies.slice(0, 4).map((hobby, index) => (
                      <View key={index} style={styles.hobbyChip}>
                        <Text style={styles.hobbyText}>{hobby}</Text>
                      </View>
                    ))}
                  </View>
                );
              })()}
            </TouchableOpacity>
          </View>
        )}

        {currentCard ? (
          <View style={styles.bottomBar}>
            <TouchableOpacity
              style={[styles.button, styles.rejectButton]}
              activeOpacity={0.7}
              onPress={() => swipeLeft()}
            >
              <AppIcon name="times" size={30} color={Colors.nope} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.likeButton]}
              activeOpacity={0.7}
              onPress={() => swipeRight()}
            >
              <AppIcon name="heart" size={28} color={Colors.like} />
            </TouchableOpacity>
          </View>
        ) : null}
      </View>

      <MatchModal
        visible={showMatchModal}
        currentUser={userData || user}
        matchedUser={matchedUser}
        onClose={dismissMatchModal}
        onSendMessage={() => {
          dismissMatchModal();
          if (navigation && matchedUser) {
            navigation.navigate('ChatScreen', {
              match: {
                id: [user?.uid, matchedUser.uid].sort().join('_'),
                otherUser: matchedUser,
              },
            });
          }
        }}
      />
    </SafeAreaView>
  );
};

export default Home;

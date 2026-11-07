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

  // Reload profiles whenever screen gains focus
  useFocusEffect(
    useCallback(() => {
      loadDeck();
    }, [loadDeck])
  );

  // Keep latest swipe functions in refs so PanResponder never has stale closure
  const swipeLeftRef = useRef(swipeLeft);
  const swipeRightRef = useRef(swipeRight);

  useEffect(() => {
    swipeLeftRef.current = swipeLeft;
    swipeRightRef.current = swipeRight;
  }, [swipeLeft, swipeRight]);

  // Simple PanResponder to detect finger dragging Left or Right
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (evt, gesture) => {
        // Only claim gesture if finger moved horizontally more than 10 pixels
        return Math.abs(gesture.dx) > 10;
      },
      onPanResponderTerminationRequest: () => false,
      onPanResponderRelease: (evt, gesture) => {
        // Dragged Left -> Like
        if (gesture.dx < -40) {
          swipeLeftRef.current();
        }
        // Dragged Right -> Reject
        else if (gesture.dx > 40) {
          swipeRightRef.current();
        }
      },
    })
  ).current;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <AppIcon name="fire" size={26} color="#FE3C72" style={{ marginRight: 6 }} />
          <Text style={styles.headerTitle}>tinder</Text>
        </View>
        <TouchableOpacity onPress={loadDeck} style={{ padding: 4 }}>
          <AppIcon name="refresh" size={18} color="#555555" />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        {/* Loading State */}
        {loading && deck.length === 0 ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#FE3C72" />
            <Text style={styles.loadingText}>Finding people nearby...</Text>
          </View>
        ) : !currentCard ? (
          /* Empty Deck State */
          <View style={styles.centerContainer}>
            <View style={{ marginBottom: 12 }}>
              <AppIcon name="fire" size={60} color="#FE3C72" />
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
          /* Current Profile Card (Swipeable) */
          <View style={styles.cardContainer} {...panResponder.panHandlers}>
            {/* User Photo */}
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

            {/* Profile Info Overlay (Tap to view full profile) */}
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
                <AppIcon name="info-circle" size={22} color="#FFFFFF" />
              </View>

              {currentCard.city ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                  <AppIcon
                    name="map-marker"
                    size={15}
                    color="#EEEEEE"
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

              {/* Hobbies */}
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

        {/* Bottom Buttons */}
        {currentCard ? (
          <View style={styles.bottomBar}>
            {/* Reject Button (Swipe Right) */}
            <TouchableOpacity
              style={[styles.button, styles.rejectButton]}
              activeOpacity={0.7}
              onPress={() => swipeRight()}
            >
              <AppIcon name="times" size={30} color="#FF3F56" />
            </TouchableOpacity>

            {/* Like Button (Swipe Left) */}
            <TouchableOpacity
              style={[styles.button, styles.likeButton]}
              activeOpacity={0.7}
              onPress={() => swipeLeft()}
            >
              <AppIcon name="heart" size={28} color="#20D5A1" />
            </TouchableOpacity>
          </View>
        ) : null}
      </View>

      {/* Match Celebration Modal */}
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

import { getDb } from './firebase';

// Demo fallback match for testing chat immediately
const DEMO_MATCH = {
  id: 'demo_match_sophia',
  otherUser: {
    uid: 'demo_user_sophia',
    displayName: 'Sophia Chen',
    photoURL:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    city: 'New York',
  },
  lastMessage: 'You matched! Say hello 👋',
  lastMessageTimestamp: Date.now() - 1000 * 60 * 10, // 10 mins ago
  createdAt: Date.now() - 1000 * 60 * 60,
};

/**
 * Fetch all matches for the current user from Realtime Database
 */
export const fetchUserMatches = async (currentUserId) => {
  try {
    let matchesData = {};
    let myBlocked = {};
    const db = getDb();

    if (currentUserId) {
      try {
        const matchesSnap = await db.ref('/matches').once('value');
        matchesData = matchesSnap.val() || {};
      } catch (err) {
        console.log('Error fetching matches from RTDB:', err.message);
      }

      try {
        const blockedSnap = await db.ref(`/blockedUsers/${currentUserId}`).once('value');
        myBlocked = blockedSnap.val() || {};
      } catch (err) {
        console.log('Error fetching blocked users in chat:', err.message);
      }
    }

    // Filter matches where current user is a participant and other user is not blocked
    const userMatches = Object.values(matchesData)
      .filter((match) => match?.users && match.users[currentUserId])
      .map((match) => {
        // Find the OTHER user in this match
        const otherUserId = Object.keys(match.users).find((id) => id !== currentUserId);
        const otherParticipant = match.participants
          ? match.participants[otherUserId]
          : null;

        return {
          id: match.id,
          otherUser: {
            uid: otherUserId,
            displayName: otherParticipant?.displayName || 'Match',
            photoURL: otherParticipant?.photoURL || '',
          },
          lastMessage: match.lastMessage || 'You matched! Say hello 👋',
          lastMessageTimestamp:
            match.lastMessageTimestamp || match.createdAt || Date.now(),
          createdAt: match.createdAt || Date.now(),
        };
      })
      .filter((m) => !myBlocked[m.otherUser.uid])
      .sort((a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp);

    // If no real matches exist yet and demo is not blocked, provide demo match so user can test chat right away
    if (userMatches.length === 0) {
      if (!myBlocked[DEMO_MATCH.otherUser.uid]) {
        return [DEMO_MATCH];
      }
      return [];
    }

    return userMatches;
  } catch (error) {
    console.log('Error in fetchUserMatches:', error.message);
    return [];
  }
};

/**
 * Fetch all messages for a specific match from Realtime Database
 */
export const fetchMessages = async (matchId) => {
  try {
    const db = getDb();
    const snapshot = await db
      .ref(`/messages/${matchId}`)
      .orderByChild('timestamp')
      .once('value');
    const data = snapshot.val() || {};

    // Convert messages object to sorted array
    const messageList = Object.values(data).sort(
      (a, b) => (a.timestamp || 0) - (b.timestamp || 0)
    );

    // If demo match and empty, provide welcome message
    if (matchId === DEMO_MATCH.id && messageList.length === 0) {
      return [
        {
          id: 'welcome_1',
          senderId: DEMO_MATCH.otherUser.uid,
          text: 'Hey! Nice to match with you! How is your day going? 😊',
          timestamp: Date.now() - 1000 * 60 * 5,
        },
      ];
    }

    return messageList;
  } catch (error) {
    console.log('Error in fetchMessages:', error.message);
    return [];
  }
};

/**
 * Subscribe to realtime message updates for a match with listener cleanup
 * @param {string} matchId
 * @param {function} callback
 * @returns {function} Unsubscribe cleanup function
 */
export const subscribeToMessages = (matchId, callback) => {
  if (!matchId) return () => {};
  const db = getDb();
  const messagesRef = db.ref(`/messages/${matchId}`).orderByChild('timestamp');

  const onValue = (snapshot) => {
    const data = snapshot.val() || {};
    const messageList = Object.values(data).sort(
      (a, b) => (a.timestamp || 0) - (b.timestamp || 0)
    );
    callback(messageList);
  };

  messagesRef.on('value', onValue);

  return () => {
    messagesRef.off('value', onValue);
  };
};

/**
 * Send a chat message using native push() and update()
 */
export const sendChatMessage = async (matchId, senderId, text) => {
  if (!text || !text.trim() || !matchId) return null;

  const db = getDb();
  const timestamp = Date.now();
  const messagesRef = db.ref(`/messages/${matchId}`);
  const newMsgRef = messagesRef.push();
  const messageId = newMsgRef.key;

  const message = {
    id: messageId,
    senderId,
    text: text.trim(),
    timestamp,
  };

  try {
    // 1. Save message with native set()
    await newMsgRef.set(message);

    // 2. Update match's last message with native update()
    await db.ref(`/matches/${matchId}`).update({
      lastMessage: text.trim(),
      lastMessageTimestamp: timestamp,
    });

    return message;
  } catch (error) {
    console.log('Error in sendChatMessage:', error.message);
    return message;
  }
};

export default {
  fetchUserMatches,
  fetchMessages,
  subscribeToMessages,
  sendChatMessage,
};

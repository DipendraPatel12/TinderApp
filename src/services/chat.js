import { getDb, serverTimestamp } from './firebase';

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

    const userMatches = Object.values(matchesData)
      .filter((match) => match?.users && match.users[currentUserId])
      .map((match) => {
        const otherUserId = Object.keys(match.users).find((id) => id !== currentUserId);
        const otherParticipant = match.participants
          ? match.participants[otherUserId]
          : null;

        const rawLastTime = match.lastMessageTimestamp ?? match.createdAt;
        const lastMessageTimestamp =
          typeof rawLastTime === 'number'
            ? rawLastTime
            : Number(rawLastTime) || Date.now();
        const createdAt =
          typeof match.createdAt === 'number'
            ? match.createdAt
            : Number(match.createdAt) || Date.now();

        return {
          id: match.id,
          otherUser: {
            uid: otherUserId,
            displayName: otherParticipant?.displayName || 'Match',
            photoURL: otherParticipant?.photoURL || '',
          },
          lastMessage: match.lastMessage || 'You matched! Say hello 👋',
          lastMessageTimestamp,
          createdAt,
        };
      })
      .filter((m) => !myBlocked[m.otherUser.uid])
      .sort((a, b) => (Number(b.lastMessageTimestamp) || 0) - (Number(a.lastMessageTimestamp) || 0));

    return userMatches;
  } catch (error) {
    console.log('Error in fetchUserMatches:', error.message);
    return [];
  }
};

export const fetchMessages = async (matchId) => {
  try {
    const db = getDb();
    const snapshot = await db
      .ref(`/messages/${matchId}`)
      .orderByChild('timestamp')
      .once('value');
    const data = snapshot.val() || {};

    const messageList = Object.values(data).sort(
      (a, b) => (a.timestamp || 0) - (b.timestamp || 0)
    );

    return messageList;
  } catch (error) {
    console.log('Error in fetchMessages:', error.message);
    return [];
  }
};

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

export const sendChatMessage = async (matchId, senderId, text) => {
  if (!text || !text.trim() || !matchId) return null;

  const db = getDb();
  const localTimestamp = Date.now();
  const messagesRef = db.ref(`/messages/${matchId}`);
  const newMsgRef = messagesRef.push();
  const messageId = newMsgRef.key;

  const messagePayload = {
    id: messageId,
    senderId,
    text: text.trim(),
    timestamp: serverTimestamp(),
  };

  const optimisticMessage = {
    id: messageId,
    senderId,
    text: text.trim(),
    timestamp: localTimestamp,
  };

  try {
    await newMsgRef.set(messagePayload);

    await db.ref(`/matches/${matchId}`).update({
      lastMessage: text.trim(),
      lastMessageTimestamp: serverTimestamp(),
    });

    return optimisticMessage;
  } catch (error) {
    console.log('Error in sendChatMessage:', error.message);
    return optimisticMessage;
  }
};

export default {
  fetchUserMatches,
  fetchMessages,
  subscribeToMessages,
  sendChatMessage,
};

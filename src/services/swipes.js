import { getDb, serverTimestamp } from './firebase';

export const fetchCandidates = async (currentUserId) => {
  try {
    let allUsers = {};
    let mySwipes = {};
    let myBlocked = {};
    const db = getDb();

    try {
      const usersSnap = await db.ref('/users').once('value');
      allUsers = usersSnap.val() || {};
    } catch (e) {
      console.log('Error fetching users from database:', e.message);
    }

    if (currentUserId) {
      try {
        const swipesSnap = await db.ref(`/swipes/${currentUserId}`).once('value');
        mySwipes = swipesSnap.val() || {};
      } catch (e) {
        console.log('Error fetching user swipes:', e.message);
      }

      try {
        const blockedSnap = await db.ref(`/blockedUsers/${currentUserId}`).once('value');
        myBlocked = blockedSnap.val() || {};
      } catch (e) {
        console.log('Error fetching blocked users:', e.message);
      }
    }

    const realUsers = Object.values(allUsers).filter((user) => {
      if (!user?.uid) return false;
      if (user.uid === currentUserId) return false;
      if (!user.isProfileCompleted) return false;
      if (mySwipes[user.uid]) return false;
      if (myBlocked[user.uid]) return false;
      return true;
    });

    return realUsers;
  } catch (error) {
    console.log('Error in fetchCandidates:', error.message);
    return [];
  }
};

export const recordSwipe = async (
  currentUserId,
  currentUserData,
  targetUser,
  direction
) => {
  try {
    const db = getDb();

    if (currentUserId && targetUser?.uid) {
      await db.ref(`/swipes/${currentUserId}/${targetUser.uid}`).set(direction);
    }

    if (direction !== 'like') {
      return { isMatch: false };
    }

    let targetLikedMe = false;

    if (currentUserId && targetUser?.uid) {
      try {
        const checkSnap = await db
          .ref(`/swipes/${targetUser.uid}/${currentUserId}`)
          .once('value');
        targetLikedMe = checkSnap.val() === 'like';
      } catch (e) {
        console.log('Error checking target swipe:', e.message);
      }
    }

    if (targetLikedMe) {
      const matchId = [currentUserId, targetUser.uid].sort().join('_');

      const matchData = {
        id: matchId,
        users: {
          [currentUserId]: true,
          [targetUser.uid]: true,
        },
        participants: {
          [currentUserId]: {
            uid: currentUserId,
            displayName: currentUserData?.displayName || 'You',
            photoURL: currentUserData?.photoURL || '',
          },
          [targetUser.uid]: {
            uid: targetUser.uid,
            displayName: targetUser.displayName || 'Anonymous',
            photoURL: targetUser.photoURL || '',
          },
        },
        createdAt: serverTimestamp(),
        lastMessage: 'You matched! Say hello 👋',
        lastMessageTimestamp: serverTimestamp(),
      };

      try {
        await db.ref(`/matches/${matchId}`).set(matchData);
      } catch (e) {
        console.log('Error saving match record:', e.message);
      }

      return {
        isMatch: true,
        matchData: {
          matchId,
          matchedUser: targetUser,
        },
      };
    }

    return { isMatch: false };
  } catch (error) {
    console.log('Error in recordSwipe:', error.message);
    return { isMatch: false };
  }
};

export default {
  fetchCandidates,
  recordSwipe,
};

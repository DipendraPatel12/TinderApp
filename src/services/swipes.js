import { getDb } from './firebase';

// Fallback seed profiles for initial demo/testing when database has no other users
const DEFAULT_CANDIDATES = [
  {
    uid: 'demo_user_sophia',
    displayName: 'Sophia Chen',
    age: 23,
    city: 'New York',
    photoURL:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    bio: 'Architect & weekend photographer 📸. Coffee enthusiast, love exploring hidden rooftop cafes.',
    hobbies: ['Photography', 'Architecture', 'Coffee', 'Art'],
    isProfileCompleted: true,
    autoMatch: true, // Auto-matches when you swipe like on her!
  },
  {
    uid: 'demo_user_liam',
    displayName: 'Liam Miller',
    age: 25,
    city: 'Brooklyn',
    photoURL:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    bio: 'Software engineer by day, guitarist by night 🎸. Big fan of indie rock, bouldering, and tacos.',
    hobbies: ['Music', 'Fitness', 'Coding', 'Foodie'],
    isProfileCompleted: true,
    autoMatch: true,
  },
  {
    uid: 'demo_user_olivia',
    displayName: 'Olivia Martinez',
    age: 24,
    city: 'Manhattan',
    photoURL:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    bio: 'UX designer & dog mom 🐶. Constantly curating Spotify playlists. Let’s grab matcha!',
    hobbies: ['Design', 'Dogs', 'Travel', 'Music'],
    isProfileCompleted: true,
    autoMatch: false,
  },
  {
    uid: 'demo_user_ethan',
    displayName: 'Ethan Vance',
    age: 26,
    city: 'Jersey City',
    photoURL:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    bio: 'Triathlete & startup founder. Love marathon training, good books, and spontaneous road trips.',
    hobbies: ['Running', 'Reading', 'Travel', 'Startups'],
    isProfileCompleted: true,
    autoMatch: true,
  },
];

/**
 * Fetch candidates excluding self, incomplete profiles, already swiped, and blocked users
 */
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

    // Convert users object to array and filter
    const realUsers = Object.values(allUsers).filter((user) => {
      if (!user?.uid) return false;
      if (user.uid === currentUserId) return false;
      if (!user.isProfileCompleted) return false;
      if (mySwipes[user.uid]) return false; // already swiped
      if (myBlocked[user.uid]) return false; // blocked
      return true;
    });

    // Also include demo candidates if they have not been swiped or blocked yet
    const demoUsers = DEFAULT_CANDIDATES.filter((demo) => {
      if (demo.uid === currentUserId) return false;
      if (mySwipes[demo.uid]) return false;
      if (myBlocked[demo.uid]) return false;
      // Do not duplicate if real user somehow has same uid
      return !realUsers.some((u) => u.uid === demo.uid);
    });

    return [...realUsers, ...demoUsers];
  } catch (error) {
    console.log('Error in fetchCandidates:', error.message);
    return DEFAULT_CANDIDATES;
  }
};

/**
 * Record swipe choice (like or reject) and detect mutual matches
 */
export const recordSwipe = async (
  currentUserId,
  currentUserData,
  targetUser,
  direction
) => {
  try {
    const db = getDb();

    // 1. Save swipe in Realtime Database under /swipes/{currentUserId}/{targetUserId}
    if (currentUserId && targetUser?.uid) {
      await db.ref(`/swipes/${currentUserId}/${targetUser.uid}`).set(direction);
    }

    // 2. If direction is not 'like', no match possible
    if (direction !== 'like') {
      return { isMatch: false };
    }

    // 3. Check if target user has already liked current user
    let targetLikedMe = false;

    // Check demo user autoMatch flag for testing
    if (targetUser?.autoMatch) {
      targetLikedMe = true;
    } else if (currentUserId && targetUser?.uid) {
      try {
        const checkSnap = await db
          .ref(`/swipes/${targetUser.uid}/${currentUserId}`)
          .once('value');
        targetLikedMe = checkSnap.val() === 'like';
      } catch (e) {
        console.log('Error checking target swipe:', e.message);
      }
    }

    // 4. If mutual like, create a match!
    if (targetLikedMe) {
      const matchId = [currentUserId, targetUser.uid].sort().join('_');
      const timestamp = Date.now();

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
        createdAt: timestamp,
        lastMessage: 'You matched! Say hello 👋',
        lastMessageTimestamp: timestamp,
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

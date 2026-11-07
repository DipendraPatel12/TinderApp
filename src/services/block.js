import { getDb } from './firebase';

/**
 * Block a user in Realtime Database under /blockedUsers/{currentUserId}/{targetUserId}
 * and remove any active match between them.
 */
export const blockUser = async (currentUserId, targetUser) => {
  if (!currentUserId || !targetUser?.uid) return false;

  try {
    const db = getDb();
    const timestamp = Date.now();
    const blockedData = {
      uid: targetUser.uid,
      displayName: targetUser.displayName || 'User',
      photoURL: targetUser.photoURL || '',
      blockedAt: timestamp,
    };

    // 1. Record in /blockedUsers/{currentUserId}/{targetUserId}
    await db
      .ref(`/blockedUsers/${currentUserId}/${targetUser.uid}`)
      .set(blockedData);

    // 2. Also remove any active match between these two users
    const matchId = [currentUserId, targetUser.uid].sort().join('_');
    try {
      await db.ref(`/matches/${matchId}`).remove();
    } catch (e) {
      // If match didn't exist, ignore
    }

    return true;
  } catch (error) {
    console.log('Error in blockUser:', error.message);
    return false;
  }
};

/**
 * Unblock a user by removing their entry from /blockedUsers/{currentUserId}/{targetUserId}
 */
export const unblockUser = async (currentUserId, targetUserId) => {
  if (!currentUserId || !targetUserId) return false;

  try {
    const db = getDb();
    await db.ref(`/blockedUsers/${currentUserId}/${targetUserId}`).remove();
    return true;
  } catch (error) {
    console.log('Error in unblockUser:', error.message);
    return false;
  }
};

/**
 * Fetch list of blocked users for the current user
 */
export const fetchBlockedUsers = async (currentUserId) => {
  if (!currentUserId) return [];

  try {
    const db = getDb();
    const snapshot = await db.ref(`/blockedUsers/${currentUserId}`).once('value');
    const data = snapshot.val() || {};
    return Object.values(data);
  } catch (error) {
    console.log('Error in fetchBlockedUsers:', error.message);
    return [];
  }
};

export default {
  blockUser,
  unblockUser,
  fetchBlockedUsers,
};

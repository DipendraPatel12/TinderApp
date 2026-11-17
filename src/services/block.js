import { getDb, serverTimestamp } from './firebase';

export const blockUser = async (currentUserId, targetUser) => {
  if (!currentUserId || !targetUser?.uid) return false;

  try {
    const db = getDb();
    const blockedData = {
      uid: targetUser.uid,
      displayName: targetUser.displayName || 'User',
      photoURL: targetUser.photoURL || '',
      blockedAt: serverTimestamp(),
    };

    await db
      .ref(`/blockedUsers/${currentUserId}/${targetUser.uid}`)
      .set(blockedData);

    const matchId = [currentUserId, targetUser.uid].sort().join('_');
    try {
      await db.ref(`/matches/${matchId}`).remove();
    } catch (e) {
    }

    return true;
  } catch (error) {
    console.log('Error in blockUser:', error.message);
    return false;
  }
};

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

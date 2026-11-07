import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { blockUser, unblockUser, fetchBlockedUsers } from '../services/block';

export const useBlock = () => {
  const { user } = useSelector((state) => state.auth);
  const [blockedList, setBlockedList] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadBlockedList = useCallback(async () => {
    if (!user?.uid) return;
    setLoading(true);
    try {
      const list = await fetchBlockedUsers(user.uid);
      setBlockedList(list);
    } catch (e) {
      console.log('Error loading blocked users:', e.message);
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  const block = useCallback(
    async (targetUser) => {
      if (!user?.uid || !targetUser?.uid) return false;
      const success = await blockUser(user.uid, targetUser);
      if (success) {
        setBlockedList((prev) => [...prev, targetUser]);
      }
      return success;
    },
    [user?.uid]
  );

  const unblock = useCallback(
    async (targetUserId) => {
      if (!user?.uid || !targetUserId) return false;
      const success = await unblockUser(user.uid, targetUserId);
      if (success) {
        setBlockedList((prev) => prev.filter((item) => item.uid !== targetUserId));
      }
      return success;
    },
    [user?.uid]
  );

  return {
    blockedList,
    loading,
    loadBlockedList,
    block,
    unblock,
  };
};

export default useBlock;


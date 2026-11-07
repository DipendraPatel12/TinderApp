import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  loadUserMatches,
  loadChatMessages,
  sendMessage,
  clearActiveChat,
  addMessageLocally,
} from '../redux/slices/chatSlice';

export const useChat = () => {
  const dispatch = useDispatch();
  const { matches, activeChatMessages, loadingMatches, loadingMessages, error } =
    useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);

  const loadMatches = useCallback(() => {
    dispatch(loadUserMatches(user?.uid || null));
  }, [dispatch, user?.uid]);

  const openChat = useCallback(
    (matchId) => {
      dispatch(loadChatMessages(matchId));
    },
    [dispatch]
  );

  const send = useCallback(
    async (matchId, text) => {
      if (!text || !text.trim()) return;
      return dispatch(
        sendMessage({
          matchId,
          senderId: user?.uid || 'me',
          text,
        })
      );
    },
    [dispatch, user?.uid]
  );

  const closeChat = useCallback(() => {
    dispatch(clearActiveChat());
  }, [dispatch]);

  const addLocalMessage = useCallback(
    (message) => {
      dispatch(addMessageLocally(message));
    },
    [dispatch]
  );

  return {
    matches,
    activeChatMessages,
    loadingMatches,
    loadingMessages,
    error,
    currentUserId: user?.uid || 'me',
    loadMatches,
    openChat,
    send,
    closeChat,
    addLocalMessage,
  };
};

export default useChat;


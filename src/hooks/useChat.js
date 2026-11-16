import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  loadUserMatches,
  loadChatMessages,
  sendMessage,
  clearActiveChat,
  addMessageLocally,
  setActiveChatMessages,
} from '../redux/slices/chatSlice';
import { subscribeToMessages } from '../services/chat';

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

  const syncMessages = useCallback(
    (messages) => {
      dispatch(setActiveChatMessages(messages));
    },
    [dispatch]
  );

  const subscribeToMatch = useCallback(
    (matchId) => {
      if (!matchId) return () => {};
      return subscribeToMessages(matchId, (messages) => {
        dispatch(setActiveChatMessages(messages));
      });
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
    syncMessages,
    subscribeToMatch,
  };
};

export default useChat;


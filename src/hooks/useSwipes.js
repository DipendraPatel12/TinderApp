import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  loadCandidates,
  swipeCard,
  popTopCard,
  closeMatchModal,
} from '../redux/slices/swipesSlice';

export const useSwipes = () => {
  const dispatch = useDispatch();
  const { deck, loading, error, showMatchModal, matchedUser } = useSelector(
    (state) => state.swipes
  );
  const { user, userData } = useSelector((state) => state.auth);

  const loadDeck = useCallback(() => {
    if (user?.uid) {
      dispatch(loadCandidates(user.uid));
    } else {
      dispatch(loadCandidates(null));
    }
  }, [dispatch, user?.uid]);

  const swipe = useCallback(
    (direction, cardToSwipe = null) => {
      const targetUser = cardToSwipe || deck[0];
      if (!targetUser) return;

      // Optimistically pop card from deck immediately
      dispatch(popTopCard());

      // Save swipe and check for match in background
      dispatch(
        swipeCard({
          currentUserId: user?.uid,
          currentUserData: userData,
          targetUser,
          direction,
        })
      );
    },
    [dispatch, deck, user?.uid, userData]
  );

  const swipeLeft = useCallback(
    (card = null) => {
      swipe('like', card); // Swipe Left = Like / Approve
    },
    [swipe]
  );

  const swipeRight = useCallback(
    (card = null) => {
      swipe('reject', card); // Swipe Right = Reject / Nope
    },
    [swipe]
  );

  const dismissMatchModal = useCallback(() => {
    dispatch(closeMatchModal());
  }, [dispatch]);

  return {
    deck,
    currentCard: deck[0] || null,
    nextCard: deck[1] || null,
    loading,
    error,
    showMatchModal,
    matchedUser,
    loadDeck,
    swipe,
    swipeLeft,
    swipeRight,
    dismissMatchModal,
  };
};

export default useSwipes;


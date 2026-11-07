import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCandidates, recordSwipe } from '../../services/swipes';

export const loadCandidates = createAsyncThunk(
  'swipes/loadCandidates',
  async (currentUserId, { rejectWithValue }) => {
    try {
      const candidates = await fetchCandidates(currentUserId);
      return candidates;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load profiles');
    }
  }
);

export const swipeCard = createAsyncThunk(
  'swipes/swipeCard',
  async ({ currentUserId, currentUserData, targetUser, direction }, { rejectWithValue }) => {
    try {
      const result = await recordSwipe(currentUserId, currentUserData, targetUser, direction);
      return {
        targetUser,
        direction,
        isMatch: result.isMatch,
        matchData: result.matchData || null,
      };
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to record swipe');
    }
  }
);

const initialState = {
  deck: [],
  loading: false,
  error: null,
  showMatchModal: false,
  matchedUser: null,
  lastSwipe: null,
};

const swipesSlice = createSlice({
  name: 'swipes',
  initialState,
  reducers: {
    popTopCard: (state) => {
      if (state.deck.length > 0) {
        state.deck.shift(); // Remove top card
      }
    },
    closeMatchModal: (state) => {
      state.showMatchModal = false;
      state.matchedUser = null;
    },
    resetDeck: (state) => {
      state.deck = [];
      state.loading = false;
      state.error = null;
      state.showMatchModal = false;
      state.matchedUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // loadCandidates
      .addCase(loadCandidates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadCandidates.fulfilled, (state, action) => {
        state.loading = false;
        state.deck = action.payload;
        state.error = null;
      })
      .addCase(loadCandidates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // swipeCard
      .addCase(swipeCard.fulfilled, (state, action) => {
        const { targetUser, direction, isMatch, matchData } = action.payload;
        state.lastSwipe = { targetUser, direction };
        // If it resulted in a mutual match, open celebration modal
        if (isMatch && matchData) {
          state.showMatchModal = true;
          state.matchedUser = matchData.matchedUser;
        }
      });
  },
});

export const { popTopCard, closeMatchModal, resetDeck } = swipesSlice.actions;
export default swipesSlice.reducer;


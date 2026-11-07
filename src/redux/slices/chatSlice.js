import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchUserMatches, fetchMessages, sendChatMessage } from '../../services/chat';

export const loadUserMatches = createAsyncThunk(
  'chat/loadUserMatches',
  async (currentUserId, { rejectWithValue }) => {
    try {
      const matches = await fetchUserMatches(currentUserId);
      return matches;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load matches');
    }
  }
);

export const loadChatMessages = createAsyncThunk(
  'chat/loadChatMessages',
  async (matchId, { rejectWithValue }) => {
    try {
      const messages = await fetchMessages(matchId);
      return { matchId, messages };
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load messages');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ matchId, senderId, text }, { rejectWithValue }) => {
    try {
      const message = await sendChatMessage(matchId, senderId, text);
      return { matchId, message };
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to send message');
    }
  }
);

const initialState = {
  matches: [],
  activeChatMessages: [],
  loadingMatches: false,
  loadingMessages: false,
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessageLocally: (state, action) => {
      state.activeChatMessages.push(action.payload);
    },
    clearActiveChat: (state) => {
      state.activeChatMessages = [];
      state.loadingMessages = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // loadUserMatches
      .addCase(loadUserMatches.pending, (state) => {
        state.loadingMatches = true;
        state.error = null;
      })
      .addCase(loadUserMatches.fulfilled, (state, action) => {
        state.loadingMatches = false;
        state.matches = action.payload;
        state.error = null;
      })
      .addCase(loadUserMatches.rejected, (state, action) => {
        state.loadingMatches = false;
        state.error = action.payload;
      })

      // loadChatMessages
      .addCase(loadChatMessages.pending, (state) => {
        state.loadingMessages = true;
      })
      .addCase(loadChatMessages.fulfilled, (state, action) => {
        state.loadingMessages = false;
        state.activeChatMessages = action.payload.messages;
      })
      .addCase(loadChatMessages.rejected, (state, action) => {
        state.loadingMessages = false;
        state.error = action.payload;
      })

      // sendMessage
      .addCase(sendMessage.fulfilled, (state, action) => {
        const { message, matchId } = action.payload;
        if (message) {
          // Check if message is already added
          const exists = state.activeChatMessages.some((m) => m.id === message.id);
          if (!exists) {
            state.activeChatMessages.push(message);
          }

          // Update last message in matches list
          const matchIndex = state.matches.findIndex((m) => m.id === matchId);
          if (matchIndex !== -1) {
            state.matches[matchIndex].lastMessage = message.text;
            state.matches[matchIndex].lastMessageTimestamp = message.timestamp;
          }
        }
      });
  },
});

export const { addMessageLocally, clearActiveChat } = chatSlice.actions;
export default chatSlice.reducer;


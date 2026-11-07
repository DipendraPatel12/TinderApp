import { StyleSheet } from 'react-native';
import { Colors, s, vs, ms } from '../../constants';

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(16),
    paddingVertical: vs(10),
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  backButton: {
    padding: s(6),
    marginRight: s(6),
  },
  headerAvatar: {
    width: ms(38),
    height: ms(38),
    borderRadius: ms(19),
    marginRight: s(10),
  },
  headerName: {
    fontSize: ms(16),
    fontWeight: '700',
    color: '#222222',
  },
  headerSubtitle: {
    fontSize: ms(11),
    color: '#4CAF50',
    fontWeight: '500',
  },

  // Messages List
  messagesList: {
    paddingHorizontal: s(16),
    paddingVertical: vs(12),
  },
  messageRow: {
    marginVertical: vs(4),
    flexDirection: 'row',
  },
  messageRowSent: {
    justifyContent: 'flex-end',
  },
  messageRowReceived: {
    justifyContent: 'flex-start',
  },

  // Bubbles
  bubble: {
    maxWidth: '75%',
    paddingHorizontal: s(14),
    paddingVertical: vs(10),
    borderRadius: ms(18),
  },
  bubbleSent: {
    backgroundColor: '#FE3C72',
    borderBottomRightRadius: ms(4),
  },
  bubbleReceived: {
    backgroundColor: '#EEEEEE',
    borderBottomLeftRadius: ms(4),
  },
  bubbleTextSent: {
    color: '#FFFFFF',
    fontSize: ms(15),
    lineHeight: ms(20),
  },
  bubbleTextReceived: {
    color: '#222222',
    fontSize: ms(15),
    lineHeight: ms(20),
  },
  timeText: {
    fontSize: ms(10),
    marginTop: vs(4),
    alignSelf: 'flex-end',
  },
  timeTextSent: {
    color: 'rgba(255, 255, 255, 0.75)',
  },
  timeTextReceived: {
    color: '#888888',
  },

  // Input Bar
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(12),
    paddingVertical: vs(8),
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: s(16),
    paddingVertical: vs(10),
    borderRadius: ms(22),
    fontSize: ms(14),
    color: '#222222',
    maxHeight: vs(100),
  },
  sendButton: {
    width: ms(42),
    height: ms(42),
    borderRadius: ms(21),
    backgroundColor: '#FFF0F4',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: s(8),
  },
  sendButtonActive: {
    backgroundColor: '#FE3C72',
  },
});


import { StyleSheet } from 'react-native';
import { s, vs, ms, Colors } from '../../constants';

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.surfaceLight,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(16),
    paddingVertical: vs(10),
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLightAlt,
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
    color: Colors.textHeading,
  },
  headerSubtitle: {
    fontSize: ms(11),
    color: Colors.green,
    fontWeight: '500',
  },

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

  bubble: {
    maxWidth: '75%',
    paddingHorizontal: s(14),
    paddingVertical: vs(10),
    borderRadius: ms(18),
  },
  bubbleSent: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: ms(4),
  },
  bubbleReceived: {
    backgroundColor: Colors.borderLightAlt,
    borderBottomLeftRadius: ms(4),
  },
  bubbleTextSent: {
    color: Colors.white,
    fontSize: ms(15),
    lineHeight: ms(20),
  },
  bubbleTextReceived: {
    color: Colors.textHeading,
    fontSize: ms(15),
    lineHeight: ms(20),
  },
  timeText: {
    fontSize: ms(10),
    marginTop: vs(4),
    alignSelf: 'flex-end',
  },
  timeTextSent: {
    color: Colors.overlayWhiteHigh,
  },
  timeTextReceived: {
    color: Colors.textDim,
  },

  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(12),
    paddingVertical: vs(8),
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLightAlt,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.surfaceAlt,
    paddingHorizontal: s(16),
    paddingVertical: vs(10),
    borderRadius: ms(22),
    fontSize: ms(14),
    color: Colors.textHeading,
    maxHeight: vs(100),
  },
  sendButton: {
    width: ms(42),
    height: ms(42),
    borderRadius: ms(21),
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: s(8),
  },
  sendButtonActive: {
    backgroundColor: Colors.primary,
  },
});

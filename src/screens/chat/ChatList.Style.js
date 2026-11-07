import { StyleSheet } from 'react-native';
import { Colors, s, vs, ms } from '../../constants';

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: s(20),
    paddingVertical: vs(14),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: ms(24),
    fontWeight: '800',
    color: '#222222',
  },

  // Section Titles
  sectionHeader: {
    paddingHorizontal: s(20),
    paddingTop: vs(16),
    paddingBottom: vs(10),
  },
  sectionTitle: {
    fontSize: ms(14),
    fontWeight: '700',
    color: '#FE3C72',
    textTransform: 'uppercase',
    letterSpacing: ms(0.8),
  },

  // New Matches Horizontal Row
  matchesScroll: {
    paddingHorizontal: s(16),
    paddingBottom: vs(14),
  },
  matchAvatarItem: {
    alignItems: 'center',
    marginRight: s(16),
    width: ms(72),
  },
  matchAvatarBorder: {
    width: ms(66),
    height: ms(66),
    borderRadius: ms(33),
    borderWidth: 2.5,
    borderColor: '#FE3C72',
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: vs(6),
  },
  matchAvatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: ms(30),
  },
  matchAvatarName: {
    fontSize: ms(12),
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: '#F5F5F5',
    marginHorizontal: s(20),
    marginVertical: vs(4),
  },

  // Conversations List Item
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(20),
    paddingVertical: vs(14),
    borderBottomWidth: 1,
    borderBottomColor: '#F9F9F9',
  },
  convAvatar: {
    width: ms(56),
    height: ms(56),
    borderRadius: ms(28),
    marginRight: s(14),
  },
  convInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  convHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(4),
  },
  convName: {
    fontSize: ms(16),
    fontWeight: '700',
    color: '#222222',
  },
  convTime: {
    fontSize: ms(12),
    color: '#999999',
  },
  convMessage: {
    fontSize: ms(13),
    color: '#777777',
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: s(40),
    paddingTop: vs(60),
  },
  emptyIcon: {
    marginBottom: vs(16),
  },
  emptyTitle: {
    fontSize: ms(18),
    fontWeight: '700',
    color: '#333333',
    marginBottom: vs(6),
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: ms(13),
    color: '#888888',
    textAlign: 'center',
    lineHeight: ms(18),
  },
});


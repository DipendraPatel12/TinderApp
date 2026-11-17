import { StyleSheet } from 'react-native';
import { s, vs, ms, Colors } from '../../constants';

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: s(16),
    paddingVertical: vs(14),
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLightAlt,
    backgroundColor: Colors.white,
  },
  backButton: {
    padding: s(6),
  },
  headerTitle: {
    fontSize: ms(18),
    fontWeight: '700',
    color: Colors.textHeading,
  },
  headerPlaceholder: {
    width: s(32),
  },
  listContent: {
    paddingVertical: vs(8),
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: s(16),
    paddingVertical: vs(12),
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceAlt,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: s(12),
  },
  avatar: {
    width: ms(48),
    height: ms(48),
    borderRadius: ms(24),
    backgroundColor: Colors.borderLightAlt,
  },
  avatarPlaceholder: {
    width: ms(48),
    height: ms(48),
    borderRadius: ms(24),
    backgroundColor: Colors.surfaceMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameContainer: {
    marginLeft: s(12),
    flex: 1,
  },
  userName: {
    fontSize: ms(16),
    fontWeight: '600',
    color: Colors.textHeading,
  },
  blockedSubtitle: {
    fontSize: ms(13),
    color: Colors.textPlaceholder,
    marginTop: vs(2),
  },
  unblockBtn: {
    paddingHorizontal: s(16),
    paddingVertical: vs(8),
    borderRadius: ms(20),
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: Colors.nopeLight,
  },
  unblockBtnText: {
    color: Colors.primary,
    fontSize: ms(13),
    fontWeight: '700',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: s(36),
  },
  emptyIconCircle: {
    width: ms(80),
    height: ms(80),
    borderRadius: ms(40),
    backgroundColor: Colors.surfaceMutedAlt,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: vs(16),
  },
  emptyTitle: {
    fontSize: ms(20),
    fontWeight: '700',
    color: Colors.textDark,
    marginBottom: vs(8),
  },
  emptySubtitle: {
    fontSize: ms(14),
    color: Colors.textDim,
    textAlign: 'center',
    lineHeight: ms(20),
  },
  loadingText: {
    marginTop: vs(12),
    fontSize: ms(14),
    color: Colors.textDim,
  },
});

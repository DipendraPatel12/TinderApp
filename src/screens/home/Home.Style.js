import { StyleSheet } from 'react-native';
import { s, vs, ms, Colors } from '../../constants';

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
    justifyContent: 'space-between',
    paddingBottom: vs(16),
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: s(20),
    paddingVertical: vs(12),
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLightAlt,
  },
  headerTitle: {
    fontSize: ms(24),
    fontWeight: '800',
    color: Colors.primary,
  },
  refreshIcon: {
    fontSize: ms(20),
  },

  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: s(32),
  },
  loadingText: {
    marginTop: vs(12),
    fontSize: ms(14),
    color: Colors.textGray,
  },
  emptyFlame: {
    fontSize: ms(48),
    marginBottom: vs(12),
  },
  emptyTitle: {
    fontSize: ms(20),
    fontWeight: '700',
    color: Colors.textHeading,
    marginBottom: vs(8),
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: ms(14),
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: vs(20),
    lineHeight: ms(20),
  },
  refreshButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: s(24),
    paddingVertical: vs(10),
    borderRadius: ms(20),
  },
  refreshButtonText: {
    color: Colors.white,
    fontSize: ms(14),
    fontWeight: '600',
  },

  cardContainer: {
    flex: 1,
    marginHorizontal: s(16),
    marginVertical: vs(10),
    borderRadius: ms(16),
    backgroundColor: Colors.white,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  cardInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.overlayMedium,
    padding: s(16),
  },
  nameText: {
    fontSize: ms(24),
    fontWeight: '800',
    color: Colors.white,
  },
  cityText: {
    fontSize: ms(14),
    color: Colors.borderLightAlt,
    marginTop: vs(4),
  },
  bioText: {
    fontSize: ms(13),
    color: Colors.borderMedium,
    marginTop: vs(6),
    lineHeight: ms(18),
  },
  hobbiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: vs(8),
  },
  hobbyChip: {
    backgroundColor: Colors.overlayWhiteSubtle,
    paddingHorizontal: s(8),
    paddingVertical: vs(3),
    borderRadius: ms(10),
    marginRight: s(6),
    marginTop: vs(4),
  },
  hobbyText: {
    color: Colors.white,
    fontSize: ms(11),
    fontWeight: '600',
  },

  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: vs(10),
  },
  button: {
    width: ms(60),
    height: ms(60),
    borderRadius: ms(30),
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  rejectButton: {
    borderWidth: 2,
    borderColor: Colors.nope,
  },
  likeButton: {
    borderWidth: 2,
    borderColor: Colors.like,
  },
  buttonText: {
    fontSize: ms(26),
  },
});

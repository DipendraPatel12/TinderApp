import { StyleSheet } from 'react-native';
import { Colors, s, vs, ms } from '../../constants';

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    justifyContent: 'space-between',
    paddingBottom: vs(16),
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: s(20),
    paddingVertical: vs(12),
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerTitle: {
    fontSize: ms(24),
    fontWeight: '800',
    color: '#FE3C72',
  },
  refreshIcon: {
    fontSize: ms(20),
  },

  // Center States (Loading & Empty)
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: s(32),
  },
  loadingText: {
    marginTop: vs(12),
    fontSize: ms(14),
    color: '#666666',
  },
  emptyFlame: {
    fontSize: ms(48),
    marginBottom: vs(12),
  },
  emptyTitle: {
    fontSize: ms(20),
    fontWeight: '700',
    color: '#222222',
    marginBottom: vs(8),
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: ms(14),
    color: '#777777',
    textAlign: 'center',
    marginBottom: vs(20),
    lineHeight: ms(20),
  },
  refreshButton: {
    backgroundColor: '#FE3C72',
    paddingHorizontal: s(24),
    paddingVertical: vs(10),
    borderRadius: ms(20),
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontSize: ms(14),
    fontWeight: '600',
  },

  // Profile Card
  cardContainer: {
    flex: 1,
    marginHorizontal: s(16),
    marginVertical: vs(10),
    borderRadius: ms(16),
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
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
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    padding: s(16),
  },
  nameText: {
    fontSize: ms(24),
    fontWeight: '800',
    color: '#FFFFFF',
  },
  cityText: {
    fontSize: ms(14),
    color: '#EEEEEE',
    marginTop: vs(4),
  },
  bioText: {
    fontSize: ms(13),
    color: '#DDDDDD',
    marginTop: vs(6),
    lineHeight: ms(18),
  },
  hobbiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: vs(8),
  },
  hobbyChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: s(8),
    paddingVertical: vs(3),
    borderRadius: ms(10),
    marginRight: s(6),
    marginTop: vs(4),
  },
  hobbyText: {
    color: '#FFFFFF',
    fontSize: ms(11),
    fontWeight: '600',
  },

  // Bottom Buttons
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
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  rejectButton: {
    borderWidth: 2,
    borderColor: '#FF3F56',
  },
  likeButton: {
    borderWidth: 2,
    borderColor: '#20D5A1',
  },
  buttonText: {
    fontSize: ms(26),
  },
});

import { StyleSheet } from 'react-native';
import { s, vs, ms, Metrics, Colors } from '../../constants';

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: s(16),
    paddingVertical: vs(12),
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLightAlt,
  },
  headerIconButton: {
    padding: s(6),
  },
  headerTitle: {
    fontSize: ms(18),
    fontWeight: '700',
    color: Colors.textHeading,
  },
  imageContainer: {
    width: Metrics.screenWidth,
    height: Metrics.screenHeight * 0.48,
    backgroundColor: Colors.borderAlt,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  infoCard: {
    backgroundColor: Colors.white,
    paddingHorizontal: s(20),
    paddingVertical: vs(20),
    borderTopLeftRadius: ms(24),
    borderTopRightRadius: ms(24),
    marginTop: -vs(20),
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: vs(4),
  },
  nameText: {
    fontSize: ms(26),
    fontWeight: '800',
    color: Colors.textHeading,
  },
  ageText: {
    fontSize: ms(24),
    fontWeight: '400',
    color: Colors.textSub,
    marginLeft: s(8),
  },
  cityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(16),
  },
  cityText: {
    fontSize: ms(15),
    color: Colors.textLight,
    fontWeight: '500',
  },
  section: {
    marginVertical: vs(12),
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceAlt,
    paddingTop: vs(12),
  },
  sectionTitle: {
    fontSize: ms(13),
    fontWeight: '700',
    color: Colors.textDim,
    textTransform: 'uppercase',
    letterSpacing: ms(0.8),
    marginBottom: vs(8),
  },
  bioText: {
    fontSize: ms(15),
    color: Colors.textBody,
    lineHeight: ms(22),
  },
  hobbiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  hobbyChip: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: s(12),
    paddingVertical: vs(6),
    borderRadius: ms(16),
    marginRight: s(8),
    marginBottom: vs(8),
    borderWidth: 1,
    borderColor: Colors.primaryBorder,
  },
  hobbyText: {
    color: Colors.primary,
    fontSize: ms(13),
    fontWeight: '600',
  },
  blockButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: vs(28),
    marginBottom: vs(16),
    paddingVertical: vs(14),
    borderRadius: ms(25),
    borderWidth: 1.5,
    borderColor: Colors.nope,
    backgroundColor: Colors.nopeLight,
  },
  blockButtonText: {
    color: Colors.nope,
    fontSize: ms(14),
    fontWeight: '700',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: ms(16),
    color: Colors.textGray,
    marginBottom: vs(16),
  },
  backBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: s(20),
    paddingVertical: vs(10),
    borderRadius: ms(20),
  },
  backBtnText: {
    color: Colors.white,
    fontWeight: '600',
  },
});

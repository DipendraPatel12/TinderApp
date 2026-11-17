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
  headerButton: {
    padding: s(6),
  },
  headerTitle: {
    fontSize: ms(18),
    fontWeight: '700',
    color: Colors.textHeading,
  },
  saveHeaderButton: {
    paddingHorizontal: s(12),
    paddingVertical: vs(6),
  },
  saveHeaderText: {
    fontSize: ms(16),
    fontWeight: '700',
    color: Colors.primary,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: vs(24),
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLightAlt,
  },
  avatarContainer: {
    position: 'relative',
    width: ms(110),
    height: ms(110),
    borderRadius: ms(55),
    borderWidth: 3,
    borderColor: Colors.primary,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.overlaySoft,
    paddingVertical: vs(4),
    alignItems: 'center',
  },
  uploadOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.overlaySemi,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarHint: {
    fontSize: ms(12),
    color: Colors.textLight,
    marginTop: vs(8),
  },
  formSection: {
    paddingHorizontal: s(20),
    paddingTop: vs(20),
  },
  inputGroup: {
    marginBottom: vs(18),
  },
  inputLabel: {
    fontSize: ms(13),
    fontWeight: '700',
    color: Colors.textGray,
    textTransform: 'uppercase',
    letterSpacing: ms(0.8),
    marginBottom: vs(8),
  },
  input: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.borderAlt,
    borderRadius: ms(12),
    paddingHorizontal: s(14),
    paddingVertical: vs(12),
    fontSize: ms(15),
    color: Colors.textHeading,
  },
  bioInput: {
    height: vs(90),
    textAlignVertical: 'top',
  },
  hobbiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  hobbyChip: {
    backgroundColor: Colors.white,
    paddingHorizontal: s(12),
    paddingVertical: vs(8),
    borderRadius: ms(18),
    marginRight: s(8),
    marginBottom: vs(8),
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  hobbyChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  hobbyText: {
    color: Colors.textSub,
    fontSize: ms(13),
    fontWeight: '600',
  },
  hobbyTextSelected: {
    color: Colors.white,
    fontWeight: '700',
  },
  saveButton: {
    backgroundColor: Colors.primary,
    marginHorizontal: s(20),
    marginVertical: vs(30),
    paddingVertical: vs(15),
    borderRadius: ms(25),
    alignItems: 'center',
  },
  saveButtonText: {
    color: Colors.white,
    fontSize: ms(16),
    fontWeight: '700',
  },
});

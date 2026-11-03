import { StyleSheet } from 'react-native';
import { Colors, scale, verticalScale, moderateScale, Fonts } from '../../constants';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: scale(24),
    paddingBottom: verticalScale(30),
  },
  titleContainer: {
    marginTop: verticalScale(28),
    marginBottom: verticalScale(24),
  },
  title: {
    fontSize: moderateScale(28),
    fontWeight: Fonts.weight.bold,
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: moderateScale(14),
    color: Colors.textSecondary,
    marginTop: verticalScale(6),
    lineHeight: moderateScale(20),
  },
  avatarSection: {
    alignItems: 'center',
    marginVertical: verticalScale(16),
  },
  avatarContainer: {
    width: scale(120),
    height: scale(120),
    borderRadius: scale(60),
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.primary,
    overflow: 'hidden',
    position: 'relative',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  uploadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarPlaceholderIcon: {
    fontSize: moderateScale(36),
    color: Colors.textMuted,
  },
  avatarPlaceholderText: {
    fontSize: moderateScale(11),
    color: Colors.textSecondary,
    fontWeight: '600',
    marginTop: verticalScale(4),
  },
  badge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary,
    width: scale(34),
    height: scale(34),
    borderRadius: scale(17),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  badgeText: {
    color: Colors.white,
    fontSize: moderateScale(16),
    fontWeight: 'bold',
  },
  avatarHelperText: {
    fontSize: moderateScale(12),
    color: Colors.textMuted,
    marginTop: verticalScale(8),
  },
  avatarPresetsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: scale(10),
    marginTop: verticalScale(10),
    marginBottom: verticalScale(16),
  },
  presetThumb: {
    width: scale(44),
    height: scale(44),
    borderRadius: scale(22),
    borderWidth: 2,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  presetThumbSelected: {
    borderColor: Colors.primary,
    borderWidth: 2.5,
  },
  presetImage: {
    width: '100%',
    height: '100%',
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: verticalScale(18),
  },
  label: {
    fontSize: moderateScale(13),
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: verticalScale(6),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: verticalScale(50),
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: moderateScale(14),
    paddingHorizontal: scale(14),
    backgroundColor: Colors.surface,
  },
  inputContainerFocused: {
    borderColor: Colors.primary,
    backgroundColor: Colors.white,
  },
  inputContainerError: {
    borderColor: Colors.error,
  },
  input: {
    flex: 1,
    fontSize: moderateScale(15),
    color: Colors.textPrimary,
    paddingVertical: 0,
  },
  bioInputContainer: {
    height: verticalScale(85),
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(10),
    alignItems: 'flex-start',
  },
  bioInput: {
    flex: 1,
    width: '100%',
    textAlignVertical: 'top',
  },
  errorText: {
    fontSize: moderateScale(12),
    color: Colors.error,
    marginTop: verticalScale(4),
  },
  hobbiesLabel: {
    fontSize: moderateScale(13),
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: verticalScale(10),
  },
  hobbiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scale(8),
    marginBottom: verticalScale(24),
  },
  hobbyChip: {
    paddingHorizontal: scale(14),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(20),
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  hobbyChipSelected: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(254, 60, 114, 0.08)',
  },
  hobbyText: {
    fontSize: moderateScale(13),
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  hobbyTextSelected: {
    color: Colors.primary,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    height: verticalScale(50),
    borderRadius: moderateScale(25),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(12),
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    color: Colors.white,
    fontSize: moderateScale(16),
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

export default styles;


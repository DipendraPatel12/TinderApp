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
    paddingBottom: verticalScale(28),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(8),
  },
  backButton: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: moderateScale(22),
    color: Colors.textPrimary,
    fontWeight: 'bold',
    includeFontPadding: false,
    lineHeight: moderateScale(24),
  },
  titleContainer: {
    marginTop: verticalScale(20),
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
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: verticalScale(16),
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
  eyeButton: {
    padding: scale(6),
  },
  eyeText: {
    fontSize: moderateScale(13),
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  errorText: {
    fontSize: moderateScale(12),
    color: Colors.error,
    marginTop: verticalScale(4),
    marginLeft: scale(4),
  },
  signupButton: {
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
  signupButtonText: {
    color: Colors.white,
    fontSize: moderateScale(16),
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: verticalScale(22),
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    marginHorizontal: scale(14),
    fontSize: moderateScale(12),
    fontWeight: '600',
    color: Colors.textMuted,
    textTransform: 'uppercase',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: verticalScale(50),
    borderRadius: moderateScale(25),
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  googleLogo: {
    width: scale(20),
    height: scale(20),
    resizeMode: 'contain',
    marginRight: scale(10),
  },
  googleButtonText: {
    color: Colors.textPrimary,
    fontSize: moderateScale(15),
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(26),
  },
  footerText: {
    fontSize: moderateScale(14),
    color: Colors.textSecondary,
  },
  loginLink: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    color: Colors.primary,
  },
});

export default styles;


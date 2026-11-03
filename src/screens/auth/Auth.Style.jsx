import { StyleSheet } from 'react-native';
import { Colors, scale, verticalScale, moderateScale } from '../../constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: scale(24),
  },
  topSection: {
    alignItems: 'center',
    paddingTop: verticalScale(30),
  },
  logo: {
    width: scale(115),
    height: verticalScale(32),
    resizeMode: 'contain',
  },
  taglineContainer: {
    marginTop: verticalScale(36),
    alignItems: 'center',
  },
  taglineText: {
    fontSize: moderateScale(30),
    color: Colors.white,
    textAlign: 'center',
    lineHeight: moderateScale(38),
    letterSpacing: -0.3,
  },
  boldText: {
    fontWeight: '800',
  },
  regularText: {
    fontWeight: '300',
  },
  bottomSection: {
    width: '100%',
    paddingBottom: verticalScale(16),
  },
  termsText: {
    fontSize: moderateScale(11.5),
    color: Colors.white,
    textAlign: 'center',
    lineHeight: moderateScale(16),
    marginBottom: verticalScale(22),
    paddingHorizontal: scale(10),
  },
  linkText: {
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  googleButton: {
    backgroundColor: Colors.white,
    height: verticalScale(48),
    borderRadius: moderateScale(24),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(12),
  },
  googleIcon: {
    width: scale(18),
    height: scale(18),
    resizeMode: 'contain',
    marginRight: scale(10),
  },
  googleButtonText: {
    color: Colors.textPrimary,
    fontSize: moderateScale(15),
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  loginButton: {
    backgroundColor: Colors.white,
    height: verticalScale(48),
    borderRadius: moderateScale(24),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(12),
  },
  loginButtonText: {
    color: Colors.textPrimary,
    fontSize: moderateScale(15),
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  createAccountButton: {
    borderWidth: 2,
    borderColor: Colors.white,
    backgroundColor: 'transparent',
    height: verticalScale(48),
    borderRadius: moderateScale(24),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(14),
  },
  createAccountButtonText: {
    color: Colors.white,
    fontSize: moderateScale(15),
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  troubleButton: {
    alignItems: 'center',
    paddingVertical: verticalScale(8),
  },
  troubleButtonText: {
    color: Colors.white,
    fontSize: moderateScale(14),
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});

export default styles;

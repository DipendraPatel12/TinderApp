import { moderateScale } from 'react-native-size-matters';

export const FontSizes = {
  tiny: moderateScale(10),
  caption: moderateScale(12),
  small: moderateScale(13),
  body: moderateScale(14),
  regular: moderateScale(15),
  medium: moderateScale(16),
  large: moderateScale(18),
  subheading: moderateScale(20),
  heading: moderateScale(24),
  title: moderateScale(28),
  display: moderateScale(34),
};

export const FontWeights = {
  light: '300',
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
  heavy: '800',
};

export const Fonts = {
  size: FontSizes,
  weight: FontWeights,
};

export default Fonts;


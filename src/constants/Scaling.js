import { Dimensions } from 'react-native';
import {
  scale,
  verticalScale,
  moderateScale,
  moderateVerticalScale,
  s,
  vs,
  ms,
  mvs,
  ScaledSheet,
} from 'react-native-size-matters';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const Metrics = {
  screenWidth: SCREEN_WIDTH,
  screenHeight: SCREEN_HEIGHT,
  isSmallDevice: SCREEN_WIDTH < 375,
};

export {
  scale,
  verticalScale,
  moderateScale,
  moderateVerticalScale,
  s,
  vs,
  ms,
  mvs,
  ScaledSheet,
};

export default {
  ...Metrics,
  scale,
  verticalScale,
  moderateScale,
  moderateVerticalScale,
  s,
  vs,
  ms,
  mvs,
  ScaledSheet,
};


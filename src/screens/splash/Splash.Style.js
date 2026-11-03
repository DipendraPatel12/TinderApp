import { StyleSheet } from 'react-native';
import { Colors, scale, verticalScale } from '../../constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: scale(170),
    height: verticalScale(45),
    resizeMode: 'contain',
  },
});

export default styles;

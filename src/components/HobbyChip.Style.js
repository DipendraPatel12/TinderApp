import { StyleSheet } from 'react-native';
import { Colors, s, vs, ms } from '../constants';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: s(6),
    marginTop: vs(4),
  },
  chipOverlay: {
    backgroundColor: Colors.overlayWhiteSubtle,
    paddingHorizontal: s(8),
    paddingVertical: vs(3),
    borderRadius: ms(10),
  },
  chipPrimary: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: s(12),
    paddingVertical: vs(6),
    borderRadius: ms(16),
    borderWidth: 1,
    borderColor: Colors.primaryBorder,
    marginBottom: vs(8),
    marginRight: s(8),
  },
  text: {
    fontWeight: '600',
  },
  textOverlay: {
    color: Colors.white,
    fontSize: ms(11),
  },
  textPrimary: {
    color: Colors.primary,
    fontSize: ms(12),
  },
});

export default styles;

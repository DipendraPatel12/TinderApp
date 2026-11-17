import { StyleSheet } from 'react-native';
import { s, vs, ms, Colors } from '../constants';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  header: {
    position: 'absolute',
    top: vs(44),
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: s(20),
    zIndex: 10,
  },
  headerBtn: {
    width: ms(44),
    height: ms(44),
    borderRadius: ms(22),
    backgroundColor: Colors.overlayMedium,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: vs(44),
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  captureBtnOuter: {
    width: ms(76),
    height: ms(76),
    borderRadius: ms(38),
    borderWidth: 4,
    borderColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureBtnInner: {
    width: ms(60),
    height: ms(60),
    borderRadius: ms(30),
    backgroundColor: Colors.white,
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: Colors.black,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: s(32),
  },
  permissionTitle: {
    color: Colors.white,
    fontSize: ms(20),
    fontWeight: '700',
    marginBottom: vs(10),
    textAlign: 'center',
  },
  permissionText: {
    color: Colors.textMuted,
    fontSize: ms(14),
    textAlign: 'center',
    marginBottom: vs(24),
    lineHeight: ms(20),
  },
  permissionBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: s(24),
    paddingVertical: vs(12),
    borderRadius: ms(24),
  },
  permissionBtnText: {
    color: Colors.white,
    fontSize: ms(15),
    fontWeight: '700',
  },
  closeBtn: {
    marginTop: vs(16),
    padding: s(8),
  },
  closeBtnText: {
    color: Colors.textMuted,
    fontSize: ms(14),
  },
});

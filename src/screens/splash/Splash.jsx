import React from 'react';
import { View, StatusBar } from 'react-native';
import { styles } from './Splash.Style';
import { Colors } from '../../constants';
import { AppImage } from '../../lib';

const Splash = () => {
  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.primary}
      />
      <AppImage
        source={require('../../assets/images/tinder_logo_white.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
};

export default Splash;

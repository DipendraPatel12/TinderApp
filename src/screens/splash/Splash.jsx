import React from 'react';
import { View, Image, StatusBar } from 'react-native';
import { styles } from './Splash.Style';
import { Colors } from '../../constants';

const Splash = () => {
  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.primary}
      />
      <Image
        source={require('../../assets/images/tinder_logo_white.png')}
        style={styles.logo}
      />
    </View>
  );
};

export default Splash;

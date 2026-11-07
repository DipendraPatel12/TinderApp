import React from 'react';
import { TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';

export const AppImage = ({
  source,
  style,
  resizeMode = 'cover',
  onPress,
  ...rest
}) => {
  const image = (
    <FastImage
      source={source}
      style={style}
      resizeMode={FastImage.resizeMode[resizeMode] || FastImage.resizeMode.cover}
      {...rest}
    />
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
        {image}
      </TouchableOpacity>
    );
  }

  return image;
};

export default AppImage;

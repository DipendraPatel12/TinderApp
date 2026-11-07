import React from 'react';
import { TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export const AppIcon = ({
  name,
  size = 24,
  color = '#000000',
  style,
  onPress,
  ...rest
}) => {
  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={onPress} style={style}>
        <FontAwesome name={name} size={size} color={color} {...rest} />
      </TouchableOpacity>
    );
  }

  return <FontAwesome name={name} size={size} color={color} style={style} {...rest} />;
};

export default AppIcon;

import React from 'react';
import { View, Text } from 'react-native';
import styles from './HobbyChip.Style';

export const HobbyChip = ({
  label,
  variant = 'overlay',
  style,
  textStyle,
}) => {
  const isPrimary = variant === 'primary';

  return (
    <View
      style={[
        styles.chip,
        isPrimary ? styles.chipPrimary : styles.chipOverlay,
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          isPrimary ? styles.textPrimary : styles.textOverlay,
          textStyle,
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

export const HobbyChips = ({
  hobbies,
  maxItems = 4,
  variant = 'overlay',
  containerStyle,
  chipStyle,
  textStyle,
}) => {
  const list = Array.isArray(hobbies) ? hobbies : Object.values(hobbies || {});
  const displayList = typeof maxItems === 'number' ? list.slice(0, maxItems) : list;

  if (displayList.length === 0) return null;

  return (
    <View style={[styles.container, containerStyle]}>
      {displayList.map((hobby) => (
        <HobbyChip
          key={hobby}
          label={hobby}
          variant={variant}
          style={chipStyle}
          textStyle={textStyle}
        />
      ))}
    </View>
  );
};

export default HobbyChip;

import React, { forwardRef } from 'react';
import { FlashList } from '@shopify/flash-list';

export const AppList = forwardRef(({
  estimatedItemSize = 80,
  ...rest
}, ref) => {
  return (
    <FlashList
      ref={ref}
      estimatedItemSize={estimatedItemSize}
      {...rest}
    />
  );
});

export default AppList;


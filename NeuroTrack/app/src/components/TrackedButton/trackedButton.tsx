import React, { useRef } from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { usageTracker } from '../../services/usageTracker';

type Props = TouchableOpacityProps & {
  onDoublePress?: () => void;
};

const DOUBLE_TAP_DELAY = 300; // ms

const TrackedButton: React.FC<Props> = ({ onPress, onDoublePress, ...rest }) => {
  const lastTapRef = useRef<number | null>(null);

  const handlePress = () => {
    const now = Date.now();

    if (lastTapRef.current && now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      // double click
      usageTracker.registerDoubleClick();
      lastTapRef.current = null;
      if (onDoublePress) {
        onDoublePress();
      } else if (onPress) {
        onPress(undefined as any);
      }
    } else {
      // single click
      usageTracker.registerClick();
      lastTapRef.current = now;
      if (!onDoublePress && onPress) {
        // se não tem double, chama normal
        onPress(undefined as any);
      }
    }
  };

  return (
    <TouchableOpacity {...rest} onPress={handlePress} />
  );
};

export default TrackedButton;

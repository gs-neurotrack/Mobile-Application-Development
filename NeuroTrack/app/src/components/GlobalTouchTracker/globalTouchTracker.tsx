import React, { useRef, PropsWithChildren } from 'react';
import { View, GestureResponderEvent } from 'react-native';
import { usageTracker } from '../../services/usageTracker';

const DOUBLE_TAP_DELAY = 300;

const GlobalTouchTracker: React.FC<PropsWithChildren> = ({ children }) => {
  const lastTapRef = useRef<number | null>(null);

  const handleTouchEndCapture = (e: GestureResponderEvent) => {

    const payload = usageTracker.buildPayload();
    if (!payload) {
      return;
    }

    const now = Date.now();

    
    usageTracker.registerClick();

 
    if (lastTapRef.current && now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      usageTracker.registerDoubleClick();
    }

    lastTapRef.current = now;
  };

  return (
    <View style={{ flex: 1 }} onTouchEndCapture={handleTouchEndCapture}>
      {children}
    </View>
  );
};

export default GlobalTouchTracker;

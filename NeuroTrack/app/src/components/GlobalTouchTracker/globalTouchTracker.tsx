// src/components/GlobalTouchTracker/GlobalTouchTracker.tsx
import React, { useRef, PropsWithChildren } from 'react';
import { View, GestureResponderEvent } from 'react-native';
import { usageTracker } from '../../services/usageTracker';

const DOUBLE_TAP_DELAY = 300; // ms

const GlobalTouchTracker: React.FC<PropsWithChildren> = ({ children }) => {
  const lastTapRef = useRef<number | null>(null);

  const handleTouchEndCapture = (e: GestureResponderEvent) => {
    // se não tiver sessão ativa, nem conta
    // (userId só é setado no login)
    // isso evita contar coisa antes de logar
    // mas se você quiser contar mesmo antes, pode tirar o if
    // usageTracker.startSession precisa ter sido chamado no login
    const payload = usageTracker.buildPayload();
    if (!payload) {
      return;
    }

    const now = Date.now();

    // sempre conta 1 click
    usageTracker.registerClick();

    // verifica double click
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

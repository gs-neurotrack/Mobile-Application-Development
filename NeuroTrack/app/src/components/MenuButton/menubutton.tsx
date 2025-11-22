import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './style';

type MenuButtonProps = {
  icon: string;
  label: string;
  onPress: () => void;
  style?: any;
};

export default function MenuButton({ icon, label, onPress, style }: MenuButtonProps) {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Ionicons name={icon as any} size={40} color="#ffffffff" />
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

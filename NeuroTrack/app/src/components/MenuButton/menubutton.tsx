import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import styles from './style';
import { Ionicons } from '@expo/vector-icons';

interface MenuButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}

const MenuButton = ({ icon, label, onPress }: MenuButtonProps) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Ionicons name={icon} size={38} color="#fff" />
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

export default MenuButton;

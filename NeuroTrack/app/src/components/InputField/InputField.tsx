import React from 'react';
import { TextInput } from 'react-native';
import styles from './style';

interface InputFieldProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType: 'email-address' | 'password' | 'default' | 'numeric';
}

export default function InputField({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType,
}: InputFieldProps) {
  return (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor="#777"
      value={value}
      secureTextEntry={secureTextEntry}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
    />
  );
}
import React from "react";
import { View, Text, TextInput, TextInputProps } from "react-native";
import styles from "./style";

type Props = {
  rotulo: string;
  valor: string;
  aoMudarTexto: (t: string) => void;
  dica?: string;
  erro?: string;
  placeholder?: string;
  inputProps?: TextInputProps;
  keyBoardType?: TextInputProps["keyboardType"];
};

export default function CampoTexto({
  rotulo,
  valor,
  aoMudarTexto,
  dica,
  erro,
  placeholder,
  inputProps,
}: Props) {
  return (
    <View style={styles.campo}>
      <Text style={styles.rotulo}>{rotulo}</Text>
      <TextInput
        style={[styles.entrada, erro && { borderColor: "#EF4444" }]} 
        value={valor}
        onChangeText={aoMudarTexto}  
        placeholder={placeholder}
        keyboardType={inputProps?.keyboardType || "default"}  
        autoCapitalize="none"  
        autoCorrect={false}  
        {...inputProps} 
      />
      {dica && <Text style={styles.dica}>{dica}</Text>}
      {erro && <Text style={{ color: "red", marginTop: 4 }}>{erro}</Text>}
    </View>
  );
}
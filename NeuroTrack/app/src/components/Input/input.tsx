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
        style={[styles.entrada, erro && { borderColor: "#EF4444" }]} // Aplica a cor de erro
        value={valor}
        onChangeText={aoMudarTexto}  // Chama a função aoMudarTexto para atualizar o estado
        placeholder={placeholder}
        keyboardType={inputProps?.keyboardType || "default"}  // Define o tipo do teclado
        autoCapitalize="none"  // Evita a capitalização automática
        autoCorrect={false}  // Desativa a correção automática
        {...inputProps}  // Permite a passagem de mais propriedades (como maxLength, multiline, etc.)
      />
      {dica && <Text style={styles.dica}>{dica}</Text>}
      {erro && <Text style={{ color: "red", marginTop: 4 }}>{erro}</Text>}
    </View>
  );
}
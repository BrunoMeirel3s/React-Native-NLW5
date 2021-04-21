import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableOpacityProps,
} from "react-native";
import colors from "../styles/colors";
import fonts from "../styles/fonts";

/**
 * Usamos a interface para criar as propriedades que deverão ser passadas
 * para o componente botão de forma obrigatória ao utilizar o componente
 */
interface ButtonProps extends TouchableOpacityProps {
  title: string;
}

/**
 * Como parâmetro da função devemos passar o title como configurado
 * na interface e o '...rest' significa que estamos instanciando
 * todos os demais parametros passados como o onPress por exemplo
 */
export function Button({ title, ...rest }: ButtonProps) {
  return (
    <TouchableOpacity style={styles.container} {...rest}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.green,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    color: colors.white,
    fontFamily: fonts.heading,
  },
});

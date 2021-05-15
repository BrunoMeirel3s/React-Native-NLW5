import React from "react";
import { StyleSheet, Text } from "react-native";

/**
 * RectButton e RectButtonProps serão utilizados pois são elementos
 * criados pensando em navegação utilizando botões
 */
import { RectButton, RectButtonProps } from "react-native-gesture-handler";

import colors from "../styles/colors";
import fonts from "../styles/fonts";

/**
 * A interface aqui é utilizada para obrigarmos que os parametros sejam
 * passados no momento da instanciação de EnviromentButton, active recebe
 * o sinal de  '?' para significar que o mesmo não é obrigatório
 */
interface EnviromentButtonProps extends RectButtonProps {
  title: string;
  active?: Boolean;
}

export function EnviromentButton({
  title,
  active = false,
  ...rest
}: EnviromentButtonProps) {
  return (
    <RectButton
      style={[styles.container, active && styles.containerActive]}
      {...rest}
    >
      {/**
       * Caso EnviromentButton receba o parametro 'active' iremos adicionar
       * estilos diferentes ao botão e ao texto interno
       */}
      <Text style={[styles.text, active && styles.textActive]}>{title}</Text>
    </RectButton>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.shape,
    width: 76,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    marginHorizontal: 5,
  },
  containerActive: {
    backgroundColor: colors.green_light,
  },
  text: {
    color: colors.heading,
    fontFamily: fonts.text,
  },
  textActive: {
    fontFamily: fonts.heading,
    color: colors.green_dark,
  },
});

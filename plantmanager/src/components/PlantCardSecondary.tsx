import React from "react";
import { StyleSheet, Text, View, Animated } from "react-native";
import { RectButton, RectButtonProps } from "react-native-gesture-handler";
/**
 * Swipeable será utilizado para criar o elemento plantCardSecondary com a
 * opção de deslize lateral para que seja então mostrado o botão de delete
 * da planta
 */
import Swipeable from "react-native-gesture-handler/Swipeable";
/**
 * SvgFromUri será utilizado para renderizarmos fotos no formato svg
 */
import { SvgFromUri } from "react-native-svg";

/**
 * Feather será utilizado para utilizarmos ícones vetoriais
 * é uma biblioteca de ícones
 */
import { Feather } from "@expo/vector-icons";

import colors from "../styles/colors";
import fonts from "../styles/fonts";

/**
 * PlantCardSecondary precisa receber a foto, nome e horas
 * para regar a planta, sendo assim iremos passar a hora setada
 * pelo usuário e salva no asyncStorage
 */
interface PlantProps extends RectButtonProps {
  data: {
    name: string;
    photo: string;
    hour: string;
  };

  /**
   * handleRemove será utilizado para excluir a plantinha
   * por isso está sendo criado aqui porém também será criado no
   * componente que for utilizar o plantCardSecondary
   */
  handleRemove: () => void;
}

export const PlantCardSecondary = ({
  data,
  handleRemove,
  ...rest
}: PlantProps) => {
  return (
    <Swipeable
      overshootRight={false}
      renderRightActions={() => (
        <Animated.View>
          <View>
            <RectButton style={styles.buttonRemove} onPress={handleRemove}>
              <Feather name="trash" size={32} color={colors.white} />
            </RectButton>
          </View>
        </Animated.View>
      )}
    >
      <RectButton style={styles.container} {...rest}>
        <SvgFromUri uri={data.photo} width={50} height={50} />
        <Text style={styles.title}>{data.name}</Text>
        <View style={styles.details}>
          <Text style={styles.timeLabel}>Regar às</Text>
          <Text style={styles.time}>{data.hour}</Text>
        </View>
      </RectButton>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 10,
    paddingVertical: 25,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.shape,
    marginVertical: 5,
  },
  title: {
    flex: 1,
    marginLeft: 10,
    fontFamily: fonts.heading,
    fontSize: 17,
    color: colors.heading,
  },
  details: {
    alignItems: "flex-end",
  },
  timeLabel: {
    fontSize: 16,
    fontFamily: fonts.text,
    color: colors.body_light,
  },
  time: {
    marginTop: 5,
    fontSize: 16,
    fontFamily: fonts.heading,
    color: colors.body_dark,
  },
  buttonRemove: {
    width: 140,
    height: 85,
    backgroundColor: colors.red,
    marginTop: 15,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    right: 10,
    paddingLeft: 10,
  },
});

/**
 * Telas de confirmação será utilizada apenas para demonstrar de forma
 * alguma mensagem passada como parâmetro para confirmation
 */
import React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/core";

import { Button } from "../components/Button";

import colors from "../styles/colors";
import fonts from "../styles/fonts";

//Interface para ser utilizada na tela de confirmação, apenas para garantir que os parametros sejam passados
interface Params {
  title: string;
  subtitle: string;
  buttonTitle: string;
  icon: "smile" | "hug";
  nextScreen: string;
}

const emojis = {
  hug: "🤗",
  smile: "😄",
};

export function Confirmation() {
  /**
   * Como iremos utilizar navegação faz-se necessário criarmos um instância de 
   * useNavigation, e useRoute
   */
  const navigation = useNavigation();
  const routes = useRoute();

  /**
   * Como iremos receber os valores a serem exibidos como parâmetro faz-se necessários desestruturar
   * esses campos retirando-os de routes.params, e utilizando a interface Params para garantir que todas
   * tenham sido passados
   */
  const {
    title,
    subtitle,
    buttonTitle,
    icon,
    nextScreen,
  } = routes.params as Params;

  /**
   * handleMoveOn será a função que realizará a navegação entre páginas,
   * para isto iremos utilizar o navigate passando como parâmetro o nome da tela
   * recebida como parâmetro
   */
  function handleMoveOn() {
    navigation.navigate(nextScreen);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/**
         * emoji será exibido com base no emoji passado como parâmetro para Confirmation
         */}
        <Text style={styles.emoji}>{emojis[icon]}</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        <View style={styles.footer}>
          <Button title={buttonTitle} onPress={handleMoveOn} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontFamily: fonts.heading,
    textAlign: "center",
    color: colors.heading,
  },
  subtitle: {
    fontFamily: fonts.text,
    textAlign: "center",
    fontSize: 17,
    paddingVertical: 10,
    color: colors.heading,
  },
  emoji: {
    fontSize: 78,
  },
  footer: {
    width: "100%",
    paddingHorizontal: 50,
    marginTop: 20,
  },
});

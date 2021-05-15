import React, { useEffect, useState } from "react";
import { StyleSheet, Text, Image, View } from "react-native";
import { getStatusBarHeight } from "react-native-iphone-x-helper";
import UserImg from "../assets/bruno.jpg";
import colors from "../styles/colors";
import fonts from "../styles/fonts";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function Header() {
  /**
   * Aqui começamos a utilizar o conceito de estados,
   * o estado userName será utilizado para armazenar o nome do usuário informado ao abrir a aplicação,
   * iremos usar o AsyncStorage para obter o nome do usuário e então setar no estado
   */
  const [userName, setUserName] = useState<string>();

  /**
   * useEffect é um hook que é utilizado sempre entramos na tela que possuir este
   * componente "Header", observe que criamos uma async function para obter
   * o nome do usuário gravado com o AsyncStorage, devemos usar o async storage pois não sabemos
   * o tempo que irá demorar para o app obter essa informação
   */
  useEffect(() => {
    async function loadStoragedUserName() {
      const user = await AsyncStorage.getItem("@plantmanager:user");
      setUserName(user || "");
    }
    loadStoragedUserName();
  }, []);
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.greeting}>Olá,</Text>
        <Text style={styles.userName}>{userName}</Text>
      </View>
      <Image style={styles.image} source={UserImg} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
    marginTop: getStatusBarHeight(),
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 40,
  },
  greeting: {
    fontSize: 32,
    color: colors.heading,
    fontFamily: fonts.text,
  },
  userName: {
    fontSize: 32,
    fontFamily: fonts.heading,
    color: colors.heading,
    lineHeight: 40,
  },
});

import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
} from "react-native";

/**
 * o useNavigation nos permite utilizar a navegação que criamos
 * no routes, lembrando que o mesmo deve ser devidamente instalado
 */
import { useNavigation } from "@react-navigation/core";

import { Button } from "../components/Button";
import colors from "../styles/colors";
import fonts from "../styles/fonts";

export function UserIdentification() {
  /**
   * Instanciamos o useNavigation em uma constante
   * após isto estamos criando uma função que irá realizar a navegação
   * utilizando a função navigate de useNavigation, passamos entre
   * paranteses o nome da tela para onde queremos ir, o nome é
   * configurado la no routes
   *  */
  const navigation = useNavigation();
  function handleSubmit() {
    navigation.navigate("Confirmation");
  }

  //Estados que usaremos na aplicação, bem como as funções que ajustarão os estados
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);
  const [name, setName] = useState<string>();

  /**
   * handleInputBlur será utilizado quando deixarmos o campo
   * input, desta forma iremos setar isFocused para false
   *  e checar se isFilled está preenchido, se sim isFilled
   * será true senão será false
   */
  function handleInputBlur() {
    setIsFocused(false);
    setIsFilled(!!name);
  }

  //handleInputFocus será utilizado para setar o isFocused quando clicarmos no input
  function handleInputFocus() {
    setIsFocused(true);
  }

  /**
   * handleInputChange será chamado no evento onChange do input,
   * sendo assim, iremos receber o valor digitado, caso o nome
   * tenha sido digitado iremos preencher setIsFilled com o valor lógico
   * true, e iremos usar o setName para passar o valor para o estado
   * name
   */
  function handleInputChange(value: string) {
    setIsFilled(!!value);
    setName(value);
  }

  return (
    <SafeAreaView style={styles.container}>
      {/**
       * o SafeAreaView acima é um componente utilizado sempre como wrapper do código,
       * ele garante que todo o código ficará em partes da tela que serão devidamente exibidas.
       * Abaixo estamos usando o KeyBoardAvoidingView envolvendo todo nosso código para
       * criar o efeito de deslizar todo o conteúdo para cima ao clicarmos no input a ser preenchido
       */}
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/**
         * Abaixo estamos usando o TouchableWithoutFeedBack para envolver
         * todo a nossa tela repare no onPress, estamos chamando o evento
         * Keyboard.dismiss para remover o teclado quando estivermos
         * no input e clicarmos em qualquer parte da tela
         */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.content}>
            <View style={styles.form}>
              <View style={styles.header}>
                <Text style={styles.emoji}>{isFilled ? "😄" : "😃"}</Text>
                <Text style={styles.title}>
                  Como podemos {"\n"} chamar você?
                </Text>
              </View>
              <TextInput
                style={[
                  styles.input,
                  (isFocused || isFilled) && { borderColor: colors.green },
                ]}
                placeholder={"Digite seu nome"}
                onBlur={handleInputBlur}
                onFocus={handleInputFocus}
                onChangeText={handleInputChange}
              />
              <View style={styles.footer}>
                {/**
                 * o handleSubmit abaixo no botão está justamente chamado o
                 * react navigation para mover para a próxima tela
                 */}
                <Button title="Confirmar" onPress={handleSubmit} />
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "space-around",
  },
  content: {
    flex: 1,
    width: "100%",
  },
  form: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 54,
    alignItems: "center",
  },
  header: {
    alignItems: "center",
  },
  emoji: {
    fontSize: 44,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: colors.gray,
    color: colors.heading,
    width: "100%",
    fontSize: 18,
    marginTop: 50,
    padding: 10,
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    textAlign: "center",
    color: colors.heading,
    fontFamily: fonts.heading,
    marginTop: 20,
  },
  footer: {
    marginTop: 40,
    width: "100%",
    paddingHorizontal: 20,
  },
});

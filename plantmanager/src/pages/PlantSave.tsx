/**
 * PlantSave será a tela onde realizaremos a ação de salvar a planta, onde será criado o lembrete
 * de regagem
 */
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Platform,
  TouchableOpacity,
} from "react-native";

//getBottomSpace será utilizado para colocar o espaço de bottom no iphone
import { getBottomSpace } from "react-native-iphone-x-helper";
import { SvgFromUri } from "react-native-svg";

import waterdrop from "../assets/waterdrop.png";
import { Button } from "../components/Button";
import colors from "../styles/colors";
import fonts from "../styles/fonts";
import { PlantProps, savePlant } from "./../libs/storage";

/**
 * useRoute nos permitirá recuperar os valores
 * passados como "Parametro" para o componente PlantSave
 */
import { useRoute, useNavigation } from "@react-navigation/core";

/**
 * DateTimePicker nos permite utilizar a opção para escolher data e hora em dispositivos
 * android e ios, isBefore e format serão utilizados para calcular e formatar a hora selecionada
 * pelo usuário
 */
import DateTimePicker, { Event } from "@react-native-community/datetimepicker";
import { isBefore, format } from "date-fns";

/**
 * interface Params será utilizada
 * para criar a const plant utilizando
 * os valores passados como parametro para PlantSave
 */
interface Params {
  plant: PlantProps;
}

export function PlantSave() {
  const [selecteDateTime, setSelectedDateTime] = useState(new Date());
  /**
   * showDatePicker será utilizado para controlarmos se iremos exibir direto
   * o timePicker ou não, porque no android ele não é um componente como no iOS,
   * no android ele sobrepõem os demais itens e não permite fazer mais nada enquanto
   * não selecionarmos a hora, depois de selecionada ainda temos que fechar o componente
   * manualmente com um estado
   */
  const [showDatePicker, setShowDatePicker] = useState(Platform.OS == "ios");
  const route = useRoute(); //instancia que permite utilizar o método params
  /**
   * a const plant recebe os parametros enviados para o componentes
   * PlantSave, utilizamos a interface Params para tipar os valores
   * a serem passados para PlantSave, assim garantimos que a planta terá todos
   * os atributos esperados
   */
  const { plant } = route.params as Params;

  const navigation = useNavigation();

  /**
   * A função handleChangeTime será chamada ao clicarmos no botão para escolher um horário,
   * se a plataforma for android iremos mudar o estado de showDatePicker para poder aparecer
   * o componente
   */
  function handleChangeTime(event: Event, dateTime: Date | undefined) {
    if (Platform.OS == "android") {
      setShowDatePicker((oldState) => !oldState);
    }

    /**
     * Aqui estamos checando se foi passado uma hora para a função handleChangeTime
     * e comparando se a data/hora passada é antes da hora atual do dispositivo,
     * para evitarmos de colocar uma hora antes de agora, caso seja encontrado o erro é retornado
     * um alerta e a função é encerrada
     */
    if (dateTime && isBefore(dateTime, new Date())) {
      setSelectedDateTime(new Date());
      return Alert.alert("Escolha uma hora futura! ⏰");
    }

    /**
     * Caso a função não tenha sido encerrada pelo alerta acima é realizado a inserção da 
     * data no estado selectedDateTime
     */
    if (dateTime) {
      setSelectedDateTime(dateTime);
    }
  }

  /**
   * A função abaixo será utilizada no botão para mudar o horário, este botão
   * ficará disponível somente no android, para isto ao chamarmos a função abaixo
   * a mesma irá trocar o estado showDatePicker para então mostrar a função de dateTimePicker
   */
  function handleOpenDateTimePickerForAndroid() {
    setShowDatePicker((oldState) => !oldState);
  }

  /**'
   * handleSave será utilizado como o nome diz para realizar o salvamento das plantas que tiveram 
   * o horário definido, para isto iremos utilizar o try abaixo para chamar a função savePlant, 
   * que então pegará a planta passada como parâmetro e irá salva-la juntamente do dateTimeNotification
   * que irá definir o horário de lembrete para regar a planta
   */
  async function handleSave() {
    try {
      await savePlant({
        ...plant,
        dateTimeNotification: selecteDateTime,
      });

      /**
       * Após salvarmos a planta iremos navegar para a tela de confirmação, para isto
       * iremos passar os parametros abaixo
       */
      navigation.navigate("Confirmation", {
        title: "Tudo certo",
        subtitle:
          "Fique tranquilo que sempre vamos lembrar você de cuidar da sua plantinha com muito cuidado.",
        buttonTitle: "Muito Obrigado",
        icon: "hug",
        nextScreen: "MyPlants",
      });
    } catch {
      Alert.alert("Não foi possível salvar! 😢");
    }
  }
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <View style={styles.container}>
        <View style={styles.plantInfo}>
          <SvgFromUri uri={plant.photo} height={150} width={150} />
          <Text style={styles.plantName}>{plant.name}</Text>
          <Text style={styles.plantAbout}>{plant.about}</Text>
        </View>

        <View style={styles.controller}>
          <View style={styles.tipContainer}>
            <Image source={waterdrop} style={styles.tipImage} />
            <Text style={styles.tipText}>{plant.water_tips}</Text>
          </View>

          <Text style={styles.alertLabel}>
            Escolha o melhor horário para ser lembrado:
          </Text>
          {/**
           * Aqui temos algo a prestar atenção, caso showDatePicker esteja definido como true iremos mostrar
           * o componente para selecionar a hora, caso o dispositivo seja iOS por padrão será listado
           * o componente, porém caso seja android será disponível somente ao clicar no botão
           * para trocar a hora.
           */}
          {showDatePicker && (
            <DateTimePicker
              value={selecteDateTime}
              mode="time"
              display="spinner"
              onChange={handleChangeTime}
            />
          )}
          {Platform.OS === "android" && (
            <TouchableOpacity
              style={styles.dateTimePickerButton}
              onPress={handleOpenDateTimePickerForAndroid}
            >
              <Text style={styles.dateTimePickerText}>
                {`Mudar ${format(selecteDateTime, "HH:mm")}`}
              </Text>
            </TouchableOpacity>
          )}

          <Button title={"Cadastrar planta"} onPress={handleSave}></Button>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: colors.shape,
  },
  plantInfo: {
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.shape,
  },
  controller: {
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: getBottomSpace() || 20,
  },
  plantName: {
    fontFamily: fonts.heading,
    fontSize: 24,
    color: colors.heading,
    marginTop: 15,
  },
  plantAbout: {
    textAlign: "center",
    fontFamily: fonts.text,
    color: colors.heading,
    fontSize: 17,
    marginTop: 10,
  },
  tipContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.blue_light,
    padding: 20,
    borderRadius: 20,
    position: "relative",
    bottom: 60,
  },
  tipImage: {
    width: 56,
    height: 56,
  },
  tipText: {
    flex: 1,
    marginLeft: 20,
    fontFamily: fonts.text,
    color: colors.blue,
    fontSize: 17,
    textAlign: "justify",
  },
  alertLabel: {
    textAlign: "center",
    fontFamily: fonts.complement,
    color: colors.heading,
    fontSize: 12,
    marginBottom: 5,
  },
  dateTimePickerButton: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 40,
  },
  dateTimePickerText: {
    color: colors.heading,
    fontSize: 24,
    fontFamily: fonts.text,
  },
});

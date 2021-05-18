/**
 * MyPlants será a tela responsável por exibir as plantas salvas na seleção
 * inicial, aqui também poderemos deletar as plantas salvas 
 */
import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Image, FlatList, Alert } from "react-native";
import { Header } from "../components/Header";
import colors from "../styles/colors";

import waterdrop from "../assets/waterdrop.png";
import { PlantProps, loadPlant, removePlant } from "./../libs/storage";
import { formatDistance } from "date-fns";
import { ptBR } from "date-fns/locale";
import fonts from "../styles/fonts";
import { PlantCardSecondary } from "../components/PlantCardSecondary";
import { Load } from "../components/Load";

export function MyPlants() {
  //estados que serão utilizados nesta tela
  const [myPlants, setMyPlants] = useState<PlantProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextWatered, setNextWatered] = useState<string>();

  /**
   * função handleRemove será utilizada para realizar a exclusão da planta
   * agendada, para isto, ao clicar sobre o botão iremos exibir o Alert criado
   * abaixo, caso seja clicado em sim é disparado a função removePlant trazida lá de 
   * storage, para isto iremos passar o id da planta, após remover a planta é realizada
   * a remoção da planta do estado "myPlants", para isto recebemos os dados antigos e realizamos um filter
   * em cima delas, retornando todos os valores que possuirem um id diferente do id da planta excluída
   */
  function handleRemove(plant: PlantProps) {
    Alert.alert("Remover", `Deseja remover a ${plant.name}?`, [
      {
        text: "Não 🙏",
        style: "cancel",
      },
      {
        text: "Sim 😢",
        onPress: async () => {
          try {
            await removePlant(plant.id);
            setMyPlants((oldData) =>
              oldData.filter((item) => item.id != plant.id)
            );
          } catch (error) {
            Alert.alert("Não foi possível remover 😢");
          }
        },
      },
    ]);
  }

  /**
   * useEffect é utilizado para carregar determinada função assim que a tela é carregada,
   * na função loadStorageData estamos criando uma constante plantsStoraged que recebe
   * todas as plantas salvas no dispositivo, para isto utilizamos a função loadPlant
   * que foi definida lá em storage.
   * 
   * nextTime recebe a primeira planta que está em plantsStorage já que elas são retornadas 
   * ordenadas de acordo com a horá de regagem, utilizamos o formatDistante para calcular
   * a distância em tempo da data atual até a data da regagem, desta forma nextTime receberá
   * a hora, minuto ou segundo até a regagem da próxima planta
   */
  useEffect(() => {
    async function loadStorageData() {
      const plantsStoraged = await loadPlant();

      const nextTime = formatDistance(
        new Date(plantsStoraged[0].dateTimeNotification).getTime(),
        new Date().getTime(),
        { locale: ptBR }
      );

      //setNextWaterede será o texto que será exibido informando a próxima planta a ser regada
      setNextWatered(
        `Não esqueça de regar a ${plantsStoraged[0].name} daqui à ${nextTime}`
      );

      //myPlants recebe então as plantas carregadas
      setMyPlants(plantsStoraged);

      //após conseguirmos obter as plantas o loading é tornado como falso para poder deixar de exibir a imagem de carregamento
      if (plantsStoraged) {
        setLoading(false);
      }
    }

    //Por fim executamos a função loadStorageData
    loadStorageData();
  }, []);

  if (loading) {
    return <Load />;
  } else {
    return (
      <View style={styles.container}>
        <Header />
        <View style={styles.spotlight}>
          <Image source={waterdrop} style={styles.spotlightImage} />
          <Text style={styles.spotlightText}>{nextWatered}</Text>
        </View>

        <View style={styles.plants}>
          <Text style={styles.plantTitle}>Próximas regadas</Text>
          {/**
           * FlatList é utilizado aqui para renderizar os diversos cards com as plantas
           * salvas, para isso passamos as plantas carregadas para o atributo data,
           * keyExtractor precisa receber um identificador que possa distinguir as plantas,
           * para isso passamos o id da planta, o renderItem realizará o carregamento do
           * elemento, para isto iremos passar o plantCardSecondary passando para ele como
           * atributo o item que será no caso a planta em si, o handleRemove será
           * a função que realizará a exclusão da planta
           */}
          <FlatList
            data={myPlants}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <PlantCardSecondary
                data={item}
                handleRemove={() => handleRemove(item)}
              />
            )}
            showsVerticalScrollIndicator={true}
            contentContainerStyle={{ flex: 1 }}
          ></FlatList>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 30,
    paddingTop: 50,
    backgroundColor: colors.background,
  },
  spotlight: {
    backgroundColor: colors.blue_light,
    paddingHorizontal: 20,
    borderRadius: 20,
    height: 110,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  spotlightImage: {
    width: 60,
    height: 60,
  },
  spotlightText: {
    flex: 1,
    color: colors.blue,
    paddingHorizontal: 20,
  },
  plants: {
    flex: 1,
    width: "100%",
  },
  plantTitle: {
    fontSize: 24,
    fontFamily: fonts.heading,
    color: colors.heading,
    marginVertical: 20,
  },
});

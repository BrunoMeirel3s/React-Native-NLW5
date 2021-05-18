import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/core";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { EnviromentButton } from "../components/EnviromentButton";

import { Header } from "../components/Header";

import colors from "../styles/colors";
import fonts from "../styles/fonts";
import { PlantCardPrimary } from "../components/PlantCardPrimary";
import { Load } from "../components/Load";

/**
 * api será utilizado para realizar as requisições para o nosso
 * backend, utilizaremos o axios para realizar as requisições
 * para um json server com baseUrl local
 */
import api from "./../services/api";
import { PlantProps } from "./../libs/storage";

interface EnviromentProps {
  key: string;
  title: string;
}

export function PlantSelect() {
  const [enviroments, setEnviroments] = useState<EnviromentProps[]>();
  const [plants, setPlants] = useState<PlantProps[]>();
  const [filteredPlants, setFilteredPlants] = useState<PlantProps[]>();
  const [enviromentSelected, setEnviromentSelected] = useState("all");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  const navigation = useNavigation();

  /**
   * handleEnviromentSelected será utilizado para realizar o carregamento das plantas
   * selecionados na tela principal com base no enviroment selecionado, pelo usuário
   */
  function handleEnviromentSelected(enviroment: string) {
    //setEnviromentSelected apenas muda o estado para o enviroment selecionado
    setEnviromentSelected(enviroment);

    /**
     * Se o enviroment selecionado for "Todos" setamos setFilteredPlants
     * para o valor armazenado no estado 'plants' que recebe
     * todas as plantas ao realizar uma requisição para o backend
     */
    if (enviroment == "all") {
      return setFilteredPlants(plants);
    }

    /**
     * Aqui iremos realizar um filtro em cima do estado
     * "plants" checando em todas as plantas se elas possuem
     * o valor passado como parametro para handleEnviromentSelected
     * que é o enviroment selecionado, o filter em questão retorna
     * as plantas que possuem o enviroment selecionado em seu
     * camp "environments"
     */
    const filtered = plants?.filter((plant) =>
      plant.environments.includes(enviroment)
    );
    setFilteredPlants(filtered);
  }

  function handleFetchMore(distance: number) {
    if (distance < 1) {
      return;
    }

    setLoadingMore(true);
    setPage((oldValue) => oldValue + 1);
    fetchPlants();
  }

  useEffect(() => {
    async function fetchEnviroment() {
      const { data } = await api.get(
        "plants_environments?_sort=title&order=asc"
      );
      setEnviroments([
        {
          key: "all",
          title: "Todos",
        },
        ...data,
      ]);
    }
    fetchEnviroment();
  }, []);

  async function fetchPlants() {
    const { data } = await api.get(
      `plants?_sort=name&order=asc&_page=${page}&_limit=8`
    );

    if (!data) {
      return setLoading(true);
    }

    if (page > 1) {
      setPlants((oldValue) => [...oldValue, ...data]);
      setFilteredPlants((oldValue) => [...oldValue, ...data]);
    } else {
      setPlants(data);
      setFilteredPlants(data);
    }

    setLoading(false);
    setLoadingMore(false);
  }

  function handlePlantSelect(plant: PlantProps) {
    navigation.navigate("PlantSave", { plant });
  }

  useEffect(() => {
    fetchPlants();
  }, []);

  if (loading) {
    return <Load />;
  } else {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Header />
          <Text style={styles.title}>Em qual ambiente</Text>
          <Text style={styles.subtitle}>você quer colocar sua planta?</Text>
        </View>
        <View>
          <FlatList
            data={enviroments}
            keyExtractor={(item) => String(item.key)}
            renderItem={({ item }) => (
              <EnviromentButton
                title={item.title}
                active={item.key === enviromentSelected}
                onPress={() => handleEnviromentSelected(item.key)}
              />
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.enviromentList}
          />
        </View>

        <View style={styles.plants}>
          <FlatList
            data={filteredPlants}
            keyExtractor={(item) => String(item.id)}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <PlantCardPrimary
                data={item}
                onPress={() => handlePlantSelect(item)}
              />
            )}
            numColumns={2}
            onEndReachedThreshold={0.1}
            onEndReached={({ distanceFromEnd }) => {
              handleFetchMore(distanceFromEnd);
            }}
            ListFooterComponent={
              loadingMore ? <ActivityIndicator color={colors.green} /> : <></>
            }
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 17,
    color: colors.heading,
    fontFamily: fonts.heading,
    lineHeight: 20,
    marginTop: 15,
  },
  subtitle: {
    fontFamily: fonts.text,
    fontSize: 17,
    lineHeight: 28,
    color: colors.heading,
  },
  enviromentList: {
    height: 40,
    justifyContent: "center",
    paddingBottom: 5,
    marginLeft: 32,
    marginVertical: 32,
  },
  plants: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: "center",
  },
});

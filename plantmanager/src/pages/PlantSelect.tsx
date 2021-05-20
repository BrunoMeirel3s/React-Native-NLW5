/**
 * PlantSelect será a tela principal onde iremos listar todas as plantas
 * obtidas do servidor JSON, aqui iremos selecionar a planta que será
 * enviada para a tela de plantSave
 */
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
  /**
   * Enviroments e plants serão obtidos do backend da nossa aplicação, para isto
   * iremos realizar requisições para o JSON Server
   */
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

  /**
   * handleFetchMore será utilizado para carregar mais plantas caso estejamos no final
   * da página, para isso iremos usar uma função da FlatList que nos diz quando chegarmos
   * no fim da lista, para isto iremos receber a distancia até o fim da página
   */
  function handleFetchMore(distance: number) {
    //se a distância for menor que um iremos retornar não executando a função
    if (distance < 1) {
      return;
    }

    /**
     * Caso não tenha sido retornado acima iremos carregar mais itens, para isto iremos setar
     * o loadingMore para true para exibirmos a imagem de carregando e iremos setar a o page com mais 1
     * desta forma ao realizarmos o fetchPlants iremos requisitar mais plantas
     */
    setLoadingMore(true);
    setPage((oldValue) => oldValue + 1);
    fetchPlants();
  }

  //será executado sempre que entrarmos na tela de PlantSelect
  useEffect(() => {
    async function fetchEnviroment() {
      //data recebe os environments disponíveis para serem selecionados
      const { data } = await api.get(
        "plants_environments?_sort=title&order=asc"
      );
      /**
       * observe que estamos inserindo o todos de forma manual, e depois disto o data
       * desta forma teremos todos os enviroments disponíveis
       */
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

  /**
   * fetchPlants será a função utilizada para obter as plantas do nosso backend,
   * será obtido todas as plantas e no próprio app será processado quais plantas 
   * devem ser exibidas
   */
  async function fetchPlants() {
    //data recebe as plantas obtidas com base no limite colado sobre quantas plantas devem ser trazidas
    const { data } = await api.get(
      `plants?_sort=name&order=asc&_page=${page}&_limit=8`
    );

    /**
     * Caso ainda não tenha sido obtido os dados iremos setar setLoading para true, assim iremos exibir
     * a animação de carregando
     */
    if (!data) {
      return setLoading(true);
    }

    /**
     * Caso page seja maior do que um significa que estamos obtendo mais plantas
     * do backend, desta forma no setPlants iremos pegar as plantas antigas e adicionar
     * as novas, caso contrário iremos apenas setar as plantas obtidas em setPlants
     */
    if (page > 1) {
      setPlants((oldValue) => [...oldValue, ...data]);
      setFilteredPlants((oldValue) => [...oldValue, ...data]);
    } else {
      setPlants(data);
      setFilteredPlants(data);
    }

    //Aqui estamos setando o loading e loadingMore para false para não exibirmos as animações
    setLoading(false);
    setLoadingMore(false);
  }

  /**
   * Ao selecionarmos uma planta a função abaixo será chamada, passando a planta para a página
   * PlantSave
   */
  function handlePlantSelect(plant: PlantProps) {
    navigation.navigate("PlantSave", { plant });
  }

  //carregará o fetchPlants assim que a tela for aberta
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

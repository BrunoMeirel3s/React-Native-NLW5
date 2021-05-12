import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import AppLoading from "expo-app-loading";

import * as Notifications from "expo-notifications";

import Routes from "./src/routes";

/**
 * Estamos importando as fontes na raiz do projeto para que seja possível utiliza-las
 * em qualquer componente
 */
import { PlantProps } from "./src/libs/storage";
import {
  useFonts,
  Jost_400Regular,
  Jost_600SemiBold,
} from "@expo-google-fonts/jost";

export default function app() {
  /**
   * Nesta etapa estamos setando as fontes para serem utilizadas,
   * realizamos um teste para checar se as fontes já encontram-se carregadas,
   * caso não estejam é exibido apenas a tela de splash do app
   */
  const [fontsLoaded] = useFonts({ Jost_400Regular, Jost_600SemiBold });

  //useEffect(() => {
  /*
    const subscription = Notifications.addNotificationReceivedListener(
      async (notification) => {
        const data = notification.request.content.data.plant as PlantProps;
        console.log(data);
      }
    );
    return () => {
      subscription.remove();
    };
  }, []);
  */

  // }

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return <Routes />;
  }
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

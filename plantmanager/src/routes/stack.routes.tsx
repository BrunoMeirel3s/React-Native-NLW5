import React from "react";
/**
 * usaremos o createStackNavigator para criamos a navegação entre as telas
 */
import { createStackNavigator } from "@react-navigation/stack";

import { Welcome } from "./../pages/Welcome";
import { UserIdentification } from "./../pages/UserIdentification";
import { Confirmation } from "./../pages/Confirmation";

import colors from "../styles/colors";
import { PlantSelect } from "./../pages/PlantSelect";
import { PlantSave } from "./../pages/PlantSave";
import { MyPlants } from "../pages/MyPlants";
import AuthRoutes from "./tab.routes";

//instancia de createStackNavigator que nos permitirá utilizar as funções
const stackRoutes = createStackNavigator();

const AppRoutes: React.FC = () => (
  <stackRoutes.Navigator
    headerMode="none"
    screenOptions={{
      cardStyle: {
        backgroundColor: colors.white,
      },
    }}
  >
    {/**
     * Acima nós temos o navigator que envolve as rotas abaixo, em screenOptions nós passamos
     * o cardStyle para que a cor do background sejá branco. Abaixo nós temos as rotas, as "screens"
     * cada rota tem um name, bem como o componente que a mesma irá acessar, assim ao utilizarmos
     * o navigate dentro dos componentes devemos apenas chamar o name da tela para qual
     * desejamos navegar
     */}
    <stackRoutes.Screen name="Welcome" component={Welcome} />
    <stackRoutes.Screen
      name="UserIdentification"
      component={UserIdentification}
    />
    <stackRoutes.Screen name="Confirmation" component={Confirmation} />
    {/**
     * Aqui está o segredo para exibir a barra inferior de navegação, nas telas que for
     * necessário exibi-la ao invés de chamar o componente da tela devemos chamar o 
     * AuthRoutes que é a barra de menu inferior
     */}
    <stackRoutes.Screen name="PlantSelect" component={AuthRoutes} />
    <stackRoutes.Screen name="PlantSave" component={PlantSave} />
    <stackRoutes.Screen name="MyPlants" component={AuthRoutes} />
  </stackRoutes.Navigator>
);

export default AppRoutes;

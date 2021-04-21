/**
 * Aqui nós temos o index da nossa navegação, no arquivo
 * stack.routes criamos as rotas bem como para onde cada rota vai
 * e aqui nós criamos o NavigationCointainer que irá envolver todas
 * as rotas que desenvolvermos
 */
import React from "react";
import { NavigationContainer } from "@react-navigation/native";

import StackRoutes from "./stack.routes";
const Routes = () => (
  <NavigationContainer>
    <StackRoutes />
  </NavigationContainer>
);

export default Routes;

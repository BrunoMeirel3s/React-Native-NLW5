//axios nos permite fazer requisições http
import axios from "axios";

/**
 * Estamos setando aqui que a o endereço padrão para realização das requisições será
 * o que consta em baseURL
 */
const api = axios.create({
  baseURL: "http://192.168.101.14:3333",
});

export default api;
